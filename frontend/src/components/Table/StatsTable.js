import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { MaterialReactTable } from "material-react-table";
import {
    Box,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Stack,
} from "@mui/material";

import { playerFetchAll } from "../../redux/player";
import { setYear } from "../../redux/year";
import { setPointsType } from "../../redux/pointsType";

const StatsTable = () => {
    const players = useSelector((state) => state.player.players);
    const year = useSelector((state) => state.year.year);
    const pointsType = useSelector((state) => state.pointsType.pointsType);
    const [tableData, setTableData] = useState(() => []);
    const [position, setPosition] = useState("ALL");
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(playerFetchAll());
    }, [dispatch]);

    //update table
    useEffect(() => {
        setTableData(
            players.filter((player) => {
                if (position === "ALL") {
                    return player.stats.some((item) => item.season === year);
                } else if (position === "FLX") {
                    return (
                        player.stats.some((item) => item.season === year) &&
                        (player.position === "RB" ||
                            player.position === "WR" ||
                            player.position === "TE")
                    );
                } else {
                    return (
                        player.stats.some((item) => item.season === year) &&
                        player.position === position
                    );
                }
            })
        );
    }, [players, year, position, pointsType]);

    const columns = useMemo(
        () => [
            {
                id: "player",
                header: "PLAYER",
                columns: [
                    {
                        accessorKey: "name",
                        header: "NAME",
                        size: 200,
                    },
                ],
            },
            {
                id: "overview",
                header: "OVERVIEW",
                columns: [
                    {
                        accessorKey: "position",
                        header: "POS",
                        size: 30,
                    },
                    {
                        accessorKey: "team",
                        header: "TEAM",
                        size: 50,
                    },
                    {
                        accessorKey: "yearsOfExperience",
                        header: "YOE",
                        size: 30,
                    },
                    {
                        accessorFn: (player) =>
                            player.stats[
                                player.stats.findIndex(
                                    (item) => item.season === year
                                )
                            ].season,
                        id: "season",
                        header: "YEAR",
                        size: 50,
                    },
                    {
                        accessorFn: (player) =>
                            player.stats[
                                player.stats.findIndex(
                                    (item) => item.season === year
                                )
                            ].depthChart,
                        id: "depthChart",
                        header: "DC",
                        size: 20,
                    },
                    {
                        accessorFn: (player) =>
                            player.stats[
                                player.stats.findIndex(
                                    (item) => item.season === year
                                )
                            ].games,
                        id: "games",
                        header: "G",
                        size: 30,
                    },
                ],
            },
            {
                accessorKey: "rushing totals",
                header: "RUSHING TOTALS",
                columns: [
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].rushing.attempts;
                            } catch {
                                return null;
                            }
                        },
                        id: "rushing.attempts",
                        header: "ATT",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].rushing.yards;
                            } catch {
                                return null;
                            }
                        },
                        id: "rushing.yards",
                        header: "YDS",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].rushing.long;
                            } catch {
                                return null;
                            }
                        },
                        id: "rushing.long",
                        header: "LONG",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].rushing.twentyPlus;
                            } catch {
                                return null;
                            }
                        },
                        id: "rushing.twentyPlus",
                        header: "20+",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].rushing.td;
                            } catch {
                                return null;
                            }
                        },
                        id: "rushing.td",
                        header: "TD",
                        size: 30,
                    },
                ],
            },
            {
                accessorKey: "rushing averages",
                header: "RUSHING AVERAGES",
                columns: [
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].rushing.attemptsMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "rushing.attemptsMean",
                        header: "ATT",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].rushing.yardsMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "rushing.yardsMean",
                        header: "YDS",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].rushing.yardsPerAttempt;
                            } catch {
                                return null;
                            }
                        },
                        id: "rushing.yardsPerAttempt",
                        header: "Y/A",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].rushing.longMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "rushing.longMean",
                        header: "LONG",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].rushing.twentyPlusMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "rushing.twentyPlusMean",
                        header: "20+",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].rushing.tdMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "rushing.tdMean",
                        header: "TD",
                        size: 30,
                    },
                ],
            },
            {
                accessorKey: "receiving totals",
                header: "RECEIVING TOTALS",
                columns: [
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].receiving.receptions;
                            } catch {
                                return null;
                            }
                        },
                        id: "receiving.receptions",
                        header: "REC",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].receiving.targets;
                            } catch {
                                return null;
                            }
                        },
                        id: "receiving.targets",
                        header: "TGT",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].receiving.yards;
                            } catch {
                                return null;
                            }
                        },
                        id: "receiving.yards",
                        header: "YDS",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].receiving.long;
                            } catch {
                                return null;
                            }
                        },
                        id: "receiving.long",
                        header: "LONG",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].receiving.twentyPlus;
                            } catch {
                                return null;
                            }
                        },
                        id: "receiving.twentyPlus",
                        header: "20+",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].receiving.td;
                            } catch {
                                return null;
                            }
                        },
                        id: "receiving.td",
                        header: "TD",
                        size: 30,
                    },
                ],
            },
            {
                accessorKey: "receiving averages",
                header: "RECEIVING AVERAGES",
                columns: [
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].receiving.receptionsMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "receiving.receptionsMean",
                        header: "REC",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].receiving.targetsMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "receiving.targetsMean",
                        header: "TGT",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].receiving.yardsMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "receiving.yardsMean",
                        header: "YDS",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].receiving.yardsPerReception;
                            } catch {
                                return null;
                            }
                        },
                        id: "receiving.yardsPerReception",
                        header: "Y/C",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].receiving.longMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "receiving.longMean",
                        header: "LONG",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].receiving.twentyPlusMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "receiving.twentyPlusMean",
                        header: "20+",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].receiving.tdMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "receiving.tdMean",
                        header: "TD",
                        size: 30,
                    },
                ],
            },
            {
                accessorKey: "passing totals",
                header: "PASSING TOTALS",
                columns: [
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].passing.completions;
                            } catch {
                                return null;
                            }
                        },
                        id: "passing.completions",
                        header: "CMP",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].passing.attempts;
                            } catch {
                                return null;
                            }
                        },
                        id: "passing.attempts",
                        header: "ATT",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].passing.yards;
                            } catch {
                                return null;
                            }
                        },
                        id: "passing.yards",
                        header: "YDS",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].passing.td;
                            } catch {
                                return null;
                            }
                        },
                        id: "passing.td",
                        header: "TD",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].passing.interceptions;
                            } catch {
                                return null;
                            }
                        },
                        id: "passing.interceptions",
                        header: "INT",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].passing.sacks;
                            } catch {
                                return null;
                            }
                        },
                        id: "passing.sacks",
                        header: "SACK",
                        size: 30,
                    },
                ],
            },
            {
                accessorKey: "passing averages",
                header: "PASSING AVERAGES",
                columns: [
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].passing.completionsMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "passing.completionsMean",
                        header: "CMP",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].passing.attemptsMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "passing.attemptsMean",
                        header: "ATT",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].passing.percentage;
                            } catch {
                                return null;
                            }
                        },
                        id: "passing.percentage",
                        header: "PCT",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].passing.yardsMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "passing.yardsMean",
                        header: "YDS",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].passing.yardsPerAttempt;
                            } catch {
                                return null;
                            }
                        },
                        id: "passing.yardsPerAttempt",
                        header: "Y/A",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].passing.tdMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "passing.tdMean",
                        header: "TD",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].passing.interceptionsMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "passing.interceptionsMean",
                        header: "INT",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].passing.sacksMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "passing.sacksMean",
                        header: "SACK",
                        size: 30,
                    },
                ],
            },
            {
                accessorKey: "kicking totals",
                header: "KICKING TOTALS",
                columns: [
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.fieldGoals.sum;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.fieldGoals.sum",
                        header: "MADE",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.fieldGoals.attempts;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.fieldGoals.attempts",
                        header: "ATT",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.fieldGoals.long;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.fieldGoals.long",
                        header: "LONG",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.fieldGoals.sum10_19;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.fieldGoals.sum10_19",
                        header: "10-19",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.fieldGoals.sum20_29;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.fieldGoals.sum20_29",
                        header: "20-29",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.fieldGoals.sum30_39;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.fieldGoals.sum30_39",
                        header: "30-39",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.fieldGoals.sum40_49;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.fieldGoals.sum40_49",
                        header: "40-49",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.fieldGoals.sum50Plus;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.fieldGoals.sum50Plus",
                        header: "50+",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.extraPoints.sum;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.extraPoints.sum",
                        header: "EP",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.extraPoints.attempts;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.extraPoints.attempts",
                        header: "EPA",
                        size: 30,
                    },
                ],
            },
            {
                accessorKey: "kicking averages",
                header: "KICKING AVERAGES",
                columns: [
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.fieldGoals.mean;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.fieldGoals.mean",
                        header: "MADE",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.fieldGoals.attemptsMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.fieldGoals.attemptsMean",
                        header: "ATT",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.fieldGoals.percentage;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.fieldGoals.percentage",
                        header: "PCT",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.fieldGoals.longMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.fieldGoals.longMean",
                        header: "LONG",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.fieldGoals.mean10_19;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.fieldGoals.mean10_19",
                        header: "10-19",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.fieldGoals.mean20_29;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.fieldGoals.mean20_29",
                        header: "20-29",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.fieldGoals.mean30_39;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.fieldGoals.mean30_39",
                        header: "30-39",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.fieldGoals.mean40_49;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.fieldGoals.mean40_49",
                        header: "40-49",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.fieldGoals.mean50Plus;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.fieldGoals.mean50Plus",
                        header: "50+",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.extraPoints.mean;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.extraPoints.mean",
                        header: "EP",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.extraPoints.attemptsMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.extraPoints.attemptsMean",
                        header: "EPA",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].kicking.extraPoints.percentage;
                            } catch {
                                return null;
                            }
                        },
                        id: "kicking.extraPoints.percentage",
                        header: "EPCT",
                        size: 30,
                    },
                ],
            },
        ],
        [year]
    );

    return (
        <Box
            sx={{
                mt: 2,
                backgroundColor: "primary",
            }}
        >
            <MaterialReactTable
                columns={columns}
                data={tableData}
                enableRowNumbers
                rowNumberMode="static"
                enableStickyHeader
                enableColumnActions={false}
                enablePinning
                enableDensityToggle={false}
                initialState={{
                    columnPinning: { left: ["name"] },
                    density: "compact",
                    pagination: { pageSize: 25 },
                }}
                muiTableProps={{
                    sx: {
                        border: "1px solid rgba(20, 20, 20, .3)",
                    },
                }}
                muiTableHeadCellProps={{
                    sx: {
                        border: "1px solid rgba(20, 20, 20, .3)",
                    },
                }}
                muiTableBodyCellProps={{
                    sx: {
                        border: "1px solid rgba(20, 20, 20, .1)",
                    },
                }}
                muiTablePaginationProps={{
                    rowsPerPageOptions: [25, 50, 100],
                }}
                renderTopToolbarCustomActions={({ table }) => {
                    return (
                        <Stack direction="row" justifyContent="space-between">
                            <FormControl sx={{ my: 1, mr: 1, minWidth: 80 }}>
                                <InputLabel id="pos-label">Position</InputLabel>
                                <Select
                                    labelId="pos-label"
                                    id="pos-select"
                                    value={position}
                                    label="Position"
                                    onChange={(event) =>
                                        setPosition(event.target.value)
                                    }
                                >
                                    <MenuItem value={"ALL"}>ALL</MenuItem>
                                    <MenuItem value={"QB"}>QB</MenuItem>
                                    <MenuItem value={"RB"}>RB</MenuItem>
                                    <MenuItem value={"WR"}>WR</MenuItem>
                                    <MenuItem value={"TE"}>TE</MenuItem>
                                    <MenuItem value={"FLX"}>FLX</MenuItem>
                                    <MenuItem value={"K"}>K</MenuItem>
                                    <MenuItem value={"DST"}>DST</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ my: 1, mr: 1, minWidth: 80 }}>
                                <InputLabel id="type-label">Type</InputLabel>
                                <Select
                                    labelId="type-label"
                                    id="type-select"
                                    value={pointsType}
                                    label="Type"
                                    onChange={(event) =>
                                        dispatch(
                                            setPointsType(event.target.value)
                                        )
                                    }
                                >
                                    <MenuItem value={"standard"}>
                                        Standard
                                    </MenuItem>
                                    <MenuItem value={"half"}>Half-PPR</MenuItem>
                                    <MenuItem value={"ppr"}>PPR</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ my: 1, minWidth: 120 }}>
                                <InputLabel id="year-label">Year</InputLabel>
                                <Select
                                    labelId="year-label"
                                    id="year-select"
                                    value={year}
                                    label="Year"
                                    onChange={(event) =>
                                        dispatch(setYear(event.target.value))
                                    }
                                >
                                    <MenuItem value={"4 year weighted average"}>
                                        4 year weighted average
                                    </MenuItem>
                                    <MenuItem value={"2022"}>2022</MenuItem>
                                    <MenuItem value={"2021"}>2021</MenuItem>
                                    <MenuItem value={"2020"}>2020</MenuItem>
                                    <MenuItem value={"2019"}>2019</MenuItem>
                                    <MenuItem value={"2018"}>2018</MenuItem>
                                    <MenuItem value={"2017"}>2017</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    );
                }}
            />
        </Box>
    );
};

export default StatsTable;
