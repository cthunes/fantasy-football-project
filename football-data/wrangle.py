import pandas as pd
from aggregate import *

currentYear = 2025
years = 5
# .00001 or the addition of .00001 all refers to 0; this prevents errors caused by it being exactly 0
positions = [
    {"name": "qb", "weights": [15.625, 6.25, 2.5, 1, 0.00001]},
    {"name": "rb", "weights": [8, 4, 2, 1, 0.00001]},
    {"name": "wr", "weights": [3.375, 2.25, 1.5, 1, 0.00001]},
    {"name": "te", "weights": [81, 27, 9, 3, 1]},
    {"name": "k", "weights": [3.375, 2.25, 1.5, 1, 0.00001]},
    {"name": "dst", "weights": [64, 16, 4, 1, 0.00001]},
]

# use last names as join column
def split_join_name(df):
    df["join_name"] = (
        df["Player"]
        .str.replace(r" Jr.$| Sr.$| II$| III$| IV$", "", regex=True)
        .str.rsplit(n=1)
        .str[-1]
    )


def split_team(df):
    df.insert(1, "TEAM", "")
    df[["Player", "TEAM"]] = df.Player.str.split("(", expand=True)
    df["TEAM"] = df.TEAM.str.replace(")", "", regex=False)
    df["Player"] = df["Player"].str.strip()


def add_fds(df, pos, year):
    df["copy"] = df["Player"]
    split_team(df)

    rush_fds = pd.read_csv("raw/fd/rushing/{}.csv".format(year))

    # use last names as join column
    split_join_name(df)
    split_join_name(rush_fds)
    rush_fds = rush_fds.drop(columns="Player")

    rush_fds = rush_fds.rename(columns={"Att": "rush_ATT"})
    df = df.merge(rush_fds, how="left", on=["join_name", "rush_ATT"])
    loc = list(df.columns).index("rush_Y/A")
    df.insert(loc + 1, "rush_FD", df["FD"])
    df.fillna(0, inplace=True)
    total_rush_FD = df["rush_FD"].sum()
    rush_ATT_per_FD = df.loc[df["rush_FD"] > 0, "rush_ATT"].sum() / total_rush_FD
    rush_YDS_per_FD = df.loc[df["rush_FD"] > 0, "rush_YDS"].sum() / total_rush_FD
    # replace 0 FDs when there are missing values with expected number of first downs
    df["rush_FD"] = np.where(
        df["rush_FD"] == 0,
        round(
            (
                (df["rush_ATT"] / rush_ATT_per_FD)
                + (df["rush_YDS"] / rush_YDS_per_FD)
            )
            / 2
        ),
        df["rush_FD"],
    )
    df.insert(loc + 2, "rush_FD_mean", df["rush_FD"] / df["G"])
    df = df.drop(columns="FD")

    if pos != "qb":
        rec_fds = pd.read_csv("raw/fd/receiving/{}.csv".format(year))
        split_join_name(rec_fds)
        rec_fds = rec_fds.drop(columns="Player")
        rec_fds = rec_fds.rename(columns={"Rec": "rec_REC"})
        df = df.merge(rec_fds, how="left", on=["join_name", "rec_REC"])
        loc = list(df.columns).index("rec_Y/R")
        df.insert(loc + 1, "rec_FD", df["FD"])
        df.fillna(0, inplace=True)
        total_rec_FD = df["rec_FD"].sum()
        rec_REC_per_FD = df.loc[df["rec_FD"] > 0, "rec_REC"].sum() / total_rec_FD
        rec_YDS_per_FD = df.loc[df["rec_FD"] > 0, "rec_YDS"].sum() / total_rec_FD
        # replace 0 FDs when there are missing values with expected number of first downs
        df["rec_FD"] = np.where(
            df["rec_FD"] == 0,
            round(
                (
                    (df["rec_REC"] / rec_REC_per_FD)
                    + (df["rec_YDS"] / rec_YDS_per_FD)
                )
                / 2
            ),
            df["rec_FD"],
        )
        df.insert(loc + 2, "rec_FD_mean", df["rec_FD"] / df["G"])
        df = df.drop(columns="FD")

    loc = list(df.columns).index("OPP_mean")
    df.insert(
        loc + 1,
        "FD",
        df["rush_FD"] + df["rec_FD"] if pos != "qb" else df["rush_FD"],
    )
    df.insert(
        loc + 2,
        "FD_mean",
        (
            df["rush_FD_mean"] + df["rec_FD_mean"]
            if pos != "qb"
            else df["rush_FD_mean"]
        ),
    )

    df["HALF_Score"] = df["HALF_Score"] + df["FD_mean"] * 0.5
    df["Player"] = df["copy"]
    df = df.drop(columns=["join_name", "TEAM", "copy"])

    return df.round(2).drop_duplicates()


