import pandas as pd
import argparse
from nflverse import *
from ..mongo.mongo import *


def main(seasons):
    games = load_games(seasons)
    players = load_players(seasons)
    player_games = load_player_games(seasons)
    team_games = load_team_games(seasons)
    client, db = get_database()
    try:
        save_games(db, games)
        save_players(db, players)
        save_player_games(db, player_games)
        save_team_games(db, team_games)
    finally:
        client.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest NFL data into MongoDB up to but not including the current year.")
    parser.add_argument("--current_year", type=int, required = True, help="Current year")
    parser.add_argument("-n","--num_seasons", type=int, default=1, help="Number of seasons to ingest (default: 1)")
    args = parser.parse_args()
    main([*range(args.current_year - args.num_seasons, args.current_year)])