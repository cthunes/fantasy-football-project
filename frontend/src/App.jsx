import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Container,
    AppBar,
    Typography,
    Button,
    Grow,
    Grid,
} from "@mui/material";
import { playerFetchAll } from "./redux/player";
import { rankingFetchAll, rankingCreate } from "./redux/ranking";

import Table from "./components/Table/Table";
import FormAndRankings from "./components/FormAndRankings/FormAndRankings";

const App = () => {
    const players = useSelector((state) => state.player.players);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(playerFetchAll());
    }, [dispatch]);

    return (
        <Container maxWidth="xl">
            <AppBar position="static" color="inherit">
                <Typography variant="h3" align="center">
                    Explore Fantasy Stats
                </Typography>
            </AppBar>
            <Grow in>
                <Container>
                    <Grid
                        container
                        justify="space-between"
                        alignItems="stretch"
                        spacing={3}
                    >
                        <Grid item xs={12} sm={7}>
                            <Table />
                            {players.map((player) => (
                                <ul>
                                    <li key={player.name}>
                                        <label>
                                            {player.name}, {player.position}
                                        </label>
                                    </li>
                                </ul>
                            ))}
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormAndRankings />
                            <Button
                                variant="contained"
                                onClick={() =>
                                    dispatch(
                                        rankingCreate({
                                            name: "Christian McCaffrey is awesome",
                                            type: "what is type for",
                                        })
                                    )
                                }
                            >
                                Create Rankings
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Grow>
        </Container>
    );
};

export default App;
