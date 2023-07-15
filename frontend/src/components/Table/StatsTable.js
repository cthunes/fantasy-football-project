import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { playerFetchAll } from "../../redux/player";

const StatsTable = () => {
    const players = useSelector((state) => state.player.players);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(playerFetchAll());
    }, [dispatch]);

    return (
        <TableContainer component={Paper}>
            <Table
                sx={{ minWidth: 650 }}
                size="small"
                aria-label="a dense table"
            >
                <TableHead>
                    <TableRow>
                        <TableCell>NAME</TableCell>
                        <TableCell align="center">POS</TableCell>
                        <TableCell align="center">TEAM</TableCell>
                        <TableCell align="right">YOE</TableCell>
                        <TableCell align="right">SEASON</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {players
                        .filter((player) => player.stats.length > 1)
                        .map((player) => (
                            <TableRow
                                key={player.name
                                    .concat(player.team)
                                    .concat(player.position)}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {player.name}
                                </TableCell>
                                <TableCell align="center">
                                    {player.position}
                                </TableCell>
                                <TableCell align="center">
                                    {player.team}
                                </TableCell>
                                <TableCell align="right">
                                    {player.yearsOfExperience}
                                </TableCell>
                                <TableCell align="right">
                                    {player.stats[1].season}
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default StatsTable;
