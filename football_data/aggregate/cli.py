import argparse

from football_data.aggregate.defaults import (
    DEFAULT_SCORING_CONFIG,
    DEFAULT_WEIGHTED_WEIGHTS,
    ensure_reference_documents,
)
from football_data.aggregate.orchestrate import (
    aggregate_players,
    build_season_aggregations,
    build_weighted_aggregations,
)
from football_data.mongo.mongo import get_database


def main(argv=None):
    parser = argparse.ArgumentParser(description="Build Mongo player aggregations.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    seasons_parser = subparsers.add_parser("seasons", help="Aggregate each requested season")
    seasons_parser.add_argument("--seasons", nargs="+", type=int, required=True)
    seasons_parser.add_argument("--scoring", default=DEFAULT_SCORING_CONFIG["_id"])

    weighted_parser = subparsers.add_parser("weighted", help="Blend existing season aggregations")
    weighted_parser.add_argument("--seasons", nargs="+", type=int, required=True)
    weighted_parser.add_argument("--weights", nargs="+", type=float, default=list(DEFAULT_WEIGHTED_WEIGHTS))
    weighted_parser.add_argument("--scoring", default=DEFAULT_SCORING_CONFIG["_id"])

    profile_parser = subparsers.add_parser("profile", help="Aggregate using a profile's rules")
    profile_parser.add_argument("--profile-id", required=True)
    profile_parser.add_argument("--seasons", nargs="+", type=int, required=True)
    profile_parser.add_argument(
        "--combine-seasons",
        action="store_true",
        help="Aggregate all requested seasons together instead of separately",
    )
    profile_parser.add_argument("--scoring", default=DEFAULT_SCORING_CONFIG["_id"])

    args = parser.parse_args(argv)
    client, db = get_database()
    try:
        ensure_reference_documents(db)
        if args.command == "seasons":
            documents = build_season_aggregations(db, args.seasons, args.scoring)
        elif args.command == "weighted":
            documents = build_weighted_aggregations(
                db,
                args.seasons,
                weights=tuple(args.weights),
                scoring_config=args.scoring,
            )
        elif args.command == "profile":
            if args.combine_seasons:
                documents = aggregate_players(
                    db,
                    {
                        "type": "profile",
                        "profileId": args.profile_id,
                        "seasons": args.seasons,
                    },
                    args.scoring,
                    scope="player",
                )
            else:
                documents = []
                for season in args.seasons:
                    documents.extend(
                        aggregate_players(
                            db,
                            {
                                "type": "profile",
                                "profileId": args.profile_id,
                                "seasons": [season],
                            },
                            args.scoring,
                        )
                    )
        else:
            raise ValueError(args.command)
        print(f"Upserted {len(documents)} player_aggregations documents.")
    finally:
        client.close()


if __name__ == "__main__":
    main()
