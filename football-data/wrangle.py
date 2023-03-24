import pandas as pd
from aggregate import *


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
    df["Season"] = year
    df = df.sort_values("HALF_Score", ascending=False)
    return df.round(2)


pos = "rb"
df = wrangle(pos, 2022)
df.index = np.arange(1, len(df) + 1)
print(df)
