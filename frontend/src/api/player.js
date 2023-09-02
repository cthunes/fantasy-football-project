import axios from "axios";

const url = "http://localhost:8080/players";

export const fetchPlayers = () => axios.get(url);
