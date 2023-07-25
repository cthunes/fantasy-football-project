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
import { rankingFetchAll, rankingCreate } from "./redux/ranking";
import { setYear } from "./redux/year";

import StatsTable from "./components/Table/StatsTable";
import FormAndRankings from "./components/FormAndRankings/FormAndRankings";

const App = () => {
    const dispatch = useDispatch();

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
                        spacing={2}
                    >
                        {true && (
                            <Grid item xs={12}>
                                <StatsTable />
                            </Grid>
                        )}
                        {false && (
                            <>
                                <Grid item xs={12} sm={8}>
                                    <StatsTable />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormAndRankings />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Container>
            </Grow>
        </Container>
    );
};

export default App;