def add_fds_by_game(df, pos, year):
    df_grouped = df.groupby("Player", as_index=False)

    split_team(df)
    df_sum = df_grouped.agg({"rush_ATT": "sum"}).rename(columns={"rush_ATT": "rush_ATT_sum"})
    split_team(df_sum)
    df = df.merge(df_sum, on=["Player", "TEAM"], how="left")
    rush_fds = pd.read_csv("raw/fd/rushing/{}.csv".format(year))

    split_join_name(df)
    split_join_name(rush_fds)
    rush_fds = rush_fds.drop(columns="Player")

    df = df.merge(rush_fds, how="left", left_on=["join_name", "rush_ATT_sum"], right_on=["join_name", "Att"])
    loc = list(df.columns).index("rush_YDS")
    df.insert(loc + 1, "rush_FD", df["FD"])

    # Identify unmatched rows and fuzzy match or fill with expected value
    unmatched = df[df["FD"].isna()].copy()
    approx_candidates = unmatched[["join_name", "Week", "rush_ATT_sum"]].merge(
        rush_fds[["join_name", "Att", "FD"]],
        how="left",
        on="join_name"
    )
    mask = np.abs(approx_candidates["rush_ATT_sum"] - approx_candidates["Att"]) / approx_candidates["Att"] <= 0.05
    approx_candidates = approx_candidates[mask].copy()
    approx_candidates["diff"] = np.abs(approx_candidates["rush_ATT_sum"] - approx_candidates["Att"])
    approx_candidates = approx_candidates.sort_values("diff").drop_duplicates(subset=["join_name", "Week", "rush_ATT_sum"])
    df.set_index(["join_name", "Week", "rush_ATT_sum"], inplace=True)
    approx_candidates.set_index(["join_name", "Week", "rush_ATT_sum"], inplace=True)
    df.loc[approx_candidates.index, "rush_FD"] = approx_candidates["FD"]
    df.reset_index(inplace=True)
    rush_ATT_per_FD = rush_fds["Att"].sum() / rush_fds["FD"].sum()
    df["rush_FD"] = df["rush_FD"].fillna(0)
    df["rush_FD"] = np.where(
        df["rush_FD"] == 0,
        df["rush_ATT"] / rush_ATT_per_FD,
        df["rush_FD"]
    )

    df = df.drop(columns="FD")

    if pos != "qb":
        rec_fds = pd.read_csv("raw/fd/receiving/{}.csv".format(year))
        split_join_name(rec_fds)
        rec_fds = rec_fds.drop(columns="Player")

        df_sum = df_grouped.agg({"rec_REC": "sum"}).rename(columns={"rec_REC": "rec_REC_sum"})
        split_team(df_sum)
        df = df.merge(df_sum, on=["Player", "TEAM"], how="left")
        df = df.merge(rec_fds, how="left", left_on=["join_name", "rec_REC_sum"], right_on=["join_name", "Rec"])
        loc = list(df.columns).index("rec_YDS")
        df.insert(loc + 1, "rec_FD", df["FD"])

        # Identify unmatched rows and fuzzy match or fill with expected value
        unmatched = df[df["FD"].isna()].copy()
        approx_candidates = unmatched[["join_name", "Week", "rec_REC_sum"]].merge(
            rec_fds[["join_name", "Rec", "FD"]],
            how="left",
            on="join_name"
        )
        mask = np.abs(approx_candidates["rec_REC_sum"] - approx_candidates["Rec"]) / approx_candidates["Rec"] <= 0.05
        approx_candidates = approx_candidates[mask].copy()
        approx_candidates["diff"] = np.abs(approx_candidates["rec_REC_sum"] - approx_candidates["Rec"])
        approx_candidates = approx_candidates.sort_values("diff").drop_duplicates(subset=["join_name", "Week", "rec_REC_sum"])
        df.set_index(["join_name", "Week", "rec_REC_sum"], inplace=True)
        approx_candidates.set_index(["join_name", "Week", "rec_REC_sum"], inplace=True)
        df.loc[approx_candidates.index, "rec_FD"] = approx_candidates["FD"]
        df.reset_index(inplace=True)
        rec_REC_per_FD = rec_fds["Rec"].sum() / rec_fds["FD"].sum()
        df["rec_FD"] = df["rec_FD"].fillna(0)
        df["rec_FD"] = np.where(
            df["rec_FD"] == 0,
            df["rec_REC"] / rec_REC_per_FD,
            df["rec_FD"]
        )

        df = df.drop(columns="FD")

    loc = list(df.columns).index("OPP")
    df.insert(
        loc + 1,
        "FD_expected",
        (
            df["rush_FD"] * df["rush_ATT"] / df["Att"] + df["rec_FD"] * df["rec_REC"] / df["Rec"]
            if pos != "qb"
            else df["rush_FD"] * df["rush_ATT"] / df["Att"]
        ).fillna(0).round(0)
    )

    df["FPTS"] = df["FPTS"] + df["FD_expected"] * 0.5
    df["HALF"] = df["HALF"] + df["FD_expected"] * 0.5
    df["PPR"] = df["PPR"] + df["FD_expected"] * 0.5
    df = df.drop(columns=["rush_FD", "Att", "join_name", "rush_ATT_sum"])
    if pos != "qb":
        df = df.drop(columns=["rec_REC_sum", "rec_FD", "Rec"])
    # move week to 4th position
    week_col = df.pop("Week")
    df.insert(3, "Week", week_col)
    return df.round(2).drop_duplicates()


