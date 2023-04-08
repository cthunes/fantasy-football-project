import pandas as pd
from aggregate import *

currentYear = 2023
positions = ["qb", "rb", "wr", "te", "k", "dst"]
# each year is weighed 2.5x more than the previous year (~62%, ~24%, ~10%, ~4%)
weights = [15.625, 6.25, 2.5, 1]


def wrangle(pos, year):
    header = 1
    if pos == "k" or pos == "dst":
        header = 0
    df = pd.read_csv(
        "football-data/raw/{}/{}.csv".format(pos, year), header=header)
    df = df.sort_values(["Player", "Week"])

    if pos == "rb" or pos == "wr" or pos == "te":
        df["HALF"] = df["FPTS"] + df["REC"] * 0.5
        df["PPR"] = df["FPTS"] + df["REC"]
    else:
        df["HALF"] = df["FPTS"]
        df["PPR"] = df["FPTS"]

    grouped = df.groupby("Player", sort=False, as_index=False)

    if pos == "rb":
        df = agg_RBs(grouped)
    elif pos == "wr":
        df = agg_WRs(grouped)
    elif pos == "te":
        df = agg_TEs(grouped)
    elif pos == "qb":
        df = agg_QBs(grouped)
    elif pos == "k":
        df = agg_Ks(grouped)
    else:
        df = agg_DSTs(grouped)

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
    all["Player"] = all["Player"].str.strip()

    # must have played in the last 2 seasons
    all = all[all["Weight_sum"] >= weights[1]]
    all = all[np.logical_not(
        (all["Weight_sum"] < weights[0]) & (all["TEAM"] == "FA"))]

    # add column for role on team (ranking on team for position)
    if pos != "dst":
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
        df["Player"] = df["Player"].str.strip()
        if pos != "dst":
            df.insert(3, "DPCHT", df.groupby("TEAM")[
                "OPP_mean"].transform("rank", ascending=False))
        print("Saving file aggregated/{}/{}.csv".format(pos, year))
        df.to_csv(
            "football-data/aggregated/{}/{}.csv".format(pos, year), index=False)

    wrangle_all(pd.concat(data).sort_values(["Player", "Weight"]), pos)
