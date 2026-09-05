import axios from "axios";

const url = "http://localhost:5000/scoringRules";

export const fetchScoringRules = () => axios.get(url);
