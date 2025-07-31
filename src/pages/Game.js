import { useParams } from "react-router-dom";
import useGameStore from "../store/useGameStore";
import { Box, Typography, Avatar, Stack, Button } from "@mui/material";
import { useEffect, useState, useRef } from "react";
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
  const [favorTargets, setFavorTargets] = useState([]);
  const [favorFrom, setFavorFrom] = useState(null);
  const [showFavorSelectModal, setShowFavorSelectModal] = useState(false);
  const [showGiveCardModal, setShowGiveCardModal] = useState(false);
  const [targetedAttackTargets, setTargetedAttackTargets] = useState([]);
  const [showTargetedAttackModal, setShowTargetedAttackModal] = useState(false);
  const [selectedCatCards, setSelectedCatCards] = useState([]);
  const [showStealButton, setShowStealButton] = useState(false);
  const [catTargets, setCatTargets] = useState([]);
  const [showCatOpponentModal, setShowCatOpponentModal] = useState(false);
  const [catStealOptions, setCatStealOptions] = useState([]);
  const [showCatIndexModal, setShowCatIndexModal] = useState(false);
  const [showDefuseStealButton, setShowDefuseStealButton] = useState(false);
  const [showDefuseStealModal, setShowDefuseStealModal] = useState(false);
  const [gameWinner, setGameWinner] = useState(null);
  const [eliminationNotification, setEliminationNotification] = useState(null);
  const [actionNotifications, setActionNotifications] = useState([]);
  const notifiedEliminationsRef = useRef(new Set());

  const modalStyle = {
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
};

  const addActionNotification = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type };
    setActionNotifications(prev => [...prev, notification]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setActionNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const removeActionNotification = (id) => {
    setActionNotifications(prev => prev.filter(n => n.id !== id));
  };

  const refreshGameState = async () => {
    try {
      const res = await axios.get(`http://localhost:8082/game/${lobbyId}`);
      const gameState = res.data;

      const current = gameState.players[gameState.currentPlayerIndex]?.playerId;
      if (current) setCurrentPlayerId(current);
      
      // Check for new eliminations
      const newEliminatedPlayers = gameState.eliminatedPlayers || [];
      
      // Find players that are newly eliminated (in newEliminatedPlayers but not in notifiedEliminations)
      const newlyEliminated = newEliminatedPlayers.filter(id => !notifiedEliminationsRef.current.has(id));
      
      console.log('Current eliminated players:', newEliminatedPlayers);
      console.log('Notified eliminations:', Array.from(notifiedEliminationsRef.current));
      console.log('Newly eliminated:', newlyEliminated);
      
      if (newlyEliminated.length > 0) {
        const eliminatedPlayerName = participants.find(p => p.playerId === newlyEliminated[0])?.name || 'Unknown Player';
        console.log('Showing notification for:', eliminatedPlayerName);
        setEliminationNotification(`${eliminatedPlayerName} was eliminated! 💥`);
        // Clear notification after 3 seconds
        setTimeout(() => setEliminationNotification(null), 3000);
        
        // Mark this elimination as notified
        notifiedEliminationsRef.current.add(newlyEliminated[0]);
      }
      
      setEliminatedPlayers(newEliminatedPlayers);

      setUsedCards(gameState.usedCards || []);

      const player = gameState.players.find(p => p.playerId === playerId);
      if (player) setHand(player.hand);
      
      // Check for game winner
      const winnerRes = await axios.get(`http://localhost:8082/game/${lobbyId}/winner`);
      if (winnerRes.data) {
        setGameWinner(winnerRes.data);
      }
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
      },
      targets => { setFavorTargets(targets); setShowFavorSelectModal(true);},
      fromId => { setFavorFrom(fromId); setShowGiveCardModal(true); },
      (targets) => { setTargetedAttackTargets(targets); setShowTargetedAttackModal(true) },
      addActionNotification
    );
    window.onCatOpponentSelect = (targets) => {
      setCatTargets(targets);
      setShowCatOpponentModal(true);
    };

    window.onCatIndexSelect = (indices) => {
      setCatStealOptions(indices);
      setShowCatIndexModal(true);
    };
    return () => disconnectGameSocket();
  }, [lobbyId]);

  const latestUsedCard = usedCards[usedCards.length - 1];

  return (
    <Box sx={{ 
      height: '100vh', 
      backgroundColor: '#3a3ad6', 
      p: 4, 
      position: 'relative',
      '@keyframes slideInRight': {
        from: {
          transform: 'translateX(100%)',
          opacity: 0
        },
        to: {
          transform: 'translateX(0)',
          opacity: 1
        }
      }
    }}>
             {/* Elimination Notification */}
       {eliminationNotification && (
         <Box sx={{
           position: 'absolute',
           top: 20,
           left: 20,
           backgroundColor: '#d66f6f',
           color: 'white',
           padding: 2,
           borderRadius: 2,
           zIndex: 1001,
           display: 'flex',
           alignItems: 'center',
           gap: 2,
           minWidth: 300
         }}>
           <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
             {eliminationNotification}
           </Typography>
           <button
             onClick={() => setEliminationNotification(null)}
             style={{
               background: 'transparent',
               border: 'none',
               color: 'white',
               fontSize: '20px',
               fontWeight: 'bold',
               cursor: 'pointer',
               padding: '0 4px',
               borderRadius: '50%',
               width: '24px',
               height: '24px',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               transition: 'background-color 0.2s'
             }}
             onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
             onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
           >
             ×
           </button>
         </Box>
       )}

       {/* Action Notifications */}
       <Box sx={{
         position: 'absolute',
         top: 80,
         left: 20,
         zIndex: 1000,
         display: 'flex',
         flexDirection: 'column',
         gap: 1,
         maxWidth: 400
       }}>
         {actionNotifications.map((notification) => (
           <Box
             key={notification.id}
             sx={{
               backgroundColor: notification.type === 'info' ? '#4a90e2' : 
                               notification.type === 'success' ? '#4caf50' : 
                               notification.type === 'warning' ? '#ff9800' : '#f44336',
               color: 'white',
               padding: 1.5,
               borderRadius: 2,
               display: 'flex',
               alignItems: 'center',
               gap: 2,
               minWidth: 300,
               boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
               animation: 'slideInRight 0.3s ease-out'
             }}
           >
             <Typography variant="body2" sx={{ fontWeight: 'bold', flex: 1 }}>
               {notification.message}
             </Typography>
             <button
               onClick={() => removeActionNotification(notification.id)}
               style={{
                 background: 'transparent',
                 border: 'none',
                 color: 'white',
                 fontSize: '16px',
                 fontWeight: 'bold',
                 cursor: 'pointer',
                 padding: '0 2px',
                 borderRadius: '50%',
                 width: '20px',
                 height: '20px',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 transition: 'background-color 0.2s'
               }}
               onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
               onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
             >
               ×
             </button>
           </Box>
         ))}
       </Box>

      {/* Top Row - Players */}
      <Stack direction="row" spacing={4} justifyContent="center" mb={4}>
        {participants.map(p => {
          const isEliminated = eliminatedPlayers.includes(p.playerId);
          const isCurrentPlayer = p.playerId === currentPlayerId;
          
          return (
            <Box key={p.playerId} sx={{ textAlign: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: isEliminated ? 'red' : isCurrentPlayer ? 'yellow' : 'transparent', 
                  border: '5px solid black',
                  opacity: isEliminated ? 0.6 : 1,
                  position: 'relative'
                }}
              />
              {isEliminated && (
                <Typography 
                  variant="caption" 
                  color="red" 
                  sx={{ 
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'white',
                    padding: '2px 6px',
                    borderRadius: 1,
                    fontWeight: 'bold'
                  }}
                >
                  ELIMINATED
                </Typography>
              )}
              <Typography 
                color="white" 
                align="center"
                sx={{ 
                  textDecoration: isEliminated ? 'line-through' : 'none',
                  opacity: isEliminated ? 0.6 : 1
                }}
              >
                {p.name}
              </Typography>
              {isCurrentPlayer && !isEliminated && p.playerId === playerId && (
                <Typography variant="caption" color="yellow" sx={{ fontWeight: 'bold' }}>
                  YOUR TURN
                </Typography>
              )}
            </Box>
          );
        })}
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
            style={{ margin: '0 8px 12px 8px', cursor: 'pointer',
              border:
                selectedCatCards.some(c => c.index === idx)
                  ? '4px solid #9c27b0' // violet border
                  : '2px solid transparent',
              boxShadow:
                selectedCatCards.some(c => c.index === idx)
                  ? '0 0 12px 4px #9c27b080' // violet glow
                  : 'none',
              transition: 'box-shadow 0.2s ease, border 0.2s ease'
            }}
            onClick={async () => {
              if (playerId !== currentPlayerId) return;

              // cat card
              if (card.startsWith("CAT_")) {
                const alreadySelected = selectedCatCards.find(c => c.index === idx);
                let newSelection;

                if (alreadySelected) {
                  newSelection = selectedCatCards.filter(c => c.index !== idx);
                } else {
                  newSelection = [...selectedCatCards, { card, index: idx }];
                }

                setSelectedCatCards(newSelection);

                const catCounts = newSelection.reduce((acc, cur) => {
                  acc[cur.card] = (acc[cur.card] || 0) + 1;
                  return acc;
                }, {});

                const matchedCat = Object.keys(catCounts).find(k => catCounts[k] === 2);
                const matchedThree = Object.keys(catCounts).find(k => catCounts[k] === 3);

                if (matchedCat) {
                  setShowStealButton(true);
                } else {
                  setShowStealButton(false);
                }

                if (matchedThree) {
                  setShowDefuseStealButton(true); // new state below
                } else {
                  setShowDefuseStealButton(false);
                }

                return;
              }

              // normal play
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
      {showFavorSelectModal && (
        <Box sx={{ ...modalStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography align="center" sx={{ mb: 2 }}>Select a player to request favor from:</Typography>
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
            {favorTargets.map(pid => {
              const player = participants.find(p => p.playerId === pid);
              return (
                <Button
                  key={pid}
                  variant="contained"
                  sx={{
                    borderRadius: 3,
                    fontWeight: 'bold',
                    fontSize: 18,
                    px: 3,
                    py: 1.5,
                    boxShadow: 2,
                    background: '#e0e0e0',
                    color: '#333',
                    transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      background: '#bdbdbd',
                      color: '#212121',
                      boxShadow: 4,
                      border: '2px solid #3a3ad6',
                    }
                  }}
                  onClick={async () => {
                    await axios.post(`http://localhost:8082/game/favor/request/${lobbyId}`, null, {
                      params: { fromPlayerId: playerId, toPlayerId: pid }
                    });
                    setShowFavorSelectModal(false);
                  }}
                >
                  {player?.name || pid}
                </Button>
              );
            })}
          </Stack>
        </Box>
      )}
      {showGiveCardModal && (
        <>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.5)',
              zIndex: 999,
            }}
          />
          <Box sx={{ ...modalStyle, zIndex: 1000 }}>
            <Typography>Select a card to give to the favor requester:</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {hand.map((card, idx) => (
                <img
                  key={idx}
                  src={`/assets/cards/${card}.jpg`}
                  alt={card}
                  width={100}
                  onClick={async () => {
                    await axios.post(`http://localhost:8082/game/favor/response/${lobbyId}`, null, {
                      params: {
                        fromPlayerId: playerId,
                        toPlayerId: favorFrom,
                        givenCard: card
                      }
                    });
                    setHand(prev => prev.filter((_, i) => i !== idx));
                    setShowGiveCardModal(false);
                  }}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
        </>
      )}
      {showTargetedAttackModal && (
        <Box sx={{ ...modalStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography align="center" sx={{ mb: 2 }}>Select a player to attack:</Typography>
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
            {targetedAttackTargets.map(pid => {
              const player = participants.find(p => p.playerId === pid);
              return (
                <Button
                  key={pid}
                  variant="contained"
                  sx={{
                    borderRadius: 3,
                    fontWeight: 'bold',
                    fontSize: 18,
                    px: 3,
                    py: 1.5,
                    boxShadow: 2,
                    background: '#e0e0e0',
                    color: '#333',
                    transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      background: '#bdbdbd',
                      color: '#212121',
                      boxShadow: 4,
                      border: '2px solid #ff1744',
                    }
                  }}
                  onClick={async () => {
                    await axios.post(`http://localhost:8082/game/targeted/confirm/${lobbyId}`, null, {
                      params: { fromPlayerId: playerId, toPlayerId: pid }
                    });
                    setShowTargetedAttackModal(false);
                  }}
                >
                  {player?.name || pid}
                </Button>
              );
            })}
          </Stack>
        </Box>
      )}
      {showStealButton && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <button
            onClick={async () => {
              setShowStealButton(false);

              // Remove selected cat cards from hand
              const updatedHand = hand.filter((_, i) =>
                !selectedCatCards.some(c => c.index === i)
              );
              setHand(updatedHand);

              // Clear selection after removal
              setSelectedCatCards([]);

              try {
                const res = await axios.get(`http://localhost:8082/game/cat/opponents/${lobbyId}`, {
                  params: { playerId }
                });
                window.onCatOpponentSelect(res.data);
              } catch (err) {
                console.error("Failed to get opponents", err);
              }
            }}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#6a1b9a',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Steal Card
          </button>
        </Box>
      )}
      {showDefuseStealButton && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <button
            onClick={async () => {
              try {
                const res = await axios.get(`http://localhost:8082/game/cat/opponents/${lobbyId}`, {
                  params: { playerId }
                });
                setCatTargets(res.data);
                setShowDefuseStealModal(true);
              } catch (err) {
                console.error("Failed to get opponents", err);
              }
            }}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#f50057',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Steal Defuse
          </button>
        </Box>
      )}

      {showCatOpponentModal && (
        <Box sx={modalStyle}>
          <Typography>Select an opponent to steal from:</Typography>
          <Stack direction="row" spacing={2}>
            {catTargets.map(pid => {
              const player = participants.find(p => p.playerId === pid);
              return (
                <Button
                  key={pid}
                  variant="contained"
                  color="secondary"
                  sx={{
                    borderRadius: 3,
                    fontWeight: 'bold',
                    fontSize: 18,
                    px: 3,
                    py: 1.5,
                    boxShadow: 2,
                    background: 'linear-gradient(90deg, #9c27b0 60%, #ce93d8 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #ce93d8 60%, #9c27b0 100%)',
                      boxShadow: 4
                    }
                  }}
                  onClick={async () => {
                    await axios.post(`http://localhost:8082/game/cat/steal/${lobbyId}`, null, {
                      params: { fromPlayerId: playerId, toPlayerId: pid }
                    });
                    setShowCatOpponentModal(false);
                  }}
                >
                  {player?.name || pid}
                </Button>
              );
            })}
          </Stack>
        </Box>
      )}
      {showDefuseStealModal && (
        <Box sx={modalStyle}>
          <Typography>Select a player to steal DEFUSE from:</Typography>
          <Stack direction="row" spacing={2}>
            {catTargets.map(pid => {
              const player = participants.find(p => p.playerId === pid);
              return (
                <Button
                  key={pid}
                  variant="contained"
                  color="warning"
                  sx={{
                    borderRadius: 3,
                    fontWeight: 'bold',
                    fontSize: 18,
                    px: 3,
                    py: 1.5,
                    boxShadow: 2,
                    background: 'linear-gradient(90deg, #f50057 60%, #ffb300 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #ffb300 60%, #f50057 100%)',
                      boxShadow: 4
                    }
                  }}
                  onClick={async () => {
                    await axios.post(`http://localhost:8082/game/cat/steal-defuse/${lobbyId}`, null, {
                      params: { fromPlayerId: playerId, toPlayerId: pid }
                    });
                    setShowDefuseStealModal(false);
                    setSelectedCatCards([]);
                    setShowDefuseStealButton(false);
                    await refreshGameState();
                  }}
                >
                  {player?.name || pid}
                </Button>
              );
            })}
          </Stack>
        </Box>
      )}
      {showCatIndexModal && (
        <Box sx={modalStyle}>
          <Typography>Select a number to steal that card:</Typography>
          <Stack direction="row" spacing={2}>
            {catStealOptions.map(index => (
              <Button
                key={index}
                variant="contained"
                color="secondary"
                sx={{
                  borderRadius: 3,
                  fontWeight: 'bold',
                  fontSize: 18,
                  px: 3,
                  py: 1.5,
                  boxShadow: 2,
                  background: 'linear-gradient(90deg, #9c27b0 60%, #ce93d8 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #ce93d8 60%, #9c27b0 100%)',
                    boxShadow: 4
                  }
                }}
                onClick={async () => {
                  await axios.post(`http://localhost:8082/game/cat/steal/resolve/${lobbyId}`, null, {
                    params: { stealerId: playerId, selectedIndex: index }
                  });
                  setShowCatIndexModal(false);
                  await refreshGameState();
                }}
              >
                {index}
              </Button>
            ))}
          </Stack>
        </Box>
      )}
             {gameWinner && (
         <Box sx={{ 
           position: 'absolute', 
           top: '50%', 
           left: '50%', 
           transform: 'translate(-50%, -50%)', 
           zIndex: 1000,
           backgroundColor: 'rgba(0,0,0,0.9)',
           padding: 4,
           borderRadius: 2,
           textAlign: 'center'
         }}>
           <Typography variant="h4" color="white" sx={{ mb: 2 }}>🎉 Game Over! 🎉</Typography>
           <Typography variant="h6" color="white" sx={{ mb: 2 }}>
             Winner: {participants.find(p => p.playerId === gameWinner)?.name || gameWinner}
           </Typography>
           <Button
             variant="contained"
             color="primary"
             sx={{ mt: 2 }}
             onClick={() => window.location.href = `/lobby/${lobbyId}`}
           >
             Back to Lobby
           </Button>
         </Box>
       )}
    </Box>
  );
}

export default Game;
