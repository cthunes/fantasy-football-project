import nflreadpy as nfl
import pandas as pd
import numpy as np
import unicodedata
import re
from constants import *

def _normalize_name(name):
    pattern = r"[ .\-']|\b(jr|sr|ii|iii|iv)\b"
    name = re.sub(pattern, "", name.lower(), flags=re.IGNORECASE)
    return "".join([c for c in unicodedata.normalize("NFKD", name) if not unicodedata.combining(c)])

def _snake_to_camel(snake_str):
    parts = snake_str.split('_')
    return parts[0].lower() + ''.join(x.capitalize() for x in parts[1:])

def _load_players(seasons):
    # load from nflverse
    players = nfl.load_players().to_pandas()

    # convert FB to their position group (RB or TE) for fantasy purposes
    players.loc[players["position"] == "FB", "position"] = players["position_group"]
    players = players[players['position'].isin(FF_POSITIONS)]
    players = players[players['last_season'] >= seasons[0]]
    # subset players columns
    players = players[["gsis_id", "display_name", "first_name", "last_name", "position", "height", "weight", 
                       "headshot", "college_name", "rookie_season", "last_season", "latest_team", "status", 
                       "years_of_experience", "draft_year", "draft_round", "draft_pick"]]
    return players

def _load_depth_charts(seasons):
    # load from nflverse
    depth_charts = nfl.load_depth_charts(seasons[-1] + 1).to_pandas()

    # subset depth charts to only fantasy relevant positions and choose only the latest position ranks
    depth_charts = depth_charts[depth_charts['pos_abb'].isin(FF_POSITIONS)]
    depth_charts = depth_charts.sort_values("dt", ascending=False)
    depth_charts = depth_charts.drop_duplicates(subset=["gsis_id"], keep="first")
    # subset depth charts columns
    depth_charts = depth_charts[["gsis_id", "team", "pos_rank"]]
    return depth_charts

def _load_ff_rankings():
    # load from nflverse
    ff_rankings = nfl.load_ff_rankings().to_pandas()

    # subset ff_rankings to only fantasy relevant positions
    ff_rankings = ff_rankings[ff_rankings['page_type'].isin(['redraft-' + pos for pos in FF_POSITIONS])]
    # subset ff_rankings columns and rename to match players for merging
    ff_rankings = ff_rankings[["player", "pos", "team", "ecr", "sd", "best", "worst"]]
    ff_rankings.rename(columns={"player": "display_name", "pos": "position", "sd": "ecr_sd", 
                                "best": "ecr_best", "worst": "ecr_worst"}, inplace=True)
    return ff_rankings

def _load_player_stats(seasons):
    # load from nflverse
    player_games = nfl.load_player_stats(seasons).to_pandas()

    # convert FB to their position group (RB or TE) for fantasy purposes
    player_games.loc[player_games["position"] == "FB", "position"] = player_games["position_group"]
    player_games = player_games[player_games['position'].isin(FF_POSITIONS)]

    player_games.drop(columns=["player_name", "player_display_name", "position", "position_group", "headshot_url", "season_type"], inplace=True)

    return player_games

def _load_snap_counts(seasons):
    # load from nflverse
    snap_counts = nfl.load_snap_counts(seasons).to_pandas()
    ff_playerids = nfl.load_ff_playerids().to_pandas()[["gsis_id", "pfr_id"]]
    
    ff_playerids.rename(columns={"gsis_id": "player_id", "pfr_id": "pfr_player_id"}, inplace=True)
    snap_counts = snap_counts.merge(ff_playerids, on="pfr_player_id", how="left")
    snap_counts = snap_counts[snap_counts['position'].isin(FF_POSITIONS + ["FB"])]
    snap_counts = snap_counts[~snap_counts['player_id'].isna()]
    snap_counts = snap_counts[["game_id", "player_id", "offense_snaps", "offense_pct", "defense_snaps", "defense_pct", "st_snaps", "st_pct"]]

    return snap_counts

