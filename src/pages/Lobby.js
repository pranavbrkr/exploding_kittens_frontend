import { useEffect } from "react";
import { Box, Typography, Paper, Button, Divider } from "@mui/material";
import axios from "axios";
import useGameStore from "../store/useGameStore";
import { useNavigate, useParams } from "react-router-dom";
import { connectToLobbySocket, disconnectLobbySocket } from "../ws/LobbySocket";
import apiConfig from "../config/apiConfig";

function Lobby() {
  const  { lobbyId } = useParams()
  const { playerName, playerId, participants } = useGameStore();
  const setParticipants = useGameStore((state) => state.setParticipants);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLobby = async () => {
      try {
        const res = await axios.get(`${apiConfig.lobbyServiceUrl}/api/lobby/${lobbyId}`);
        const players = res.data.players;
        setParticipants(players);
      } catch (err) {
        console.error("Failed to fetch lobby info", err);
      }
    };

    fetchLobby();
    const interval = setInterval(fetchLobby, 2000);

    return () => clearInterval(interval);
  }, [lobbyId]);

  useEffect(() => {
    connectToLobbySocket(lobbyId, () => {
      disconnectLobbySocket();
      navigate(`/game/${lobbyId}`);
    });

    return () => {
      disconnectLobbySocket();
    };
  }, [lobbyId]);

  const handleStartGame = async () => {
    try {
     await axios.post(`${apiConfig.lobbyServiceUrl}/api/lobby/start/${lobbyId}`);
    } catch (err) {
      console.error("Failed to start game", err);
    }
  };

  if (!participants) return <div>Loading lobby...</div>;

  return (
    <Box sx={{ height: '100vh', backgroundColor: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, borderRadius: 3, minWidth: 400, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Lobby: {lobbyId}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          You: {playerName} ({playerId})
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Participants:
        </Typography>
        <ul style={{ textAlign: "left" }}>
          {participants.map((p) => (
            <li key={p.playerId}>{p.name}</li>
          ))}
        </ul>
        <Button variant="contained" fullWidth sx={{ mt: 3 }} disabled={participants.length !== 4} onClick={handleStartGame}>
          Start Game
        </Button>
      </Paper>
    </Box>
  );
}

export default Lobby;
