import pandas as pd


def wrangle(pos, year):
    if pos == "qb" or pos == "rb" or pos == "wr" or pos == "te":
        df = pd.read_csv(
            "football-data/raw/{}/{}.csv".format(pos, year), header=[0, 1])
        df = df.rename(columns={"Unnamed: 0_level_0": "",
                       "Unnamed: 1_level_0": "", "Unnamed: 2_level_0": ""})
        df = df.sort_values([("", "Player"), ("", "Week")])
        if pos != "qb":
            df[("HALF-PPR", "FPTS")] = df[("STANDARD", "FPTS")] + \
                df[("RECEIVING", "REC")] * 0.5
            df[("PPR", "FPTS")] = df[("STANDARD", "FPTS")] + \
                df[("RECEIVING", "REC")]
        return df
    elif pos == "k" or pos == "dst":
        df = pd.read_csv("football-data/raw/{}/{}.csv".format(pos, year))
        df = df.sort_values(["Player", "Week"])
        return df

# wrangle("qb", 2022)
