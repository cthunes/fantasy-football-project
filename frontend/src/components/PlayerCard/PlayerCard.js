import { useState, useMemo } from "react";
import { useSelector } from "react-redux";

import {
    Box,
    Typography,
    Modal,
    Grid,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";

import StatCard from "./StatCard";
import BlankCard from "./BlankCard";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    maxWidth: 1000,
    outline: 'none',
    bgcolor: 'background.paper',
    border: '3px solid',
    borderColor: 'secondary.dark',
    borderRadius: 3,
    boxShadow: 24,
    p: 3,
};

const positionMap = {
    QB: "Quarterback",
    RB: "Running Back",
    WR: "Wide Receiver",
    TE: "Tight End",
    K: "Kicker",
    DST: "Defense/Special Teams"
}

const teamMap = {
    ARI: "Arizona Cardinals",
    ATL: "Atlanta Falcons",
    BAL: "Baltimore Ravens",
    BUF: "Buffalo Bills",
    CAR: "Carolina Panthers",
    CHI: "Chicago Bears",
    CIN: "Cincinnati Bengals",
    CLE: "Cleveland Browns",
    DAL: "Dallas Cowboys",
    DEN: "Denver Broncos",
    DET: "Detroit Lions",
    GB: "Green Bay Packers",
    HOU: "Houston Texans",
    IND: "Indianapolis Colts",
    JAC: "Jacksonville Jaguars",
    KC: "Kansas City Chiefs",
    LAC: "Los Angeles Chargers",
    LAR: "Los Angeles Rams",
    LV: "Las Vegas Raiders",
    MIA: "Miami Dolphins",
    MIN: "Minnesota Vikings",
    NE: "New England Patriots",
    NO: "New Orleans Saints",
    NYG: "New York Giants",
    NYJ: "New York Jets",
    PHI: "Philadelphia Eagles",
    PIT: "Pittsburgh Steelers",
    SEA: "Seattle Seahawks",
    SF: "San Francisco 49ers",
    TB: "Tampa Bay Buccaneers",
    TEN: "Tennessee Titans",
    WAS: "Washington Commanders",
    FA: "Free Agent"
};

const baseStatsByPosition = {
    QB: [
        'passing.yardsPerAttempt', 'passing.td', 'rushing.yards', 'rushing.yardsMean', 'rushing.attempts',
        'rushing.attemptsMean', 'rushing.firstDowns', 'rushing.td', '{pointsType}.points.mean',
        '{pointsType}.games.great', '{pointsType}.goodStartRatio', '{pointsType}.qualityStartRatio',
    ],
    RB: [
        'rushing.yardsMean', 'rushing.tdMean', 'receiving.yards', 'receiving.yardsMean', 'receiving.receptionsMean',
        'receiving.targetsMean', 'misc.opportunitiesMean', 'misc.firstDownsMean', '{pointsType}.points.mean',
        '{pointsType}.games.great', '{pointsType}.goodStartRatio', '{pointsType}.qualityStartRatio',
    ],
    WR: [
        'receiving.yards', 'receiving.yardsMean', 'receiving.tdMean', 'receiving.receptionsMean', 'receiving.targetsMean',
        'receiving.firstDownsMean', 'misc.touchesMean', 'misc.firstDownsMean', '{pointsType}.points.mean',
        '{pointsType}.games.great', '{pointsType}.goodStartRatio', '{pointsType}.qualityStartRatio',
    ],
    TE: [
        'receiving.yards', 'receiving.yardsMean', 'receiving.tdMean', 'receiving.receptionsMean', 'receiving.twentyPlus',
        'misc.touchesMean', 'misc.firstDownsMean', '{pointsType}.points.standardDeviation', '{pointsType}.points.mean',
        '{pointsType}.games.great', '{pointsType}.goodStartRatio', '{pointsType}.qualityStartRatio',
    ],
    K: [
        'kicking.fieldGoals.percentage', 'kicking.fieldGoals.sum', 'kicking.fieldGoals.sum40_49', 'kicking.fieldGoals.sum50Plus',
        'kicking.extraPoints.percentage', 'kicking.extraPoints.sum', 'kicking.extraPoints.attempts', 'misc.opportunities',
        '{pointsType}.points.adjustedMean', '{pointsType}.games.great', '{pointsType}.goodStartRatio', '{pointsType}.qualityStartRatio',
    ],
    DST: [
        'dst.defense.sacks', 'dst.defense.interceptions', 'dst.defense.fumblesRecovered', 'dst.defense.forcedFumbles',
        'dst.defense.td', 'dst.defense.safeties', 'dst.specialTeams.td', '{pointsType}.points.standardDeviation',
        '{pointsType}.points.mean', '{pointsType}.games.great', '{pointsType}.goodStartRatio', '{pointsType}.qualityStartRatio',
    ],
};

