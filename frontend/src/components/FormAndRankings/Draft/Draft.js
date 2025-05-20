import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

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

import PosRanking from "./PosRanking/PosRanking";
import { setCurrent } from "../../../redux/ranking";

const Draft = () => {
    const dispatch = useDispatch();
    const current = useSelector((state) => state.ranking.current);
    const rankings = useSelector((state) => state.ranking.rankings);
    const maxWidth = useSelector((state) => state.view.maxWidth);
    const [currentName, setCurrentName] = useState("");

    useEffect(() => {
        setCurrentName(current.name);
    }, [current]);

    const startDraft = () => {
        dispatch(
            setCurrent({
                ...rankings[
                    rankings.findIndex((item) => item.name === currentName)
                ],
            })
        );
    };

    return (
        current.name != null &&
        currentName != null && (
            <Box align="center" sx={{ mx: 5, my: 2 }}>
                <Grid container maxWidth="md" columnSpacing={1}>
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
                            onClick={startDraft}
                        >
                            Start Draft
                        </Button>
                    </Grid>
                </Grid>
                <Typography variant="h5" sx={{ my: 1 }}>
                    {current.name}
                </Typography>
                {maxWidth && (
                    <Grid container columnSpacing={1} sx={{ my: 1 }}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <PosRanking
                                position="Overall"
                                accessorKey="overall"
                                open
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <PosRanking
                                position="Quarterbacks"
                                accessorKey="qb"
                                col1
                            />
                            <PosRanking
                                position="Running Backs"
                                accessorKey="rb"
                                col1
                            />
                            <PosRanking
                                position="Wide Recievers"
                                accessorKey="wr"
                                col1
                            />
                            <PosRanking
                                position="Tight Ends"
                                accessorKey="te"
                                col1
                            />
                            <PosRanking
                                position="Kickers"
                                accessorKey="k"
                                col1
                            />
                            <PosRanking
                                position="Defense/ST"
                                accessorKey="dst"
                                col1
                            />
                        </Grid>
                    </Grid>
                )}
                {!maxWidth && (
                    <Grid container columnSpacing={1} sx={{ my: 1 }}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
                            <PosRanking
                                position="Overall"
                                accessorKey="overall"
                                open
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
                            <PosRanking
                                position="Running Backs"
                                accessorKey="rb"
                                open
                                col1
                            />
                            <PosRanking
                                position="Quarterbacks"
                                accessorKey="qb"
                                col1
                            />
                            <PosRanking
                                position="Kickers"
                                accessorKey="k"
                                col1
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
                            <PosRanking
                                position="Wide Recievers"
                                accessorKey="wr"
                                open
                                col2
                            />
                            <PosRanking
                                position="Tight Ends"
                                accessorKey="te"
                                col2
                            />
                            <PosRanking
                                position="Defense/ST"
                                accessorKey="dst"
                                col2
                            />
                        </Grid>
                    </Grid>
                )}
            </Box>
        )
    );
};

export default Draft;
