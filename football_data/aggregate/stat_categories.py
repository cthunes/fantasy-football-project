TOP_LEVEL_STATS = {"games"}

CATEGORY_ORDER = (
    "passing",
    "rushing",
    "receiving",
    "kicking",
    "defSt",
    "fantasy",
    "misc",
)

_PASSING_EXACT = {
    "completions",
    "completionsMean",
    "attempts",
    "attemptsMean",
    "sacksSuffered",
    "sacksSufferedMean",
    "sackFumbles",
    "sackFumblesMean",
    "sackFumblesLost",
    "sackFumblesLostMean",
    "pacr",
    "passingYardsPerAtt",
    "passingCpoePerAtt",
    "passingEpaPerAtt",
}

_RUSHING_EXACT = {
    "carries",
    "carriesMean",
    "carriesShare",
    "carriesTeam",
    "carriesTeamMean",
    "rushingYardsShare",
    "rushingYardsTeam",
}

_RECEIVING_EXACT = {
    "receptions",
    "receptionsMean",
    "targets",
    "targetsMean",
    "targetsTeam",
    "targetsTeamMean",
    "targetShare",
    "airYardsShare",
    "wopr",
    "racr",
    "earnedTargetPct",
    "receivingYardsShare",
    "receivingAirYardsTeam",
    "receivingYardsTeam",
}

_MISC_EXACT = {
    "offenseSnaps",
    "offenseSnapsMean",
    "offensePct",
    "defenseSnaps", 
    "defenseSnapsMean",
    "stSnaps", 
    "stSnapsMean",
    "opportunities",
    "opportunitiesMean",
}


def category_for(stat_name):
    if stat_name in TOP_LEVEL_STATS:
        return None
    if stat_name in _MISC_EXACT:
        return "misc"
    if stat_name in _PASSING_EXACT or stat_name.startswith("passing"):
        return "passing"
    if stat_name in _RUSHING_EXACT or stat_name.startswith("rushing"):
        return "rushing"
    if stat_name in _RECEIVING_EXACT or stat_name.startswith("receiving"):
        return "receiving"
    if stat_name.startswith("fg") or stat_name.startswith("pat"):
        return "kicking"
    if (
        stat_name.startswith("def")
        or stat_name.startswith("specialTeams")
        or stat_name.startswith("fumbleRecovery")
        or stat_name.startswith("ptReturn")
    ):
        return "defSt"
    if stat_name.startswith("fantasyPoints"):
        return "fantasy"
    return "misc"


def nest_by_category(flat_stats):
    nested = {category: {} for category in CATEGORY_ORDER}
    top_level = {}

    for key, value in flat_stats.items():
        category = category_for(key)
        if category is None:
            top_level[key] = value
        else:
            nested[category][key] = value

    return {
        **top_level,
        **{category: nested[category] for category in CATEGORY_ORDER if nested[category]},
    }


def flatten_nested_stats(stats):
    flat = {}
    for key, value in (stats or {}).items():
        if isinstance(value, dict):
            for child_key, child_value in value.items():
                if not isinstance(child_value, dict):
                    flat[child_key] = child_value
        else:
            flat[key] = value
    return flat
