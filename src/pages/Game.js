import { useParams } from "react-router-dom"
import useGameStore from "../store/useGameStore";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

function Game() {
  const { lobbyId } = useParams();
  const { playerId, playerName, participants } = useGameStore();
  const [hand, setHand] = useState([]);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await axios.get(`http://localhost:8082/game/${lobbyId}`);
        const gameState = res.data

        if (!gameState || !Array.isArray(gameState.players)) {
          console.warn("Invalid game state structure:", gameState);
          return;
        }

        const player = gameState.players.find(p => p.playerId === playerId);
        if (player) setHand(player.hand);
      } catch (err) {
        console.log("Failed to fetch game state", err);
      }
    };

    fetchGame();
  }, [lobbyId, playerId])

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
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          Your Hand:
        </Typography>
        <ul style={{ textAlign: "left" }}>
          {hand.map((card, idx) => (
            <li key={idx}>{card}</li>
          ))}
        </ul>
      </Paper>
    </Box>
  );
}
export default Game