def save_ind_games(df, pos, year):
    if pos == "qb":
        df = df.rename(columns = {"CMP" : "pass_CMP",
                                  "ATT" : "pass_ATT",
                                  "PCT" : "pass_PCT",
                                  "YDS" : "pass_YDS",
                                  "Y/A" : "pass_Y/A",
                                  "TD" : "pass_TD",
                                  "INT" : "pass_INT",
                                  "SACKS" : "pass_SACKS",
                                  "ATT.1" : "rush_ATT",
                                  "YDS.1" : "rush_YDS",
                                  "TD.1" : "rush_TD"})
        df.insert(14, "OPP", df["pass_ATT"] + df["rush_ATT"])
    elif pos == "rb":
        df = df.rename(columns = {"ATT" : "rush_ATT",
                                  "YDS" : "rush_YDS",
                                  "Y/A" : "rush_Y/A",
                                  "LG" : "rush_LG",
                                  "20+" : "rush_20+",
                                  "TD" : "rush_TD",
                                  "REC" : "rec_REC",
                                  "TGT" : "rec_TGT",
                                  "YDS.1" : "rec_YDS",
                                  "Y/R" : "rec_Y/R",
                                  "TD.1" : "rec_TD"})
        df.insert(14, "TOU", df["rush_ATT"] + df["rec_REC"])
        df.insert(15, "OPP", df["rush_ATT"] + df["rec_TGT"])
    elif pos == "wr" or pos == "te":
        df = df.rename(columns = {"REC" : "rec_REC",
                                  "TGT" : "rec_TGT",
                                  "YDS" : "rec_YDS",
                                  "Y/R" : "rec_Y/R",
                                  "LG" : "rec_LG",
                                  "20+" : "rec_20+",
                                  "TD" : "rec_TD",
                                  "ATT" : "rush_ATT",
                                  "YDS.1" : "rush_YDS",
                                  "Y/A" : "rush_Y/A",
                                  "TD.1" : "rush_TD"})
        df.insert(13, "TOU", df["rush_ATT"] + df["rec_REC"])
        df.insert(14, "OPP", df["rush_ATT"] + df["rec_TGT"])
    elif pos == "k":
        df = df.rename(columns = {"1-19" : "FG_10_19",
                                  "20-29" : "FG_20_29",
                                  "30-39" : "FG_30_39",
                                  "40-49" : "FG_40_49",
                                  "50+" : "FG_50",
                                  "XPT" : "XP"})
        df.insert(14, "OPP", df["FGA"] + df["XPA"])
    else:  #dst
        df = df.rename(columns = {"DEF TD" : "D_TD", "SPC TD" : "ST_TD"})
    
    if pos != "dst" and pos != "k":
        df = add_fds_by_game(df, pos, year)
    else:
        split_team(df)

    print("Saving file aggregated/{}/{}games.csv".format(pos, year))
    df.to_csv("aggregated/{}/{}games.csv".format(pos, year), index=False)


