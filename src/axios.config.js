import axios from "axios";
import https from "https";

axios.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false
})