import axios from "axios";

const url = "http://localhost:5000/rankings";

export const fetchRankings = () => axios.get(url);
export const createRanking = (newRanking) => axios.post(url, newRanking);
export const updateRanking = (id, updatedRanking) =>
    axios.patch(`${url}/${id}`, updatedRanking);