def wrangle(pos, year):
    header = 1
    if pos == "k" or pos == "dst":
        header = 0
    df = pd.read_csv("raw/{}/{}.csv".format(pos, year), header=header)

    if pos == "rb" or pos == "wr" or pos == "te":
        df["HALF"] = df["FPTS"] + df["REC"] * 0.5
        df["PPR"] = df["FPTS"] + df["REC"]
    else:
        df["HALF"] = df["FPTS"]
        df["PPR"] = df["FPTS"]

    pt = [5, 10, 15, 20]
    if pos == "rb" or pos == "wr":
        pt = [10, 20, 30, 40]

    g = 16
    if year >= 2021:
        g = 17

    for type in ["FPTS", "HALF", "PPR"]:
        name = "{}_tier".format(type)
        df = df.sort_values(type, ascending=False)
        df.loc[df.index[0 : (pt[0] * g)], name] = 1
        df.loc[df.index[(pt[0] * g) : (pt[1] * g)], name] = 2
        df.loc[df.index[(pt[1] * g) : (pt[2] * g)], name] = 3
        df.loc[df.index[(pt[2] * g) : (pt[3] * g)], name] = 4
        df.loc[df.index[(pt[3] * g) :], name] = 5

    df = df.sort_values(["Player", "Week"])
    save_ind_games(df.copy(), pos, year)

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

    if pos != "dst" and pos != "k":
        df = add_fds(df, pos, year)
    df = df.sort_values("HALF_Score", ascending=False)
    return df.round(2)


