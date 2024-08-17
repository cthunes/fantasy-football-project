import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { MaterialReactTable } from "material-react-table";
import {
    Box,
    InputLabel,
    MenuItem,
    FormControl,
    FormControlLabel,
    Select,
    Stack,
    Switch,
} from "@mui/material";

import { playerFetchAll } from "../../redux/player";
import { setYear } from "../../redux/year";
import { setPointsType } from "../../redux/pointsType";

const StatsTable = () => {
    const players = useSelector((state) => state.player.players);
    const year = useSelector((state) => state.year.year);
    const pointsType = useSelector((state) => state.pointsType.pointsType);
    const [position, setPosition] = useState("ALL");
    const [team, setTeam] = useState("ALL");
    const [showFAs, setShowFAs] = useState(true);
    const [tableData, setTableData] = useState(() => []);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(playerFetchAll());
    }, [dispatch]);

    //update table
    useEffect(() => {
        setTableData(
            players.filter((player) => {
                let ret;
                if (position === "ALL") {
                    ret = player.stats.some((item) => item.season === year);
                } else if (position === "FLX") {
                    ret =
                        player.stats.some((item) => item.season === year) &&
                        (player.position === "RB" ||
                            player.position === "WR" ||
                            player.position === "TE");
                } else {
                    ret =
                        player.stats.some((item) => item.season === year) &&
                        player.position === position;
                }
                if (team !== "ALL") {
                    ret = ret && player.team === team;
                }
                if (!showFAs) {
                    ret = ret && player.team !== "FA";
                }
                return ret;
            })
        );
    }, [players, year, position, team, showFAs, pointsType]);

    const columns = useMemo(() => {
        let cols = [
            {
                id: "overview",
                header: "OVERVIEW",
                columns: [
                    {
                        accessorKey: "name",
                        id: "name",
                        header: "NAME",
                        size: 200,
                    },
                    {
                        accessorKey: "position",
                        id: "position",
                        header: "POS",
                        size: 30,
                    },
                    {
                        accessorKey: "team",
                        id: "team",
                        header: "TEAM",
                        size: 50,
                    },
                    {
                        accessorKey: "yearsOfExperience",
                        id: "yoe",
                        header: "YOE",
                        size: 30,
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
                                ].rushing.firstDowns;
                            } catch {
                                return null;
                            }
                        },
                        id: "rushing.firstDowns",
                        header: "FD",
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
                                ].rushing.firstDownsMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "rushing.firstDownsMean",
                        header: "FD",
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
                                ].receiving.firstDowns;
                            } catch {
                                return null;
                            }
                        },
                        id: "receiving.firstDowns",
                        header: "FD",
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
                                ].receiving.firstDownsMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "receiving.firstDownsMean",
                        header: "FD",
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
            {
                accessorKey: "defense/st totals",
                header: "DEFENSE/ST TOTALS",
                columns: [
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].dst.defense.sacks;
                            } catch {
                                return null;
                            }
                        },
                        id: "dst.defense.sacks",
                        header: "SACK",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].dst.defense.interceptions;
                            } catch {
                                return null;
                            }
                        },
                        id: "dst.defense.interceptions",
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
                                ].dst.defense.fumblesRecovered;
                            } catch {
                                return null;
                            }
                        },
                        id: "dst.defense.fumblesRecovered",
                        header: "FR",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].dst.defense.forcedFumbles;
                            } catch {
                                return null;
                            }
                        },
                        id: "dst.defense.forcedFumbles",
                        header: "FF",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].dst.defense.safeties;
                            } catch {
                                return null;
                            }
                        },
                        id: "dst.defense.safeties",
                        header: "SAF",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].dst.defense.td;
                            } catch {
                                return null;
                            }
                        },
                        id: "dst.defense.td",
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
                                ].dst.specialTeams.td;
                            } catch {
                                return null;
                            }
                        },
                        id: "dst.specialTeams.td",
                        header: "STTD",
                        size: 30,
                    },
                ],
            },
            {
                accessorKey: "defense/st averages",
                header: "DEFENSE/ST AVERAGES",
                columns: [
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].dst.defense.sacksMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "dst.defense.sacksMean",
                        header: "SACK",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].dst.defense.interceptionsMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "dst.defense.interceptionsMean",
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
                                ].dst.defense.fumblesRecoveredMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "dst.defense.fumblesRecoveredMean",
                        header: "FR",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].dst.defense.forcedFumblesMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "dst.defense.forcedFumblesMean",
                        header: "FF",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].dst.defense.safetiesMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "dst.defense.safetiesMean",
                        header: "SAF",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].dst.defense.tdMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "dst.defense.tdMean",
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
                                ].dst.specialTeams.tdMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "dst.specialTeams.tdMean",
                        header: "STTD",
                        size: 30,
                    },
                ],
            },
            {
                accessorKey: "misc totals",
                header: "MISC TOTALS",
                columns: [
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].misc.touches;
                            } catch {
                                return null;
                            }
                        },
                        id: "misc.touches",
                        header: "TCH",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].misc.opportunities;
                            } catch {
                                return null;
                            }
                        },
                        id: "misc.opportunities",
                        header: "OPP",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].misc.firstDowns;
                            } catch {
                                return null;
                            }
                        },
                        id: "misc.firstDowns",
                        header: "FD",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].misc.fumblesLost;
                            } catch {
                                return null;
                            }
                        },
                        id: "misc.fumblesLost",
                        header: "FL",
                        size: 30,
                    },
                ],
            },
            {
                accessorKey: "misc averages",
                header: "MISC AVERAGES",
                columns: [
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].misc.touchesMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "misc.touchesMean",
                        header: "TCH",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].misc.opportunitiesMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "misc.opportunitiesMean",
                        header: "OPP",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].misc.firstDownsMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "misc.firstDownsMean",
                        header: "FD",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].misc.fumblesLostMean;
                            } catch {
                                return null;
                            }
                        },
                        id: "misc.fumblesLostMean",
                        header: "FL",
                        size: 30,
                    },
                    {
                        accessorFn: (player) => {
                            try {
                                return player.stats[
                                    player.stats.findIndex(
                                        (item) => item.season === year
                                    )
                                ].misc.fumblesLostPerTouch;
                            } catch {
                                return null;
                            }
                        },
                        id: "misc.fumblesLostPerTouch",
                        header: "FL/T",
                        size: 30,
                    },
                ],
            },
        ];
        if (pointsType === "ppr") {
            cols = cols.concat([
                {
                    accessorKey: "ppr points",
                    header: "PPR POINTS",
                    columns: [
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].ppr.points.sum;
                                } catch {
                                    return null;
                                }
                            },
                            id: "ppr.points.sum",
                            header: "SUM",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].ppr.points.mean;
                                } catch {
                                    return null;
                                }
                            },
                            id: "ppr.points.mean",
                            header: "MEAN",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].ppr.points.median;
                                } catch {
                                    return null;
                                }
                            },
                            id: "ppr.points.median",
                            header: "MDN",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].ppr.points.standardDeviation;
                                } catch {
                                    return null;
                                }
                            },
                            id: "ppr.points.standardDeviation",
                            header: "STD",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].ppr.points.adjustedMean;
                                } catch {
                                    return null;
                                }
                            },
                            id: "ppr.points.adjustedMean",
                            header: "ADJM",
                            size: 30,
                        },
                    ],
                },
                {
                    accessorKey: "ppr misc",
                    header: "PPR MISC",
                    columns: [
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].ppr.games.bad;
                                } catch {
                                    return null;
                                }
                            },
                            id: "ppr.games.bad",
                            header: "BAD",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].ppr.games.poor;
                                } catch {
                                    return null;
                                }
                            },
                            id: "ppr.games.poor",
                            header: "POOR",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].ppr.games.okay;
                                } catch {
                                    return null;
                                }
                            },
                            id: "ppr.games.okay",
                            header: "FINE",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].ppr.games.good;
                                } catch {
                                    return null;
                                }
                            },
                            id: "ppr.games.good",
                            header: "GOOD",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].ppr.games.great;
                                } catch {
                                    return null;
                                }
                            },
                            id: "ppr.games.great",
                            header: "GRT",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].ppr.qualityStartRatio;
                                } catch {
                                    return null;
                                }
                            },
                            id: "ppr.qualityStartRatio",
                            header: "QSR",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].ppr.goodStartRatio;
                                } catch {
                                    return null;
                                }
                            },
                            id: "ppr.goodStartRatio",
                            header: "GSR",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].ppr.score;
                                } catch {
                                    return null;
                                }
                            },
                            id: "ppr.score",
                            header: "SCR",
                            size: 30,
                        },
                    ],
                },
            ]);
        } else if (pointsType === "half") {
            cols = cols.concat([
                {
                    accessorKey: "half-ppr points",
                    header: "HALF-PPR POINTS",
                    columns: [
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].half.points.sum;
                                } catch {
                                    return null;
                                }
                            },
                            id: "half.points.sum",
                            header: "SUM",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].half.points.mean;
                                } catch {
                                    return null;
                                }
                            },
                            id: "half.points.mean",
                            header: "MEAN",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].half.points.median;
                                } catch {
                                    return null;
                                }
                            },
                            id: "half.points.median",
                            header: "MDN",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].half.points.standardDeviation;
                                } catch {
                                    return null;
                                }
                            },
                            id: "half.points.standardDeviation",
                            header: "STD",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].half.points.adjustedMean;
                                } catch {
                                    return null;
                                }
                            },
                            id: "half.points.adjustedMean",
                            header: "ADJM",
                            size: 30,
                        },
                    ],
                },
                {
                    accessorKey: "half-ppr misc",
                    header: "HALF-PPR MISC",
                    columns: [
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].half.games.bad;
                                } catch {
                                    return null;
                                }
                            },
                            id: "half.games.bad",
                            header: "BAD",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].half.games.poor;
                                } catch {
                                    return null;
                                }
                            },
                            id: "half.games.poor",
                            header: "POOR",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].half.games.okay;
                                } catch {
                                    return null;
                                }
                            },
                            id: "half.games.okay",
                            header: "FINE",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].half.games.good;
                                } catch {
                                    return null;
                                }
                            },
                            id: "half.games.good",
                            header: "GOOD",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].half.games.great;
                                } catch {
                                    return null;
                                }
                            },
                            id: "half.games.great",
                            header: "GRT",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].half.qualityStartRatio;
                                } catch {
                                    return null;
                                }
                            },
                            id: "half.qualityStartRatio",
                            header: "QSR",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].half.goodStartRatio;
                                } catch {
                                    return null;
                                }
                            },
                            id: "half.goodStartRatio",
                            header: "GSR",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].half.score;
                                } catch {
                                    return null;
                                }
                            },
                            id: "half.score",
                            header: "SCR",
                            size: 30,
                        },
                    ],
                },
                {
                    accessorKey: "half-ppr projected",
                    header: "HALF-PPR PROJECTED",
                    columns: [
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].half.projected.mean;
                                } catch {
                                    return null;
                                }
                            },
                            id: "half.projected.mean",
                            header: "MEAN",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].half.projected.sum;
                                } catch {
                                    return null;
                                }
                            },
                            id: "half.projected.sum",
                            header: "TOT",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].half.projected.rank;
                                } catch {
                                    return null;
                                }
                            },
                            id: "half.projected.rank",
                            header: "RANK",
                            size: 30,
                        },
                    ],
                },
            ]);
        } else if (pointsType === "standard") {
            cols = cols.concat([
                {
                    accessorKey: "standard points",
                    header: "STANDARD POINTS",
                    columns: [
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].standard.points.sum;
                                } catch {
                                    return null;
                                }
                            },
                            id: "standard.points.sum",
                            header: "SUM",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].standard.points.mean;
                                } catch {
                                    return null;
                                }
                            },
                            id: "standard.points.mean",
                            header: "MEAN",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].standard.points.median;
                                } catch {
                                    return null;
                                }
                            },
                            id: "standard.points.median",
                            header: "MDN",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].standard.points.standardDeviation;
                                } catch {
                                    return null;
                                }
                            },
                            id: "standard.points.standardDeviation",
                            header: "STD",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].standard.points.adjustedMean;
                                } catch {
                                    return null;
                                }
                            },
                            id: "standard.points.adjustedMean",
                            header: "ADJM",
                            size: 30,
                        },
                    ],
                },
                {
                    accessorKey: "standard misc",
                    header: "STANDARD MISC",
                    columns: [
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].standard.games.bad;
                                } catch {
                                    return null;
                                }
                            },
                            id: "standard.games.bad",
                            header: "BAD",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].standard.games.poor;
                                } catch {
                                    return null;
                                }
                            },
                            id: "standard.games.poor",
                            header: "POOR",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].standard.games.okay;
                                } catch {
                                    return null;
                                }
                            },
                            id: "standard.games.okay",
                            header: "FINE",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].standard.games.good;
                                } catch {
                                    return null;
                                }
                            },
                            id: "standard.games.good",
                            header: "GOOD",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].standard.games.great;
                                } catch {
                                    return null;
                                }
                            },
                            id: "standard.games.great",
                            header: "GRT",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].standard.qualityStartRatio;
                                } catch {
                                    return null;
                                }
                            },
                            id: "standard.qualityStartRatio",
                            header: "QSR",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].standard.goodStartRatio;
                                } catch {
                                    return null;
                                }
                            },
                            id: "standard.goodStartRatio",
                            header: "GSR",
                            size: 30,
                        },
                        {
                            accessorFn: (player) => {
                                try {
                                    return player.stats[
                                        player.stats.findIndex(
                                            (item) => item.season === year
                                        )
                                    ].standard.score;
                                } catch {
                                    return null;
                                }
                            },
                            id: "standard.score",
                            header: "SCR",
                            size: 30,
                        },
                    ],
                },
            ]);
        }
        return cols;
    }, [year, pointsType]);

    return (
        <Box
            sx={{
                backgroundColor: "secondary.main",
                mx: 5,
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
                    columnPinning: {
                        left: ["mrt-row-numbers", "name", "position"],
                    },
                    density: "compact",
                    pagination: { pageSize: 25 },
                    columnVisibility: {
                        "rushing.attempts": false,
                        "rushing.attemptsMean": false,
                        "rushing.yards": false,
                        "rushing.yardsMean": false,
                        "rushing.yardsPerAttempt": false,
                        "rushing.firstDowns": false,
                        "rushing.firstDownsMean": false,
                        "rushing.long": false,
                        "rushing.longMean": false,
                        "rushing.twentyPlus": false,
                        "rushing.twentyPlusMean": false,
                        "rushing.td": false,
                        "rushing.tdMean": false,
                        "receiving.receptions": false,
                        "receiving.receptionsMean": false,
                        "receiving.targets": false,
                        "receiving.targetsMean": false,
                        "receiving.yards": false,
                        "receiving.yardsMean": false,
                        "receiving.yardsPerReception": false,
                        "receiving.firstDowns": false,
                        "receiving.firstDownsMean": false,
                        "receiving.long": false,
                        "receiving.longMean": false,
                        "receiving.twentyPlus": false,
                        "receiving.twentyPlusMean": false,
                        "receiving.td": false,
                        "receiving.tdMean": false,
                        "passing.completions": false,
                        "passing.completionsMean": false,
                        "passing.attempts": false,
                        "passing.attemptsMean": false,
                        "passing.percentage": false,
                        "passing.yards": false,
                        "passing.yardsMean": false,
                        "passing.yardsPerAttempt": false,
                        "passing.td": false,
                        "passing.tdMean": false,
                        "passing.interceptions": false,
                        "passing.interceptionsMean": false,
                        "passing.sacks": false,
                        "passing.sacksMean": false,
                        "kicking.fieldGoals.sum": false,
                        "kicking.fieldGoals.mean": false,
                        "kicking.fieldGoals.attempts": false,
                        "kicking.fieldGoals.attemptsMean": false,
                        "kicking.fieldGoals.percentage": false,
                        "kicking.fieldGoals.long": false,
                        "kicking.fieldGoals.longMean": false,
                        "kicking.fieldGoals.sum10_19": false,
                        "kicking.fieldGoals.mean10_19": false,
                        "kicking.fieldGoals.sum20_29": false,
                        "kicking.fieldGoals.mean20_29": false,
                        "kicking.fieldGoals.sum30_39": false,
                        "kicking.fieldGoals.mean30_39": false,
                        "kicking.fieldGoals.sum40_49": false,
                        "kicking.fieldGoals.mean40_49": false,
                        "kicking.fieldGoals.sum50Plus": false,
                        "kicking.fieldGoals.mean50Plus": false,
                        "kicking.extraPoints.sum": false,
                        "kicking.extraPoints.mean": false,
                        "kicking.extraPoints.attempts": false,
                        "kicking.extraPoints.attemptsMean": false,
                        "kicking.extraPoints.percentage": false,
                        "dst.defense.sacks": false,
                        "dst.defense.sacksMean": false,
                        "dst.defense.interceptions": false,
                        "dst.defense.interceptionsMean": false,
                        "dst.defense.fumblesRecovered": false,
                        "dst.defense.fumblesRecoveredMean": false,
                        "dst.defense.forcedFumbles": false,
                        "dst.defense.forcedFumblesMean": false,
                        "dst.defense.safeties": false,
                        "dst.defense.safetiesMean": false,
                        "dst.defense.td": false,
                        "dst.defense.tdMean": false,
                        "dst.specialTeams.td": false,
                        "dst.specialTeams.tdMean": false,
                        "misc.touches": false,
                        "misc.touchesMean": false,
                        "misc.opportunities": false,
                        "misc.opportunitiesMean": false,
                        "misc.firstDowns": false,
                        "misc.firstDownsMean": false,
                        "misc.fumblesLost": false,
                        "misc.fumblesLostMean": false,
                        "misc.fumblesLostPerTouch": false,
                        "standard.games.bad": false,
                        "standard.games.poor": false,
                        "standard.games.okay": false,
                        "standard.games.good": false,
                        "standard.games.great": false,
                        "half.games.bad": false,
                        "half.games.poor": false,
                        "half.games.okay": false,
                        "half.games.good": false,
                        "half.games.great": false,
                        "ppr.games.bad": false,
                        "ppr.games.poor": false,
                        "ppr.games.okay": false,
                        "ppr.games.good": false,
                        "ppr.games.great": false,
                    },
                    sorting: [
                        {
                            id: "half.projected.sum",
                            desc: true,
                        },
                        {
                            id: "ppr.score",
                            desc: true,
                        },
                        {
                            id: "standard.score",
                            desc: true,
                        }, //sort by state in ascending order by default
                    ],
                }}
                displayColumnDefOptions={{
                    "mrt-row-numbers": { size: 1 },
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
                muiTableContainerProps={{ sx: { maxHeight: "80vh" } }}
                muiTablePaginationProps={{
                    rowsPerPageOptions: [25, 50, 100],
                }}
                renderTopToolbarCustomActions={({ table }) => {
                    return (
                        <Stack direction="row" justifyContent="space-between">
                            <FormControl sx={{ my: 1, mr: 1, minWidth: 80 }}>
                                <InputLabel id="pos-label" color="secondary">
                                    Position
                                </InputLabel>
                                <Select
                                    labelId="pos-label"
                                    id="pos-select"
                                    value={position}
                                    label="Position"
                                    size="small"
                                    color="secondary"
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
                                <InputLabel id="type-label" color="secondary">
                                    Scoring
                                </InputLabel>
                                <Select
                                    labelId="type-label"
                                    id="type-select"
                                    value={pointsType}
                                    label="Scoring"
                                    size="small"
                                    color="secondary"
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
                            <FormControl sx={{ my: 1, mr: 1, minWidth: 120 }}>
                                <InputLabel id="year-label" color="secondary">
                                    Year
                                </InputLabel>
                                <Select
                                    labelId="year-label"
                                    id="year-select"
                                    value={year}
                                    label="Year"
                                    size="small"
                                    color="secondary"
                                    onChange={(event) =>
                                        dispatch(setYear(event.target.value))
                                    }
                                >
                                    <MenuItem value={"Weighted Average"}>
                                        Weighted Average
                                    </MenuItem>
                                    <MenuItem value={"2023"}>2023</MenuItem>
                                    <MenuItem value={"2022"}>2022</MenuItem>
                                    <MenuItem value={"2021"}>2021</MenuItem>
                                    <MenuItem value={"2020"}>2020</MenuItem>
                                    <MenuItem value={"2019"}>2019</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ my: 1, minWidth: 120 }}>
                                <InputLabel id="team-label" color="secondary">
                                    Team
                                </InputLabel>
                                <Select
                                    labelId="team-label"
                                    id="team-select"
                                    value={team}
                                    label="Team"
                                    size="small"
                                    color="secondary"
                                    onChange={(event) =>
                                        setTeam(event.target.value)
                                    }
                                >
                                    <MenuItem value={"ALL"}>All</MenuItem>
                                    <MenuItem value={"ARI"}>Arizona</MenuItem>
                                    <MenuItem value={"ATL"}>Atlanta</MenuItem>
                                    <MenuItem value={"BAL"}>Baltimore</MenuItem>
                                    <MenuItem value={"BUF"}>Buffalo</MenuItem>
                                    <MenuItem value={"CAR"}>Carolina</MenuItem>
                                    <MenuItem value={"CHI"}>Chicago</MenuItem>
                                    <MenuItem value={"CIN"}>
                                        Cincinnati
                                    </MenuItem>
                                    <MenuItem value={"CLE"}>Cleveland</MenuItem>
                                    <MenuItem value={"DAL"}>Dallas</MenuItem>
                                    <MenuItem value={"DEN"}>Denver</MenuItem>
                                    <MenuItem value={"DET"}>Detroit</MenuItem>
                                    <MenuItem value={"GB"}>Green Bay</MenuItem>
                                    <MenuItem value={"HOU"}>Houston</MenuItem>
                                    <MenuItem value={"IND"}>
                                        Indianapolis
                                    </MenuItem>
                                    <MenuItem value={"JAC"}>
                                        Jacksonville
                                    </MenuItem>
                                    <MenuItem value={"KC"}>
                                        Kansas City
                                    </MenuItem>
                                    <MenuItem value={"LAC"}>
                                        LA Chargers
                                    </MenuItem>
                                    <MenuItem value={"LAR"}>LA Rams</MenuItem>
                                    <MenuItem value={"LV"}>Las Vegas</MenuItem>
                                    <MenuItem value={"MIA"}>Miami</MenuItem>
                                    <MenuItem value={"MIN"}>Minnesota</MenuItem>
                                    <MenuItem value={"NE"}>
                                        New England
                                    </MenuItem>
                                    <MenuItem value={"NO"}>
                                        New Orleans
                                    </MenuItem>
                                    <MenuItem value={"NYG"}>NY Giants</MenuItem>
                                    <MenuItem value={"NYJ"}>NY Jets</MenuItem>
                                    <MenuItem value={"PHI"}>
                                        Philadelphia
                                    </MenuItem>
                                    <MenuItem value={"PIT"}>
                                        Pittsburgh
                                    </MenuItem>
                                    <MenuItem value={"SEA"}>Seattle</MenuItem>
                                    <MenuItem value={"SF"}>
                                        San Francisco
                                    </MenuItem>
                                    <MenuItem value={"TB"}>Tampa Bay</MenuItem>
                                    <MenuItem value={"TEN"}>Tennessee</MenuItem>
                                    <MenuItem value={"WAS"}>
                                        Washington
                                    </MenuItem>
                                    <MenuItem value={"FA"}>
                                        Free Agents
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ my: 1, minWidth: 120 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            color="secondary"
                                            checked={showFAs}
                                            onChange={() =>
                                                setShowFAs(!showFAs)
                                            }
                                        />
                                    }
                                    label="Show Free Agents"
                                    labelPlacement="start"
                                />
                            </FormControl>
                        </Stack>
                    );
                }}
            />
        </Box>
    );
};

export default StatsTable;
