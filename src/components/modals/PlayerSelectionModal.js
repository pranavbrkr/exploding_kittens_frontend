import { Typography, Stack, Button } from "@mui/material";
import BaseModal from "./BaseModal";

function PlayerSelectionModal({ 
  show, 
  title, 
  targets, 
  participants, 
  onSelect, 
  onClose,
  buttonColor = '#e0e0e0',
  hoverColor = '#bdbdbd',
  borderColor = '#3a3ad6'
}) {
  return (
    <BaseModal 
      show={show} 
      onClose={onClose}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
    >
      <Typography align="center" sx={{ mb: 2 }}>{title}</Typography>
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
        {targets.map(pid => {
          const player = participants.find(p => p.playerId === pid);
          return (
            <Button
              key={pid}
              variant="contained"
              sx={{
                borderRadius: 3,
                fontWeight: 'bold',
                fontSize: 18,
                px: 3,
                py: 1.5,
                boxShadow: 2,
                background: buttonColor,
                color: '#333',
                transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
                '&:hover': {
                  background: hoverColor,
                  color: '#212121',
                  boxShadow: 4,
                  border: `2px solid ${borderColor}`,
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

export default PlayerSelectionModal;
