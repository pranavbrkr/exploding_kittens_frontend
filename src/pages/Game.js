import { useParams } from "react-router-dom";
import useGameStore from "../store/useGameStore";
import { Box, Typography, Avatar, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { connectToGameSocket, disconnectGameSocket } from "../ws/GameSocket";

function Game() {
  const { lobbyId } = useParams();
  const { playerId, playerName, participants } = useGameStore();
  const [hand, setHand] = useState([]);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [usedCards, setUsedCards] = useState([]);

  const refreshGameState = async () => {
    try {
      const res = await axios.get(`http://localhost:8082/game/${lobbyId}`);
      const gameState = res.data;

      const current = gameState.players[gameState.currentPlayerIndex]?.playerId;
      if (current) setCurrentPlayerId(current);

      setUsedCards(gameState.usedCards || []);

      const player = gameState.players.find(p => p.playerId === playerId);
      if (player) setHand(player.hand);
    } catch (err) {
      console.log("Failed to refresh game state", err);
    }
  };

  useEffect(() => {
    refreshGameState();
  }, [lobbyId, playerId]);

  useEffect(() => {
    connectToGameSocket(lobbyId, setCurrentPlayerId, refreshGameState);
    return () => disconnectGameSocket();
  }, [lobbyId]);

  console.log("All used cards:", usedCards);
  const latestUsedCard = usedCards[usedCards.length - 1];

  console.log("Last used card:", latestUsedCard);

  return (
    <Box sx={{ height: '100vh', backgroundColor: '#3a3ad6', p: 4, position: 'relative' }}>

      {/* Top Row - Players */}
      <Stack direction="row" spacing={4} justifyContent="center" mb={4}>
        {participants.map(p => (
          <Box key={p.playerId}>
            <Avatar 
              sx={{ 
                width: 60, 
                height: 60, 
                bgcolor: p.playerId === currentPlayerId ? 'yellow' : 'transparent', 
                border: '5px solid black' 
              }}
            />
            <Typography color="white" align="center">{p.name}</Typography>
          </Box>
        ))}
      </Stack>

      {/* Center - Used Card */}
<Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
  {latestUsedCard && (
    <img
      src={`/assets/cards/${latestUsedCard}.jpg`}
      alt={latestUsedCard}
      width={100}
      style={{ borderRadius: 12, boxShadow: '0 0 10px rgba(0,0,0,0.3)' }}
    />
  )}
</Box>

      {/* Right - Deck */}
      <Box sx={{ position: 'absolute', top: 32, right: 32 }}>
        <img
          src="/assets/cards/BACK.png"
          alt="deck"
          width={80}
          style={{ borderRadius: 12 }}
          onClick={async () => {
            if (playerId !== currentPlayerId) return;
            try {
              await axios.post(`http://localhost:8082/game/draw/${lobbyId}`, null, {
                params: {playerId},
              });
              await refreshGameState();
            } catch (err) {
              console.error("Failed to draw card", err);
            }
          }}
        />
      </Box>

      {/* Bottom - Player Hand */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, flexWrap: 'wrap' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 6,
          flexWrap: 'wrap',
          p: 2,
          borderRadius: 4,
          boxShadow: playerId === currentPlayerId 
            ? '0 0 15px 4px #00e676' 
            : 'none',
          transition: 'box-shadow 0.3s ease-in-out',
          border: playerId === currentPlayerId ? '2px solid #00e676' : 'none',
          backgroundColor: playerId === currentPlayerId ? '#f1f8e9' : 'transparent'
        }}
      >
        {hand.map((card, idx) => (
          <img
            key={idx}
            src={`/assets/cards/${card}.jpg`}
            alt={card}
            width={80}
            style={{ margin: '0 8px 12px 8px', cursor: 'pointer' }}
            onClick={async () => {
              if (playerId !== currentPlayerId) return;
              try {
                await axios.post(`http://localhost:8082/game/play/${lobbyId}`, null, {
                  params: { playerId, cardType: card },
                });
                setHand(prev => prev.filter((_, i) => i !== idx));
                await refreshGameState();
              } catch (err) {
                console.error("Failed to play card", err);
              }
            }}
          />
        ))}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <button
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: playerId === currentPlayerId ? '#ff1744' : '#ccc',
            color: 'white',
            cursor: playerId === currentPlayerId ? 'pointer' : 'not-allowed'
          }}
          disabled={playerId !== currentPlayerId}
          onClick={async () => {
            try {
              await axios.post(`http://localhost:8082/game/skip/${lobbyId}`);
               await refreshGameState();
            } catch (err) {
              console.error("Failed to skip turn", err);
            }
          }}
        >
          Skip Turn
        </button>
      </Box>
    </Box>
  );
}

export default Game;
