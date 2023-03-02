import axios from "axios";

const url = "http://localhost:8080/test";

export const fetchTest = () => axios.get(url);
export const createTest = (newTest) => axios.post(url, newTest);
