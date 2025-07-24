import mongoose from "mongoose";

const gameSchema = mongoose.Schema({
    player: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },
    season: String,
    week: Number,
    rushing: {
        attempts: Number,
        yards: Number,
        yardsPerAttempt: Number,
        long: Number,
        twentyPlus: Number,
        td: Number,
    },
    receiving: {
        receptions: Number,
        targets: Number,
        yards: Number,
        yardsPerReception: Number,
        long: Number,
        twentyPlus: Number,
        td: Number,
    },
    passing: {
        completions: Number,
        attempts: Number,
        percentage: Number,
        yards: Number,
        yardsPerAttempt: Number,
        td: Number,
        interceptions: Number,
        sacks: Number,
    },
    kicking: {
        fieldGoals: {
            made: Number,
            attempts: Number,
            percentage: Number,
            long: Number,
            made10_19: Number,
            made20_29: Number,
            made30_39: Number,
            made40_49: Number,
            made50Plus: Number,
        },
        extraPoints: {
            made: Number,
            attempts: Number,
        },
    },
    dst: {
        defense: {
            sacks: Number,
            interceptions: Number,
            fumblesRecovered: Number,
            forcedFumbles: Number,
            td: Number,
            safeties: Number,
        },
        specialTeams: {
            td: Number,
        },
    },
    misc: {
        touches: Number,
        opportunities: Number,
        expectedFirstDowns: Number,
        fumblesLost: Number,
    },
    standard: {
        points: Number,
        tier: Number,
    },
    half: {
        points: Number,
        tier: Number,
    },
    ppr: {
        points: Number,
        tier: Number,
    }
});

const Game = mongoose.model("Game", gameSchema);

export default Game;