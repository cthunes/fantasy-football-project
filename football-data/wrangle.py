import pandas as pd
from aggregate import *

currentYear = 2024
# .00001 or the addition of .00001 all refers to 0; this prevents errors caused by it being exactly 0
positions = [
    {"name": "qb", "weights": [15.625, 6.25, 2.5, 1, 0.00001]},
    {"name": "rb", "weights": [8, 4, 2, 1, 0.00001]},
    {"name": "wr", "weights": [3.375, 2.25, 1.5, 1, 0.00001]},
    {"name": "te", "weights": [81, 27, 9, 3, 1]},
    {"name": "k", "weights": [3.375, 2.25, 1.5, 1, 0.00001]},
    {"name": "dst", "weights": [64, 16, 4, 1, 0.00001]},
]
scoring_types = ["FPTS", "HALF", "PPR"]
z_scores = [-0.84162, -0.25335, 0.25335, 0.84162]


def calc_tiers(df, pos, year):
    point_tiers = []
    p = 20
    if pos == "rb":
        p = 40
    if pos == "wr":
        p = 60
    g = 17 if year > 2020 else 16
    for type in scoring_types:
        top = df.sort_values(type, ascending=False).head(p * g)
        # use median instead of mean due to skew of selection of top p * g rows
        median = top[type].median()
        std = top[type].std()
        tiers = []
        for z in z_scores:
            tiers.append(median + z * std)
        point_tiers.append(tiers)
    return point_tiers


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

    point_tiers = calc_tiers(df, pos, year)

    df = df.sort_values(["Player", "Week"])
    grouped = df.groupby("Player", sort=False, as_index=False)

    if pos == "rb":
        df = agg_RBs(grouped, point_tiers)
    elif pos == "wr":
        df = agg_WRs(grouped, point_tiers)
    elif pos == "te":
        df = agg_TEs(grouped, point_tiers)
    elif pos == "qb":
        df = agg_QBs(grouped, point_tiers)
    elif pos == "k":
        df = agg_Ks(grouped, point_tiers)
    else:
        df = agg_DSTs(grouped, point_tiers)

    df = df.sort_values("HALF_Score", ascending=False)
    return df.round(2)


