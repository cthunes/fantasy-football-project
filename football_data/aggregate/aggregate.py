import pandas as pd
import numpy as np
from numbers import Number

EXCLUDED_COLUMNS = {
    "playerId",
    "gameId",
    "season",
    "week",
    "team",
    "opponentTeam",
    "position",
    "fgBlockedList",
    "fgMadeList",
    "fgMissedList",
    "defensePct",
    "stPct",
}

DERIVED_COLUMNS = {
    "pacr", # Derive from passing yards/passing air yards
    "targetShare", # Derive from targets / team targets
    "airYardsShare", # Derive from air yards / team air yards
    "racr", # Derive from receiving yards/receiving air yards
    "wopr", # Derive from 1.5 * target share + 0.7 * air yards share
    "fgPct", # Derive from fg made / attempts
    "patPct", # Derive from pat made / attempts
    "passingAvgAirYardsDifferential", # Derive from intended air yards - completed air yards
    "passingCompletionPercentage", # Derive from completions / attempts
    "rushingRushYardsOverExpectedPerAtt", # Derive from rushingRushYardsOverExpected / rushingRushAttempts
    "fantasyPointsTier"
}

SPECIAL_AGGREGATIONS = {
    "fgLong": ("fgLong", "max"),
    "passingMaxAirDistance": ("passingMaxAirDistance", "max"),
    "passingMaxCompletedAirDistance": ("passingMaxCompletedAirDistance", "max"),
    "passingPasserRating": ("passingPasserRating", "mean"),
}

def aggregate_player_games(player_games, team_games, scoring_rules):
    """
    Aggregate the player-game dataset.
    """
    if player_games.empty or team_games.empty:
        return None

    dst_games = build_dst_player_games(team_games)

    player_games = pd.concat(
        [player_games, dst_games],
        ignore_index=True,
    )

    player_games = calculate_fantasy_points(player_games, scoring_rules)
    
    player_games = calculate_fantasy_point_tiers(player_games)

    team_games = team_games[["gameId", "team", "targets", "receivingAirYards", "carries", "rushingYards", "receivingYards"]]
    team_games.columns = [col + "Team" if col not in ("gameId", "team") else col for col in team_games.columns]
    player_games = player_games.merge(team_games, on=["gameId", "team"], how="left")

    aggregation_map = build_aggregation_map(player_games)

    aggregated = (
        player_games
        .groupby(["playerId", "position"], dropna=False)
        .agg(**aggregation_map)
        .reset_index()
    )

    aggregated = calculate_ngs_averages(aggregated)

    aggregated = calculate_derived_stats(aggregated)

    aggregated = calculate_fantasy_metrics(aggregated)

    return aggregated


def get_ngs_weighted_columns(columns):
    return [
        column
        for column in columns
        if column.endswith("Total")
        and f"{column[:-5]}Denom" in columns
    ]


def build_aggregation_map(player_games):
    columns = set(player_games.columns)

    weighted_totals = get_ngs_weighted_columns(columns)

    aggregation_map = {
        "games": ("playerId", "size"),
    }

    for column in player_games.columns:
        if column in EXCLUDED_COLUMNS or column in DERIVED_COLUMNS:
            continue

        if column in SPECIAL_AGGREGATIONS:
            aggregation_map[column] = SPECIAL_AGGREGATIONS[column]
            continue

        if column.endswith("Total") and column in weighted_totals:
            aggregation_map[column] = (column, "sum")
            continue

        if column.endswith("Denom"):
            aggregation_map[column] = (column, "sum")
            continue

        if f"{column}Total" in columns and f"{column}Denom" in columns:
            continue

        aggregation_map[column] = (column, "sum")
        aggregation_map[column + "Mean"] = (column, "mean")

    aggregation_map["fantasyPointsMedian"] = ("fantasyPoints", "median")
    aggregation_map["fantasyPointsStd"] = ("fantasyPoints", "std")

    tier_names = ["Great", "Good", "Okay", "Poor", "Bad"]

    for tier, name in enumerate(tier_names, start=1):
        aggregation_map[f"fantasyPoints{name}"] = (
            "fantasyPointsTier",
            lambda x, tier=tier: (x == tier).sum(),
        )

    return aggregation_map


