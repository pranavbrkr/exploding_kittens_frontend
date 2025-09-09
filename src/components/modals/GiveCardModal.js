import { Box, Typography } from "@mui/material";
import BaseModal from "./BaseModal";

function GiveCardModal({ show, hand, onSelectCard, onClose }) {
  return (
    <>
      {show && (
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
      )}
      <BaseModal show={show} onClose={onClose} style={{ zIndex: 1000 }}>
        <Typography>Select a card to give to the favor requester:</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {hand.map((card, idx) => (
            <img
              key={idx}
              src={`/assets/cards/${card.toLowerCase()}.jpg`}
              alt={card}
              width={100}
              onClick={() => onSelectCard(card, idx)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </BaseModal>
    </>
  );
}

export default GiveCardModal;
