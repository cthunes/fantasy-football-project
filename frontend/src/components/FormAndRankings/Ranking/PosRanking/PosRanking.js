import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Card,
    CardHeader,
    CardContent,
    Collapse,
    IconButton,
    Box,
} from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { MaterialReactTable } from "material-react-table";

import { setCurrent } from "../../../../redux/ranking";

const PosRanking = (props) => {
    const dispatch = useDispatch();
    const current = useSelector((state) => state.ranking.current);
    const [expanded, setExpanded] = useState(false);

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
                            }}
                            displayColumnDefOptions={{
                                "mrt-row-drag": { size: 1 },
                                "mrt-row-numbers": { size: 1 },
                            }}
                            muiTableContainerProps={
                                props.position === "Overall"
                                    ? {
                                          sx: { maxHeight: "80vh" },
                                      }
                                    : {
                                          sx: { maxHeight: "40vh" },
                                      }
                            }
                            muiTableBodyRowDragHandleProps={reorder}
                        />
                    </CardContent>
                </Collapse>
            </Box>
        </Card>
    );
};

export default PosRanking;
