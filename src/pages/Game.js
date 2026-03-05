import { useParams } from "react-router-dom";
import useGameStore from "../store/useGameStore";
import { Box } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { connectToGameSocket, disconnectGameSocket } from "../ws/GameSocket";

// Import all the new components
import PlayersRow from "../components/PlayersRow";
import UsedCard from "../components/UsedCard";
import Deck from "../components/Deck";
import PlayerHand from "../components/PlayerHand";
import GameControls from "../components/GameControls";
import NotificationSystem from "../components/NotificationSystem";
import GameWinner from "../components/GameWinner";
import ActionWindow from "../components/ActionWindow";

// Import modal components
import FutureModal from "../components/modals/FutureModal";
import AlterModal from "../components/modals/AlterModal";
import PlayerSelectionModal from "../components/modals/PlayerSelectionModal";
import GiveCardModal from "../components/modals/GiveCardModal";
import CatStealModal from "../components/modals/CatStealModal";
import CatIndexModal from "../components/modals/CatIndexModal";

function Game() {
  const { lobbyId } = useParams();
  const { playerId, playerName, participants } = useGameStore();
  
  // Game state
  const [hand, setHand] = useState([]);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [usedCards, setUsedCards] = useState([]);
  const [eliminatedPlayers, setEliminatedPlayers] = useState([]);
  const [gameWinner, setGameWinner] = useState(null);
  
  // Modal states
  const [futureCards, setFutureCards] = useState([]);
  const [showFutureModal, setShowFutureModal] = useState(false);
  const [alterCards, setAlterCards] = useState([]);
  const [showAlterModal, setShowAlterModal] = useState(false);
  const [favorTargets, setFavorTargets] = useState([]);
  const [favorFrom, setFavorFrom] = useState(null);
  const [showFavorSelectModal, setShowFavorSelectModal] = useState(false);
  const [showGiveCardModal, setShowGiveCardModal] = useState(false);
  const [targetedAttackTargets, setTargetedAttackTargets] = useState([]);
  const [showTargetedAttackModal, setShowTargetedAttackModal] = useState(false);
  const [catTargets, setCatTargets] = useState([]);
  const [showCatOpponentModal, setShowCatOpponentModal] = useState(false);
  const [catStealOptions, setCatStealOptions] = useState([]);
  const [showCatIndexModal, setShowCatIndexModal] = useState(false);
  
  // Cat card selection
  const [selectedCatCards, setSelectedCatCards] = useState([]);
  const [showStealButton, setShowStealButton] = useState(false);
  const [showDefuseStealButton, setShowDefuseStealButton] = useState(false);
  
  // Notifications
  const [eliminationNotification, setEliminationNotification] = useState(null);
  const [actionNotifications, setActionNotifications] = useState([]);
  const notifiedEliminationsRef = useRef(new Set());

  // WebSocket connection state: fallback polling only when disconnected
  const [gameSocketConnected, setGameSocketConnected] = useState(false);

  // Action log: new actions pushed to front, kept for the whole game (display-only list)
  const addActionNotification = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setActionNotifications(prev => [{ id, message, type }, ...prev]);
  };

  const refreshGameState = async () => {
    try {
      const res = await axios.get(`http://localhost:8082/api/game/${lobbyId}`);
      const gameState = res.data;

      const current = gameState.players[gameState.currentPlayerIndex]?.playerId;
      if (current) setCurrentPlayerId(current);
      
      // Check for new eliminations
      const newEliminatedPlayers = gameState.eliminatedPlayers || [];
      
      // Find players that are newly eliminated
      const newlyEliminated = newEliminatedPlayers.filter(id => !notifiedEliminationsRef.current.has(id));
      
      if (newlyEliminated.length > 0) {
        const eliminatedPlayerName = participants.find(p => p.playerId === newlyEliminated[0])?.name || 'Unknown Player';
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
      const winnerRes = await axios.get(`http://localhost:8082/api/game/${lobbyId}/winner`);
      if (winnerRes.data) {
        setGameWinner(winnerRes.data);
      }
    } catch (err) {
      console.log("Failed to refresh game state", err);
    }
  };

  // Card click handler with cat combo logic
  const handleCardClick = async (card, idx) => {
              if (playerId !== currentPlayerId) return;

    // Cat card selection logic
              if (card.startsWith("CAT_")) {
                const alreadySelected = selectedCatCards.find(c => c.index === idx);
                let newSelection;

                if (alreadySelected) {
                  newSelection = selectedCatCards.filter(c => c.index !== idx);
                } else {
                  newSelection = [...selectedCatCards, { card, index: idx }];
                }

                setSelectedCatCards(newSelection);

      // Check for valid cat combinations including feral cats
      const feralCount = newSelection.filter(c => c.card === "CAT_FERAL").length;
      const regularCats = newSelection.filter(c => c.card !== "CAT_FERAL");
      
      // Count regular cat types
      const regularCatCounts = regularCats.reduce((acc, cur) => {
                  acc[cur.card] = (acc[cur.card] || 0) + 1;
                  return acc;
                }, {});

      // Check for valid combinations
      let canStealRandom = false;
      let canStealDefuse = false;

      // For steal random (2 cards)
      if (newSelection.length === 2) {
        if (newSelection[0].card === newSelection[1].card && newSelection[0].card.startsWith("CAT_")) {
          canStealRandom = true;
        }
        else if (feralCount === 1 && regularCats.length === 1) {
          canStealRandom = true;
        }
      }

      // For steal defuse (3 cards)
      if (newSelection.length === 3) {
        if (newSelection[0].card === newSelection[1].card && newSelection[1].card === newSelection[2].card && newSelection[0].card.startsWith("CAT_")) {
          canStealDefuse = true;
        }
        else if (feralCount === 2 && regularCats.length === 1) {
          canStealDefuse = true;
        }
        else if (feralCount === 1 && regularCats.length === 2) {
          const regularCatTypes = Object.keys(regularCatCounts);
          if (regularCatTypes.length === 1 && regularCatCounts[regularCatTypes[0]] === 2) {
            canStealDefuse = true;
          }
        }
      }

      setShowStealButton(canStealRandom);
      setShowDefuseStealButton(canStealDefuse);

                return;
              }

    // Normal card play
              try {
      await axios.post(`http://localhost:8082/api/game/play/${lobbyId}`, null, {
                  params: { playerId, cardType: card },
                });
                setHand(prev => prev.filter((_, i) => i !== idx));
                await refreshGameState();
              } catch (err) {
                console.error("Failed to play card", err);
              }
  };

  // Game action handlers
  const handleDrawCard = async () => {
    if (playerId !== currentPlayerId) return;
    try {
      await axios.post(`http://localhost:8082/api/game/draw/${lobbyId}`, null, {
        params: { playerId },
      });
      await refreshGameState();
    } catch (err) {
      console.error("Failed to draw card", err);
    }
  };

  const handleStealCard = async () => {
    setShowStealButton(false);
    const catCards = selectedCatCards.map(c => c.card);
    try {
      await axios.post(`http://localhost:8082/api/game/cat-combo/${lobbyId}`, catCards, {
        params: { playerId }
      });

      // Remove selected cat cards from hand
      const updatedHand = hand.filter((_, i) =>
        !selectedCatCards.some(c => c.index === i)
      );
      setHand(updatedHand);
      setSelectedCatCards([]);
    } catch (err) {
      console.error("Failed to send cat combo", err);
    }
  };

  const handleStealDefuse = async () => {
    const catCards = selectedCatCards.map(c => c.card);
    try {
      await axios.post(`http://localhost:8082/api/game/cat-combo/${lobbyId}`, catCards, {
                    params: { playerId }
                  });

      // Remove selected cat cards from hand
      const updatedHand = hand.filter((_, i) =>
        !selectedCatCards.some(c => c.index === i)
      );
      setHand(updatedHand);
      setSelectedCatCards([]);
      setShowDefuseStealButton(false);
                } catch (err) {
      console.error("Failed to send cat combo", err);
    }
  };

  // Modal handlers
  const handleFavorSelect = async (pid) => {
    await axios.post(`http://localhost:8082/api/game/favor/request/${lobbyId}`, null, {
                      params: { fromPlayerId: playerId, toPlayerId: pid }
                    });
                    setShowFavorSelectModal(false);
  };

  const handleGiveCard = async (card, idx) => {
    await axios.post(`http://localhost:8082/api/game/favor/response/${lobbyId}`, null, {
                      params: {
                        fromPlayerId: playerId,
                        toPlayerId: favorFrom,
                        givenCard: card
                      }
                    });
                    setHand(prev => prev.filter((_, i) => i !== idx));
                    setShowGiveCardModal(false);
  };

  const handleTargetedAttackSelect = async (pid) => {
    await axios.post(`http://localhost:8082/api/game/targeted/confirm/${lobbyId}`, null, {
                      params: { fromPlayerId: playerId, toPlayerId: pid }
                    });
                    setShowTargetedAttackModal(false);
  };

  const handleCatOpponentSelect = async (pid) => {
    await axios.post(`http://localhost:8082/api/game/cat/steal/${lobbyId}`, null, {
                      params: { fromPlayerId: playerId, toPlayerId: pid }
                    });
                    setShowCatOpponentModal(false);
  };

  const handleCatIndexSelect = async (index) => {
    await axios.post(`http://localhost:8082/api/game/cat/steal/resolve/${lobbyId}`, null, {
                    params: { stealerId: playerId, selectedIndex: index }
                  });
                  setShowCatIndexModal(false);
                  await refreshGameState();
  };

  const handleAlterConfirm = async () => {
    try {
      await axios.post(`http://localhost:8082/api/game/alter/${lobbyId}`, alterCards, {
        params: { playerId }
      });
      setShowAlterModal(false);
    } catch (err) {
      console.error("Failed to update deck order", err);
    }
  };

  useEffect(() => {
    refreshGameState();
  }, [lobbyId, playerId]);

  useEffect(() => {
    connectToGameSocket(
      lobbyId,
      setCurrentPlayerId,
      refreshGameState,
      cards => {
        setFutureCards(cards);
        setShowFutureModal(true);
      },
      cards => {
        setAlterCards(cards);
        setShowAlterModal(true);
      },
      targets => {
        setFavorTargets(targets);
        setShowFavorSelectModal(true);
      },
      fromId => {
        setFavorFrom(fromId);
        setShowGiveCardModal(true);
      },
      (targets) => {
        setTargetedAttackTargets(targets);
        setShowTargetedAttackModal(true);
      },
      addActionNotification,
      {
        onConnected: () => setGameSocketConnected(true),
        onDisconnected: () => setGameSocketConnected(false),
      }
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

  // Fallback: slow poll only when game WebSocket is disconnected (so WS bugs are visible when connected)
  const FALLBACK_POLL_MS = 5000;
  useEffect(() => {
    if (gameSocketConnected) return;
    const interval = setInterval(refreshGameState, FALLBACK_POLL_MS);
    return () => clearInterval(interval);
  }, [lobbyId, gameSocketConnected]);

  const latestUsedCard = usedCards[usedCards.length - 1];
  const isCurrentPlayer = playerId === currentPlayerId;

  return (
    <Box sx={{ 
      height: '100vh', 
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: '#3a3ad6',
      overflow: 'hidden'
    }}>
      {/* Game area: 80% left */}
      <Box sx={{
        width: '80%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        p: 4,
        minWidth: 0
      }}>
        <NotificationSystem
          eliminationNotification={eliminationNotification}
          onDismissElimination={() => setEliminationNotification(null)}
        />

        {/* Game deck: top-right corner of game area */}
        <Box sx={{ position: 'absolute', top: 28, right: 32, zIndex: 10 }}>
          <Deck
            onDrawCard={handleDrawCard}
            canDraw={isCurrentPlayer}
          />
        </Box>

        <PlayersRow
          participants={participants}
          eliminatedPlayers={eliminatedPlayers}
          currentPlayerId={currentPlayerId}
          playerId={playerId}
        />

        {/* Center area: used card + hand (deck is in top-right of game area) */}
        <Box sx={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 0, pb: 20 }}>
          <UsedCard latestUsedCard={latestUsedCard} />
          <PlayerHand
            hand={hand}
            selectedCatCards={selectedCatCards}
            onCardClick={handleCardClick}
            isCurrentPlayer={currentPlayerId}
            playerId={playerId}
          />
          <GameControls
            showStealButton={showStealButton}
            showDefuseStealButton={showDefuseStealButton}
            onStealCard={handleStealCard}
            onStealDefuse={handleStealDefuse}
          />
        </Box>
      </Box>

      {/* Game actions: 20% right, full height */}
      <Box sx={{ width: '20%', height: '100%', minWidth: 0 }}>
        <ActionWindow actions={actionNotifications} />
      </Box>

      {/* Modals */}
      <FutureModal
        show={showFutureModal}
        futureCards={futureCards}
        onClose={() => setShowFutureModal(false)}
      />

      <AlterModal
        show={showAlterModal}
        alterCards={alterCards}
        onAlterCards={setAlterCards}
        onConfirm={handleAlterConfirm}
        onClose={() => setShowAlterModal(false)}
      />

      <PlayerSelectionModal
        show={showFavorSelectModal}
        title="Select a player to request favor from:"
        targets={favorTargets}
        participants={participants}
        onSelect={handleFavorSelect}
        onClose={() => setShowFavorSelectModal(false)}
      />

      <GiveCardModal
        show={showGiveCardModal}
        hand={hand}
        onSelectCard={handleGiveCard}
        onClose={() => setShowGiveCardModal(false)}
      />

      <PlayerSelectionModal
        show={showTargetedAttackModal}
        title="Select a player to attack:"
        targets={targetedAttackTargets}
        participants={participants}
        onSelect={handleTargetedAttackSelect}
        onClose={() => setShowTargetedAttackModal(false)}
        buttonColor="#e0e0e0"
        hoverColor="#bdbdbd"
        borderColor="#ff1744"
      />

      <CatStealModal
        show={showCatOpponentModal}
        targets={catTargets}
        participants={participants}
        onSelect={handleCatOpponentSelect}
        onClose={() => setShowCatOpponentModal(false)}
      />

      <CatIndexModal
        show={showCatIndexModal}
        indices={catStealOptions}
        onSelect={handleCatIndexSelect}
        onClose={() => setShowCatIndexModal(false)}
      />

      {/* Game Winner */}
      <GameWinner
        gameWinner={gameWinner}
        participants={participants}
        lobbyId={lobbyId}
      />
    </Box>
  );
}

export default Game;