def calc_projected_points(df, pos):
    # Save original YOE
    original_yoe = df["YOE"].copy()
    # Cap YOE at 3 for calculation
    df["YOE"] = df["YOE"].clip(upper=3)

    if pos == "rb":
        df["proj_HALF_mean"] = (
            13.12818
            - 0.02306 * df["rush_ATT"]
            + 0.06813 * df["rec_YDS_mean"] * df["FD_mean"]
            - 0.00950 * df["rec_TGT"] * df["YOE"]
            - 4.57418 * df["rush_TD_mean"] * df["rec_FD_mean"]
            + 0.45833 * df["FL"] * df["HALF_okay"]
            - 7.43081 * df["YOE"] * df["FL_mean"]
            + 0.55976 * df["rush_TD_mean"] * df["rush_ATT_mean"]
            + 0.56447 * df["HALF_bad"] * df["HALF_QSRat"]
            - 0.07782 * df["HALF_bad"] * df["HALF_Score"]
            + 0.03167 * df["HALF_bad"] * df["rush_LG_mean"]
            - 2.99109 * df["rush_TD_mean"] * df["HALF_GSRat"]
        )
        df["proj_HALF"] = (
            174.41515
            - 0.35377 * df["HALF"]
            + 0.90041 * df["HALF_median"] * df["HALF_std"]
            - 0.75860 * df["G"] * df["YOE"]
            + 10.92800 * df["rec_FD"] * df["rec_FD_mean"]
            - 1.74416 * df["HALF_std"] * df["rec_FD"]
            - 0.48346 * df["rec_FD"] * df["rec_YDS_mean"]
            + 0.06526 * df["HALF_std"] * df["rec_YDS"]
            - 627.34446 * df["YOE"] * df["FL/T"]
            - 26.52114 * df["rush_TD"] * df["FL_mean"]
            + 2.66273 * df["FL"] * df["rec_Y/R"]
            + 0.76498 * df["rec_FD"] * df["FD_mean"]
        )
    elif pos == "wr":
        df["proj_HALF_mean"] = (
            9.69071
            + 0.00259 * df["rec_YDS_mean"] * df["HALF_mean"]
            - 0.16450 * df["rec_TGT_mean"] * df["YOE"]
            + 0.03589 * df["FD"] * df["HALF_good"]
            + 0.02769 * df["YOE"] * df["rush_Y/A"]
            - 2.99380 * df["rush_TD_mean"] * df["HALF_bad"]
            + 0.01785 * df["rush_YDS"] * df["HALF_poor"]
            - 0.28925 * df["HALF_poor"] * df["rush_FD"]
            - 0.01138 * df["HALF_good"] * df["rec_TGT"]
            + 0.05881 * df["rec_REC_mean"] * df["HALF_std"]
            + 32.07052 * df["HALF_good"] * df["FL_mean"]
            - 1.61720 * df["HALF_good"] * df["FL"]
            + 0.18181 * df["YOE"] * df["HALF_great"]
            - 19.63244 * df["HALF_great"] * df["FL/T"]
            - 0.80565 * df["rec_20_mean"] * df["HALF_QSRat"]
        )
        df["proj_HALF"] = (
            146.08707
            - 47.21410 * df["rec_20_mean"]
            + 0.02493 * df["HALF"] * df["HALF_mean"]
            - 0.45074 * df["rec_TGT"] * df["YOE"]
            + 2.32740 * df["FD_mean"] * df["HALF_good"]
            - 7.07173 * df["rec_Y/R"] * df["rec_TD_mean"]
            + 0.23833 * df["HALF"] * df["YOE"]
            + 93.68252 * df["OPP_mean"] * df["FL_mean"]
            - 0.63054 * df["rec_YDS_mean"] * df["FL"]
            + 0.94726 * df["rush_Y/A"] * df["HALF_poor"]
            - 144.55716 * df["rush_FD_mean"] * df["HALF_GSRat"]
            + 2.52930 * df["HALF_std"] * df["HALF_great"]
            - 1.55837 * df["HALF_great"] * df["rec_20"]
            + 4.87852 * df["rec_20_mean"] * df["rec_20"]
            - 46.06631 * df["rush_TD_mean"] * df["HALF_bad"]
        )
    elif pos == "te":
        df["proj_HALF_mean"] = (
            12.75958
            - 0.85382 * df["HALF_bad"]
            + 0.00094 * df["rec_YDS_mean"] * df["HALF"]
            - 0.04137 * df["OPP"] * df["rec_20_mean"]
            - 0.27865 * df["HALF_median"] * df["HALF_okay"]
            + 0.30654 * df["HALF_okay"] * df["FL"]
            - 1.94957 * df["rec_TD_mean"] * df["YOE"]
            + 0.03081 * df["HALF_okay"] * df["FD"]
            - 1.77217 * df["HALF_poor"] * df["HALF_GSRat"]
            + 0.02437 * df["HALF_bad"] * df["G"]
        )
        df["proj_HALF"] = (
            77.06606
            + 1.54876 * df["HALF"]
            - 1.32314 * df["rec_TD_mean"] * df["OPP"]
            - 0.02691 * df["OPP"] * df["rec_20"]
            - 18.28303 * df["rec_20_mean"] * df["HALF_okay"]
            - 0.16448 * df["rec_FD"] * df["HALF_std"]
            - 1.05763 * df["G"] * df["HALF_mean"]
            + 0.01569 * df["HALF_mean"] * df["rec_YDS"]
        )
    elif pos == "qb":
        df["proj_HALF_mean"] = (
            -2.07396
            + 1.97038 * df["pass_Y/A"]
            + 0.06576 * df["HALF_std"] * df["HALF_okay"]
            - 0.03382 * df["rush_ATT"] * df["YOE"]
            - 0.14149 * df["pass_Y/A"] * df["pass_INT"]
            + 0.02208 * df["pass_INT_mean"] * df["OPP"]
            + 0.14543 * df["rush_ATT_mean"] * df["G"]
            + 0.20314 * df["pass_Y/A"] * df["YOE"]
        )
        df["proj_HALF"] = (
            41.63286
            + 12.46356 * df["HALF_mean"]
            + 1.24346 * df["HALF_std"] * df["HALF_okay"]
            + 0.01935 * df["rush_YDS"] * df["HALF_bad"]
            - 9.05340 * df["pass_SACKS_mean"] * df["rush_FD"]
            - 0.85178 * df["HALF_bad"] * df["HALF_median"]
            + 0.58581 * df["HALF_bad"] * df["G"]
            + 8.60298 * df["pass_SACKS"] * df["rush_FD_mean"]
        )
    elif pos == "k":
        df["proj_HALF_mean"] = (
            9.60008
            + 0.63111 * df["XP"] * df["HALF_GSRat"]
            - 0.02792 * df["OPP_mean"] * df["HALF_std"]
            - 0.73075 * df["FG_30_39_mean"] * df["YOE"]
            - 0.49275 * df["HALF_GSRat"] * df["XPA"]
            + 0.39128 * df["FG_30_39_mean"] * df["FG_50"]
            - 0.10654 * df["FG_50_mean"] * df["OPP"]
            + 0.10534 * df["FG_50"] * df["HALF_adj"]
            - 0.01765 * df["HALF_median"] * df["HALF_good"]
            - 0.63511 * df["HALF_GSRat"] * df["HALF_poor"]
        )
        df["proj_HALF"] = (
            164.65195
            - 253.20695 * df["HALF_GSRat"]
            + 5.26911 * df["HALF_adj"] * df["HALF_great"]
            - 3.62681 * df["HALF_great"] * df["OPP_mean"]
            - 1.42104 * df["HALF_good"] * df["YOE"]
            + 1.44246 * df["HALF_GSRat"] * df["HALF"]
            - 6.35416 * df["FGA"] * df["FG_PCT"]
            + 4.99918 * df["G"] * df["FG_mean"]
        )
        df["proj_HALF_mean"] = np.where(
            (df["OPP"] > df["OPP"].median() / 2), df["proj_HALF_mean"], 0
        )
        df["proj_HALF"] = np.where(
            (df["OPP"] > df["OPP"].median() / 2), df["proj_HALF"], 0
        )
    else:
        df["proj_HALF_mean"] = (
            4.11413
            + 0.46106 * df["HALF_mean"]
            + 0.18600 * df["ST_TD"] * df["HALF_okay"]
            - 0.03364 * df["HALF_bad"] * df["HALF_poor"]
            + 0.18946 * df["HALF_bad"] * df["SFTY"]
            + 0.01415 * df["HALF_bad"] * df["SACK"]
            - 0.09197 * df["HALF_bad"] * df["HALF_median"]
            - 1.19802 * df["FF"] * df["SFTY_mean"]
            - 0.01310 * df["SACK"] * df["HALF_std"]
            + 1.14308 * df["FF_mean"] * df["HALF_great"]
            - 0.65438 * df["FF"] * df["HALF_GSRat"]
            + 0.05296 * df["HALF_median"] * df["HALF_std"]
        )
        df["proj_HALF"] = (
            46.68152
            + 0.46919 * df["HALF"]
            + 3.12829 * df["ST_TD"] * df["HALF_okay"]
            - 0.40351 * df["HALF_mean"] * df["HALF_median"]
            + 1.67617 * df["HALF_good"] * df["HALF_great"]
            - 11.41801 * df["FF"] * df["SFTY_mean"]
            + 4.41147 * df["HALF_okay"] * df["SFTY"]
            + 0.07354 * df["HALF_bad"] * df["SACK"]
            - 5.81759 * df["HALF_bad"] * df["D_TD_mean"]
        )

    if pos != "k" and pos != "dst":
        df["proj_HALF_mean"] = np.where(
            (df["OPP"] > df["OPP"].median()), df["proj_HALF_mean"], 0
        )
        df["proj_HALF"] = np.where(
            (df["OPP"] > df["OPP"].median()), df["proj_HALF"], 0
        )
    # restore original YOE
    df["YOE"] = original_yoe
    # calculate mean and total points as equal to the averages of the projected mean and total points
    temp_proj_half_mean = df["proj_HALF_mean"]
    df["proj_HALF_mean"] = (df["proj_HALF_mean"] + (df["proj_HALF"] / 17)) / 2
    df["proj_HALF"] = (df["proj_HALF"] + (temp_proj_half_mean * 17)) / 2
    df = df.sort_values("proj_HALF", ascending=False)
    df["proj_RANK"] = df["proj_HALF"].rank(ascending=False)
    return df.round(2)


