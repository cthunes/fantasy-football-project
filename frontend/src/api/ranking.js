import axios from "axios";

const url = "http://localhost:8080/rankings";

export const fetchRankings = () => axios.get(url);
export const createRanking = (newRanking) => axios.post(url, newRanking);
