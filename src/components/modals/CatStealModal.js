import { Typography, Stack, Button } from "@mui/material";
import BaseModal from "./BaseModal";

function CatStealModal({ show, targets, participants, onSelect, onClose }) {
  return (
    <BaseModal show={show} onClose={onClose}>
      <Typography>Select an opponent to steal from:</Typography>
      <Stack direction="row" spacing={2}>
        {targets.map(pid => {
          const player = participants.find(p => p.playerId === pid);
          return (
            <Button
              key={pid}
              variant="contained"
              color="secondary"
              sx={{
                borderRadius: 3,
                fontWeight: 'bold',
                fontSize: 18,
                px: 3,
                py: 1.5,
                boxShadow: 2,
                background: 'linear-gradient(90deg, #9c27b0 60%, #ce93d8 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(90deg, #ce93d8 60%, #9c27b0 100%)',
                  boxShadow: 4
                }
              }}
              onClick={() => onSelect(pid)}
            >
              {player?.name || pid}
            </Button>
          );
        })}
      </Stack>
    </BaseModal>
  );
}

export default CatStealModal;
