import React, { useState, useMemo } from "react";

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

const PosRanking = (props) => {
    const [expanded, setExpanded] = useState(false);
    const [ranking, setRanking] = useState(props.ranking);

    const columns = useMemo(
        () => [
            {
                accessorKey: "rank",
                head: "RANK",
                size: 25,
            },
            {
                accessorKey: "name",
                head: "Player",
                size: 125,
            },
            {
                accessorKey: "position",
                head: "POS",
                size: 25,
            },
            {
                accessorKey: "team",
                head: "TEAM",
                size: 25,
            },
        ],
        []
    );

    return (
        <Card
            border={5}
            borderRadius={2}
            sx={{
                borderColor: "secondary.dark",
            }}
        >
            <CardHeader
                title={props.position}
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
                <Collapse in={expanded} timeout={0} unmountOnExit>
                    <CardContent sx={{ p: 0 }}>
                        <MaterialReactTable
                            columns={columns}
                            data={ranking}
                            enableRowOrdering
                            enableRowNumbers
                            enableColumnActions={false}
                            enableColumnFilters={false}
                            enablePagination={false}
                            enableSorting={false}
                            enableBottomToolbar={false}
                            enableTopToolbar={false}
                            initialState={{
                                density: "compact",
                            }}
                            muiTableBodyRowDragHandleProps={({ table }) => ({
                                onDragEnd: () => {
                                    const { draggingRow, hoveredRow } =
                                        table.getState();
                                    let rankingCopy = ranking.map((a) => {
                                        return { ...a };
                                    });
                                    if (hoveredRow && draggingRow) {
                                        rankingCopy.splice(
                                            hoveredRow.index,
                                            0,
                                            rankingCopy.splice(
                                                draggingRow.index,
                                                1
                                            )[0]
                                        );
                                        setRanking([...rankingCopy]);
                                    }
                                },
                            })}
                        />
                    </CardContent>
                </Collapse>
            </Box>
        </Card>
    );
};

export default PosRanking;
