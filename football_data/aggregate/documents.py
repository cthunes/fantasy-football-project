from hashlib import sha1

import numpy as np
import pandas as pd

from football_data.aggregate.defaults import scoring_config_id
from football_data.aggregate.stat_categories import nest_by_category

CONTEXT_SUFFIXES = ("__rank", "__percentile", "__par")


def build_aggregation_id(selection, scoring_config):
    config_id = scoring_config_id(scoring_config)
    selection_type = selection["type"]

    if selection_type == "season":
        seasons = _season_key(selection["seasons"])
        return f"season:{seasons}:{config_id}"

    if selection_type == "profile":
        seasons = _season_key(selection["seasons"])
        return f"profile:{selection['profileId']}:{seasons}:{config_id}"

    if selection_type == "custom":
        custom_id = selection.get("aggregationId") or _game_ids_key(selection.get("gameIds", []))
        return f"custom:{custom_id}:{config_id}"

    if selection_type == "weighted":
        seasons = _season_key(selection["seasons"])
        weights = "-".join(str(weight) for weight in selection.get("weights", []))
        return f"weighted:{seasons}:{weights}:{config_id}"

    raise ValueError(f"Unsupported selection type '{selection_type}'")


def documents_from_aggregated(
    aggregated,
    *,
    players_by_id,
    resolved,
    scoring_config,
    scope,
    persist_ids=None,
):
    aggregation_id = build_aggregation_id(resolved.selection, scoring_config)
    persist = set(persist_ids or [])
    documents = []

    for row in aggregated.to_dict(orient="records"):
        player_id = row["playerId"]
        if persist and player_id not in persist:
            continue

        player = players_by_id.get(player_id, {})
        stats, metrics = _split_stats_and_context(row)
        game_ids = resolved.game_ids_for(player_id)

        documents.append({
            "aggregationId": aggregation_id,
            "playerId": player_id,
            "name": player.get("name") or _dst_name(player_id),
            "position": row.get("position") or player.get("position"),
            "team": player.get("team") or _dst_team(player_id),
            **_depth_chart_field(player),
            **_years_of_experience_field(player),
            "scope": scope,
            "aggregationType": resolved.aggregation_type,
            "selection": {
                **resolved.selection,
                "gameIds": game_ids,
            },
            "scoring": {
                "configId": scoring_config_id(scoring_config),
            },
            "stats": stats,
            "context": {
                "population": {
                    "type": "same_selection",
                    "position": row.get("position"),
                },
                "metrics": metrics,
            },
            "gameCount": stats.get("games"),
        })

    return documents


def weighted_documents(
    blended,
    *,
    players_by_id,
    selection,
    scoring_config,
    sources,
    scope="table",
    persist_ids=None,
):
    aggregation_id = build_aggregation_id(selection, scoring_config)
    persist = set(persist_ids or [])
    documents = []

    for row in blended.to_dict(orient="records"):
        player_id = row["playerId"]
        if persist and player_id not in persist:
            continue

        player = players_by_id.get(player_id, {})
        stats, metrics = _split_stats_and_context(row)

        documents.append({
            "aggregationId": aggregation_id,
            "playerId": player_id,
            "name": player.get("name") or _dst_name(player_id),
            "position": row.get("position") or player.get("position"),
            "team": player.get("team") or _dst_team(player_id),
            **_depth_chart_field(player),
            **_years_of_experience_field(player),
            "scope": scope,
            "aggregationType": "weighted",
            "selection": {
                "type": "weighted",
                "seasons": list(selection["seasons"]),
                "weights": list(selection.get("weights", [])),
            },
            "scoring": {
                "configId": scoring_config_id(scoring_config),
            },
            "sources": sources,
            "stats": stats,
            "context": {
                "population": {
                    "type": "same_selection",
                    "position": row.get("position"),
                },
                "metrics": metrics,
            },
            "gameCount": stats.get("games"),
        })

    return documents


def to_mongo_value(value):
    if value is None:
        return None
    if isinstance(value, (list, dict, str, bytes)):
        return value
    try:
        if pd.isna(value):
            return None
    except (ValueError, TypeError):
        return value
    if isinstance(value, np.integer):
        return int(value)
    if isinstance(value, np.floating):
        value = float(value)
        return value if np.isfinite(value) else None
    if isinstance(value, float) and not np.isfinite(value):
        return None
    if isinstance(value, np.bool_):
        return bool(value)
    if isinstance(value, (pd.Timestamp,)):
        return value.isoformat()
    return value


def sanitize_document(document):
    if isinstance(document, dict):
        return {key: sanitize_document(value) for key, value in document.items()}
    if isinstance(document, list):
        return [sanitize_document(value) for value in document]
    return to_mongo_value(document)


def _split_stats_and_context(row):
    stats = {}
    grouped = {}

    for key, value in row.items():
        if key in {"playerId", "position"}:
            continue
        if any(key.endswith(suffix) for suffix in CONTEXT_SUFFIXES):
            continue
        stats[key] = to_mongo_value(value)

    for key, value in row.items():
        for suffix in CONTEXT_SUFFIXES:
            if not key.endswith(suffix):
                continue
            stat_name = key[: -len(suffix)]
            metric_name = suffix[2:]
            grouped.setdefault(stat_name, {})[metric_name] = to_mongo_value(value)

    metrics = {}
    for stat_name, parts in grouped.items():
        if parts.get("rank") is None:
            continue
        metrics[stat_name] = {
            "rank": parts.get("rank"),
            "percentile": parts.get("percentile"),
            "par": parts.get("par"),
        }

    return nest_by_category(stats), nest_by_category(metrics)


def _years_of_experience_field(player):
    if "yearsOfExperience" not in player:
        return {}
    yoe = to_mongo_value(player.get("yearsOfExperience"))
    # rookies say 0, but second year players are 2, third year players are 3, etc. 
    # We want to say 1 for second year players, 2 for third year players, etc.
    if yoe > 1:
        yoe -= 1
    return {"yearsOfExperience": yoe}


def _depth_chart_field(player):
    if "posRank" not in player:
        return {}
    pos_rank = to_mongo_value(player.get("posRank"))
    return {"posRank": pos_rank}


def _season_key(seasons):
    return "-".join(str(season) for season in seasons)


def _game_ids_key(game_ids):
    joined = ",".join(sorted(game_ids))
    return sha1(joined.encode("utf-8")).hexdigest()[:16]


def _dst_team(player_id):
    if isinstance(player_id, str) and player_id.startswith("DST_"):
        return player_id[4:]
    return None


def _dst_name(player_id):
    team = _dst_team(player_id)
    return f"{team} DST" if team else None
