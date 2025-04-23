import { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, Divider } from "@mui/material";
import axios from "axios";
import useGameStore from "../store/useGameStore";

function Lobby() {
  const { playerName, playerId, lobbyId } = useGameStore();
  const [participants, setParticipants] = useState(null);

  useEffect(() => {
    const fetchLobby = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/lobby/${lobbyId}`);
        setParticipants(res.data.players);
      } catch (err) {
        console.error("Failed to fetch lobby info", err);
      }
    };

    fetchLobby();
    const interval = setInterval(fetchLobby, 2000);

    return () => clearInterval(interval);
  }, [lobbyId]);

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
        <Button variant="contained" fullWidth sx={{ mt: 3 }} disabled>
          Start Game (Coming Soon)
        </Button>
      </Paper>
    </Box>
  );
}

export default Lobby;
