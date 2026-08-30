from pymongo import MongoClient

def get_database():
    print("Connecting to mongo")
    client = MongoClient("mongodb://localhost:27017/")
    try:
        client.admin.command('ping')
    except Exception as e:
        print("Could not connect to MongoDB. Ensure Mongo is up by running `docker compose up -d mongo`")
    return client,client["ffp_db_v2"]

def save_games(db, games):
    print("Saving games")
    result = db["games"].insert_many(games)
    print(f"Inserted {len(result.inserted_ids)} documents into the 'games' collection.")

def save_players(db, players):
    print("Saving players")
    result = db["players"].insert_many(players)
    print(f"Inserted {len(result.inserted_ids)} documents into the 'players' collection.")

def save_player_games(db, player_games):
    print("Saving player games")
    result = db["player_games"].insert_many(player_games)
    print(f"Inserted {len(result.inserted_ids)} documents into the 'player_games' collection.")

def save_team_games(db, team_games):
    print("Saving team games")
    result = db["team_games"].insert_many(team_games)
    print(f"Inserted {len(result.inserted_ids)} documents into the 'team_games' collection.")