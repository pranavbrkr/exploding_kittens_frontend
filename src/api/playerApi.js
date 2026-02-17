import axios from "axios"

const BASE_URL = "http://localhost:8080"

export const register = async (username, password, displayName) => {
  const response = await axios.post(`${BASE_URL}/auth/register`, {
    username,
    password,
    displayName: displayName || undefined,
  })
  return response.data
}

export const login = async (username, password) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, { username, password })
  return response.data
}