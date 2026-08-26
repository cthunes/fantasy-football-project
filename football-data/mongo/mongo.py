from pymongo import MongoClient

def get_database():
    client = MongoClient("mongodb://localhost:27017/")
    try:
        client.admin.command('ping')
    except Exception as e:
        print("Could not connect to MongoDB. Ensure Mongo is up by running `docker compose up -d mongo`")
    return client,client["ffp_db"]

def save_games(db, games):
    collection = db["games"]
    result = collection.insert_many(games)
    print(f"Inserted {len(result.inserted_ids)} documents into the 'games' collection.")

def save_players(db, players):
    collection = db["players"]
    result = collection.insert_many(players)
    print(f"Inserted {len(result.inserted_ids)} documents into the 'players' collection.")

def save_player_games(db, player_games):
    collection = db["player_games"]
    result = collection.insert_many(player_games)
    print(f"Inserted {len(result.inserted_ids)} documents into the 'player_games' collection.")

def save_team_games(db, team_games):
    collection = db["team_games"]
    result = collection.insert_many(team_games)
    print(f"Inserted {len(result.inserted_ids)} documents into the 'team_games' collection.")