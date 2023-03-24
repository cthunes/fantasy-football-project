import pandas as pd
import numpy as np

FPTS_tiers = [6, 9.5, 13.5, 18]
HALF_tiers = [7, 10.75, 15.085, 20]
PPR_tiers = [8, 12, 16.67, 22]
FPTS_adj_constant = 1.615  # average of the 1/4 roots of fpts std dev
HALF_adj_constant = 1.633
PPR_adj_constant = 1.653


def agg_RBs(grouped):
    df = grouped.agg(G=("Player", "size"),
                     rush_ATT=("ATT", "sum"),
                     rush_ATT_mean=("ATT", "mean"),
                     rush_YDS=("YDS", "sum"),
                     rush_YDS_mean=("YDS", "mean"),
                     rush_LG=("LG", "max"),
                     rush_LG_mean=("LG", "mean"),
                     rush_20=("20+", "sum"),
                     rush_20_mean=("20+", "mean"),
                     rush_TD=("TD", "sum"),
                     rush_TD_mean=("TD", "mean"),
                     rec_REC=("REC", "sum"),
                     rec_REC_mean=("REC", "mean"),
                     rec_TGT=("TGT", "sum"),
                     rec_TGT_mean=("TGT", "mean"),
                     rec_YDS=("YDS.1", "sum"),
                     rec_YDS_mean=("YDS.1", "mean"),
                     rec_TD=("TD.1", "sum"),
                     rec_TD_mean=("TD.1", "mean"),
                     FL=("FL", "sum"),
                     FL_mean=("FL", "mean"),
                     FPTS=("FPTS", "sum"),
                     FPTS_mean=("FPTS", "mean"),
                     FPTS_median=("FPTS", "median"),
                     FPTS_std=("FPTS", "std"),
                     FPTS_bad=("FPTS", lambda x: sum(
                         1 for y in x if y < FPTS_tiers[0])),
                     FPTS_poor=("FPTS", lambda x: sum(1 for y in x if (
                         y >= FPTS_tiers[0]) and (y < FPTS_tiers[1]))),
                     FPTS_okay=("FPTS", lambda x: sum(1 for y in x if (
                         y >= FPTS_tiers[1]) and (y < FPTS_tiers[2]))),
                     FPTS_good=("FPTS", lambda x: sum(1 for y in x if (
                         y >= FPTS_tiers[2]) and (y < FPTS_tiers[3]))),
                     FPTS_great=("FPTS", lambda x: sum(
                         1 for y in x if y >= FPTS_tiers[3])),
                     HALF=("HALF", "sum"),
                     HALF_mean=("HALF", "mean"),
                     HALF_median=("HALF", "median"),
                     HALF_std=("HALF", "std"),
                     HALF_bad=("HALF", lambda x: sum(
                         1 for y in x if y < HALF_tiers[0])),
                     HALF_poor=("HALF", lambda x: sum(1 for y in x if (
                         y >= HALF_tiers[0]) and (y < HALF_tiers[1]))),
                     HALF_okay=("HALF", lambda x: sum(1 for y in x if (
                         y >= HALF_tiers[1]) and (y < HALF_tiers[2]))),
                     HALF_good=("HALF", lambda x: sum(1 for y in x if (
                         y >= HALF_tiers[2]) and (y < HALF_tiers[3]))),
                     HALF_great=("HALF", lambda x: sum(
                         1 for y in x if y >= HALF_tiers[3])),
                     PPR=("PPR", "sum"),
                     PPR_mean=("PPR", "mean"),
                     PPR_median=("PPR", "median"),
                     PPR_std=("PPR", "std"),
                     PPR_bad=("PPR", lambda x: sum(
                         1 for y in x if y < PPR_tiers[0])),
                     PPR_poor=("PPR", lambda x: sum(1 for y in x if (
                         y >= PPR_tiers[0]) and (y < PPR_tiers[1]))),
                     PPR_okay=("PPR", lambda x: sum(1 for y in x if (
                         y >= PPR_tiers[1]) and (y < PPR_tiers[2]))),
                     PPR_good=("PPR", lambda x: sum(1 for y in x if (
                         y >= PPR_tiers[2]) and (y < PPR_tiers[3]))),
                     PPR_great=("PPR", lambda x: sum(1 for y in x if y >= PPR_tiers[3])))
    df.insert(1, "POS", "RB")
    df.insert(7, "rush_Y/A", df["rush_YDS"] / df["rush_ATT"])
    df.insert(20, "rec_Y/R", df["rec_YDS"] / df["rec_REC"])
    df.insert(23, "TOU", df["rush_ATT"] + df["rec_REC"])
    df.insert(24, "TOU_mean", df["TOU"] / df["G"])
    df.insert(25, "OPP", df["rush_ATT"] + df["rec_TGT"])
    df.insert(26, "OPP_mean", df["OPP"] / df["G"])
    df.insert(29, "FL/T", df["FL"] / df["TOU"])
    df.insert(30, "INJCOR", np.where(df["G"] < 10, 1 - (10 - df["G"])*.025, 1))
    df.insert(35, "FPTS_adj", np.where(df["FPTS_std"] != 0, df["FPTS_mean"] / pow(
        df["FPTS_std"], 1/4) * FPTS_adj_constant, df["FPTS_mean"]))
    df.replace(np.inf, 0)
    df.insert(41, "FPTS_QSRat", (df["FPTS_great"] + df["FPTS_good"] + df["FPTS_okay"]) / np.where(
        df["FPTS_poor"] + df["FPTS_bad"] != 0, df["FPTS_poor"] + df["FPTS_bad"], 1))
    df.insert(42, "FPTS_GSRat", (df["FPTS_great"] + df["FPTS_good"]
                                 ) / np.where(df["FPTS_bad"] != 0, df["FPTS_bad"], 1))
    df.replace(np.inf, 17, inplace=True)
    df.insert(43, "FPTS_Score", df["INJCOR"] * (df["FPTS_adj"] * .4 + df["FPTS_median"]
              * .4 + df["FPTS_QSRat"] * .5 + df["FPTS_GSRat"] * .25 + df["OPP_mean"] * .1))
    df.insert(48, "HALF_adj", np.where(df["HALF_std"] != 0, df["HALF_mean"] / pow(
        df["HALF_std"], 1/4) * HALF_adj_constant, df["HALF_mean"]))
    df.insert(54, "HALF_QSRat", (df["HALF_great"] + df["HALF_good"] + df["HALF_okay"]) / np.where(
        df["HALF_poor"] + df["HALF_bad"] != 0, df["HALF_poor"] + df["HALF_bad"], 1))
    df.insert(55, "HALF_GSRat", (df["HALF_great"] + df["HALF_good"]
                                 ) / np.where(df["HALF_bad"] != 0, df["HALF_bad"], 1))
    df.replace(np.inf, 17, inplace=True)
    df.insert(56, "HALF_Score", df["INJCOR"] * (df["HALF_adj"] * .4 + df["HALF_median"]
              * .4 + df["HALF_QSRat"] * .5 + df["HALF_GSRat"] * .25 + df["OPP_mean"] * .1))
    df.insert(61, "PPR_adj", np.where(df["PPR_std"] != 0, df["PPR_mean"] / pow(
        df["PPR_std"], 1/4) * PPR_adj_constant, df["PPR_mean"]))
    df.insert(67, "PPR_QSRat", (df["PPR_great"] + df["PPR_good"] + df["PPR_okay"]) / np.where(
        df["PPR_poor"] + df["PPR_bad"] != 0, df["PPR_poor"] + df["PPR_bad"], 1))
    df.insert(68, "PPR_GSRat", (df["PPR_great"] + df["PPR_good"]
                                ) / np.where(df["PPR_bad"] != 0, df["PPR_bad"], 1))
    df.replace(np.inf, 17, inplace=True)
    df.insert(69, "PPR_Score", df["INJCOR"] * (df["PPR_adj"] * .4 + df["PPR_median"]
              * .4 + df["PPR_QSRat"] * .5 + df["PPR_GSRat"] * .25 + df["OPP_mean"] * .1))

    df.fillna(0, inplace=True)
    df = df[(df["OPP_mean"] > 5) & (df["G"] > 2)]
    return df
