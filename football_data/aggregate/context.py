import numpy as np
import pandas as pd

IDENTITY_COLUMNS = {"playerId", "position"}

LOWER_IS_BETTER = {
    "passingInterceptions",
    "passingInterceptionsMean",
    "sackFumblesLost",
    "sackFumblesLostMean",
    "rushingFumbles",
    "rushingFumblesMean",
    "rushingFumblesLost",
    "rushingFumblesLostMean",
    "receivingFumbles",
    "receivingFumblesMean",
    "receivingFumblesLost",
    "receivingFumblesLostMean",
    "fumblesLost",
    "fumblesLostMean",
    "defYardsAllowed",
    "defYardsAllowedMean",
    "defPointsAllowed",
    "defPointsAllowedMean",
    "fantasyPointsStd",
}

REPLACEMENT_RANGES = {
    "QB": (12, 18),
    "RB": (30, 42),
    "WR": (30, 42),
    "TE": (12, 18),
    "K": (12, 18),
    "DST": (12, 18),
}

OPPORTUNITY_THRESHOLDS = {
    "QB": 10,
    "RB": 6,
    "WR": 4,
    "TE": 2,
    "K": 6,
}


def calculate_context(aggregated):
    """
    Add positional rank, percentile, and PAR for each numeric stat.

    Comparison population is the aggregated table itself, grouped by
    position (same_selection). Eligibility filters only apply when the
    position has a typical season-length sample; short custom windows
    rank every player who appeared.

    PAR is percent above replacement, not a raw point differential:
        ((value - replacement) / replacement) * 100
    Replacement is the mean of a positional slice of eligible players
    (e.g. WR ranks 31-42). A WR with 10 targets vs a 8-target replacement
    level has PAR 25.0, meaning 25% above replacement.
    """
    if aggregated is None or aggregated.empty:
        return aggregated

    result = aggregated.copy()
    numeric_columns = [
        column
        for column, dtype in result.dtypes.items()
        if column not in IDENTITY_COLUMNS and pd.api.types.is_numeric_dtype(dtype)
    ]

    context_frames = [
        _position_context(group, numeric_columns, position)
        for position, group in result.groupby("position", dropna=False)
    ]
    return pd.concat(context_frames).sort_index()


def _position_context(group, numeric_columns, position):
    group = group.copy()
    eligible = _eligible_mask(group, position)
    eligible_values = group[numeric_columns].where(eligible)

    higher = [column for column in numeric_columns if column not in LOWER_IS_BETTER]
    lower = [column for column in numeric_columns if column in LOWER_IS_BETTER]

    parts = [group]
    if higher:
        parts.append(_rank_block(eligible_values[higher], ascending=False, suffix="__rank"))
        parts.append(_rank_block(eligible_values[higher], ascending=True, suffix="__percentile", pct=True))
    if lower:
        parts.append(_rank_block(eligible_values[lower], ascending=True, suffix="__rank"))
        parts.append(_rank_block(eligible_values[lower], ascending=False, suffix="__percentile", pct=True))

    par_columns = {
        f"{column}__par": _percent_above_replacement(
            group[column],
            eligible_values[column],
            position,
            column in LOWER_IS_BETTER,
        )
        for column in numeric_columns
    }
    parts.append(pd.DataFrame(par_columns, index=group.index))

    return pd.concat(parts, axis=1)


def _rank_block(values, *, ascending, suffix, pct=False):
    ranked = values.rank(axis=0, ascending=ascending, method="min", pct=pct)
    ranked.columns = [f"{column}{suffix}" for column in ranked.columns]
    return ranked


def _eligible_mask(group, position):
    if "games" not in group.columns:
        return pd.Series(True, index=group.index)

    typical_season = group["games"].median() >= 6
    if not typical_season:
        return group["games"].fillna(0) > 0

    eligible = group["games"] >= 6
    threshold = OPPORTUNITY_THRESHOLDS.get(position)
    if threshold is not None and "opportunitiesMean" in group.columns:
        eligible &= group["opportunitiesMean"].fillna(0) >= threshold
    return eligible


def _percent_above_replacement(values, ranked, position, lower_is_better):
    sorted_vals = ranked.dropna().sort_values(ascending=lower_is_better).reset_index(drop=True)
    if sorted_vals.empty:
        return pd.Series(np.nan, index=values.index)

    start, end = REPLACEMENT_RANGES.get(position, (12, 18))
    replacement_slice = sorted_vals.iloc[start:end]
    replacement = replacement_slice.mean() if not replacement_slice.empty else sorted_vals.median()

    if replacement == 0 or pd.isna(replacement):
        return pd.Series(np.nan, index=values.index)

    return ((values - replacement) / replacement) * 100
