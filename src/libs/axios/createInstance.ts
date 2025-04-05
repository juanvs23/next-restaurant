import axios from "axios";

const abortController = new AbortController();
export const createInstance = axios.create({ baseURL:`${process.env.NEXT_PUBLIC_BASE_URL}/`, signal: abortController.signal })