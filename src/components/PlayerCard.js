import { Box, Typography, Avatar } from "@mui/material";

function PlayerCard({ player, isEliminated, isCurrentPlayer, isYourTurn }) {
  return (
    <Box key={player.playerId} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 44 }}>
      <Avatar 
        sx={{ 
          width: 44, 
          height: 44, 
          bgcolor: isEliminated ? 'red' : isCurrentPlayer ? 'yellow' : 'transparent', 
          border: '3px solid black',
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
        variant="body2"
        color="white" 
        sx={{ 
          mt: 0.5,
          fontSize: '0.75rem',
          textAlign: 'center',
          textDecoration: isEliminated ? 'line-through' : 'none',
          opacity: isEliminated ? 0.6 : 1,
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
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
