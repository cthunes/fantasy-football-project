import React from "react";
import { useDispatch } from "react-redux";
import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    Button,
    ButtonBase,
    ButtonGroup,
} from "@mui/material";

import { setView } from "../.././redux/view";

const TopBar = () => {
    const dispatch = useDispatch();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="static"
                sx={{ backgroundColor: "secondary.main" }}
            >
                <Toolbar sx={{ justifyContent: "flex-end" }}>
                    <ButtonBase
                        onClick={() => dispatch(setView("stats"))}
                        sx={{ mr: "auto" }}
                    >
                        <Typography variant="h5" sx={{ flexGrow: 1 }}>
                            Explore Fantasy Statistics
                        </Typography>
                    </ButtonBase>
                    <ButtonGroup>
                        <Button
                            color="inherit"
                            onClick={() => dispatch(setView("rankings"))}
                        >
                            Rankings
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => dispatch(setView("draft"))}
                        >
                            Draft
                        </Button>
                    </ButtonGroup>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default TopBar;
