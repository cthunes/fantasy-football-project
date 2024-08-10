import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Card,
    CardHeader,
    CardActionArea,
    CardContent,
    Collapse,
    IconButton,
    Box,
    ButtonGroup,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    List,
    ListItem,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";
import {
    KeyboardArrowUp,
    KeyboardArrowDown,
    Delete,
    GroupAdd,
} from "@mui/icons-material";
import { MaterialReactTable } from "material-react-table";

import { setCurrent, setNewPlayerCount } from "../../../../redux/ranking";

import PlayerInfo from "./PlayerInfo/PlayerInfo";

const PosRanking = (props) => {
    const dispatch = useDispatch();
    const current = useSelector((state) => state.ranking.current);
    const newPlayerCount = useSelector((state) => state.ranking.newPlayerCount);
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);

    const columns = useMemo(
        () => [
            {
                accessorKey: "rank",
                head: "RANK",
                size: 1,
            },
            {
                accessorKey: "name",
                head: "Player",
                size: 170,
            },
            {
                accessorKey: "position",
                head: "POS",
                size: 1,
            },
            {
                accessorKey: "team",
                head: "TEAM",
                size: 1,
            },
        ],
        []
    );

    const reorder = ({ table }) => ({
        onDragEnd: () => {
            const { draggingRow, hoveredRow } = table.getState();
            let rankingCopy = current.rankings[props.accessorKey].map((a) => {
                return { ...a };
            });
            let overallCopy = current.rankings["overall"].map((a) => {
                return { ...a };
            });
            if (hoveredRow && draggingRow) {
                const draggingRowPos =
                    draggingRow.original.position.toLowerCase();
                const hoveredRowPos =
                    hoveredRow.original.position.toLowerCase();
                let dragAndHoverRowRankingCopy = current.rankings[
                    draggingRowPos
                ].map((a) => {
                    return { ...a };
                });
                if (props.accessorKey === "overall") {
                    let indices = [hoveredRow.index, draggingRow.index].sort();
                    if (
                        rankingCopy
                            .slice(indices[0] + 1, indices[1])
                            .filter(
                                (player) =>
                                    player.position ===
                                    draggingRow.original.position
                            ).length > 0
                    ) {
                        return; // if there is a player of the same position in between the drag and hover, exit without changes
                    }
                    rankingCopy.splice(
                        hoveredRow.index,
                        0,
                        rankingCopy.splice(draggingRow.index, 1)[0]
                    );
                    if (draggingRowPos === hoveredRowPos) {
                        dragAndHoverRowRankingCopy.splice(
                            dragAndHoverRowRankingCopy.findIndex(
                                (item) => item.rank === hoveredRow.original.rank
                            ),
                            0,
                            dragAndHoverRowRankingCopy.splice(
                                dragAndHoverRowRankingCopy.findIndex(
                                    (item) =>
                                        item.rank === draggingRow.original.rank
                                ),
                                1
                            )[0]
                        );
                    }
                } else {
                    rankingCopy.splice(
                        hoveredRow.index,
                        0,
                        rankingCopy.splice(draggingRow.index, 1)[0]
                    );
                    overallCopy.splice(
                        overallCopy.findIndex(
                            (item) => item.rank === hoveredRow.original.rank
                        ),
                        0,
                        overallCopy.splice(
                            overallCopy.findIndex(
                                (item) =>
                                    item.rank === draggingRow.original.rank
                            ),
                            1
                        )[0]
                    );
                }
                dispatch(
                    setCurrent({
                        ...current,
                        rankings: {
                            ...current.rankings,
                            overall: overallCopy,
                            [props.accessorKey]: rankingCopy,
                            [draggingRowPos]:
                                props.accessorKey === draggingRowPos
                                    ? rankingCopy
                                    : dragAndHoverRowRankingCopy,
                        },
                    })
                );
            }
        },
    });

    const insertPlayers = (event) => {
        event.preventDefault();
        const entries = Object.fromEntries(
            new FormData(event.currentTarget).entries()
        );
        const newPlayers = [];
        for (const key in entries) {
            const match = key.match(/(\D+)(\d+)/);
            if (match) {
                if (!newPlayers[match[2]]) {
                    newPlayers[match[2]] = {};
                }
                newPlayers[match[2]][match[1]] = entries[key];
            }
        }
        let rankings = structuredClone(current.rankings);
        newPlayers.forEach((player) => {
            const pos = player.position.toLowerCase();
            const posRank = player.rank;
            console.log(posRank);
            player.rank = rankings[pos][posRank - 1].rank;
            console.log(player.rank);
            rankings[pos].splice(posRank - 1, 0, player);
            rankings.overall.splice(
                rankings.overall.findIndex((item) => item.rank === player.rank),
                0,
                player
            );
        });
        dispatch(
            setCurrent({
                ...current,
                rankings: rankings,
            })
        );
        handleClose();
    };

    const deletePlayer = (row) => {
        const pos = row.original.position.toLowerCase();
        dispatch(
            setCurrent({
                ...current,
                rankings: {
                    ...current.rankings,
                    overall: current.rankings.overall.filter(
                        (player) => player.name !== row.original.name
                    ),
                    [pos]: current.rankings[pos].filter(
                        (player) => player.name !== row.original.name
                    ),
                },
            })
        );
    };

    const handleClose = () => {
        setOpen(false);
        dispatch(setNewPlayerCount(0));
    };

    return (
        <Card
            border={5}
            borderRadius={2}
            sx={{ mb: 1, borderColor: "secondary.dark" }}
        >
            <CardHeader
                title={props.position}
                titleTypographyProps={{ color: "white", fontSize: 16 }}
                action={
                    <ButtonGroup>
                        <IconButton
                            size="small"
                            variant="outlined"
                            color="neutral"
                            onClick={() => {
                                setOpen(true);
                            }}
                        >
                            <GroupAdd
                                sx={{
                                    color: "white",
                                    ":hover": {
                                        color: "success.light",
                                    },
                                }}
                            />
                        </IconButton>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            maxWidth="md"
                            PaperProps={{
                                component: "form",
                                onSubmit: insertPlayers,
                            }}
                        >
                            <DialogTitle>Add Players</DialogTitle>
                            <Divider />
                            <DialogContent>
                                <DialogContentText>
                                    To add more players to this ranking, fill
                                    out the required fields. The 'Insert At'
                                    field adds the player to this spot among
                                    their position group.
                                </DialogContentText>
                                <List>
                                    <PlayerInfo
                                        pos={props.accessorKey}
                                        id={0}
                                    />
                                    {Array.from(
                                        { length: newPlayerCount },
                                        (_, index) => (
                                            <PlayerInfo
                                                delete
                                                pos={props.accessorKey}
                                                id={index + 1}
                                            />
                                        )
                                    )}
                                    <ListItem>
                                        <Card
                                            sx={{
                                                my: 1,
                                                width: "100%",
                                                margin: "auto",
                                            }}
                                            align="center"
                                        >
                                            <CardActionArea
                                                onClick={() =>
                                                    dispatch(
                                                        setNewPlayerCount(
                                                            newPlayerCount + 1
                                                        )
                                                    )
                                                }
                                            >
                                                <CardContent>
                                                    <Typography>
                                                        Add Another Player
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </ListItem>
                                </List>
                            </DialogContent>
                            <DialogActions>
                                <Button color="secondary" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button color="secondary" type="submit">
                                    Add Players
                                </Button>
                            </DialogActions>
                        </Dialog>
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
                    </ButtonGroup>
                }
                sx={{ py: 1, backgroundColor: "secondary.main" }}
            ></CardHeader>
            <Box sx={{ backgroundColor: "secondary.light" }}>
                <Collapse in={expanded} timeout={0} unmountOnExit>
                    <CardContent
                        sx={{
                            p: 0,
                            pb: 0,
                            "&:last-child": {
                                paddingBottom: 0,
                            },
                        }}
                    >
                        <MaterialReactTable
                            columns={columns}
                            data={current.rankings[props.accessorKey]}
                            enableRowActions
                            enableRowOrdering
                            enableRowNumbers={
                                props.position === "Overall" ? false : true
                            }
                            enableColumnActions={false}
                            enableColumnFilters={false}
                            enablePagination={false}
                            enableSorting={false}
                            enableBottomToolbar={false}
                            enableTopToolbar={false}
                            initialState={{
                                density: "compact",
                                columnOrder: [
                                    "mrt-row-drag",
                                    props.position !== "Overall" &&
                                        "mrt-row-numbers",
                                    "rank",
                                    "name",
                                    "position",
                                    "team",
                                    "mrt-row-actions",
                                ],
                            }}
                            displayColumnDefOptions={{
                                "mrt-row-drag": {
                                    header: "",
                                    size: 1,
                                },
                                "mrt-row-numbers": { size: 1 },
                                "mrt-row-actions": {
                                    header: "",
                                    size: 1,
                                },
                            }}
                            muiTableContainerProps={
                                props.position === "Overall"
                                    ? {
                                          sx: { maxHeight: "118vh" },
                                      }
                                    : {
                                          sx: { maxHeight: "46vh" },
                                      }
                            }
                            muiTableBodyRowDragHandleProps={reorder}
                            renderRowActions={({ row, table }) => (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "nowrap",
                                    }}
                                >
                                    <IconButton
                                        color="secondary"
                                        onClick={() => deletePlayer(row)}
                                        sx={{
                                            ":hover": {
                                                color: "error.main",
                                            },
                                        }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Box>
                            )}
                        />
                    </CardContent>
                </Collapse>
            </Box>
        </Card>
    );
};

export default PosRanking;
