import axios from "axios"
import apiConfig from "../config/apiConfig"

export const registerPlayer = async (name) => {
  const response = await axios.post(`${apiConfig.playerServiceUrl}/api/player/register`, { name })
  return response.data
}