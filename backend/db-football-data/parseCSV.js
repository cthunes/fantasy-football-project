import fs from "fs";
import { parse } from "csv-parse";

import {parseQB, parseRB, parsePC, parseK, parseDST, parseQBGame, parseRBGame, parsePCGame, parseKGame, parseDSTGame} from "./savePos.js";

const currentYear = 2025;
const positions = ["qb", "rb", "wr", "te", "k", "dst"];

async function parseCSV(filename) {
    const data = [];
    const parser = fs
        .createReadStream(filename)
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("error", (error) => console.error(error))
        .on("end", () => console.log(filename + " done"));
    const promises = [];
    if (filename.includes("games.csv")) {
        for await (const row of parser) {
            if (filename.includes("/qb/")) {
                promises.push(await parseQBGame(row, "QB"));
            } else if (filename.includes("/rb/")) {
                promises.push(await parseRBGame(row, "RB"));
            } else if (filename.includes("/wr/")) {
                promises.push(await parsePCGame(row, "WR"));
            } else if (filename.includes("/te/")) {
                promises.push(await parsePCGame(row, "TE"));
            } else if (filename.includes("/k/")) {
                promises.push(await parseKGame(row, "K"));
            } else {
                promises.push(await parseDSTGame(row, "DST"));
            }
        }
    } else {
        for await (const row of parser) {
            if (filename.includes("/qb/")) {
                promises.push(await parseQB(row, filename));
            } else if (filename.includes("/rb/")) {
                promises.push(await parseRB(row, filename));
            } else if (filename.includes("/wr/") || filename.includes("/te/")) {
                promises.push(await parsePC(row, filename));
            } else if (filename.includes("/k/")) {
                promises.push(await parseK(row, filename));
            } else {
                promises.push(await parseDST(row, filename));
            }
        }
    }
    return promises;
}

const saveFootballData = async (players = false, games = false) => {
    if (!players) console.log("Skipping player data parsing");
    if (!games) console.log("Skipping game data parsing");
    for (const pos of positions) {
        if (players) await parseCSV(`../football-data/aggregated/${pos}/all.csv`);
        for (const yearsAgo of [1, 2, 3, 4, 5]) {
            const year = currentYear - yearsAgo;
            if (players) await parseCSV(`../football-data/aggregated/${pos}/${year}.csv`);
            if (games) await parseCSV(`../football-data/aggregated/${pos}/${year}games.csv`);
        }
    }
};

export default saveFootballData;
