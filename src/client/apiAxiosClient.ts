import axios from "axios";

import Config from "../config";

const apiAxiosClient = axios.create({
  baseURL: Config.nextApiEndpoint,
});

export default apiAxiosClient;
