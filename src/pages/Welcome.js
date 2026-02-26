import { Box, Button, Paper, TextField, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useGameStore from "../store/useGameStore";

const AUTH_MODE = { LOGIN: "login", REGISTER: "register" };
const REGISTER_STEP = { EMAIL_PASSWORD: 1, VERIFY_CODE: 2, GAME_NAME: 3 };

const PASSWORD_REQUIREMENTS = "Password must be at least 8 characters and include a letter, a number, and a special character";

function isPasswordStrong(password) {
  if (!password || password.length < 8) return false;
  return /[a-zA-Z]/.test(password) && /\d/.test(password) && /[^a-zA-Z0-9]/.test(password);
}

function Welcome() {
  const [mode, setMode] = useState(AUTH_MODE.LOGIN);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [gameName, setGameName] = useState("");
  const [registerStep, setRegisterStep] = useState(REGISTER_STEP.EMAIL_PASSWORD);
  const [error, setError] = useState("");
  const setAuth = useGameStore((state) => state.setAuth);
  const navigate = useNavigate();

  const api = axios.create({ baseURL: "http://localhost:8080" });

  const handleModeChange = (_, newMode) => {
    if (newMode) {
      setMode(newMode);
      setRegisterStep(REGISTER_STEP.EMAIL_PASSWORD);
      setError("");
    }
  };

  const handleLogin = async () => {
    const e = email.trim();
    const p = password;
    if (!e) {
      setError("Enter your email");
      return;
    }
    if (!p) {
      setError("Enter your password");
      return;
    }
    setError("");
    try {
      const res = await api.post("/auth/login", { email: e, password: p });
      const { token, playerId, name } = res.data;
      setAuth(token, playerId, name);
      navigate("/waiting");
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(msg || "Invalid email or password");
    }
  };

  const handleRegisterStep1 = async () => {
    const e = email.trim();
    const p = password;
    if (!e) {
      setError("Enter your email");
      return;
    }
    if (!p) {
      setError("Enter your password");
      return;
    }
    if (!isPasswordStrong(p)) {
      setError(PASSWORD_REQUIREMENTS);
      return;
    }
    setError("");
    try {
      await api.post("/auth/register", { email: e, password: p });
      setRegisterStep(REGISTER_STEP.VERIFY_CODE);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  const handleVerifyCode = async () => {
    const e = email.trim();
    const c = code.trim();
    if (!e || !c) {
      setError("Enter the 6-digit code from your email");
      return;
    }
    setError("");
    try {
      const res = await api.post("/auth/verify-email", { email: e, code: c });
      const { token, playerId, name, needsGameName } = res.data;
      setAuth(token, playerId, name || "");
      if (needsGameName) {
        setRegisterStep(REGISTER_STEP.GAME_NAME);
      } else {
        navigate("/waiting");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code");
    }
  };

  const handleCompleteRegistration = async () => {
    const g = gameName.trim();
    if (!g) {
      setError("Enter a game name");
      return;
    }
    if (g.length < 2) {
      setError("Game name must be at least 2 characters");
      return;
    }
    setError("");
    const token = useGameStore.getState().token;
    if (!token) {
      setError("Session expired. Please log in again.");
      return;
    }
    try {
      const res = await api.post("/auth/complete-registration", { gameName: g }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { token: newToken, playerId, name } = res.data;
      setAuth(newToken, playerId, name);
      navigate("/waiting");
    } catch (err) {
      setError(err.response?.data?.message || "Could not set game name");
    }
  };

  const isRegister = mode === AUTH_MODE.REGISTER;
  const step = isRegister ? registerStep : null;

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
          width: 660,
          minWidth: 540,
          maxWidth: "90vw",
          backgroundColor: "white",
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome to Exploding Kittens
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {isRegister
            ? step === REGISTER_STEP.GAME_NAME
              ? "Choose your game name"
              : step === REGISTER_STEP.VERIFY_CODE
                ? "Check your email for the code"
                : "Create an account"
            : "Sign in with your email"}
        </Typography>

        {!isRegister && (
          <>
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
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              autoComplete="email"
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
              autoComplete="current-password"
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Button variant="contained" fullWidth onClick={handleLogin}>
              Continue
            </Button>
          </>
        )}

        {isRegister && step === REGISTER_STEP.EMAIL_PASSWORD && (
          <>
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
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              autoComplete="email"
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              type="password"
              placeholder="8+ chars, letter, number, special"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              autoComplete="new-password"
              helperText="At least 8 characters, with a letter, number, and special character"
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Button variant="contained" fullWidth onClick={handleRegisterStep1}>
              Send verification code
            </Button>
          </>
        )}

        {isRegister && step === REGISTER_STEP.VERIFY_CODE && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              We sent a 6-digit code to {email}
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Verification code"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 6 }}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Button variant="contained" fullWidth onClick={handleVerifyCode} sx={{ mb: 1 }}>
              Verify
            </Button>
            <Button variant="text" fullWidth onClick={() => setRegisterStep(REGISTER_STEP.EMAIL_PASSWORD)}>
              Use a different email
            </Button>
          </>
        )}

        {isRegister && step === REGISTER_STEP.GAME_NAME && (
          <>
            <TextField
              fullWidth
              variant="outlined"
              label="Game name"
              placeholder="Your display name in games (unique)"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              sx={{ mb: 2 }}
              autoComplete="username"
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Button variant="contained" fullWidth onClick={handleCompleteRegistration}>
              Complete registration
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default Welcome;
