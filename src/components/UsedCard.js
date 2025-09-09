import { Box } from "@mui/material";

function UsedCard({ latestUsedCard }) {
  if (!latestUsedCard) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
      <img
        src={`/assets/cards/${latestUsedCard.toLowerCase().replace(/\s+/g, '_')}.jpg`}
        alt={latestUsedCard}
        width={100}
        style={{ borderRadius: 12, boxShadow: '0 0 10px rgba(0,0,0,0.3)' }}
      />
    </Box>
  );
}

export default UsedCard;
