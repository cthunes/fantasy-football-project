import fs from "fs";
import { parse } from "csv-parse";

import { parseQB, parseRB, parsePC, parseK, parseDST } from "./savePos.js";

const currentYear = 2023;
const positions = ["qb", "rb", "wr", "te", "k", "dst"];

async function parseCSV(filename) {
    const data = [];
    const parser = fs
        .createReadStream(filename)
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("error", (error) => console.error(error))
        .on("end", () => console.log(filename + " done"));
    const promises = [];
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
    return promises;
}

const saveFootballData = async () => {
    for (const pos of positions) {
        await parseCSV(`../football-data/aggregated/${pos}/all.csv`);
        for (const yearsAgo of [1, 2, 3, 4, 5, 6]) {
            const year = currentYear - yearsAgo;
            await parseCSV(`../football-data/aggregated/${pos}/${year}.csv`);
        }
    }
};

export default saveFootballData;
