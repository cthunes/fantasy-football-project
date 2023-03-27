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
    # average every column over all years for each player using list of weights
    all = grouped.apply(lambda x, cols: pd.Series(np.average(
        x[cols], weights=x["Weight"], axis=0), cols), list(all.columns.values)[2:-1])
    # include sum of weights and YOE based min weight present
    year = grouped.agg(Weight_sum=("Weight", "sum"), YOE=(
        "Weight", lambda x: weights.index(x.min()) + 1))
    all = pd.merge(all, year, "left", "Player")
    all.insert(1, "POS", pos.upper())
    all.insert(1, "TEAM", "")
    all[["Player", "TEAM"]] = all.Player.str.split("(", expand=True)
    all["TEAM"] = all.TEAM.str.replace(')', '', regex=False)
    # must have played in the last 2 seasons
    all = all[all["Weight_sum"] >= weights[1]]
    all = all[np.logical_not(
        (all["Weight_sum"] < weights[0]) & (all["TEAM"] == "FA"))]
    # add column for role on team (ranking on team for position)
    all.insert(3, "DPCHT", all.groupby("TEAM")[
               "OPP_mean"].transform("rank", ascending=False))
    all = all.sort_values("HALF_Score", ascending=False).round(2)
    all = all.drop("Weight_sum", axis=1)
    print("Saving file aggregated/{}/all.csv".format(pos))
    all.to_csv("football-data/aggregated/{}/all.csv".format(pos), index=False)


for pos in positions:

    data = []

    for yearsAgo in range(1, 5):
        year = currentYear - yearsAgo
        df = wrangle(pos, year)
        df["Weight"] = weights[yearsAgo - 1]
        data.append(df)
        df = df.drop("Weight", axis=1)
        df.insert(1, "TEAM", "")
        df[["Player", "TEAM"]] = df.Player.str.split("(", expand=True)
        df["TEAM"] = df.TEAM.str.replace(')', '', regex=False)
        df.insert(3, "DPCHT", df.groupby("TEAM")[
                  "OPP_mean"].transform("rank", ascending=False))
        print("Saving file aggregated/{}/{}.csv".format(pos, year))
        df.to_csv(
            "football-data/aggregated/{}/{}.csv".format(pos, year), index=False)

    wrangle_all(pd.concat(data).sort_values(["Player", "Weight"]), pos)
