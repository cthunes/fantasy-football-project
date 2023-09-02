import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Box,
    Grid,
    Typography,
    Select,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
} from "@mui/material";

import CreateForm from "./CreateForm/CreateForm";
import PosRanking from "./PosRanking/PosRanking";
import { rankingUpdate, setCurrent } from "../../../redux/ranking";
const Ranking = () => {
    const dispatch = useDispatch();
    const rankings = useSelector((state) => state.ranking.rankings);
    const current = useSelector((state) => state.ranking.current);
    const [currentName, setCurrentName] = useState("");

    useEffect(() => {
        setCurrentName(current.name);
    }, [current]);

    const editRanking = () => {
        console.log(currentName);
        dispatch(
            setCurrent(
                rankings[
                    rankings.findIndex((item) => item.name === currentName)
                ]
            )
        );
    };

    const saveChanges = () => {
        let overall = current.rankings.overall.map((player, i) => ({
            ...player,
            rank: i + 1,
        }));
        let ranking = {
            id: current._id,
            name: current.name,
            type: current.type,
            rankings: {
                overall: overall,
                qb: overall.filter((player) => player.position === "QB"),
                rb: overall.filter((player) => player.position === "RB"),
                wr: overall.filter((player) => player.position === "WR"),
                te: overall.filter((player) => player.position === "TE"),
                k: overall.filter((player) => player.position === "K"),
                dst: overall.filter((player) => player.position === "DST"),
            },
        };
        dispatch(rankingUpdate(ranking));
    };

    return (
        <>
            <CreateForm />
            {current.name != null && currentName != null && (
                <Box align="center">
                    <Box sx={{ my: 2 }}>
                        <Grid container columnSpacing={1}>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <FormControl
                                    fullWidth
                                    align="left"
                                    size="small"
                                    sx={{}}
                                >
                                    <InputLabel id="ranking-name-label">
                                        Ranking Name
                                    </InputLabel>
                                    <Select
                                        labelId="ranking-name-label"
                                        id="ranking-name-select"
                                        value={currentName}
                                        label="Ranking Name"
                                        onChange={(event) =>
                                            setCurrentName(event.target.value)
                                        }
                                    >
                                        {rankings.map((ranking) => (
                                            <MenuItem
                                                key={ranking.name}
                                                value={ranking.name}
                                            >
                                                {ranking.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <Button
                                    fullWidth
                                    sx={{
                                        py: 1,
                                        color: "black",
                                        backgroundColor: "secondary.light",
                                        ":hover": {
                                            color: "white",
                                            bgcolor: "secondary.main",
                                        },
                                    }}
                                    onClick={editRanking}
                                >
                                    Edit Ranking
                                </Button>
                            </Grid>
                        </Grid>
                        <Typography variant="h5" sx={{ my: 1 }}>
                            {current.name}
                        </Typography>
                        <Grid container columnSpacing={1}>
                            <Grid item xs={4}>
                                <Button
                                    fullWidth
                                    sx={{
                                        color: "black",
                                        fontSize: 12,
                                        backgroundColor: "error.light",
                                        ":hover": {
                                            color: "white",
                                            bgcolor: "error.main",
                                        },
                                    }}
                                >
                                    Delete Ranking
                                </Button>
                            </Grid>
                            <Grid item xs={4}>
                                <Button
                                    fullWidth
                                    sx={{
                                        color: "black",
                                        fontSize: 12,
                                        backgroundColor: "secondary.light",
                                        ":hover": {
                                            color: "white",
                                            bgcolor: "secondary.main",
                                        },
                                    }}
                                    onClick={editRanking}
                                >
                                    Discard Changes
                                </Button>
                            </Grid>
                            <Grid item xs={4}>
                                <Button
                                    fullWidth
                                    sx={{
                                        color: "white",
                                        fontSize: 12,
                                        backgroundColor: "secondary.dark",
                                        ":hover": {
                                            color: "black",
                                            bgcolor: "success.light",
                                        },
                                    }}
                                    onClick={saveChanges}
                                >
                                    Save Changes
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Grid container columnSpacing={1}>
                        <Grid item xs={12} sm={6} md={6} lg={12}>
                            <PosRanking
                                position="Overall"
                                accessorKey="overall"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={12}>
                            <PosRanking
                                position="Quarterbacks"
                                accessorKey="qb"
                            />
                            <PosRanking
                                position="Running Backs"
                                accessorKey="rb"
                            />
                            <PosRanking
                                position="Wide Recievers"
                                accessorKey="wr"
                            />
                            <PosRanking
                                position="Tight Ends"
                                accessorKey="te"
                            />
                            <PosRanking position="Kickers" accessorKey="k" />
                            <PosRanking
                                position="Defense/ST"
                                accessorKey="dst"
                            />
                        </Grid>
                    </Grid>
                </Box>
            )}
        </>
    );
};

export default Ranking;