def calculate_ngs_averages(df):
    """
    Replace each *Total / *Denom pair with the corresponding
    weighted-average column.

    Example:
        passingAvgAirDistanceTotal / passingAvgAirDistanceDenom
        -> passingAvgAirDistance
    """

    total_columns = [
        column
        for column in df.columns
        if column.endswith("Total")
    ]

    for total_column in total_columns:
        base_column = total_column[:-len("Total")]
        denom_column = base_column + "Denom"

        if denom_column not in df.columns:
            continue

        df[base_column] = np.where(
            df[denom_column] != 0,
            df[total_column] / df[denom_column],
            np.nan,
        )

        df.drop(
            columns=[total_column, denom_column],
            inplace=True,
        )

    return df


def calculate_derived_stats(df):

    # from DERIVED_COLUMNS 
    df["pacr"] = df["passingYards"] / df["passingAirYards"]
    df["racr"] = df["receivingYards"] / df["receivingAirYards"]
    df["targetShare"] = df["targets"] / df["targetsTeam"]
    df["airYardsShare"] = df["receivingAirYards"] / df["receivingAirYardsTeam"]
    df["wopr"] = (1.5 * df["targetShare"]) + (0.7 * df["airYardsShare"])
    df["fgPct"] = df["fgMade"] / df["fgAtt"]
    df["patPct"] = df["patMade"] / df["patAtt"]
    df["passingAvgAirYardsDifferential"] = (df["passingAvgIntendedAirYards"] * df["attempts"]) / (df["passingAvgCompletedAirYards"] * df["completions"])
    df["passingCompletionPercentage"] = df["completions"] / df["attempts"]
    df["rushingRushYardsOverExpectedPerAtt"] = df["rushingRushYardsOverExpected"] / df["carries"]

    # others
    df["opportunities"] =  (0.4 * df["attempts"]) + df["carries"] + df["targets"] + (3 * df["fgAtt"]) + df["patAtt"]
    df["opportunitiesMean"] = df["opportunities"] / df["games"]
    df["passingYardsPerAtt"] =  df["passingYards"] / df["attempts"]
    df["rushingYardsPerAtt"] = df["rushingYards"] / df["carries"]
    df["receivingYardsPerReception"] = df["receivingYards"] / df["receptions"]
    df["passingCpoePerAtt"] = df["passingCpoe"] / df["attempts"]
    df["passingEpaPerAtt"] = df["passingEpa"] / df["attempts"]
    df["rushingEpaPerAtt"] = df["rushingEpa"] / df["carries"]
    df["receivingEpaPerReception"] = df["receivingEpa"] / df["receptions"]
    df["earnedTargetPct"] = df["targets"] / df["offenseSnaps"]
    df["carriesShare"] = df["carries"] / df["carriesTeam"]
    df["rushingYardsShare"] = df["rushingYards"] / df["rushingYardsTeam"]
    df["receivingYardsShare"] = df["receivingYards"] / df["receivingYardsTeam"]

    return df


def calculate_range_score(value, ranges):
    """Return the scoring value corresponding to a numeric range."""
    if pd.isna(value):
        return 0
    
    for rule in ranges:
        min_value = rule.get("min", float("-inf"))
        max_value = rule.get("max", float("inf"))

        if min_value <= value <= max_value:
            return rule["points"]

    return 0


def calculate_fantasy_points(player_games, scoring_rules):
    """
    Calculate fantasy points per player-game using the supplied scoring configuration.
    """
    player_games = player_games.copy()

    player_games["fantasyPoints"] = 0.0

    for stat, scoring in scoring_rules["rules"].items():

        if stat not in player_games.columns:
            continue

        if isinstance(scoring, Number):
            player_games["fantasyPoints"] += (
                player_games[stat].fillna(0) * scoring
            )

        elif isinstance(scoring, list):
            player_games["fantasyPoints"] += (
                player_games[stat]
                .apply(calculate_range_score, ranges=scoring)
            )

    return player_games


