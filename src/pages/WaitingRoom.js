import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@mui/material";
import useGameStore from "../store/useGameStore";

function WaitingRoom() {
  const { state } = useLocation();
  const navigate = useNavigate();


  const playerName = useGameStore((state) => state.playerName);
  const playerId = useGameStore((state) => state.playerId);

  if (!playerId) {
    navigate("/");
    return null;
  }

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper sx={{ p: 4, borderRadius: 3, minWidth: 400, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Waiting Room
        </Typography>
        <Typography variant="subtitle1">
          <strong>Player Name:</strong> {playerName}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Player ID:</strong> {playerId}
        </Typography>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" fullWidth sx={{ mr: 1 }}>
            Create Lobby
          </Button>
          <Button variant="outlined" fullWidth sx={{ ml: 1 }}>
            Join Lobby
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default WaitingRoom;
