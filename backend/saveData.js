import fs from "fs";
import { parse } from "csv-parse";

import Player from "./models/Player.js";

const currentYear = 2023;
const positions = ["qb"];

const pushPlayer = async (player) => {
    try {
        var p = await Player.findOne({
            name: player.name,
            position: player.position,
        });
        if (p) {
            p.team = player.team;
            if (
                !p.stats.some((stat) => stat.season === player.stats[0].season)
            ) {
                p.stats.push(player.stats[0]);
            }
            if (player.yearsOfExperience) {
                p.yearsOfExperience = player.yearsOfExperience;
            }
        } else {
            p = new Player(player);
        }
        await p.save();
    } catch (e) {
        console.log(e.message);
    }
};

const parseQB = (row, filename) => {
    const info = row.slice(0, 3);
    const numbers = row.slice(3).map(Number);
    var season = "4 year weighted average";
    const year = /\d+/.exec(filename);
    if (year) season = year[0];
    const player = {
        name: info[0],
        team: info[1],
        position: info[2],
        stats: [
            {
                season: season,
                depthChart: numbers[0],
                games: numbers[1],
                injuryCorrectionConstant: numbers[27],
                rushing: {
                    attempts: numbers[16],
                    attemptsMean: numbers[17],
                    yards: numbers[18],
                    yardsMean: numbers[19],
                    yardsPerAttempt: numbers[20],
                    td: numbers[21],
                    tdMean: numbers[22],
                },
                passing: {
                    completions: numbers[2],
                    completionsMean: numbers[3],
                    attempts: numbers[4],
                    attemptsMean: numbers[5],
                    percentage: numbers[6],
                    yards: numbers[7],
                    yardsMean: numbers[8],
                    yardsPerAttempt: numbers[9],
                    td: numbers[10],
                    tdMean: numbers[11],
                    interceptions: numbers[12],
                    interceptionsMean: numbers[13],
                    sacks: numbers[14],
                    sacksMean: numbers[15],
                },
                misc: {
                    opportunities: numbers[25],
                    opportunitiesMean: numbers[26],
                    fumblesLost: numbers[23],
                    fumblesLostMean: numbers[24],
                },
                standard: {
                    points: {
                        sum: numbers[28],
                        mean: numbers[29],
                        median: numbers[30],
                        standardDeviation: numbers[31],
                        adjustedMean: numbers[32],
                    },
                    games: {
                        bad: numbers[33],
                        poor: numbers[34],
                        okay: numbers[35],
                        good: numbers[36],
                        great: numbers[37],
                    },
                    qualityStartRatio: numbers[38],
                    goodStartRatio: numbers[39],
                    score: numbers[40],
                },
                half: {
                    points: {
                        sum: numbers[41],
                        mean: numbers[42],
                        median: numbers[43],
                        standardDeviation: numbers[44],
                        adjustedMean: numbers[45],
                    },
                    games: {
                        bad: numbers[46],
                        poor: numbers[47],
                        okay: numbers[48],
                        good: numbers[49],
                        great: numbers[50],
                    },
                    qualityStartRatio: numbers[51],
                    goodStartRatio: numbers[52],
                    score: numbers[53],
                },
                ppr: {
                    points: {
                        sum: numbers[54],
                        mean: numbers[55],
                        median: numbers[56],
                        standardDeviation: numbers[57],
                        adjustedMean: numbers[58],
                    },
                    games: {
                        bad: numbers[59],
                        poor: numbers[60],
                        okay: numbers[61],
                        good: numbers[62],
                        great: numbers[63],
                    },
                    qualityStartRatio: numbers[64],
                    goodStartRatio: numbers[65],
                    score: numbers[66],
                },
            },
        ],
    };
    if (filename.includes("all.csv")) {
        player.yearsOfExperience = numbers[numbers.length - 1];
    }
    pushPlayer(player);
};

const parseCSV = (filename) => {
    const data = [];
    fs.createReadStream(filename)
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("error", (error) => console.error(error))
        .on("data", (row) => {
            if (filename.includes("qb")) {
                parseQB(row, filename);
            }
        })
        .on("end", () => console.log("done"));
};

const saveFootballData = async () => {
    for (const pos of positions) {
        parseCSV(`../football-data/aggregated/${pos}/all.csv`);
        for (const yearsAgo of [1, 2, 3, 4]) {
            const year = currentYear - yearsAgo;
            parseCSV(`../football-data/aggregated/${pos}/${year}.csv`);
        }
    }
};

export default saveFootballData;
