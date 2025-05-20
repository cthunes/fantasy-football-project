import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    Button,
    ButtonBase,
    ButtonGroup,
    IconButton,
} from "@mui/material";
import { ViewColumn } from "@mui/icons-material";

import { setOverallRnkHt, setView, setMaxWidth } from "../.././redux/view";

const TopBar = () => {
    const dispatch = useDispatch();
    const maxWidth = useSelector((state) => state.view.maxWidth);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="static"
                sx={{ px: 5, backgroundColor: "secondary.main" }}
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
                        <IconButton
                            sx={{ mr: 1 }}
                            onClick={() => {
                                dispatch(setMaxWidth(maxWidth ? false : "xl"));
                                dispatch(
                                    setOverallRnkHt(
                                        maxWidth ? [539, 539] : [249, 249]
                                    )
                                );
                            }}
                        >
                            <ViewColumn
                                sx={{
                                    color: "white",
                                    ":hover": {
                                        color: "secondary.light",
                                    },
                                }}
                            />
                        </IconButton>
                        <Button
                            color="inherit"
                            onClick={() => {
                                dispatch(setView("rankings"));
                                dispatch(
                                    setOverallRnkHt(
                                        maxWidth ? [249, 249] : [539, 539]
                                    )
                                );
                            }}
                            sx={{
                                ":hover": {
                                    bgcolor: "secondary.dark",
                                },
                            }}
                        >
                            Rankings
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => {
                                dispatch(setView("draft"));
                                dispatch(
                                    setOverallRnkHt(
                                        maxWidth ? [249, 249] : [539, 539]
                                    )
                                );
                            }}
                            sx={{
                                ":hover": {
                                    bgcolor: "secondary.dark",
                                },
                            }}
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
