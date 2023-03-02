import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Typography, Button } from "@mui/material";
import { testFetchAll, testCreate } from "./redux/test";

const App = () => {
    const players = useSelector((state) => state.test.players);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(testFetchAll());
    }, [dispatch]);

    return (
        <Container maxWidth="lg">
            <Typography variant="h2" align="center">
                Fantasy Football Project
            </Typography>
            {players.map((player) => (
                <ul>
                    <li key={player.name}>
                        <label>
                            {player.name}, {player.position}, {player.fpoints}{" "}
                            points
                        </label>
                    </li>
                </ul>
            ))}
            <Button
                variant="contained"
                onClick={() =>
                    dispatch(
                        testCreate({
                            name: "Christian McCaffrey",
                            position: "RB",
                            fpoints: 24.2,
                        })
                    )
                }
            >
                Create Player
            </Button>
        </Container>
    );
};

export default App;
