import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Card,
    CardHeader,
    CardContent,
    Collapse,
    ListItemText,
    IconButton,
    Box,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    Typography,
    Button,
} from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";

import { rankingFetchAll, rankingCreate } from "../../../../redux/ranking";
import { setPointsType } from "../../../../redux/pointsType";

const CreateForm = () => {
    const [expanded, setExpanded] = React.useState(false);
    const dispatch = useDispatch();
    const rankings = useSelector((state) => state.ranking.rankings);
    const players = useSelector((state) => state.player.players);
    const pointsType = useSelector((state) => state.pointsType.pointsType);
    const year = useSelector((state) => state.year.year);
    const [column, setColumn] = useState(`${pointsType}.score`);
    const [number, setNumber] = useState(300);

    useEffect(() => {
        dispatch(rankingFetchAll());
    }, [dispatch]);

    function generateRanking() {
        let split = column.split(".");
        let r1 = players
            .map((player) => ({
                ...player,
                rankingStatistic: () => {
                    let stat =
                        split.length === 2
                            ? player.stats[
                                  player.stats.findIndex(
                                      (item) => item.season === year
                                  )
                              ][split[0]][split[1]]
                            : player.stats[
                                  player.stats.findIndex(
                                      (item) => item.season === year
                                  )
                              ][split[0]][split[1]][split[2]];
                    if (player.position === "QB") return stat * 0.5;
                    else if (player.position === "TE") return stat * 1.15;
                    else if (player.position === "K") return stat * 0.8;
                    else if (player.position === "DST") return stat * 0.9;
                    else return stat;
                },
            }))
            .filter((player) =>
                player.stats.some((item) => item.season === year)
            )
            .sort((a, b) => b.rankingStatistic() - a.rankingStatistic())
            .map((player, i) => ({ ...player, rank: i + 1 }))
            .slice(0, number);
        dispatch(
            rankingCreate({
                name: "Rankings " + (rankings.length + 1),
                type: pointsType,
                rankings: {
                    overall: r1,
                    qb: r1.filter((player) => player.position === "QB"),
                    rb: r1.filter((player) => player.position === "RB"),
                    wr: r1.filter((player) => player.position === "WR"),
                    te: r1.filter((player) => player.position === "TE"),
                    k: r1.filter((player) => player.position === "K"),
                    dst: r1.filter((player) => player.position === "DST"),
                },
            })
        );
    }

    return (
        <Card
            border={5}
            borderRadius={2}
            sx={{
                borderColor: "secondary.dark",
            }}
        >
            <CardHeader
                title="Create New Rankings"
                titleTypographyProps={{ color: "white", fontSize: 20 }}
                action={
                    <IconButton
                        onClick={() => setExpanded(!expanded)}
                        size="small"
                    >
                        {expanded ? (
                            <KeyboardArrowUp sx={{ color: "white" }} />
                        ) : (
                            <KeyboardArrowDown sx={{ color: "white" }} />
                        )}
                    </IconButton>
                }
                sx={{ backgroundColor: "secondary.main" }}
            ></CardHeader>
            <Box sx={{ backgroundColor: "secondary.light" }}>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Box
                            border={2}
                            borderRadius={2}
                            sx={{
                                p: 1,
                                px: 2,
                                borderColor: "secondary.dark",
                                backgroundColor: "white",
                            }}
                        >
                            <Grid
                                container
                                justify="space-between"
                                alignItems="stretch"
                                columnSpacing={2}
                            >
                                <Grid item md={3} lg={5}>
                                    <ListItemText secondary="Generate from descending order:" />
                                </Grid>
                                <Grid item md={9} lg={7}>
                                    <FormControl
                                        size="small"
                                        sx={{ my: 1, mr: 1, width: 180 }}
                                    >
                                        <InputLabel id="year-label">
                                            Year
                                        </InputLabel>
                                        <Select
                                            labelId="year-label"
                                            id="year-select"
                                            value={year}
                                            label="Year"
                                        >
                                            <MenuItem
                                                value={"Weighted Average"}
                                            >
                                                Weighted Average
                                            </MenuItem>
                                            <MenuItem value={"2022"}>
                                                2022
                                            </MenuItem>
                                            <MenuItem value={"2021"}>
                                                2021
                                            </MenuItem>
                                            <MenuItem value={"2020"}>
                                                2020
                                            </MenuItem>
                                            <MenuItem value={"2019"}>
                                                2019
                                            </MenuItem>
                                            <MenuItem value={"2018"}>
                                                2018
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl
                                        size="small"
                                        sx={{ my: 1, mr: 1, width: 180 }}
                                    >
                                        <InputLabel id="type-label">
                                            Scoring
                                        </InputLabel>
                                        <Select
                                            labelId="type-label"
                                            id="type-select"
                                            value={pointsType}
                                            label="Scoring"
                                            onChange={(event) => {
                                                if (
                                                    column ===
                                                    "half.projected.sum"
                                                )
                                                    setColumn(
                                                        `${event.target.value}.score`
                                                    );
                                                else
                                                    setColumn(
                                                        `${
                                                            event.target.value
                                                        }.${column.substring(
                                                            column.indexOf(
                                                                "."
                                                            ) + 1
                                                        )}`
                                                    );
                                                dispatch(
                                                    setPointsType(
                                                        event.target.value
                                                    )
                                                );
                                            }}
                                        >
                                            <MenuItem value={"standard"}>
                                                Standard
                                            </MenuItem>
                                            <MenuItem value={"half"}>
                                                Half-PPR
                                            </MenuItem>
                                            <MenuItem value={"ppr"}>
                                                PPR
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl
                                        size="small"
                                        sx={{ my: 1, mr: 1, width: 180 }}
                                    >
                                        <InputLabel id="column-label">
                                            Column
                                        </InputLabel>
                                        <Select
                                            labelId="column-label"
                                            id="column-select"
                                            value={column}
                                            label="Column"
                                            onChange={(event) =>
                                                setColumn(event.target.value)
                                            }
                                        >
                                            <MenuItem
                                                value={`${pointsType}.score`}
                                            >
                                                Score
                                            </MenuItem>
                                            <MenuItem
                                                disabled={
                                                    pointsType === "half"
                                                        ? false
                                                        : true
                                                }
                                                value={`${pointsType}.projected.sum`}
                                            >
                                                Projected Points
                                            </MenuItem>
                                            <MenuItem
                                                value={`${pointsType}.points.mean`}
                                            >
                                                Mean Points
                                            </MenuItem>
                                            <MenuItem
                                                value={`${pointsType}.points.adjustedMean`}
                                            >
                                                Adjusted Mean Points
                                            </MenuItem>
                                            <MenuItem
                                                value={`${pointsType}.points.median`}
                                            >
                                                Median Points
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Typography
                                        id="input-slider"
                                        fontSize={11.5}
                                        sx={{ ml: 2, color: "#656565" }}
                                    >
                                        Number of Players
                                    </Typography>
                                    <Slider
                                        aria-label="Number of Players"
                                        defaultValue={300}
                                        valueLabelDisplay="auto"
                                        step={25}
                                        marks
                                        min={200}
                                        max={400}
                                        sx={{ color: "secondary.dark" }}
                                        onChange={(event) =>
                                            setNumber(event.target.value)
                                        }
                                    />
                                    <Typography
                                        fontSize={11}
                                        sx={{
                                            mb: 1,
                                            mx: 0.5,
                                            color: "#656565",
                                        }}
                                    >
                                        Note: QBs will be assigned 1/2 value to
                                        appropriately place them.
                                    </Typography>
                                    <Button
                                        sx={{
                                            color: "white",
                                            backgroundColor: "secondary.main",
                                            width: 180,
                                            ":hover": {
                                                bgcolor: "secondary.dark",
                                            },
                                        }}
                                        onClick={generateRanking}
                                    >
                                        Generate Rankings
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box
                            border={2}
                            borderRadius={2}
                            sx={{
                                mt: 2,
                                p: 1,
                                px: 2,
                                borderColor: "secondary.dark",
                                backgroundColor: "white",
                            }}
                        >
                            <Grid
                                container
                                justify="space-between"
                                alignItems="stretch"
                                columnSpacing={2}
                            >
                                <Grid item md={12} lg={5}>
                                    <ListItemText secondary="Create from existing ranking:" />
                                </Grid>
                                <Grid item md={12} lg={7}>
                                    <Button
                                        sx={{
                                            mt: 0.5,
                                            mr: 1,
                                            color: "black",
                                            backgroundColor: "secondary.light",
                                            width: 180,
                                            ":hover": {
                                                color: "white",
                                                bgcolor: "secondary.main",
                                            },
                                        }}
                                    >
                                        Rankings 1
                                    </Button>
                                    <Button
                                        sx={{
                                            color: "black",
                                            mt: 0.5,
                                            mr: 1,
                                            backgroundColor: "secondary.light",
                                            width: 180,
                                            ":hover": {
                                                color: "white",
                                                bgcolor: "secondary.main",
                                            },
                                        }}
                                    >
                                        Rankings 2
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Collapse>
            </Box>
        </Card>
    );
};

export default CreateForm;
