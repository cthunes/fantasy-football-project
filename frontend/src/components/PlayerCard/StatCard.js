import {
    Box,
    Typography,
} from "@mui/material";

function getBackgroundColor(rank, position) {
    if (rank === 0 || rank === undefined) return "hsl(220, 85%, 75%)";
    const worstRank = position === "RB" || position === "WR" ? 60 : 25; 
    const clamped = Math.min(rank, worstRank);
    const percentage = 1 - clamped / worstRank; // higher rank (closer to 1) = greener
    const hue = percentage * 120; // 0 (red) → 120 (green)
    return `hsl(${hue}, 85%, 75%)`; // pastel-style color
}

function formatRank(rank) {
    if (rank === 0 || rank === undefined) return "N/A"
    const j = rank % 10,
        k = rank % 100;
    if (j === 1 && k !== 11) return `${rank}st`;
    if (j === 2 && k !== 12) return `${rank}nd`;
    if (j === 3 && k !== 13) return `${rank}rd`;
    return `${rank}th`;
}

const StatCard = ({ position, data, onRemove }) => {

    return (
        <Box
            sx={{
                aspectRatio: '1 / 1',
                backgroundColor: getBackgroundColor(data.rank, position),
                borderRadius: 1,
                p: 1,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: 'secondary.dark',
                boxShadow: 3,
                maxWidth: 100,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onClick={onRemove}
        >
            <Typography variant="subtitle2" fontWeight="bold">{data.stat}</Typography>
            <Typography variant="body2" fontWeight="bold">{data.value}</Typography>
            <Typography variant="h5" fontWeight="bold">{formatRank(data.rank)}</Typography>
            <Typography variant="caption" fontWeight="bold">{data.par}% A.R.</Typography>
        </Box>
    )
}

export default StatCard;