import nflreadpy as nfl
import pandas as pd


def load_games(seasons):
    schedules = nfl.load_schedules(seasons).to_pandas()
    schedules = schedules[["game_id", "season", "week", "home_team", "away_team", "home_score", "away_score", 
                           "home_rest", "away_rest", "roof", "surface", "temp", "wind"]]
    return schedules.to_dict(orient="records")

def load_players(seasons):
    players = nfl.load_players().to_pandas()
    depth_charts = nfl.load_depth_charts(seasons[-1] + 1).to_pandas()
    ff_rankings = nfl.load_ff_rankings().to_pandas()
    positions = ['QB', 'RB', 'WR', 'TE', 'K']
    players.loc[players["position"] == "FB", "position"] = "RB"
    players = players[players['position'].isin(positions)]
    players = players[players['last_season'] >= seasons[0]]
    players = players[["gsis_id", "display_name", "first_name", "last_name", "position", "height", "weight", 
                       "headshot", "college_name", "rookie_season", "last_season", "latest_team", "status", 
                       "years_of_experience", "draft_year", "draft_round", "draft_pick"]]
    depth_charts = depth_charts[depth_charts['pos_abb'].isin(positions)]
    depth_charts = depth_charts.sort_values("dt", ascending=False)
    depth_charts = depth_charts.drop_duplicates(subset=["gsis_id"], keep="first")
    depth_charts = depth_charts[["gsis_id", "team", "pos_rank"]]
    players = players.merge(depth_charts, on="gsis_id", how="left")
    ff_rankings = ff_rankings[ff_rankings['page_type'].isin(['redraft-qb', 'redraft-rb', 'redraft-wr', 'redraft-te', 'redraft-k', 'redraft-dst'])]
    ff_rankings = ff_rankings[["player", "pos", "team", "ecr", "sd", "best", "worst"]]
    ff_rankings.rename(columns={"player": "display_name", "pos": "position", "sd": "ecr_sd", "best": "ecr_best", "worst": "ecr_worst"}, inplace=True)
    ff_rankings["display_name"] = ff_rankings["display_name"].str.replace(r" Jr.$| Sr.$| II$| III$| IV$", "", regex=True)
    ff_rankings.loc[ff_rankings["team"] == "JAC", "team"] = "JAX"
    players["display_name"] = players["display_name"].str.replace(r" Jr.$| Sr.$| II$| III$| IV$", "", regex=True)
    players.loc[players["team"] == "LA", "team"] = "LAR"
    players.loc[players["position"] == "K", "team"] = players["latest_team"]
    players["team"] = players["team"].fillna("FA")
    players = players.merge(ff_rankings, on=["display_name", "team", "position"], how="outer")
    return players.to_dict(orient="records")

def load_player_games(seasons):
    player_games = nfl.load_player_stats(seasons).to_pandas()
    return player_games.to_dict(orient="records")

def _load_play_by_play(seasons):
    pass

def load_team_games(seasons):
    team_games = nfl.load_team_stats(seasons).to_pandas()
    return team_games.to_dict(orient="records")