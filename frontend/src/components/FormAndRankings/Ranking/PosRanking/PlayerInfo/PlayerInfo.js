import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    ListItem,
    Card,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Grid,
} from "@mui/material";
import { RemoveCircleOutline } from "@mui/icons-material";

import { setNewPlayerCount } from "../../../../../redux/ranking";

const PlayerInfo = (props) => {
    const dispatch = useDispatch();
    const current = useSelector((state) => state.ranking.current);
    const newPlayerCount = useSelector((state) => state.ranking.newPlayerCount);
    const [team, setTeam] = React.useState("");
    const [position, setPosition] = React.useState(() => {
        if (props.pos === "overall") return "";
        else return props.pos.toUpperCase();
    });

    const handleUpdate = () => {
        dispatch(setNewPlayerCount(newPlayerCount - 1));
    };

    return (
        <ListItem>
            <Card
                sx={{
                    my: 1,
                    width: "100%",
                    margin: "auto",
                }}
                align="center"
            >
                <Grid container columnSpacing={1}>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={10}>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            name={"name" + props.id}
                            label="Player Name"
                            type="name"
                            color="secondary"
                            sx={{ ml: 2, mb: 1, minWidth: 225 }}
                            variant="standard"
                        />
                        <FormControl
                            required
                            size="small"
                            sx={{ ml: 2, my: 2, minWidth: 90 }}
                        >
                            <InputLabel id="team-label" color="secondary">
                                Team
                            </InputLabel>
                            <Select
                                labelId="team-label"
                                value={team}
                                id="team"
                                name={"team" + props.id}
                                label="Team"
                                type="team"
                                color="secondary"
                                onChange={(event) =>
                                    setTeam(event.target.value)
                                }
                            >
                                <MenuItem value={"ALL"}>All</MenuItem>
                                <MenuItem value={"ARI"}>Arizona</MenuItem>
                                <MenuItem value={"ATL"}>Atlanta</MenuItem>
                                <MenuItem value={"BAL"}>Baltimore</MenuItem>
                                <MenuItem value={"BUF"}>Buffalo</MenuItem>
                                <MenuItem value={"CAR"}>Carolina</MenuItem>
                                <MenuItem value={"CHI"}>Chicago</MenuItem>
                                <MenuItem value={"CIN"}>Cincinnati</MenuItem>
                                <MenuItem value={"CLE"}>Cleveland</MenuItem>
                                <MenuItem value={"DAL"}>Dallas</MenuItem>
                                <MenuItem value={"DEN"}>Denver</MenuItem>
                                <MenuItem value={"DET"}>Detroit</MenuItem>
                                <MenuItem value={"GB"}>Green Bay</MenuItem>
                                <MenuItem value={"HOU"}>Houston</MenuItem>
                                <MenuItem value={"IND"}>Indianapolis</MenuItem>
                                <MenuItem value={"JAC"}>Jacksonville</MenuItem>
                                <MenuItem value={"KC"}>Kansas City</MenuItem>
                                <MenuItem value={"LAC"}>LA Chargers</MenuItem>
                                <MenuItem value={"LAR"}>LA Rams</MenuItem>
                                <MenuItem value={"LV"}>Las Vegas</MenuItem>
                                <MenuItem value={"MIA"}>Miami</MenuItem>
                                <MenuItem value={"MIN"}>Minnesota</MenuItem>
                                <MenuItem value={"NE"}>New England</MenuItem>
                                <MenuItem value={"NO"}>New Orleans</MenuItem>
                                <MenuItem value={"NYG"}>NY Giants</MenuItem>
                                <MenuItem value={"NYJ"}>NY Jets</MenuItem>
                                <MenuItem value={"PHI"}>Philadelphia</MenuItem>
                                <MenuItem value={"PIT"}>Pittsburgh</MenuItem>
                                <MenuItem value={"SEA"}>Seattle</MenuItem>
                                <MenuItem value={"SF"}>San Francisco</MenuItem>
                                <MenuItem value={"TB"}>Tampa Bay</MenuItem>
                                <MenuItem value={"TEN"}>Tennessee</MenuItem>
                                <MenuItem value={"WAS"}>Washington</MenuItem>
                                <MenuItem value={"FA"}>Free Agents</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl
                            required
                            size="small"
                            sx={{ ml: 2, my: 2, minWidth: 85 }}
                        >
                            <InputLabel id="pos-label" color="secondary">
                                Pos.
                            </InputLabel>
                            <Select
                                labelId="pos-label"
                                id="position"
                                name={"position" + props.id}
                                value={position}
                                label="Pos."
                                type="position"
                                color="secondary"
                                onChange={(event) =>
                                    setPosition(event.target.value)
                                }
                            >
                                <MenuItem value={"QB"}>QB</MenuItem>
                                <MenuItem value={"RB"}>RB</MenuItem>
                                <MenuItem value={"WR"}>WR</MenuItem>
                                <MenuItem value={"TE"}>TE</MenuItem>
                                <MenuItem value={"K"}>K</MenuItem>
                                <MenuItem value={"DST"}>DST</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            required
                            margin="dense"
                            id="rank"
                            name={"rank" + props.id}
                            label="Insert At"
                            type="number"
                            size="small"
                            color="secondary"
                            sx={{ mx: 2, my: 2, width: 120 }}
                            InputProps={{
                                inputProps: {
                                    max: current.rankings[
                                        position.toLowerCase()
                                    ].length,
                                    min: 1,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        {props.delete && (
                            <IconButton
                                color="error"
                                sx={{ my: 2 }}
                                onClick={handleUpdate}
                            >
                                <RemoveCircleOutline />
                            </IconButton>
                        )}
                    </Grid>
                </Grid>
            </Card>
        </ListItem>
    );
};

export default PlayerInfo;
