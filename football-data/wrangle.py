import pandas as pd
from aggregate import *

currentYear = 2023
# positions = ["qb", "rb", "wr", "te", "k", "dst"]
positions = ["rb"]
weights = [.6, .25, .1, .05]


def wrangle(pos, year):
    header = 0
    if pos == "qb" or pos == "rb" or pos == "wr" or pos == "te":
        header = 1
    df = pd.read_csv(
        "football-data/raw/{}/{}.csv".format(pos, year), header=header)
    df = df.sort_values(["Player", "Week"])
    if pos == "rb" or pos == "wr" or pos == "te":
        df["HALF"] = df["FPTS"] + df["REC"] * 0.5
        df["PPR"] = df["FPTS"] + df["REC"]
    grouped = df.groupby("Player", sort=False, as_index=False)
    if pos == "rb":
        df = agg_RBs(grouped)
    else:
        df = grouped.agg(Pos=("Player", lambda x: pos.upper()),
                         G=("Player", "size"),
                         FPTS=("FPTS", "mean"),
                         FPTS_std=("FPTS", "std"))

    df = df.sort_values("HALF_Score", ascending=False)
    return df.round(2)


def wrangle_all(all, pos):
    grouped = all.groupby("Player", sort=False, as_index=False)
    all = grouped.apply(lambda x, cols: pd.Series(np.average(
        x[cols], weights=x["Weight"], axis=0), cols), list(all.columns.values)[2:-1])
    year = grouped["Weight"].sum()
    all = pd.merge(all, year, "left", "Player")
    all.insert(1, "POS", pos.upper())
    all.insert(1, "TEAM", "")
    all[["Player", "TEAM"]] = all.Player.str.split("(", expand=True)
    all["TEAM"] = all.TEAM.str.replace(')', '', regex=False)
    # must have played in the last 2 seasons
    all = all[all["Weight"] >= weights[1]]
    all = all[np.logical_not(
        (all["Weight"] < weights[0]) & (all["TEAM"] == "FA"))]
    all = all.sort_values(["HALF_Score"], ascending=False).round(2)
    all = all.drop("Weight", axis=1)
    all.to_csv("football-data/aggregated/{}/all.csv".format(pos), index=False)


for pos in positions:

    data = []

    for yearsAgo in range(1, 5):
        year = currentYear - yearsAgo
        df = wrangle(pos, year)
        df.to_csv(
            "football-data/aggregated/{}/{}.csv".format(pos, year), index=False)
        df["Weight"] = weights[yearsAgo - 1]
        data.append(df)

    wrangle_all(pd.concat(data).sort_values(["Player", "Weight"]), pos)
