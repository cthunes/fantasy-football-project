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
            } else {
                p.stats = p.stats.map((s) =>
                    s.season !== player.stats[0].season ? s : player.stats[0]
                );
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
    var season = "Weighted Average";
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
                injuryCorrectionConstant: numbers[31],
                rushing: {
                    attempts: numbers[16],
                    attemptsMean: numbers[17],
                    yards: numbers[18],
                    yardsMean: numbers[19],
                    yardsPerAttempt: numbers[20],
                    firstDowns: numbers[21],
                    firstDownsMean: numbers[22],
                    td: numbers[23],
                    tdMean: numbers[24],
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
                    opportunities: numbers[27],
                    opportunitiesMean: numbers[28],
                    firstDowns: numbers[29],
                    firstDownsMean: numbers[30],
                    fumblesLost: numbers[25],
                    fumblesLostMean: numbers[26],
                },
                standard: {
                    points: {
                        sum: numbers[32],
                        mean: numbers[33],
                        median: numbers[34],
                        standardDeviation: numbers[35],
                        adjustedMean: numbers[36],
                    },
                    games: {
                        bad: numbers[37],
                        poor: numbers[38],
                        okay: numbers[39],
                        good: numbers[40],
                        great: numbers[41],
                    },
                    qualityStartRatio: numbers[42],
                    goodStartRatio: numbers[43],
                    score: numbers[44],
                },
                half: {
                    points: {
                        sum: numbers[45],
                        mean: numbers[46],
                        median: numbers[47],
                        standardDeviation: numbers[48],
                        adjustedMean: numbers[49],
                    },
                    games: {
                        bad: numbers[50],
                        poor: numbers[51],
                        okay: numbers[52],
                        good: numbers[53],
                        great: numbers[54],
                    },
                    qualityStartRatio: numbers[55],
                    goodStartRatio: numbers[56],
                    score: numbers[57],
                },
                ppr: {
                    points: {
                        sum: numbers[58],
                        mean: numbers[59],
                        median: numbers[60],
                        standardDeviation: numbers[61],
                        adjustedMean: numbers[62],
                    },
                    games: {
                        bad: numbers[63],
                        poor: numbers[64],
                        okay: numbers[65],
                        good: numbers[66],
                        great: numbers[67],
                    },
                    qualityStartRatio: numbers[68],
                    goodStartRatio: numbers[69],
                    score: numbers[70],
                },
            },
        ],
    };
    if (filename.includes("all.csv")) {
        player.yearsOfExperience = numbers[numbers.length - 4];
        player.stats[0].half.projected = {
            mean: numbers[numbers.length - 3],
            sum: numbers[numbers.length - 2],
            rank: numbers[numbers.length - 1],
        };
    }
    return pushPlayer(player);
};

export const parseRB = (row, filename) => {
    const info = row.slice(0, 3);
    const numbers = row.slice(3).map(Number);
    var season = "Weighted Average";
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
                injuryCorrectionConstant: numbers[35],
                rushing: {
                    attempts: numbers[2],
                    attemptsMean: numbers[3],
                    yards: numbers[4],
                    yardsMean: numbers[5],
                    yardsPerAttempt: numbers[6],
                    firstDowns: numbers[7],
                    firstDownsMean: numbers[8],
                    long: numbers[9],
                    longMean: numbers[10],
                    twentyPlus: numbers[11],
                    twentyPlusMean: numbers[12],
                    td: numbers[13],
                    tdMean: numbers[14],
                },
                receiving: {
                    receptions: numbers[15],
                    receptionsMean: numbers[16],
                    targets: numbers[17],
                    targetsMean: numbers[18],
                    yards: numbers[19],
                    yardsMean: numbers[20],
                    yardsPerReception: numbers[21],
                    firstDowns: numbers[22],
                    firstDownsMean: numbers[23],
                    td: numbers[24],
                    tdMean: numbers[25],
                },
                misc: {
                    touches: numbers[26],
                    touchesMean: numbers[27],
                    opportunities: numbers[28],
                    opportunitiesMean: numbers[29],
                    firstDowns: numbers[30],
                    firstDownsMean: numbers[31],
                    fumblesLost: numbers[32],
                    fumblesLostMean: numbers[33],
                    fumblesLostPerTouch: numbers[34],
                },
                standard: {
                    points: {
                        sum: numbers[36],
                        mean: numbers[37],
                        median: numbers[38],
                        standardDeviation: numbers[39],
                        adjustedMean: numbers[40],
                    },
                    games: {
                        bad: numbers[41],
                        poor: numbers[42],
                        okay: numbers[43],
                        good: numbers[44],
                        great: numbers[45],
                    },
                    qualityStartRatio: numbers[46],
                    goodStartRatio: numbers[47],
                    score: numbers[48],
                },
                half: {
                    points: {
                        sum: numbers[49],
                        mean: numbers[50],
                        median: numbers[51],
                        standardDeviation: numbers[52],
                        adjustedMean: numbers[53],
                    },
                    games: {
                        bad: numbers[54],
                        poor: numbers[55],
                        okay: numbers[56],
                        good: numbers[57],
                        great: numbers[58],
                    },
                    qualityStartRatio: numbers[59],
                    goodStartRatio: numbers[60],
                    score: numbers[61],
                },
                ppr: {
                    points: {
                        sum: numbers[62],
                        mean: numbers[63],
                        median: numbers[64],
                        standardDeviation: numbers[65],
                        adjustedMean: numbers[66],
                    },
                    games: {
                        bad: numbers[67],
                        poor: numbers[68],
                        okay: numbers[69],
                        good: numbers[70],
                        great: numbers[71],
                    },
                    qualityStartRatio: numbers[72],
                    goodStartRatio: numbers[73],
                    score: numbers[74],
                },
            },
        ],
    };
    if (filename.includes("all.csv")) {
        player.yearsOfExperience = numbers[numbers.length - 4];
        player.stats[0].half.projected = {
            mean: numbers[numbers.length - 3],
            sum: numbers[numbers.length - 2],
            rank: numbers[numbers.length - 1],
        };
    }
    return pushPlayer(player);
};