function getStatData(playerStats, statKey) {
    const keys = statKey.split('.');
    const value = keys.reduce((obj, key) => obj?.[key], playerStats);
    const rank = keys.reduce((obj, key, i) => obj?.[i === keys.length - 1 ? `${key}Rank` : key], playerStats);
    const par = keys.reduce((obj, key, i) => obj?.[i === keys.length - 1 ? `${key}PAR` : key], playerStats);
    return { value, rank, par };
}

const suffixMap = {
    attempts: "ATT",
    yards: "Yds",
    firstDowns: "FD",
    long: "Long",
    twentyPlus: "20+",
    td: "TD",
    receptions: "Catches",
    completions: "COMP",
    percentage: "%",
    interceptions: "INT",
    opportunities: "OPP",
    sum: "",
    sum10_19: "10-19",
    sum20_29: "20-29",
    sum30_39: "30-39",
    sum40_49: "40-49",
    sum50Plus: "50+",
    mean10_19: "10-19 / G",
    mean20_29: "20-29 / G",
    mean30_39: "30-39 / G",
    mean40_49: "40-49 / G",
    mean50Plus: "50+ / G",
    fumblesRecovered: "FR",
    forcedFumbles: "FF",
    safeties: "SFTY",
    standardDeviation: "StdDev",
    adjusted: "Adj.",
    bad: "Bad Games",
    poor: "Poor Games",
    okay: "Okay Games",
    good: "Good Games",
    great: "Great Games"
}

export function formatStatLabel(stat, threeLevels = ["kicking", "dst", "standard", "half", "ppr"]) {
    const parts = stat.split('.');
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase() + parts[0].slice(1, 15);
    }
    let base = parts.at(0);
    let tail = parts.at(-1);
    let mean = false;
    if (tail.endsWith("Mean") || tail.endsWith("mean")) {
        tail = tail.replace("Mean", "");
        tail = tail.replace("mean", "");
        mean = true;
    }
    if (threeLevels.includes(base)) {
        base = parts.at(1);
    }
    let label = "";
    const repeatingTails = ["yards", "yardsPerAttempt", "td", "attempts", "long", "twentyPlus",
        "firstDowns", "percentage", "sacks", "interceptions", "sum", "",
        "median", "standardDeviation", "adjusted", "bad", "poor", "okay",
        "good", "great", "qualityStartRatio", "goodStartRatio", "score"];
    if (repeatingTails.includes(tail)) {
        switch (base) {
            case 'passing': label = "Pass"; break;
            case 'rushing': label = "Rush"; break;
            case 'receiving': label = "Rec"; break;
            case 'fieldGoals': label = "FG"; break;
            case 'extraPoints': label = "XP"; break;
            case 'defense': label = "Def"; break;
            case 'specialTeams': label = "ST"; break;
            case 'misc': label = ""; break;
            case 'points': label = "FP"; break;
            case 'games': label = ""; break;
            case 'qualityStartRatio': label = "QSR"; break;
            case 'goodStartRatio': label = "GSR"; break;
            case 'projected': label = "Proj"; break;
            default: label = base.charAt(0).toUpperCase() + base.slice(1); break;
        }
    }
    if (base === tail) return label;
    const perMap = {
        PerAttempt: " / ATT",
        PerReception: " / Catch",
        PerTouch: " / Touch"
    };
    let suffix = "";
    const perMatch = Object.keys(perMap).find(key => tail.endsWith(key));
    if (perMatch) {
        suffix = perMap[perMatch];
        tail = tail.replace(/Per\w+/, "");
    } else if (mean) {
        suffix = " / G";
    }
    const suffMatch = Object.keys(suffixMap).find(key => tail === key);
    label += (label ? " " : "") + (suffMatch ? suffixMap[suffMatch] : tail.charAt(0).toUpperCase() + tail.slice(1, 12)) + suffix;
    return label;
}

