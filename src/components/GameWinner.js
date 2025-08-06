import { Box, Typography, Button } from "@mui/material";

function GameWinner({ gameWinner, participants, lobbyId }) {
  if (!gameWinner) return null;

  return (
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
  );
}

export default GameWinner;
