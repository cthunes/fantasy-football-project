import Player from "../models/Player.js";

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
        return p.save();
    } catch (e) {
        console.log(e.message);
    }
};

export const parseQB = (row, filename) => {
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
    return pushPlayer(player);
};

export const parseRB = (row, filename) => {
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
                injuryCorrectionConstant: numbers[29],
                rushing: {
                    attempts: numbers[2],
                    attemptsMean: numbers[3],
                    yards: numbers[4],
                    yardsMean: numbers[5],
                    yardsPerAttempt: numbers[6],
                    long: numbers[7],
                    longMean: numbers[8],
                    twentyPlus: numbers[9],
                    twentyPlusMean: numbers[10],
                    td: numbers[11],
                    tdMean: numbers[12],
                },
                receiving: {
                    receptions: numbers[13],
                    receptionsMean: numbers[14],
                    targets: numbers[15],
                    targetsMean: numbers[16],
                    yards: numbers[17],
                    yardsMean: numbers[18],
                    yardsPerReception: numbers[19],
                    td: numbers[20],
                    tdMean: numbers[21],
                },
                misc: {
                    touches: numbers[22],
                    touchesMean: numbers[23],
                    opportunities: numbers[24],
                    opportunitiesMean: numbers[25],
                    fumblesLost: numbers[26],
                    fumblesLostMean: numbers[27],
                    fumblesLostPerTouch: numbers[28],
                },
                standard: {
                    points: {
                        sum: numbers[30],
                        mean: numbers[31],
                        median: numbers[32],
                        standardDeviation: numbers[33],
                        adjustedMean: numbers[34],
                    },
                    games: {
                        bad: numbers[35],
                        poor: numbers[36],
                        okay: numbers[37],
                        good: numbers[38],
                        great: numbers[39],
                    },
                    qualityStartRatio: numbers[40],
                    goodStartRatio: numbers[41],
                    score: numbers[42],
                },
                half: {
                    points: {
                        sum: numbers[43],
                        mean: numbers[44],
                        median: numbers[45],
                        standardDeviation: numbers[46],
                        adjustedMean: numbers[47],
                    },
                    games: {
                        bad: numbers[48],
                        poor: numbers[49],
                        okay: numbers[50],
                        good: numbers[51],
                        great: numbers[52],
                    },
                    qualityStartRatio: numbers[53],
                    goodStartRatio: numbers[54],
                    score: numbers[55],
                },
                ppr: {
                    points: {
                        sum: numbers[56],
                        mean: numbers[57],
                        median: numbers[58],
                        standardDeviation: numbers[59],
                        adjustedMean: numbers[60],
                    },
                    games: {
                        bad: numbers[61],
                        poor: numbers[62],
                        okay: numbers[63],
                        good: numbers[64],
                        great: numbers[65],
                    },
                    qualityStartRatio: numbers[66],
                    goodStartRatio: numbers[67],
                    score: numbers[68],
                },
            },
        ],
    };
    if (filename.includes("all.csv")) {
        player.yearsOfExperience = numbers[numbers.length - 1];
    }
    return pushPlayer(player);
};

//WRs and TEs (PC = PassCatcher)
export const parsePC = (row, filename) => {
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
                injuryCorrectionConstant: numbers[29],
                rushing: {
                    attempts: numbers[15],
                    attemptsMean: numbers[16],
                    yards: numbers[17],
                    yardsMean: numbers[18],
                    yardsPerAttempt: numbers[19],
                    td: numbers[20],
                    tdMean: numbers[21],
                },
                receiving: {
                    receptions: numbers[2],
                    receptionsMean: numbers[3],
                    targets: numbers[4],
                    targetsMean: numbers[5],
                    yards: numbers[6],
                    yardsMean: numbers[7],
                    yardsPerReception: numbers[8],
                    long: numbers[9],
                    longMean: numbers[10],
                    twentyPlus: numbers[11],
                    twentyPlusMean: numbers[12],
                    td: numbers[13],
                    tdMean: numbers[14],
                },
                misc: {
                    touches: numbers[22],
                    touchesMean: numbers[23],
                    opportunities: numbers[24],
                    opportunitiesMean: numbers[25],
                    fumblesLost: numbers[26],
                    fumblesLostMean: numbers[27],
                    fumblesLostPerTouch: numbers[28],
                },
                standard: {
                    points: {
                        sum: numbers[30],
                        mean: numbers[31],
                        median: numbers[32],
                        standardDeviation: numbers[33],
                        adjustedMean: numbers[34],
                    },
                    games: {
                        bad: numbers[35],
                        poor: numbers[36],
                        okay: numbers[37],
                        good: numbers[38],
                        great: numbers[39],
                    },
                    qualityStartRatio: numbers[40],
                    goodStartRatio: numbers[41],
                    score: numbers[42],
                },
                half: {
                    points: {
                        sum: numbers[43],
                        mean: numbers[44],
                        median: numbers[45],
                        standardDeviation: numbers[46],
                        adjustedMean: numbers[47],
                    },
                    games: {
                        bad: numbers[48],
                        poor: numbers[49],
                        okay: numbers[50],
                        good: numbers[51],
                        great: numbers[52],
                    },
                    qualityStartRatio: numbers[53],
                    goodStartRatio: numbers[54],
                    score: numbers[55],
                },
                ppr: {
                    points: {
                        sum: numbers[56],
                        mean: numbers[57],
                        median: numbers[58],
                        standardDeviation: numbers[59],
                        adjustedMean: numbers[60],
                    },
                    games: {
                        bad: numbers[61],
                        poor: numbers[62],
                        okay: numbers[63],
                        good: numbers[64],
                        great: numbers[65],
                    },
                    qualityStartRatio: numbers[66],
                    goodStartRatio: numbers[67],
                    score: numbers[68],
                },
            },
        ],
    };
    if (filename.includes("all.csv")) {
        player.yearsOfExperience = numbers[numbers.length - 1];
    }
    return pushPlayer(player);
};
