import { Box, Button, Paper, TextField, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useGameStore from "../store/useGameStore";

const AUTH_MODE = { LOGIN: "login", REGISTER: "register" };

function Welcome() {
  const [mode, setMode] = useState(AUTH_MODE.LOGIN);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setAuth = useGameStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleModeChange = (_, newMode) => {
    if (newMode) {
      setMode(newMode);
      setError("");
    }
  };

  const handleSubmit = async () => {
    const u = username.trim();
    const p = password;
    if (!u) {
      setError("Enter your game name");
      return;
    }
    if (!p) {
      setError("Enter your password");
      return;
    }
    if (mode === AUTH_MODE.REGISTER && p.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    setError("");

    const url = mode === AUTH_MODE.REGISTER
      ? "http://localhost:8080/auth/register"
      : "http://localhost:8080/auth/login";
    const payload = { username: u, password: p };

    try {
      const res = await axios.post(url, payload);
      const { token, playerId, name } = res.data;
      setAuth(token, playerId, name);
      navigate("/waiting");
    } catch (err) {
      const msg = err.response?.data?.message;
      if (err.response?.status === 401) {
        setError(msg || "Invalid game name or password");
      } else if (err.response?.status === 400) {
        setError(msg || "Invalid input (e.g. game name already taken)");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        background: "linear-gradient(to bottom right, #780178, #330133)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          minWidth: 350,
          backgroundColor: "white",
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome to Exploding Kittens
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Sign in or create an account
        </Typography>

        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          fullWidth
          sx={{ mb: 2 }}
        >
          <ToggleButton value={AUTH_MODE.LOGIN}>Login</ToggleButton>
          <ToggleButton value={AUTH_MODE.REGISTER}>Register</ToggleButton>
        </ToggleButtonGroup>

        <TextField
          fullWidth
          variant="outlined"
          label="Game name"
          placeholder="Your game name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
          autoComplete="username"
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
          autoComplete={mode === AUTH_MODE.REGISTER ? "new-password" : "current-password"}
        />

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button variant="contained" fullWidth onClick={handleSubmit}>
          {mode === AUTH_MODE.REGISTER ? "Create account" : "Continue"}
        </Button>
      </Paper>
    </Box>
  );
}

export default Welcome;