def _calculate_nextgen_avg_totals(nextgen_stats):
    # PASSING
    nextgen_stats["passing_aggressiveness_total"] = nextgen_stats["passing_aggressiveness"] * nextgen_stats["passing_attempts"]
    nextgen_stats["passing_aggressiveness_denom"] = nextgen_stats["passing_attempts"]

    nextgen_stats["passing_avg_air_distance_total"] = nextgen_stats["passing_avg_air_distance"] * nextgen_stats["passing_attempts"]
    nextgen_stats["passing_avg_air_distance_denom"] = nextgen_stats["passing_attempts"]

    nextgen_stats["passing_avg_air_yards_to_sticks_total"] = nextgen_stats["passing_avg_air_yards_to_sticks"] * nextgen_stats["passing_attempts"]
    nextgen_stats["passing_avg_air_yards_to_sticks_denom"] = nextgen_stats["passing_attempts"]

    nextgen_stats["passing_avg_completed_air_yards_total"] = nextgen_stats["passing_avg_completed_air_yards"] * nextgen_stats["passing_completions"]
    nextgen_stats["passing_avg_completed_air_yards_denom"] = nextgen_stats["passing_completions"]

    nextgen_stats["passing_avg_time_to_throw_total"] = nextgen_stats["passing_avg_time_to_throw"] * nextgen_stats["passing_attempts"]
    nextgen_stats["passing_avg_time_to_throw_denom"] = nextgen_stats["passing_attempts"]

    nextgen_stats["passing_completion_percentage_above_expectation_total"] = nextgen_stats["passing_completion_percentage_above_expectation"] * nextgen_stats["passing_attempts"]
    nextgen_stats["passing_completion_percentage_above_expectation_denom"] = nextgen_stats["passing_attempts"]

    nextgen_stats["passing_expected_completion_percentage_total"] = nextgen_stats["passing_expected_completion_percentage"] * nextgen_stats["passing_attempts"]
    nextgen_stats["passing_expected_completion_percentage_denom"] = nextgen_stats["passing_attempts"]

    nextgen_stats["passing_avg_intended_air_yards_total"] = nextgen_stats["passing_avg_intended_air_yards"] * nextgen_stats["passing_attempts"]
    nextgen_stats["passing_avg_intended_air_yards_denom"] = nextgen_stats["passing_attempts"]

    # RUSHING
    nextgen_stats["rushing_avg_rush_yards_total"] = nextgen_stats["rushing_avg_rush_yards"] * nextgen_stats["rushing_rush_attempts"]
    nextgen_stats["rushing_avg_rush_yards_denom"] = nextgen_stats["rushing_rush_attempts"]

    nextgen_stats["rushing_avg_time_to_los_total"] = nextgen_stats["rushing_avg_time_to_los"] * nextgen_stats["rushing_rush_attempts"]
    nextgen_stats["rushing_avg_time_to_los_denom"] = nextgen_stats["rushing_rush_attempts"]

    nextgen_stats["rushing_percent_attempts_gte_eight_defenders_total"] = nextgen_stats["rushing_percent_attempts_gte_eight_defenders"] * nextgen_stats["rushing_rush_attempts"]
    nextgen_stats["rushing_percent_attempts_gte_eight_defenders_denom"] = nextgen_stats["rushing_rush_attempts"]

    nextgen_stats["rushing_rush_pct_over_expected_total"] = nextgen_stats["rushing_rush_pct_over_expected"] * nextgen_stats["rushing_rush_attempts"]
    nextgen_stats["rushing_rush_pct_over_expected_denom"] = nextgen_stats["rushing_rush_attempts"]

    # RECEIVING
    nextgen_stats["receiving_avg_cushion_total"] = nextgen_stats["receiving_avg_cushion"] * nextgen_stats["receiving_targets"]
    nextgen_stats["receiving_avg_cushion_denom"] = nextgen_stats["receiving_targets"]

    nextgen_stats["receiving_avg_expected_yac_total"] = nextgen_stats["receiving_avg_expected_yac"] * nextgen_stats["receiving_receptions"]
    nextgen_stats["receiving_avg_expected_yac_denom"] = nextgen_stats["receiving_receptions"]

    nextgen_stats["receiving_avg_separation_total"] = nextgen_stats["receiving_avg_separation"] * nextgen_stats["receiving_targets"]
    nextgen_stats["receiving_avg_separation_denom"] = nextgen_stats["receiving_targets"]

    nextgen_stats["receiving_avg_yac_total"] = nextgen_stats["receiving_avg_yac"] * nextgen_stats["receiving_receptions"]
    nextgen_stats["receiving_avg_yac_denom"] = nextgen_stats["receiving_receptions"]

    nextgen_stats["receiving_avg_yac_above_expectation_total"] = nextgen_stats["receiving_avg_yac_above_expectation"] * nextgen_stats["receiving_receptions"]
    nextgen_stats["receiving_avg_yac_above_expectation_denom"] = nextgen_stats["receiving_receptions"]

    nextgen_stats["receiving_catch_percentage_total"] = nextgen_stats["receiving_catch_percentage"] * nextgen_stats["receiving_targets"]
    nextgen_stats["receiving_catch_percentage_denom"] = nextgen_stats["receiving_targets"]

    nextgen_stats["receiving_avg_intended_air_yards_total"] = nextgen_stats["receiving_avg_intended_air_yards"] * nextgen_stats["receiving_targets"]
    nextgen_stats["receiving_avg_intended_air_yards_denom"] = nextgen_stats["receiving_targets"]

    return nextgen_stats