def calculate_fantasy_point_tiers(player_games):
    """
    Assign fantasy point tiers based on roster-slot-level performance.

    Tier definitions:
        1 = top roster-slot performances
        2 = next roster-slot
        3 = next roster-slot
        4 = next roster-slot
        5 = everything else

    QB/K/DST/TE:
        1-6, 6-12, 12-18, etc. based on typical games played

    RB/WR:
        1-12, 12-24, 24-36, 36-48 roster slots per game-equivalent season
    """

    player_games = player_games.copy()

    position_slots = {
        "QB": [6, 12, 18, 24],
        "RB": [12, 24, 36, 48],
        "WR": [12, 24, 36, 48],
        "TE": [6, 12, 18, 24],
        "K": [6, 12, 18, 24],
        "DST": [6, 12, 18, 24],
    }

    player_game_counts = player_games.groupby(["position", "playerId"]).size().reset_index(name="games")

    reference_games = (
        player_game_counts
        .groupby("position")["games"]
        .max()
        .round()
        .astype(int)
        .to_dict()
    )

    player_games["fantasyPointsTier"] = 5

    for position, slots in position_slots.items():
        position_games = reference_games.get(position)

        if not position_games:
            continue

        thresholds = [slot_count * position_games for slot_count in slots]

        ranked = (
            player_games.loc[player_games["position"] == position]
            .sort_values("fantasyPoints", ascending=False)
            .index
        )

        player_games.loc[ranked[:thresholds[0]], "fantasyPointsTier"] = 1
        player_games.loc[ranked[thresholds[0]:thresholds[1]], "fantasyPointsTier"] = 2
        player_games.loc[ranked[thresholds[1]:thresholds[2]], "fantasyPointsTier"] = 3
        player_games.loc[ranked[thresholds[2]:thresholds[3]], "fantasyPointsTier"] = 4

    return player_games


def calculate_fantasy_metrics(df):

    # average of the 1/4 roots of fpts std dev
    fpts_adj_constants = {
        "QB": 1.637,
        "RB": 1.653,
        "WR": 1.685,
        "TE": 1.528,
        "K": 1.249,
        "DST": 1.554    
    }

    df["fantasyPointsAdj"] = np.where(
        df["fantasyPointsStd"] != 0,
        df["fantasyPointsMean"] / (df["fantasyPointsStd"] ** 0.25) * df["position"].map(fpts_adj_constants),
        df["fantasyPointsMean"],
    )

    df["fantasyPointsQSRat"] = (
        (df["fantasyPointsGreat"] + df["fantasyPointsGood"])
        / (df["fantasyPointsPoor"] + df["fantasyPointsBad"] + df["fantasyPointsOkay"]).replace(0, 1)
    )

    df["fantasyPointsGSRat"] = (
        df["fantasyPointsGreat"]
        / (df["fantasyPointsOkay"] + df["fantasyPointsPoor"] + df["fantasyPointsBad"] + df["fantasyPointsGood"]).replace(0, 1)
    )

    df["fantasyPointsScore"] = (
        df["fantasyPointsAdj"] * 0.4
        + df["fantasyPointsMedian"] * 0.4
        + df["opportunitiesMean"] * 0.1
        + np.log2(df["fantasyPointsQSRat"] + 1)
        + np.log2(df["fantasyPointsGSRat"] + 1)
    )

    return df


def build_dst_player_games(team_games):
    dst = team_games.copy()

    dst = dst[['gameId',
               'season',
               'week',
               'team',
               'opponentTeam',
               'specialTeamsTds',
               'defTacklesForLoss',
               'defFumblesForced',
               'defSacks',
               'defInterceptions',
               'defPassDefended',
               'defTds',
               'defFumbles',
               'defSafeties',
               'defPuntBlocks',
               'defPatBlocks',
               'defFgBlocks',
               'def2ptMade',
               'defThreeAndOuts',
               'defFourthDownStops',
               'defYardsAllowed',
               'defPointsAllowed',
               'fumbleRecoveryOpp',
               'fumbleRecoveryTds',
               'ptReturnTds']]

    dst["playerId"] = "DST_" + dst["team"]
    dst["position"] = "DST"

    return dst