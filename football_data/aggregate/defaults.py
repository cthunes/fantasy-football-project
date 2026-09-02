DEFAULT_SCORING_CONFIG = {
    "_id": "half_ppr_half_point_first_down",
    "name": "Half PPR + 0.5 First Down",
    "rules": {
        "passingYards": 0.04,
        "passingTds": 4,
        "passingInterceptions": -2,
        "passing2ptConversions": 2,
        "rushingYards": 0.1,
        "rushingTds": 6,
        "rushingFirstDowns": 0.5,
        "rushing2ptConversions": 2,
        "rushingFumbles": -1,
        "rushingFumblesLost": -1,
        "receptions": 0.5,
        "receivingYards": 0.1,
        "receivingTds": 6,
        "receivingFirstDowns": 0.5,
        "receiving2ptConversions": 2,
        "receivingFumbles": -1,
        "receivingFumblesLost": -1,
        "patMade": 1,
        "patMissed": -1,
        "fgMissed019": -1,
        "fgMissed2029": -1,
        "fgMadeDistance": .1,
        "defInterceptions": 2,
        "fumbleRecoveryOpp": 1,
        "defFumblesForced": 1,
        "defSafeties": 2,
        "defPuntBlocks": 2,
        "defPatBlocks": 2,
        "defFgBlocks": 2,
        "defTds": 6,
        "def2ptMade": 2,
        "defTacklesForLoss": 0.5,
        "defSacks": 1,
        "defThreeAndOuts": 0.25,
        "defFourthDownStops": 0.5,
        "specialTeamsTds": 6,
        "fumbleRecoveryTds": 6,

        "defPointsAllowed": [
            {"max": 0, "points": 3},
            {"min": 1, "max": 6, "points": 1},
            {"min": 7, "max": 20, "points": 0},
            {"min": 21, "max": 27, "points": -1},
            {"min": 28, "max": 34, "points": -2},
            {"min": 35, "points": -3},
        ],

        "defYardsAllowed": [
            {"max": 99, "points": 2},
            {"min": 100, "max": 299, "points": 0},
            {"min": 300, "max": 399, "points": -1},
            {"min": 400, "max": 449, "points": -2},
            {"min": 450, "max": 499, "points": -3},
            {"min": 500, "max": 549, "points": -4},
            {"min": 550, "points": -5},
        ],
    }
}

DEFAULT_PROFILES = [
    {
        "_id": "starter_games",
        "name": "Starter Games",
        "includePlayoffs": False,
        "rules": {
            "offensePct": {
                "operator": ">=",
                "value": 0.50,
            }
        },
    },
    {
        "_id": "full_season",
        "name": "Full Season",
        "includePlayoffs": True,
        "rules": {},
    },
]

DEFAULT_WEIGHTED_WEIGHTS = (0.6, 0.3, 0.1)


def scoring_config_id(scoring_config):
    return scoring_config.get("_id") or scoring_config.get("name")


def ensure_reference_documents(db):
    db["scoring_rules"].replace_one(
        {"_id": DEFAULT_SCORING_CONFIG["_id"]},
        DEFAULT_SCORING_CONFIG,
        upsert=True,
    )
    for profile in DEFAULT_PROFILES:
        db["profiles"].replace_one(
            {"_id": profile["_id"]},
            profile,
            upsert=True,
        )