//WRs and TEs (PC = PassCatcher)
export const parsePC = (row, filename) => {
    const info = row.slice(0, 3);
    const numbers = row.slice(3).map(Number);
    var season = "Weighted Average";
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
                injuryCorrectionConstant: numbers[35],
                rushing: {
                    attempts: numbers[17],
                    attemptsMean: numbers[18],
                    yards: numbers[19],
                    yardsMean: numbers[20],
                    yardsPerAttempt: numbers[21],
                    firstDowns: numbers[22],
                    firstDownsMean: numbers[23],
                    td: numbers[24],
                    tdMean: numbers[25],
                },
                receiving: {
                    receptions: numbers[2],
                    receptionsMean: numbers[3],
                    targets: numbers[4],
                    targetsMean: numbers[5],
                    yards: numbers[6],
                    yardsMean: numbers[7],
                    yardsPerReception: numbers[8],
                    firstDowns: numbers[9],
                    firstDownsMean: numbers[10],
                    long: numbers[11],
                    longMean: numbers[12],
                    twentyPlus: numbers[13],
                    twentyPlusMean: numbers[14],
                    td: numbers[15],
                    tdMean: numbers[16],
                },
                misc: {
                    touches: numbers[26],
                    touchesMean: numbers[27],
                    opportunities: numbers[28],
                    opportunitiesMean: numbers[29],
                    firstDowns: numbers[30],
                    firstDownsMean: numbers[31],
                    fumblesLost: numbers[32],
                    fumblesLostMean: numbers[33],
                    fumblesLostPerTouch: numbers[34],
                },
                standard: {
                    points: {
                        sum: numbers[36],
                        mean: numbers[37],
                        median: numbers[38],
                        standardDeviation: numbers[39],
                        adjustedMean: numbers[40],
                    },
                    games: {
                        bad: numbers[41],
                        poor: numbers[42],
                        okay: numbers[43],
                        good: numbers[44],
                        great: numbers[45],
                    },
                    qualityStartRatio: numbers[46],
                    goodStartRatio: numbers[47],
                    score: numbers[48],
                },
                half: {
                    points: {
                        sum: numbers[49],
                        mean: numbers[50],
                        median: numbers[51],
                        standardDeviation: numbers[52],
                        adjustedMean: numbers[53],
                    },
                    games: {
                        bad: numbers[54],
                        poor: numbers[55],
                        okay: numbers[56],
                        good: numbers[57],
                        great: numbers[58],
                    },
                    qualityStartRatio: numbers[59],
                    goodStartRatio: numbers[60],
                    score: numbers[61],
                },
                ppr: {
                    points: {
                        sum: numbers[62],
                        mean: numbers[63],
                        median: numbers[64],
                        standardDeviation: numbers[65],
                        adjustedMean: numbers[66],
                    },
                    games: {
                        bad: numbers[67],
                        poor: numbers[68],
                        okay: numbers[69],
                        good: numbers[70],
                        great: numbers[71],
                    },
                    qualityStartRatio: numbers[72],
                    goodStartRatio: numbers[73],
                    score: numbers[74],
                },
            },
        ],
    };
    if (filename.includes("all.csv")) {
        player.yearsOfExperience = numbers[numbers.length - 4];
        player.stats[0].half.projected = {
            mean: numbers[numbers.length - 3],
            sum: numbers[numbers.length - 2],
            rank: numbers[numbers.length - 1],
        };
    }
    return pushPlayer(player);
};

