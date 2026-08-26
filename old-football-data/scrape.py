import pandas as pd
import requests as requests
from bs4 import BeautifulSoup
from io import StringIO

currentYear = 2025
years = 5
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


def scrapeFD(type, year):
    url = "https://www.footballdb.com/statistics/nfl/player-stats/{}/{}/regular-season".format(
        type, year
    )
    header = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.75 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
    }
    r = requests.get(url, headers=header)
    soup = BeautifulSoup(r.text, "html.parser")
    for tag in soup.find_all("span", class_=["d-xl-none", "statplayer-team"]):
        tag.decompose()
    var = "Att" if type == "rushing" else "Rec"
    df = pd.read_html(StringIO(str(soup.find_all("table"))))[0][["Player", var, "FD"]]
    path = "raw/fd/{}/{}.csv".format(type, year)
    print("Saving file {}".format(path))
    df.to_csv(path, index=False)


for pos in positions:
    for yearsAgo in range(1, years + 1):
        data = []
        year = currentYear - yearsAgo
        for week in range(1, 18):
            data.append(scrape(pos, year, week))
        if year > 2020:
            # starting in 2021, there is a week 18
            data.append(scrape(pos, year, 18))
        path = "raw/{}/{}.csv".format(pos, year)
        print("Saving file {}".format(path))
        pd.concat(data).to_csv("raw/{}/{}.csv".format(pos, year), index=False)


# scrape first downs from footballdb
for yearsAgo in range(1, years + 1):
    year = currentYear - yearsAgo
    scrapeFD("rushing", year)
    scrapeFD("receiving", year)
