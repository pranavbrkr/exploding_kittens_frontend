import { Box } from "@mui/material";

function PlayerHand({ 
  hand, 
  selectedCatCards, 
  onCardClick, 
  isCurrentPlayer, 
  playerId 
}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, flexWrap: 'wrap' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 6,
          flexWrap: 'wrap',
          p: 2,
          borderRadius: 4,
          boxShadow: playerId === isCurrentPlayer 
            ? '0 0 15px 4px #00e676' 
            : 'none',
          transition: 'box-shadow 0.3s ease-in-out',
          border: playerId === isCurrentPlayer ? '2px solid #00e676' : 'none',
          backgroundColor: playerId === isCurrentPlayer ? '#f1f8e9' : 'transparent'
        }}
      >
        {hand.map((card, idx) => (
          <img
            key={idx}
            src={`/assets/cards/${card.toLowerCase()}.jpg`}
            alt={card}
            width={80}
            style={{ 
              margin: '0 8px 12px 8px', 
              cursor: 'pointer',
              border: selectedCatCards.some(c => c.index === idx)
                ? '4px solid #9c27b0'
                : '2px solid transparent',
              boxShadow: selectedCatCards.some(c => c.index === idx)
                ? '0 0 12px 4px #9c27b080'
                : 'none',
              transition: 'box-shadow 0.2s ease, border 0.2s ease'
            }}
            onClick={() => onCardClick(card, idx)}
          />
        ))}
      </Box>
    </Box>
  );
}

export default PlayerHand;
