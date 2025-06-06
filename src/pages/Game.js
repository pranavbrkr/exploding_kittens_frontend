import { useParams } from "react-router-dom"
import useGameStore from "../store/useGameStore";
import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { connectToGameSocket, disconnectGameSocket } from "../ws/GameSocket";

function Game() {
  const { lobbyId } = useParams();
  const { playerId, playerName, participants } = useGameStore();
  const [hand, setHand] = useState([]);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await axios.get(`http://localhost:8082/game/${lobbyId}`);
        const gameState = res.data

        if (!gameState || !Array.isArray(gameState.players)) {
          console.warn("Invalid game state structure:", gameState);
          return;
        }

        const current = gameState.players[gameState.currentPlayerIndex]?.playerId;
        if (current) setCurrentPlayerId(current);

        const player = gameState.players.find(p => p.playerId === playerId);
        if (player) setHand(player.hand);
      } catch (err) {
        console.log("Failed to fetch game state", err);
      }
    };

    fetchGame();
  }, [lobbyId, playerId])

  useEffect(() => {
    connectToGameSocket(lobbyId, setCurrentPlayerId);
    return () => disconnectGameSocket();
  }, [lobbyId]);

  return (
    <Box sx={{ height: '100vh', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, borderRadius: 3, minWidth: 400, textAlign: 'center'}}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Game Started! (Lobby: {lobbyId})
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1">
          Current Turn: {participants.find(p => p.playerId === currentPlayerId)?.name || "Loading..."}
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
        <Divider sx={{ my: 2 }} />
        <Button
          variant="contained"
          sx = {{ mt: 2 }}
          disabled={playerId !== currentPlayerId}
          onClick={async () => {
            await axios.post(`http://localhost:8082/game/skip/${lobbyId}`);
          }}
        >
          Skip turn
        </Button>
      </Paper>
    </Box>
  );
}
export default Game