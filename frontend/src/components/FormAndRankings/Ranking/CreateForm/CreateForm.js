import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Card,
    CardHeader,
    CardContent,
    Collapse,
    ListItemText,
    IconButton,
    Box,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    Typography,
    Button,
} from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";

import { setPointsType } from "../../../../redux/pointsType";

const CreateForm = () => {
    const [expanded, setExpanded] = React.useState(true);
    const dispatch = useDispatch();
    const pointsType = useSelector((state) => state.pointsType.pointsType);
    const year = useSelector((state) => state.year.year);
    const [column, setColumn] = useState("half.score");
    const [number, setNumber] = useState(300);

    return (
        <Card
            border={5}
            borderRadius={2}
            sx={{
                borderColor: "secondary.dark",
            }}
        >
            <CardHeader
                title="Create New Rankings"
                action={
                    <IconButton
                        onClick={() => setExpanded(!expanded)}
                        size="small"
                    >
                        {expanded ? (
                            <KeyboardArrowUp sx={{ color: "white" }} />
                        ) : (
                            <KeyboardArrowDown sx={{ color: "white" }} />
                        )}
                    </IconButton>
                }
                sx={{ color: "white", backgroundColor: "secondary.main" }}
            ></CardHeader>
            <Box sx={{ backgroundColor: "secondary.light" }}>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Box
                            border={2}
                            borderRadius={2}
                            sx={{
                                p: 1,
                                px: 2,
                                borderColor: "secondary.dark",
                                backgroundColor: "white",
                            }}
                        >
                            <Grid
                                container
                                justify="space-between"
                                alignItems="stretch"
                                columnSpacing={2}
                            >
                                <Grid item md={3} lg={5}>
                                    <ListItemText secondary="Generate from descending order:" />
                                </Grid>
                                <Grid item md={9} lg={7}>
                                    <FormControl
                                        size="small"
                                        sx={{ my: 1, mr: 1, width: 180 }}
                                    >
                                        <InputLabel id="year-label">
                                            Year
                                        </InputLabel>
                                        <Select
                                            labelId="year-label"
                                            id="year-select"
                                            value={year}
                                            label="Year"
                                        >
                                            <MenuItem
                                                value={"Weighted Average"}
                                            >
                                                Weighted Average
                                            </MenuItem>
                                            <MenuItem value={"2022"}>
                                                2022
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl
                                        size="small"
                                        sx={{ my: 1, mr: 1, width: 180 }}
                                    >
                                        <InputLabel id="type-label">
                                            Scoring
                                        </InputLabel>
                                        <Select
                                            labelId="type-label"
                                            id="type-select"
                                            value={pointsType}
                                            label="Scoring"
                                            onChange={(event) =>
                                                dispatch(
                                                    setPointsType(
                                                        event.target.value
                                                    )
                                                )
                                            }
                                        >
                                            <MenuItem value={"standard"}>
                                                Standard
                                            </MenuItem>
                                            <MenuItem value={"half"}>
                                                Half-PPR
                                            </MenuItem>
                                            <MenuItem value={"ppr"}>
                                                PPR
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl
                                        size="small"
                                        sx={{ my: 1, mr: 1, width: 180 }}
                                    >
                                        <InputLabel id="column-label">
                                            Column
                                        </InputLabel>
                                        <Select
                                            labelId="column-label"
                                            id="column-select"
                                            value={column}
                                            label="Column"
                                            onChange={(event) =>
                                                dispatch(
                                                    setColumn(
                                                        event.target.value
                                                    )
                                                )
                                            }
                                        >
                                            <MenuItem value={"half.score"}>
                                                Score
                                            </MenuItem>
                                            <MenuItem
                                                disabled={
                                                    pointsType === "half"
                                                        ? false
                                                        : true
                                                }
                                                value={"half.projected.sum"}
                                            >
                                                Projected Points
                                            </MenuItem>
                                            <MenuItem
                                                value={"half.points.mean"}
                                            >
                                                Mean Points
                                            </MenuItem>
                                            <MenuItem
                                                value={
                                                    "half.points.adjustedMean"
                                                }
                                            >
                                                Adjusted Mean Points
                                            </MenuItem>
                                            <MenuItem
                                                value={"half.points.median"}
                                            >
                                                Median Points
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Typography
                                        id="input-slider"
                                        fontSize={12}
                                        sx={{ ml: 2, color: "#616161" }}
                                    >
                                        Number of Players
                                    </Typography>
                                    <Slider
                                        aria-label="Number of Players"
                                        defaultValue={300}
                                        valueLabelDisplay="auto"
                                        step={25}
                                        marks
                                        min={200}
                                        max={400}
                                        sx={{ color: "secondary.dark" }}
                                    />
                                    <Button
                                        sx={{
                                            color: "white",
                                            backgroundColor: "secondary.main",
                                            width: 180,
                                            ":hover": {
                                                bgcolor: "secondary.dark",
                                            },
                                        }}
                                        onClick={
                                            () =>
                                                console.log("Generate rankings") //do something
                                        }
                                    >
                                        Generate Rankings
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box
                            border={2}
                            borderRadius={2}
                            sx={{
                                mt: 2,
                                p: 1,
                                px: 2,
                                borderColor: "secondary.dark",
                                backgroundColor: "white",
                            }}
                        >
                            <Grid
                                container
                                justify="space-between"
                                alignItems="stretch"
                                columnSpacing={2}
                            >
                                <Grid item md={12} lg={5}>
                                    <ListItemText secondary="Generate from existing ranking:" />
                                </Grid>
                                <Grid item md={12} lg={7}>
                                    <Button
                                        sx={{
                                            mb: 1,
                                            color: "black",
                                            backgroundColor: "secondary.light",
                                            width: 180,
                                            ":hover": {
                                                bgcolor: "secondary.main",
                                            },
                                        }}
                                    >
                                        Rankings 1
                                    </Button>
                                    <Button
                                        sx={{
                                            color: "black",
                                            backgroundColor: "secondary.light",
                                            width: 180,
                                            ":hover": {
                                                bgcolor: "secondary.main",
                                            },
                                        }}
                                    >
                                        Rankings 2
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Collapse>
            </Box>
        </Card>
    );
};

export default CreateForm;