def add_rank_and_par_cols(df, pos):
    ascending_cols = {"pass_INT", "pass_INT_mean", "pass_SACKS", "pass_SACKS_mean", "FL", "FL_mean", "FL/T"}
    base_cols = [col for col in df.columns[4:-1] if not (col.endswith("_rank") or col.endswith("_par"))]

    # Define replacement index ranges by position
    replacement_ranges = {
        "qb":  (10, 15),   # 11th–15th best
        "rb":  (25, 35),   # 26th–35th best
        "wr":  (25, 35),   # 26th–35th best
        "te":  (10, 15),   # 11th–15th best
        "k":   (10, 15),   # 11th–15th best
        "dst": (10, 15),   # 11th–15th best
    }
    rep_start, rep_end = replacement_ranges[pos]

    new_cols = {}
    
    for col in base_cols:
        asc = col in ascending_cols

        # Rank
        rank_col = df[col].rank(ascending=asc, method="min")
        new_cols[f"{col}_rank"] = rank_col

        # PAR
        sorted_vals = df[col].dropna().sort_values(ascending=asc).reset_index(drop=True)
        rep_slice = sorted_vals[rep_start:rep_end]
        replacement = rep_slice.mean() if not rep_slice.empty else sorted_vals.median()
        par_col = ((df[col] - replacement) / replacement) * 100 if replacement != 0 else float("nan")
        new_cols[f"{col}_par"] = par_col
    
    df = pd.concat([df, pd.DataFrame(new_cols, index=df.index)], axis=1)

    return df.round(2)



