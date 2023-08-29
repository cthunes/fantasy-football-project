import React from "react";
import { useSelector } from "react-redux";
import { Container, Grid, Grow } from "@mui/material";

import TopBar from "./components/TopBar/TopBar";
import StatsTable from "./components/Table/StatsTable";
import FormAndRankings from "./components/FormAndRankings/FormAndRankings";

const App = () => {
    const view = useSelector((state) => state.view.view);

    return (
        <>
            <TopBar />
            <Container
                maxWidth="xl"
                sx={{
                    mt: 2,
                }}
            >
                <Grid
                    container
                    justify="space-between"
                    alignItems="stretch"
                    spacing={2}
                >
                    <Grid
                        item
                        xs={12}
                        lg={view === "rankings" || view === "draft" ? 8 : 12}
                    >
                        <StatsTable />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        lg={4}
                        display={
                            view === "rankings" || view === "draft"
                                ? "block"
                                : "none"
                        }
                    >
                        <FormAndRankings />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default App;