def _load_nextgen_stats(seasons):
    # load from nflverse
    passing = nfl.load_nextgen_stats(seasons, "passing").to_pandas()
    rushing = nfl.load_nextgen_stats(seasons, "rushing").to_pandas()
    receiving = nfl.load_nextgen_stats(seasons, "receiving").to_pandas()

    passing.rename(columns={"avg_intended_air_yards": "passing_avg_intended_air_yards"}, inplace=True)
    receiving.rename(columns={"avg_intended_air_yards": "receiving_avg_intended_air_yards"}, inplace=True)

    join_cols = ["season", "week", "player_gsis_id"]
    # column names that are unique to each, plus join_cols
    pass_use_cols = join_cols + passing.columns.difference(rushing.columns).difference(receiving.columns).to_list()
    rush_use_cols = join_cols + rushing.columns.difference(passing.columns).difference(receiving.columns).to_list()
    rec_use_cols = join_cols + receiving.columns.difference(passing.columns).difference(rushing.columns).to_list()
    # merge without columns that are the same except join_cols
    nextgen_stats = pd.merge(passing[pass_use_cols], rushing[rush_use_cols], on=join_cols, how="outer")
    nextgen_stats = pd.merge(nextgen_stats, receiving[rec_use_cols], on=join_cols, how="outer")
    nextgen_stats = nextgen_stats[nextgen_stats["week"] >= 1]
    # rename column names with prefixes if they are not join_cols and intersection cols
    nextgen_stats.rename(columns=lambda col: f"passing_{col}" if col in passing.columns.to_list() and col not in [*join_cols, "passing_avg_intended_air_yards"] else col, inplace=True)
    nextgen_stats.rename(columns=lambda col: f"rushing_{col}" if col in rushing.columns.to_list() and col not in join_cols else col, inplace=True)
    nextgen_stats.rename(columns=lambda col: f"receiving_{col}" if col in receiving.columns.to_list() and col not in [*join_cols, "receiving_avg_intended_air_yards"] else col, inplace=True)
    nextgen_stats.rename(columns={"player_gsis_id": "player_id"}, inplace=True)

    # if 'percent' in the column name, divide by 100
    percent_cols = [col for col in nextgen_stats.columns.to_list() if "percent" in col]
    nextgen_stats[percent_cols] = nextgen_stats[percent_cols] / 100

    nextgen_stats = _calculate_nextgen_avg_totals(nextgen_stats)
    nextgen_stats.drop(columns=['passing_completions', 'passing_attempts', 'passing_interceptions', 'passing_pass_touchdowns', 'passing_pass_yards', 
                                'rushing_rush_attempts', 'rushing_rush_touchdowns', 'rushing_rush_yards', 
                                'receiving_rec_touchdowns', 'receiving_receptions', 'receiving_targets', 'receiving_yards'], inplace=True)

    return nextgen_stats

def _load_play_by_play(seasons):
    # load from nflverse
    pbp = nfl.load_pbp(seasons).to_pandas()

    # generate def 3+outs, 4th down stops, yards and points allowed
    pbp["def_three_and_outs"] = np.where((pbp["play_type"] == "punt") & (pbp["drive_first_downs"] == 0), 1, 0)
    pbp["def_fourth_down_stops"] = np.where((pbp["fourth_down_failed"] == 1) & (pbp["fixed_drive_result"] == "Turnover on downs"), 1, 0)
    pbp["def_yards_allowed"] = np.where(pbp["play_type"].isin(["run", "pass"]), pbp["yards_gained"], 0)
    pbp["def_points_allowed"] = (pbp["pass_touchdown"] + pbp["rush_touchdown"]) * 6
    pbp["def_points_allowed"] += np.where((pbp["kickoff_attempt"] + pbp["punt_attempt"] > 0), pbp["return_touchdown"] * 6, 0)
    pbp["def_points_allowed"] += np.where(pbp["extra_point_result"] == "good", 1, 0)
    pbp["def_points_allowed"] += np.where(pbp["two_point_conv_result"] == "success", 2, 0)
    pbp["def_points_allowed"] += np.where(pbp["field_goal_result"] == "made", 3, 0)

    # if defensive team is the same as td scoring team for punt/kickoff return TDs, rotate with posession team
    pbp.loc[(pbp["kickoff_attempt"] + pbp["punt_attempt"] > 0) 
            & (pbp["return_touchdown"] == 1) 
            & (pbp["defteam"] == pbp["td_team"]), 
            "defteam"] = pbp["posteam"]

    # group by game id and defensive team to get game sums
    agg_cols = ["game_id", "defteam", "def_three_and_outs", "def_fourth_down_stops", "def_yards_allowed", "def_points_allowed"]
    pbp = pbp[agg_cols].groupby(["game_id", "defteam"], as_index=False).agg('sum')

    pbp.rename(columns={"defteam": "team"}, inplace=True)
    return pbp