def wrangle_all(all, pos, weights):
    grouped = all.groupby("Player", sort=False, as_index=False)

    # average every column over all years for each player using list of weights
    all = grouped.apply(
        lambda x, cols: pd.Series(
            np.average(x[cols], weights=x["Weight"], axis=0), cols
        ),
        list(all.columns.values)[2:-1],
        include_groups=False
    )

    # include sum of weights and YOE based min weight present
    year = grouped.agg(
        Weight_sum=("Weight", "sum"),
        YOE=("Weight", lambda x: weights.index(x.min()) + 1),
    )
    all = pd.merge(all, year, "left", "Player")
    all.insert(1, "POS", pos.upper())
    all.insert(1, "TEAM", "")
    all[["Player", "TEAM"]] = all.Player.str.split("(", expand=True)
    all["TEAM"] = all.TEAM.str.replace(")", "", regex=False)
    all["Player"] = all["Player"].str.strip()

    # must have played in the last 2 seasons
    all = all[all["Weight_sum"] >= weights[1]]
    all = all[np.logical_not((all["Weight_sum"] < weights[0]) & (all["TEAM"] == "FA"))]

    # add column for role on team (ranking on team for position)
    if pos != "dst":
        if pos == "qb":
            all["temp_sum"] = all["G"] + all["OPP_mean"] / 2
            all.insert(
                3,
                "DPCHT",
                all.groupby("TEAM")["temp_sum"].transform("rank", ascending=False),
            )
            all = all.drop(columns="temp_sum")
        else:
            all.insert(
                3,
                "DPCHT",
                all.groupby("TEAM")["OPP_mean"].transform("rank", ascending=False),
            )
        all["DPCHT"] = np.where(all["TEAM"] == "FA", 0, all["DPCHT"])
    all = all.drop("Weight_sum", axis=1)

    # add rank and par columns
    all = add_rank_and_par_cols(all, pos)

    # move YOE to the end
    yoe_col = all.pop("YOE")
    all["YOE"] = yoe_col

    # calculate projected half-ppr points
    all = calc_projected_points(all, pos)

    all = all.sort_values("HALF_Score", ascending=False).round(2)
    # save
    print("Saving file aggregated/{}/all.csv".format(pos))
    all.to_csv("aggregated/{}/all.csv".format(pos), index=False)


for pos in positions:
    data = []

    for yearsAgo in range(1, years + 1):
        year = currentYear - yearsAgo
        df = wrangle(pos["name"], year)
        df["Weight"] = pos["weights"][yearsAgo - 1]
        data.append(df)
        df = df.drop("Weight", axis=1)
        split_team(df)
        if pos["name"] != "dst":
            if pos["name"] == "qb":
                df["temp_sum"] = df["G"] + df["OPP_mean"] / 2
                df.insert(
                    3,
                    "DPCHT",
                    df.groupby("TEAM")["temp_sum"].transform(
                        "rank", ascending=False
                    ),
                )
                df = df.drop(columns="temp_sum")
            else:
                df.insert(
                    3,
                    "DPCHT",
                    df.groupby("TEAM")["OPP_mean"].transform(
                        "rank", ascending=False
                    ),
                )
            df["DPCHT"] = np.where(df["TEAM"] == "FA", 0, df["DPCHT"])
        # add rank and par columns
        df = add_rank_and_par_cols(df, pos["name"])
        print("Saving file aggregated/{}/{}.csv".format(pos["name"], year))
        df.to_csv("aggregated/{}/{}.csv".format(pos["name"], year), index=False)

    wrangle_all(
        pd.concat(data).sort_values(["Player", "Weight"]),
        pos["name"],
        pos["weights"],
    )
