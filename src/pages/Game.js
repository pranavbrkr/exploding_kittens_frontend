import { useParams } from "react-router-dom";
import useGameStore from "../store/useGameStore";
import { Box, Typography, Avatar, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { connectToGameSocket, disconnectGameSocket } from "../ws/GameSocket";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

function Game() {
  const { lobbyId } = useParams();
  const { playerId, playerName, participants } = useGameStore();
  const [hand, setHand] = useState([]);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [usedCards, setUsedCards] = useState([]);
  const [eliminatedPlayers, setEliminatedPlayers] = useState([]);
  const [futureCards, setFutureCards] = useState([]);
  const [showFutureModal, setShowFutureModal] = useState(false);
  const [alterCards, setAlterCards] = useState([])
  const [showAlterModal, setShowAlterModal] = useState(false);

  const refreshGameState = async () => {
    try {
      const res = await axios.get(`http://localhost:8082/game/${lobbyId}`);
      const gameState = res.data;

      const current = gameState.players[gameState.currentPlayerIndex]?.playerId;
      if (current) setCurrentPlayerId(current);
      setEliminatedPlayers(gameState.eliminatedPlayers || []);

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
    connectToGameSocket(lobbyId, setCurrentPlayerId, refreshGameState,
      cards => {
      setFutureCards(cards);
      setShowFutureModal(true);
      },
      cards => {
       setAlterCards(cards);
       setShowAlterModal(true) 
      });
    return () => disconnectGameSocket();
  }, [lobbyId]);

  const latestUsedCard = usedCards[usedCards.length - 1];

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
                bgcolor: eliminatedPlayers.includes(p.playerId)
                  ? 'red'
                  : p.playerId === currentPlayerId ? 'yellow' : 'transparent', 
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
      {showFutureModal && (
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#fff',
            padding: 6,
            borderRadius: 6,
            boxShadow: '0 0 30px rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            gap: 4,
            alignItems: 'center',
            minWidth: 600
          }}
        >
          {futureCards.map((card, index) => (
            <img
              key={index}
              src={`/assets/cards/${card}.jpg`}
              alt={card}
              width={200}
              style={{
                borderRadius: 12,
                boxShadow: '0 0 15px rgba(0,0,0,0.3)'
              }}
            />
          ))}
          <button
            onClick={() => setShowFutureModal(false)}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'transparent',
              border: 'none',
              fontSize: 32,
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </Box>
      )}
      {showAlterModal && (
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#fff',
            padding: 6,
            borderRadius: 6,
            boxShadow: '0 0 30px rgba(0,0,0,0.6)',
            zIndex: 1000,
            minWidth: 600
          }}
        >
          <DragDropContext
            onDragEnd={(result) => {
              const { source, destination } = result;
              if (!destination) return;
              const updated = [...alterCards];
              const [removed] = updated.splice(source.index, 1);
              updated.splice(destination.index, 0, removed);
              setAlterCards(updated);
            }}
            // enableDefaultSensors = {false}
          >
            <Droppable droppableId="alter-deck" direction="horizontal">
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{ display: 'flex', gap: 2 }}
                >
                  {alterCards.map((card, index) => (
                    <Draggable draggableId={card + index} index={index} key={card + index}>
                      {(provided, snapshot) => (
                        <img
                          src={`/assets/cards/${card}.jpg`}
                          alt={card}
                          width={200}
                          ref={(node) => {
                            provided.innerRef(node);
                            // Fix drag preview image after element is available
                            if (node && node.complete) {
                              const transparentImg = new Image();
                              transparentImg.src =
                                'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
                              node.addEventListener('dragstart', (e) => {
                                e.dataTransfer.setDragImage(transparentImg, 0, 0);
                              });
                            } else if (node) {
                              node.onload = () => {
                                const transparentImg = new Image();
                                transparentImg.src =
                                  'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
                                node.addEventListener('dragstart', (e) => {
                                  e.dataTransfer.setDragImage(transparentImg, 0, 0);
                                });
                              };
                            }
                          }}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            borderRadius: 12,
                            boxShadow: '0 0 15px rgba(0,0,0,0.3)',
                            opacity: snapshot.isDragging ? 0.85 : 1,
                            transition: 'transform 0.15s ease',
                          }}
                        />
                      )}
                    </Draggable>

                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, width: '100%' }}>
            <button
              onClick={async () => {
                try {
                  await axios.post(`http://localhost:8082/game/alter/${lobbyId}`, alterCards, {
                    params: { playerId }
                  });
                  setShowAlterModal(false);
                } catch (err) {
                  console.error("Failed to update deck order", err);
                }
              }}
              style={{
                marginTop: 16,
                padding: '10px 20px',
                fontSize: '16px',
                borderRadius: '8px',
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Confirm Order
            </button>
          </Box>
        </Box>
      )}      
    </Box>
  );
}

export default Game;