function splitTeamName(fullName) {
    if (fullName === "Free Agents") {
        return { city: "Free", mascot: "Agents" };
    }
    const parts = fullName.split(" ");
    const mascot = parts.pop();
    const city = parts.join(" ");
    return { city, mascot };
}

function TeamLabel({ teamAbbr }) {
    const fullName = teamMap[teamAbbr];
    const { city, mascot } = splitTeamName(fullName);

    return (
        <Typography variant="button">
            {city + " "}
            <Box component="span" sx={{ fontWeight: "bold" }}>
                {mascot}
            </Box>
        </Typography>
    );
}

const PlayerCard = (props) => {
    const [year, setYear] = useState(useSelector((state) => state.year.year));
    const [pointsType, setPointsType] = useState(useSelector((state) => state.pointsType.pointsType));
    const [cards, setCards] = useState(baseStatsByPosition[props.player.position]);

    const currentStats = useMemo(() => {
        return props.player.stats.find((s) => s.season === year);
    }, [props.player.stats, year]);

    const handleAdd = (index, statKey) => {
        const updated = [...cards];
        updated[index] = statKey;
        setCards(updated);
    };

    const handleRemove = (index) => {
        const updated = [...cards];
        updated[index] = null;
        setCards(updated);
    };

    if (!props.isOpen) return null;

    return (
        <div>
            <Modal
                open={props.isOpen}
                onClose={props.onClose}
            >
                <Box sx={style}>
                    <Grid container justify="space-between" alignItems="stretch" spacing={2}>
                        <Grid item xs={6} display="flex" flexDirection="column" justifyContent="left">
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                {props.player.name}
                            </Typography>
                            <Box>
                                <Typography variant="button" sx={{ fontWeight: 'bold' }}>
                                    {positionMap[props.player.position] + " | "}
                                </Typography>
                                <TeamLabel teamAbbr={props.player.team} />
                            </Box>
                        </Grid>
                        <Grid item xs={6} display="flex" justifyContent="right">
                            <FormControl sx={{ my: 1, mr: 1, minWidth: 80 }}>
                                <InputLabel id="type-label" color="secondary">
                                    Scoring
                                </InputLabel>
                                <Select
                                    labelId="type-label"
                                    id="type-select"
                                    value={pointsType}
                                    label="Scoring"
                                    size="small"
                                    color="secondary"
                                    onChange={(event) =>
                                        setPointsType(event.target.value)
                                    }
                                >
                                    <MenuItem value={"standard"}>
                                        Standard
                                    </MenuItem>
                                    <MenuItem value={"half"}>Half-PPR</MenuItem>
                                    <MenuItem value={"ppr"}>PPR</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ my: 1, mr: 1, minWidth: 120 }}>
                                <InputLabel id="year-label" color="secondary">
                                    Year
                                </InputLabel>
                                <Select
                                    labelId="year-label"
                                    id="year-select"
                                    value={year}
                                    label="Year"
                                    size="small"
                                    color="secondary"
                                    onChange={(event) =>
                                        setYear(event.target.value)
                                    }
                                >
                                    <MenuItem value={"Weighted Average"}>
                                        Weighted Average
                                    </MenuItem>
                                    <MenuItem value={"2024"}>2024</MenuItem>
                                    <MenuItem value={"2023"}>2023</MenuItem>
                                    <MenuItem value={"2022"}>2022</MenuItem>
                                    <MenuItem value={"2021"}>2021</MenuItem>
                                    <MenuItem value={"2020"}>2020</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Box sx={{ maxWidth: 750, mx: 'auto', py: 2 }}>
                        <Grid container spacing={2}>
                            {cards.map((card, index) => (
                                <Grid item xs={4} sm={3} md={2} lg={2} key={index}>
                                    {card ? (
                                        <StatCard
                                            position={props.player.position}
                                            data={{
                                                stat: formatStatLabel(card.replace('{pointsType}', pointsType)),
                                                ...getStatData(currentStats, card.replace('{pointsType}', pointsType))
                                            }}
                                            onRemove={() => handleRemove(index)}
                                        />
                                    ) : (
                                        <BlankCard
                                            stats={currentStats}
                                            cards={cards}
                                            onAdd={(statKey) => handleAdd(index, statKey)}
                                        />
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default PlayerCard;