def calc_projected_points(df, pos):
    if pos == "rb":
        df["proj_HALF_mean"] = (
            -0.72692
            + -0.5197 * df["YOE"]
            + 0.59619 * df["HALF_great"]
            + -0.53782 * df["rec_REC"]
            + 0.08638 * df["rec_YDS"]
            + -3.49137 * df["rec_TGT_mean"]
            + -0.21826 * df["rush_ATT"]
            + 0.07864 * df["rush_YDS"]
            + 2.38092 * df["rush_TD"]
            + (
                -0.21372 * df["HALF"]
                + 10.58923 * df["rec_REC_mean"]
                + 2.43525 * df["rush_ATT_mean"]
                + -0.57592 * df["rush_YDS_mean"]
            )
            * df["INJCOR"]
            + (
                0.05181 * df["HALF_std"]
                + 0.01208 * df["rec_TGT"]
                + 0.06746 * df["rec_TD"]
                + -0.05515 * df["rec_YDS_mean"]
                + -0.01534 * df["rush_20"]
                + -1.18488 * df["rush_TD_mean"]
            )
            * df["G"]
        )
        df["proj_HALF"] = (
            -145.83082
            + 13.39285 * df["HALF_std"]
            + -8.43901 * df["YOE"]
            + 8.44755 * df["G"]
            + -11.09284 * df["rec_REC"]
            + 1.0966 * df["rec_YDS"]
            + -102.06287 * df["rec_TGT_mean"]
            + 205.50938 * df["rec_REC_mean"]
            + -3.83106 * df["rush_ATT"]
            + 1.19905 * df["rush_YDS"]
            + 37.67466 * df["rush_TD"]
            + -4.8592 * df["rush_20"]
            + -317.877 * df["rush_TD_mean"]
            + (
                44.61064 * df["rush_ATT_mean"]
                + -9.43676 * df["rush_YDS_mean"]
                + -5.22142 * df["HALF_poor"]
            )
            * df["INJCOR"]
            + (
                0.42673 * df["rec_TGT"]
                + 2.48498 * df["rec_TD"]
                + -0.76576 * df["rec_YDS_mean"]
                + -26.06521 * df["rec_TD_mean"]
                + -0.17564 * df["HALF"]
            )
            * df["G"]
        )
        df["proj_HALF_mean"] = np.where(
            (df["OPP"] > df["OPP"].median()), df["proj_HALF_mean"], 0
        )
        df["proj_HALF"] = np.where((df["OPP"] > df["OPP"].median()), df["proj_HALF"], 0)
    elif pos == "wr":
        df["proj_HALF_mean"] = (
            -0.49334
            + 0.80148 * df["HALF_median"]
            + 0.63537 * df["DPCHT"]
            + -0.5466 * df["YOE"]
            + 0.01449 * df["rec_YDS"]
            + (
                -0.08582 * df["HALF_median"]
                + 0.02653 * df["rec_TD"]
                + 0.10424 * df["rec_REC_mean"]
                + -0.01624 * df["rush_ATT"]
            )
            * df["G"]
            + (-0.05926 * df["rec_TGT"] + 0.04487 * df["rush_YDS"]) * df["INJCOR"]
        )
        df["proj_HALF"] = (
            -15.22122
            + 18.83461 * df["HALF_median"]
            + -868.62309 * df["G"]
            + 878.82462 * df["HALF_great"]
            + 879.14022 * df["HALF_good"]
            + 876.92071 * df["HALF_okay"]
            + 877.62237 * df["HALF_poor"]
            + 870.30401 * df["HALF_bad"]
            + 11.4517 * df["DPCHT"]
            + -17.30612 * df["YOE"]
            + 0.51368 * df["rec_YDS"]
            + 17.15681 * df["rec_TD"]
            + -6.83746 * df["rec_20"]
            + -4.21227 * df["rec_YDS_mean"]
            + (
                -0.07018 * df["HALF"]
                + -1.74102 * df["HALF_median"]
                + 2.33678 * df["rec_REC_mean"]
                + 6.98584 * df["rec_20_mean"]
                + -0.30867 * df["rush_ATT"]
            )
            * df["G"]
            + 1.29758 * df["HALF_std"] * df["YOE"]
            + (
                -1.23481 * df["rec_TGT"]
                + -103.60143 * df["rec_TD_mean"]
                + 0.91627 * df["rush_YDS"]
            )
            * df["INJCOR"]
        )
        df["proj_HALF_mean"] = np.where(
            (df["OPP"] > df["OPP"].median()), df["proj_HALF_mean"], 0
        )
        df["proj_HALF"] = np.where((df["OPP"] > df["OPP"].median()), df["proj_HALF"], 0)
    elif pos == "te":
        df["proj_HALF_mean"] = (
            -6.14673
            + 0.11 * df["HALF"]
            + 0.53357 * df["G"]
            + 3.42599 * df["YOE"]
            + 0.43051 * df["DPCHT"]
            + -0.13485 * df["rush_YDS"]
            + (
                0.03901 * df["HALF_Score"]
                + -0.00744 * df["HALF"]
                + -0.01736 * df["rec_YDS_mean"]
            )
            * df["G"]
            + (
                -3.78614 * df["YOE"]
                + 2.07639 * df["rush_YDS_mean"]
                + 0.02035 * df["rec_YDS"]
            )
            * df["INJCOR"]
        )
        df["proj_HALF"] = (
            -83.30983
            + 1.40787 * df["HALF"]
            + 6.92537 * df["G"]
            + 38.65142 * df["YOE"]
            + 6.78682 * df["DPCHT"]
            + -1.8982 * df["rush_YDS"]
            + 1.31858 * df["rec_YDS"]
            + -14.23762 * df["rec_REC"]
            + (
                0.783 * df["HALF_Score"]
                + -0.08364 * df["HALF"]
                + -0.63754 * df["HALF_good"]
                + -1.31185 * df["rec_YDS_mean"]
                + 14.09444 * df["rec_REC_mean"]
            )
            * df["G"]
            + (-44.07351 * df["YOE"] + 29.80983 * df["rush_YDS_mean"]) * df["INJCOR"]
        )
        df["proj_HALF_mean"] = np.where(
            (df["OPP"] > df["OPP"].median()), df["proj_HALF_mean"], 0
        )
        df["proj_HALF"] = np.where((df["OPP"] > df["OPP"].median()), df["proj_HALF"], 0)
    elif pos == "qb":
        df["proj_HALF_mean"] = (
            -5.96351
            + 141.54001 * df["HALF_great"]
            + 140.18691 * df["HALF_good"]
            + 141.47472 * df["HALF_okay"]
            + 141.71899 * df["HALF_poor"]
            + 140.91067 * df["HALF_bad"]
            + -139.31597 * df["G"]
            + 3.10034 * df["YOE"]
            + 0.00378 * df["pass_YDS"]
            + -0.30174 * df["YOE"] * df["G"]
            + (
                0.69141 * df["rush_TD"]
                + -0.01737 * df["pass_ATT"]
                + -0.5941 * df["pass_INT"]
            )
            * df["INJCOR"]
        )
        df["proj_HALF"] = (
            -178.29572
            + 29.41097 * df["G"]
            + 48.13456 * df["YOE"]
            + -1.06412 * df["pass_CMP"]
            + 0.15388 * df["pass_YDS"]
            + -14.97579 * df["pass_INT"]
            + -5.24495 * df["YOE"] * df["G"]
            + 11.55614 * df["rush_TD"] * df["INJCOR"]
        )
        df["proj_HALF_mean"] = np.where(
            (df["OPP"] > df["OPP"].median()), df["proj_HALF_mean"], 0
        )
        df["proj_HALF"] = np.where((df["OPP"] > df["OPP"].median()), df["proj_HALF"], 0)
    elif pos == "k":
        df["proj_HALF_mean"] = (
            2.84778
            + 0.86635 * df["HALF_adj"]
            + -0.68583 * df["HALF_median"]
            + 1.58983 * df["DPCHT"]
            + 0.37982 * df["FG"]
            + -8.74909 * df["FG_PCT"]
            + 8.07964 * df["XP_PCT"]
            + (-0.50979 * df["HALF_okay"] + -0.21728 * df["FGA"]) * df["INJCOR"]
        )
        df["proj_HALF"] = (
            -124.1586
            + 3.23275 * df["HALF"]
            + 31.07504 * df["DPCHT"]
            + 6.07283 * df["YOE"]
            + 327.45736 * df["INJCOR"]
            + -227.92201 * df["FG_PCT"]
            + -0.18751 * df["FG"] * df["G"]
            + -2.19888 * df["OPP"] * df["INJCOR"]
        )
        df["proj_HALF_mean"] = np.where(
            (df["OPP"] > df["OPP"].median() / 2), df["proj_HALF_mean"], 0
        )
        df["proj_HALF"] = np.where(
            (df["OPP"] > df["OPP"].median() / 2), df["proj_HALF"], 0
        )
    else:
        df["proj_HALF_mean"] = (
            1.0938
            + 0.42001 * df["ST_TD"]
            + 0.70824 * df["HALF_great"]
            + 0.6305 * df["HALF_good"]
            + 0.5661 * df["HALF_okay"]
            + 0.20192 * df["HALF_bad"]
            + -0.15781 * df["HALF_GSRat"] * df["HALF_QSRat"]
        )
        df["proj_HALF"] = (
            67.78177
            + -7.37916 * df["HALF_mean"]
            + -6.92168 * df["HALF_GSRat"]
            + 8.19648 * df["ST_TD"]
            + 14.04685 * df["HALF_good"]
            + 17.42961 * df["HALF_great"]
            + 9.4686 * df["HALF_okay"]
        )

    temp_proj_half_mean = df["proj_HALF_mean"]
    df["proj_HALF_mean"] = (df["proj_HALF_mean"] + (df["proj_HALF"] / 17)) / 2
    df["proj_HALF"] = (df["proj_HALF"] + (temp_proj_half_mean * 17)) / 2
    df = df.sort_values("proj_HALF", ascending=False)
    df["proj_RANK"] = df["proj_HALF"].rank(ascending=False)
    return df.round(2)


