import { Box, Typography, Avatar } from "@mui/material";

function PlayerCard({ player, isEliminated, isCurrentPlayer, isYourTurn }) {
  return (
    <Box key={player.playerId} sx={{ textAlign: 'center' }}>
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
        {player.name}
      </Typography>
      {isYourTurn && (
        <Typography variant="caption" color="yellow" sx={{ fontWeight: 'bold' }}>
          YOUR TURN
        </Typography>
      )}
    </Box>
  );
}

export default PlayerCard;
