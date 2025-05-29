import { useParams } from "react-router-dom"
import useGameStore from "../store/useGameStore";
import { Box, Divider, Paper, Typography } from "@mui/material";

function Game() {
  const { lobbyId } = useParams();
  const { playerId, playerName, participants } = useGameStore();

  return (
    <Box sx={{ height: '100vh', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, borderRadius: 3, minWidth: 400, textAlign: 'center'}}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Game Started! (Lobby: {lobbyId})
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          Current player:
        </Typography>
        <Typography fontWeight="bold" gutterBottom>
          {playerName}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          Opponents:
        </Typography>
        <ul style={{ textAlign: "left" }}>
          {participants.filter((p) => p.playerId !== playerId).map((opponent, index) => (
            <li key={index}>{opponent.name}</li>
          ))}
        </ul>
      </Paper>
    </Box>
  );
}
export default Game