def wrangle_all(all, pos, weights):
    grouped = all.groupby("Player", sort=False, as_index=False)

    # average every column over all years for each player using list of weights
    all = grouped.apply(
        lambda x, cols: pd.Series(
            np.average(x[cols], weights=x["Weight"], axis=0), cols
        ),
        list(all.columns.values)[2:-1],
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
        all.insert(
            3,
            "DPCHT",
            all.groupby("TEAM")["OPP_mean"].transform("rank", ascending=False),
        )
        all["DPCHT"] = np.where(all["TEAM"] == "FA", 0, all["DPCHT"])
    all = all.sort_values("HALF_Score", ascending=False).round(2)
    all = all.drop("Weight_sum", axis=1)

    # calculate projected half-ppr points
    all = calc_projected_points(all, pos)

    # save
    print("Saving file aggregated/{}/all.csv".format(pos))
    all.to_csv("aggregated/{}/all.csv".format(pos), index=False)


for pos in positions:
    data = []

    for yearsAgo in range(1, 6):
        year = currentYear - yearsAgo
        df = wrangle(pos["name"], year)
        df["Weight"] = pos["weights"][yearsAgo - 1]
        data.append(df)
        df = df.drop("Weight", axis=1)
        df.insert(1, "TEAM", "")
        df[["Player", "TEAM"]] = df.Player.str.split("(", expand=True)
        df["TEAM"] = df.TEAM.str.replace(")", "", regex=False)
        df["Player"] = df["Player"].str.strip()
        if pos["name"] != "dst":
            df.insert(
                3,
                "DPCHT",
                df.groupby("TEAM")["OPP_mean"].transform("rank", ascending=False),
            )
        print("Saving file aggregated/{}/{}.csv".format(pos["name"], year))
        df.to_csv("aggregated/{}/{}.csv".format(pos["name"], year), index=False)

    wrangle_all(
        pd.concat(data).sort_values(["Player", "Weight"]), pos["name"], pos["weights"]
    )
