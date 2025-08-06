import { Box } from "@mui/material";

function Deck({ onDrawCard, canDraw }) {
  return (
    <Box sx={{ position: 'absolute', top: 32, right: 32 }}>
      <img
        src="/assets/cards/BACK.png"
        alt="deck"
        width={80}
        style={{ 
          borderRadius: 12,
          cursor: canDraw ? 'pointer' : 'not-allowed',
          opacity: canDraw ? 1 : 0.6
        }}
        onClick={canDraw ? onDrawCard : undefined}
      />
    </Box>
  );
}

export default Deck;
