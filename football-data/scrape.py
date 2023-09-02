import pandas as pd

currentYear = 2023
positions = ["qb", "rb", "wr", "te", "k", "dst"]


def scrape(pos, year, week):
    print("Scraping {}s in week {} of {}...".format(pos, week, year))
    url = "https://www.fantasypros.com/nfl/stats/{}.php?range=week&year={}&week={}".format(
        pos, year, week
    )
    df = pd.read_html(url)[0]

    if pos == "qb" or pos == "rb" or pos == "wr" or pos == "te":
        df = df.rename(columns={"Unnamed: 1_level_0": ""})
        df[("", "Season")] = year
        df[("", "Week")] = week
        df[("STANDARD", "FPTS")] = df[("MISC", "FPTS")]
    elif pos == "k" or pos == "dst":
        df["Season"] = year
        df["Week"] = week

    if pos == "qb":
        df = df.loc[
            df[("MISC", "G")] > 0,
            [
                ("", "Player"),
                ("", "Season"),
                ("", "Week"),
                ("PASSING", "CMP"),
                ("PASSING", "ATT"),
                ("PASSING", "PCT"),
                ("PASSING", "YDS"),
                ("PASSING", "Y/A"),
                ("PASSING", "TD"),
                ("PASSING", "INT"),
                ("PASSING", "SACKS"),
                ("RUSHING", "ATT"),
                ("RUSHING", "YDS"),
                ("RUSHING", "TD"),
                ("MISC", "FL"),
                ("STANDARD", "FPTS"),
            ],
        ]
    elif pos == "rb":
        df = df.loc[
            df[("MISC", "G")] > 0,
            [
                ("", "Player"),
                ("", "Season"),
                ("", "Week"),
                ("RUSHING", "ATT"),
                ("RUSHING", "YDS"),
                ("RUSHING", "Y/A"),
                ("RUSHING", "LG"),
                ("RUSHING", "20+"),
                ("RUSHING", "TD"),
                ("RECEIVING", "REC"),
                ("RECEIVING", "TGT"),
                ("RECEIVING", "YDS"),
                ("RECEIVING", "Y/R"),
                ("RECEIVING", "TD"),
                ("MISC", "FL"),
                ("STANDARD", "FPTS"),
            ],
        ]
    elif pos == "wr" or pos == "te":
        df = df.loc[
            df[("MISC", "G")] > 0,
            [
                ("", "Player"),
                ("", "Season"),
                ("", "Week"),
                ("RECEIVING", "REC"),
                ("RECEIVING", "TGT"),
                ("RECEIVING", "YDS"),
                ("RECEIVING", "Y/R"),
                ("RECEIVING", "LG"),
                ("RECEIVING", "20+"),
                ("RECEIVING", "TD"),
                ("RUSHING", "ATT"),
                ("RUSHING", "YDS"),
                ("RUSHING", "TD"),
                ("MISC", "FL"),
                ("STANDARD", "FPTS"),
            ],
        ]
    elif pos == "k":
        df = df.loc[
            df["G"] > 0,
            [
                "Player",
                "Season",
                "Week",
                "FG",
                "FGA",
                "PCT",
                "LG",
                "1-19",
                "20-29",
                "30-39",
                "40-49",
                "50+",
                "XPT",
                "XPA",
                "FPTS",
            ],
        ]
    elif pos == "dst":
        df = df.loc[
            df["G"] > 0,
            [
                "Player",
                "Season",
                "Week",
                "SACK",
                "INT",
                "FR",
                "FF",
                "DEF TD",
                "SFTY",
                "SPC TD",
                "FPTS",
            ],
        ]

    return df


for pos in positions:
    for yearsAgo in range(1, 6):
        data = []
        year = currentYear - yearsAgo
        for week in range(1, 18):
            data.append(scrape(pos, year, week))
        if year > 2020:
            # starting in 2021, there is a week 18
            data.append(scrape(pos, year, 18))
        print("Saving file raw/{}/{}.csv".format(pos, year))
        pd.concat(data).to_csv("raw/{}/{}.csv".format(pos, year), index=False)
