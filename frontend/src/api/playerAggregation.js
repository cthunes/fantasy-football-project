import axios from "axios";

const url = "http://localhost:5000/playerAggregations";

export const fetchPlayerAggregations = () => axios.get(url);
