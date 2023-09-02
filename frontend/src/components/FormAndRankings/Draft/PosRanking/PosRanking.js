import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
    Card,
    CardHeader,
    CardContent,
    Collapse,
    IconButton,
    Box,
} from "@mui/material";
import {
    KeyboardArrowUp,
    KeyboardArrowDown,
    Check,
    Close,
} from "@mui/icons-material";
import { MaterialReactTable } from "material-react-table";

import { setDrafted, setUnavailable } from "../../../../redux/ranking";

const PosRanking = (props) => {
    const dispatch = useDispatch();
    const current = useSelector((state) => state.ranking.current);
    const [expanded, setExpanded] = useState(false);
    const drafted = useSelector((state) => state.ranking.drafted);
    const unavailable = useSelector((state) => state.ranking.unavailable);

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

    const dispatchDraft = (row) => {
        dispatch(
            setUnavailable(
                unavailable.filter((rank) => rank !== row.original.rank)
            )
        );
        const newDrafted = drafted.filter((rank) => rank !== row.original.rank);
        if (newDrafted.length !== drafted.length) {
            dispatch(setDrafted(newDrafted));
        } else {
            dispatch(setDrafted([...drafted, row.original.rank]));
        }
    };

    const dispatchUnavailable = (row) => {
        dispatch(
            setDrafted(drafted.filter((rank) => rank !== row.original.rank))
        );
        const newUnavailable = unavailable.filter(
            (rank) => rank !== row.original.rank
        );
        if (newUnavailable.length !== unavailable.length) {
            dispatch(setUnavailable(newUnavailable));
        } else {
            dispatch(setUnavailable([...unavailable, row.original.rank]));
        }
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
                            enableRowActions
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
                                "mrt-row-actions": { header: "Draft", size: 1 },
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
                            muiTableBodyRowProps={({ row }) => ({
                                sx: {
                                    backgroundColor: drafted.includes(
                                        row.original.rank
                                    )
                                        ? "success.light"
                                        : unavailable.includes(
                                              row.original.rank
                                          )
                                        ? "error.light"
                                        : "white",
                                },
                            })}
                            renderRowActions={({ row, table }) => (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "nowrap",
                                    }}
                                >
                                    <IconButton
                                        color="success"
                                        onClick={() => dispatchDraft(row)}
                                    >
                                        <Check />
                                    </IconButton>

                                    <IconButton
                                        color="error"
                                        onClick={() => dispatchUnavailable(row)}
                                    >
                                        <Close />
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
