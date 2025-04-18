import axios from "axios"

const BASE_URL = "http://localhost:8080"

export const registerPlayer = async (name) => {
  const response = await axios.post(`${BASE_URL}/player/register`, { name })
  return response.data
}