def load_games(seasons):
    # load from nflverse
    schedules = nfl.load_schedules(seasons).to_pandas()
    
    # drop unnecessary columns and rename to camel case
    schedules = schedules[SCHEDULES_COLUMNS]
    schedules.columns = [_snake_to_camel(col) for col in schedules.columns]
    return schedules.to_dict(orient="records")

def load_players(seasons):
    # load data from nflverse and subset
    players = _load_players(seasons)
    depth_charts = _load_depth_charts(seasons)
    ff_rankings = _load_ff_rankings()

    # merge depth charts with players
    players = players.merge(depth_charts, on="gsis_id", how="left")
    # correct team for likely free agents (players whose latest team is different from their depth chart team)
    players.loc[players["latest_team"] != players["team"], "team"] = "FA"

    # get ready to merge with ff_rankings
    # normalize player names
    players["name_key"] = players["display_name"].apply(_normalize_name)
    ff_rankings["name_key"] = ff_rankings["display_name"].apply(_normalize_name)
    # correct team abbreviations
    players.loc[players["latest_team"] == "LA", "latest_team"] = "LAR"
    players.loc[players["team"] == "LA", "team"] = "LAR"
    ff_rankings.loc[ff_rankings["team"] == "JAC", "team"] = "JAX"
    players.loc[players["position"] == "K", "team"] = players["latest_team"]
    # fill in missing teams for free agents
    players["team"] = players["team"].fillna("FA")

    # safely merge ff_rankings with player
    rank_cols = ["ecr", "ecr_sd", "ecr_best", "ecr_worst"]
    # exact first: merge on name + team + position
    players = players.merge(
        ff_rankings[["name_key", "team", "position"] + rank_cols],
        on=["name_key", "team", "position"],
        how="left"
    )
    # rows that didn't have a match
    missing = players["ecr"].isna()
    # fallback: merge on name only
    fallback = players.loc[missing, ["name_key"]].merge(
        ff_rankings[["name_key"] + rank_cols],
        on="name_key",
        how="left"
    )
    players.loc[missing, rank_cols] = fallback[rank_cols].values

    # drop unnecessary columns and rename to camel case
    players.drop(columns=["name_key", "latest_team"], inplace=True)
    players.rename(columns={"gsis_id": "player_id", "display_name": "name"}, inplace=True)
    players.columns = [_snake_to_camel(col) for col in players.columns]
    return players.to_dict(orient="records")

def load_player_games(seasons):
    # load data from nflverse and subset
    player_games = _load_player_stats(seasons)
    snap_counts = _load_snap_counts(seasons)
    nextgen_stats = _load_nextgen_stats(seasons)

    # merge in snap_counts and nextgen_stats to player_games
    player_games = player_games.merge(snap_counts, on=["game_id", "player_id"], how="left")
    player_games = player_games.merge(nextgen_stats, on=["season", "week", "player_id"], how="left")

    # drop unnecessary columns and rename to camel case
    player_games = player_games[PLAYER_GAMES_COLUMNS]
    player_games.columns = [_snake_to_camel(col) for col in player_games.columns]
    return player_games.to_dict(orient="records")

def load_team_games(seasons):
    # load data from nflverse and subset
    team_games = nfl.load_team_stats(seasons).to_pandas()
    pbp = _load_play_by_play(seasons)

    # merge pbp (3+out, 4th down stops, yards and points allowed) to team_games data
    team_games = pd.merge(team_games, pbp, "left", ["game_id", "team"])

    # drop unnecessary columns and rename to camel case
    team_games = team_games[TEAM_GAMES_COLUMNS]
    team_games.columns = [_snake_to_camel(col) for col in team_games.columns]
    return team_games.to_dict(orient="records")
