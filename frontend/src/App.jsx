import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Container,
    AppBar,
    Toolbar,
    Box,
    Typography,
    Button,
    Grid,
} from "@mui/material";
import { rankingFetchAll, rankingCreate } from "./redux/ranking";
import { setYear } from "./redux/year";

import StatsTable from "./components/Table/StatsTable";
import FormAndRankings from "./components/FormAndRankings/FormAndRankings";

const App = () => {
    const dispatch = useDispatch();

    return (
        <Container maxWidth="xl" disableGutters>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h4" sx={{ flexGrow: 1 }}>
                            Explore Fantasy Statistics
                        </Typography>
                        <Button color="inherit">need tabs</Button>
                    </Toolbar>
                </AppBar>
            </Box>
            <Container maxWidth="xl" disableGutters>
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
        </Container>
    );
};

export default App;
