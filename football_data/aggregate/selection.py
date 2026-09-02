from collections import defaultdict
import operator

from football_data.aggregate.defaults import scoring_config_id

OPERATORS = {
    ">=": operator.ge,
    "<=": operator.le,
    ">": operator.gt,
    "<": operator.lt,
    "==": operator.eq,
    "!=": operator.ne,
}

PROJECTION = {"playerId": 1, "gameId": 1, "_id": 0}

FIRST_17_GAME_SEASON = 2021


def regular_season_week_max(season):
    return 17 if season < FIRST_17_GAME_SEASON else 18


def season_games_query(seasons, include_playoffs=False):
    seasons = list(seasons)
    if include_playoffs:
        return {"season": {"$in": seasons}}

    by_max_week = defaultdict(list)
    for season in seasons:
        by_max_week[regular_season_week_max(season)].append(season)

    if len(by_max_week) == 1:
        max_week = next(iter(by_max_week))
        return {"season": {"$in": seasons}, "week": {"$gte": 1, "$lte": max_week}}

    return {
        "$or": [
            {"season": {"$in": years}, "week": {"$gte": 1, "$lte": max_week}}
            for max_week, years in by_max_week.items()
        ]
    }


class ResolvedSelection:
    def __init__(self, mapping, query, aggregation_type, selection):
        self.mapping = mapping
        self.query = query
        self.aggregation_type = aggregation_type
        self.selection = selection

    @property
    def game_ids(self):
        return sorted({game_id for game_ids in self.mapping.values() for game_id in game_ids})

    def game_ids_for(self, player_id):
        return self.mapping.get(player_id, [])


def persist_player_ids(selection):
    player_ids = list(selection.get("playerIds") or [])
    if selection.get("playerId"):
        player_ids.append(selection["playerId"])
    return player_ids


def resolve_scoring_config(db, scoring_config):
    if scoring_config is None:
        raise ValueError("scoring_config is required")

    if isinstance(scoring_config, str):
        document = db["scoring_rules"].find_one({"_id": scoring_config})
        if document is None:
            raise ValueError(f"Unknown scoring config '{scoring_config}'")
        return document

    if "rules" not in scoring_config:
        config_id = scoring_config_id(scoring_config)
        document = db["scoring_rules"].find_one({"_id": config_id})
        if document is None:
            raise ValueError(f"scoring_config is missing rules and '{config_id}' was not found")
        return document

    return scoring_config


def resolve_selection(db, selection):
    selection_type = selection.get("type")

    if selection_type == "season":
        return _resolve_season(db, selection)
    if selection_type == "profile":
        return _resolve_profile(db, selection)
    if selection_type == "custom":
        return _resolve_custom(db, selection)

    raise ValueError(f"Unsupported selection type '{selection_type}'")


def _resolve_season(db, selection):
    seasons = selection["seasons"]
    query = season_games_query(seasons, include_playoffs=False)
    mapping = _player_game_mapping(db, query)
    _add_dst_mapping(db, query, mapping)
    return ResolvedSelection(
        mapping,
        query,
        "season",
        {
            "type": "season",
            "seasons": list(seasons),
            "weeks": "regular",
        },
    )


def _resolve_profile(db, selection):
    seasons = selection["seasons"]
    profile_id = selection["profileId"]
    profile = db["profiles"].find_one({"_id": profile_id})
    if profile is None:
        raise ValueError(f"Unknown profile '{profile_id}'")

    include_playoffs = profile.get("includePlayoffs", True)
    query = season_games_query(seasons, include_playoffs=include_playoffs)
    mapping = defaultdict(list)
    extra_fields = list(profile.get("rules", {}).keys())
    projection = {**PROJECTION, **{field: 1 for field in extra_fields}}

    for document in db["player_games"].find(query, projection):
        if not _matches_profile(document, profile.get("rules", {})):
            continue
        mapping[document["playerId"]].append(document["gameId"])

    mapping = {player_id: list(dict.fromkeys(game_ids)) for player_id, game_ids in mapping.items()}
    if not profile.get("rules"):
        _add_dst_mapping(db, query, mapping)

    return ResolvedSelection(
        mapping,
        query,
        "profile",
        {
            "type": "profile",
            "profileId": profile_id,
            "seasons": list(seasons),
            "includePlayoffs": include_playoffs,
        },
    )


def _resolve_custom(db, selection):
    game_ids = list(selection["gameIds"])
    query = {"gameId": {"$in": game_ids}}
    mapping = _player_game_mapping(db, query)

    target_ids = persist_player_ids(selection)
    if target_ids:
        for player_id in target_ids:
            mapping.setdefault(player_id, [])
            mapping[player_id] = [game_id for game_id in mapping[player_id] if game_id in set(game_ids)]

    _add_dst_mapping(db, query, mapping)
    return ResolvedSelection(
        mapping,
        query,
        "custom",
        {
            "type": "custom",
            "gameIds": game_ids,
            **({"aggregationId": selection["aggregationId"]} if selection.get("aggregationId") else {}),
            **({"playerId": selection["playerId"]} if selection.get("playerId") else {}),
            **({"playerIds": selection["playerIds"]} if selection.get("playerIds") else {}),
        },
    )


def _player_game_mapping(db, query):
    mapping = defaultdict(list)
    for document in db["player_games"].find(query, PROJECTION):
        mapping[document["playerId"]].append(document["gameId"])
    return {player_id: list(dict.fromkeys(game_ids)) for player_id, game_ids in mapping.items()}


def _add_dst_mapping(db, query, mapping):
    for document in db["team_games"].find(query, {"team": 1, "gameId": 1, "_id": 0}):
        mapping.setdefault(f"DST_{document['team']}", []).append(document["gameId"])
    for player_id, game_ids in list(mapping.items()):
        mapping[player_id] = list(dict.fromkeys(game_ids))


def _matches_profile(document, rules):
    for field, rule in rules.items():
        compare = OPERATORS.get(rule["operator"])
        if compare is None:
            raise ValueError(f"Unsupported profile operator '{rule['operator']}'")

        value = document.get(field)
        if value is None:
            return False
        if not compare(value, rule["value"]):
            return False

    return True
