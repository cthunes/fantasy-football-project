import pandas as pd

from football_data.aggregate.context import IDENTITY_COLUMNS, calculate_context
from football_data.aggregate.defaults import scoring_config_id
from football_data.aggregate.documents import build_aggregation_id
from football_data.aggregate.stat_categories import flatten_nested_stats

SKIP_BLEND_COLUMNS = IDENTITY_COLUMNS | {"name", "team"}


def blend_season_aggregations(season_docs_by_weight):
    """
    Weighted-average numeric stats from existing season aggregation documents.

    season_docs_by_weight: list of (weight, {playerId: stats_doc})
    Missing seasons are skipped and remaining weights are renormalized.
    """
    player_ids = set(season_docs_by_weight[0][1]) if season_docs_by_weight else set()

    rows = []
    for player_id in player_ids:
        available = [
            (weight, docs[player_id])
            for weight, docs in season_docs_by_weight
            if player_id in docs
        ]
        if not available:
            continue

        weight_sum = sum(weight for weight, _ in available)
        if weight_sum == 0:
            continue

        first = available[0][1]
        blended = {
            "playerId": player_id,
            "position": first.get("position"),
        }

        numeric_keys = _numeric_stat_keys(available)
        for key in numeric_keys:
            total = 0.0
            present = 0.0
            for weight, document in available:
                value = _stat_value(document, key)
                if value is None:
                    continue
                total += weight * value
                present += weight
            blended[key] = total / present if present else None

        rows.append(blended)

    if not rows:
        return None

    return calculate_context(pd.DataFrame(rows))


def source_descriptors(seasons, weights, scoring_config):
    sources = []
    for season, weight in zip(seasons, weights):
        sources.append({
            "aggregationId": build_aggregation_id(
                {"type": "season", "seasons": [season]},
                scoring_config,
            ),
            "weight": weight,
        })
    return sources


def load_season_aggregation_docs(db, seasons, scoring_config):
    config_id = scoring_config_id(scoring_config)
    by_weight_ready = []
    for season in seasons:
        aggregation_id = build_aggregation_id(
            {"type": "season", "seasons": [season]},
            {"_id": config_id},
        )
        docs = {
            document["playerId"]: document
            for document in db["player_aggregations"].find({"aggregationId": aggregation_id})
        }
        by_weight_ready.append(docs)
    return by_weight_ready


def _numeric_stat_keys(available):
    keys = set()
    for _, document in available:
        stats = flatten_nested_stats(document.get("stats") or {})
        for key, value in stats.items():
            if isinstance(value, (int, float)) and key not in SKIP_BLEND_COLUMNS:
                keys.add(key)
    return sorted(keys)


def _stat_value(document, key):
    stats = flatten_nested_stats(document.get("stats") or {})
    value = stats.get(key)
    if value is None or isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return float(value)
    return None
