import { Box, Typography } from "@mui/material";
import BaseModal from "./BaseModal";

function GiveCardModal({ show, hand, onSelectCard, onClose }) {
  return (
    <BaseModal show={show} onClose={onClose}>
        <Typography>Select a card to give to the favor requester:</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {hand.map((card, idx) => (
            <img
              key={idx}
              src={`/assets/cards/${card}.jpg`}
              alt={card}
              width={100}
              onClick={() => onSelectCard(card, idx)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
    </BaseModal>
  );
}

export default GiveCardModal;