export const parseK = (row, filename) => {
    const info = row.slice(0, 3);
    const numbers = row.slice(3).map(Number);
    var season = "Weighted Average";
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
                injuryCorrectionConstant: numbers[26],
                kicking: {
                    fieldGoals: {
                        sum: numbers[2],
                        mean: numbers[3],
                        attempts: numbers[4],
                        attemptsMean: numbers[5],
                        percentage: numbers[6],
                        long: numbers[7],
                        longMean: numbers[8],
                        sum10_19: numbers[9],
                        mean10_19: numbers[10],
                        sum20_29: numbers[11],
                        mean20_29: numbers[12],
                        sum30_39: numbers[13],
                        mean30_39: numbers[14],
                        sum40_49: numbers[15],
                        mean40_49: numbers[16],
                        sum50Plus: numbers[17],
                        mean50Plus: numbers[18],
                    },
                    extraPoints: {
                        sum: numbers[19],
                        mean: numbers[20],
                        attempts: numbers[21],
                        attemptsMean: numbers[22],
                        percentage: numbers[23],
                    },
                },
                misc: {
                    opportunities: numbers[24],
                    opportunitiesMean: numbers[25],
                },
                standard: {
                    points: {
                        sum: numbers[27],
                        mean: numbers[28],
                        median: numbers[29],
                        standardDeviation: numbers[30],
                        adjustedMean: numbers[31],
                    },
                    games: {
                        bad: numbers[32],
                        poor: numbers[33],
                        okay: numbers[34],
                        good: numbers[35],
                        great: numbers[36],
                    },
                    qualityStartRatio: numbers[37],
                    goodStartRatio: numbers[38],
                    score: numbers[39],
                },
                half: {
                    points: {
                        sum: numbers[40],
                        mean: numbers[41],
                        median: numbers[42],
                        standardDeviation: numbers[43],
                        adjustedMean: numbers[44],
                    },
                    games: {
                        bad: numbers[45],
                        poor: numbers[46],
                        okay: numbers[47],
                        good: numbers[48],
                        great: numbers[49],
                    },
                    qualityStartRatio: numbers[50],
                    goodStartRatio: numbers[51],
                    score: numbers[52],
                },
                ppr: {
                    points: {
                        sum: numbers[53],
                        mean: numbers[54],
                        median: numbers[55],
                        standardDeviation: numbers[56],
                        adjustedMean: numbers[57],
                    },
                    games: {
                        bad: numbers[58],
                        poor: numbers[59],
                        okay: numbers[60],
                        good: numbers[61],
                        great: numbers[62],
                    },
                    qualityStartRatio: numbers[63],
                    goodStartRatio: numbers[64],
                    score: numbers[65],
                },
            },
        ],
    };
    if (filename.includes("all.csv")) {
        player.yearsOfExperience = numbers[numbers.length - 4];
        player.stats[0].half.projected = {
            mean: numbers[numbers.length - 3],
            sum: numbers[numbers.length - 2],
            rank: numbers[numbers.length - 1],
        };
    }
    return pushPlayer(player);
};

export const parseDST = (row, filename) => {
    const info = row.slice(0, 3);
    const numbers = row.slice(3).map(Number);
    var season = "Weighted Average";
    const year = /\d+/.exec(filename);
    if (year) season = year[0];
    const player = {
        name: info[0],
        team: info[1],
        position: info[2],
        stats: [
            {
                season: season,
                games: numbers[0],
                dst: {
                    defense: {
                        sacks: numbers[1],
                        sacksMean: numbers[2],
                        interceptions: numbers[3],
                        interceptionsMean: numbers[4],
                        fumblesRecovered: numbers[5],
                        fumblesRecoveredMean: numbers[6],
                        forcedFumbles: numbers[7],
                        forcedFumblesMean: numbers[8],
                        safeties: numbers[9],
                        safetiesMean: numbers[10],
                        td: numbers[11],
                        tdMean: numbers[12],
                    },
                    specialTeams: {
                        td: numbers[13],
                        tdMean: numbers[14],
                    },
                },
                standard: {
                    points: {
                        sum: numbers[15],
                        mean: numbers[16],
                        median: numbers[17],
                        standardDeviation: numbers[18],
                        adjustedMean: numbers[19],
                    },
                    games: {
                        bad: numbers[20],
                        poor: numbers[21],
                        okay: numbers[22],
                        good: numbers[23],
                        great: numbers[24],
                    },
                    qualityStartRatio: numbers[25],
                    goodStartRatio: numbers[26],
                    score: numbers[27],
                },
                half: {
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
                ppr: {
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
            },
        ],
    };
    if (filename.includes("all.csv")) {
        player.yearsOfExperience = numbers[numbers.length - 4];
        player.stats[0].half.projected = {
            mean: numbers[numbers.length - 3],
            sum: numbers[numbers.length - 2],
            rank: numbers[numbers.length - 1],
        };
    }
    return pushPlayer(player);
};
