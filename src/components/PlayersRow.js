import { Stack } from "@mui/material";
import PlayerCard from "./PlayerCard";

function PlayersRow({ participants, eliminatedPlayers, currentPlayerId, playerId }) {
  return (
    <Stack direction="row" spacing={4} justifyContent="center" mb={4}>
      {participants.map(p => {
        const isEliminated = eliminatedPlayers.includes(p.playerId);
        const isCurrentPlayer = p.playerId === currentPlayerId;
        const isYourTurn = isCurrentPlayer && !isEliminated && p.playerId === playerId;
        
        return (
          <PlayerCard
            key={p.playerId}
            player={p}
            isEliminated={isEliminated}
            isCurrentPlayer={isCurrentPlayer}
            isYourTurn={isYourTurn}
          />
        );
      })}
    </Stack>
  );
}

export default PlayersRow;
