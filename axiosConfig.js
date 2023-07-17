import axios from "axios";

const api = axios.create({
  baseURL: "https://lu2p3mkeu3.execute-api.us-east-1.amazonaws.com/Prod",
});

export default api;
