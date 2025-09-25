import { Box } from "@mui/material";

function GameControls({ 
  showStealButton,
  showDefuseStealButton,
  onStealCard,
  onStealDefuse
}) {
  return (
    <>

      {/* Cat Combo Buttons */}
      {showStealButton && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <button
            onClick={onStealCard}
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
            onClick={onStealDefuse}
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
    </>
  );
}

export default GameControls;
