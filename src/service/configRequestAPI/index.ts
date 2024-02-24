import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.olhovivo.sptrans.com.br/v2.1",
});
