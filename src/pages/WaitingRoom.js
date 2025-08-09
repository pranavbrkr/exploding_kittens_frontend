import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import useGameStore from "../store/useGameStore";

function WaitingRoom() {
  const navigate = useNavigate();
  const playerName = useGameStore((state) => state.playerName);
  const playerId = useGameStore((state) => state.playerId);
  const setLobbyId = useGameStore((state) => state.setLobbyId);

  const [showJoinInput, setShowJoinInput] = useState(false);
  const [joinLobbyId, setJoinLobbyId] = useState('');
  const [error, setError] = useState('');

  if (!playerId) {
    navigate("/");
    return null;
  }

  const handleCreateLobby = async () => {
    try {
      const res = await axios.post("http://localhost:8081/api/lobby/create", { playerId });
      const { lobbyId } = res.data;
      setLobbyId(lobbyId);
      navigate(`/lobby/${lobbyId}`);
    } catch (err) {
      console.error("Failed to create lobby", err);
    }
  };

  const handleJoinLobby = async () => {
    if (!joinLobbyId.trim()) return;
    try {
      const res = await axios.post("http://localhost:8081/api/lobby/join", {
        playerId,
        lobbyId: joinLobbyId.trim(),
      });
      const { lobbyId } = res.data;
      setLobbyId(lobbyId);
      navigate(`/lobby/${lobbyId}`);
    } catch (err) {
      console.error("Failed to join lobby", err);
      if (err.response?.status === 400) {
        setError("Lobby is full. Please try another.");
      } else if (err.response?.status === 500) {
        setError("Lobby not found.");
      } else {
        setError("Failed to join lobby. Please try again.");
      }
    }
  };

  return (
    <Box sx={{ height: '100vh', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, borderRadius: 3, minWidth: 400, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Waiting Room
        </Typography>
        <Typography variant="subtitle1"><strong>Player Name:</strong> {playerName}</Typography>
        <Typography variant="subtitle1" gutterBottom><strong>Player ID:</strong> {playerId}</Typography>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" fullWidth sx={{ mr: 1 }} onClick={handleCreateLobby}>
            Create Lobby
          </Button>
          <Button variant="outlined" fullWidth sx={{ ml: 1 }} onClick={() => setShowJoinInput(true)}>
            Join Lobby
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {showJoinInput && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Lobby ID"
              value={joinLobbyId}
              onChange={(e) => setJoinLobbyId(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" fullWidth onClick={handleJoinLobby}>
              Submit
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default WaitingRoom;
