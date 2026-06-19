import axios from "axios";

export const createInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
});
