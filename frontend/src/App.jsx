import React from "react";
import { useSelector } from "react-redux";
import { Container, Grid } from "@mui/material";

import TopBar from "./components/TopBar/TopBar";
import StatsTable from "./components/Table/StatsTable";
import FormAndRankings from "./components/FormAndRankings/FormAndRankings";

const App = () => {
    const view = useSelector((state) => state.view.view);
    const consoleError = console.error;
    const consoleWarn = console.warn;
    const SUPPRESSED = [
        ".score",
        "Warning:",
        "SerializableStateInvariantMiddleware",
    ];

    console.warn = function filterWarnings(msg, ...args) {
        if (!SUPPRESSED.some((entry) => msg.includes(entry))) {
            consoleWarn(msg, ...args);
        }
    };
    console.error = function filterWarnings(msg, ...args) {
        if (!SUPPRESSED.some((entry) => msg.includes(entry))) {
            consoleError(msg, ...args);
        }
    };

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
                        xl={4.5}
                        display={
                            view === "rankings" || view === "draft"
                                ? "block"
                                : "none"
                        }
                    >
                        <FormAndRankings />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        xl={view === "rankings" || view === "draft" ? 7.5 : 12}
                    >
                        <StatsTable />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default App;
