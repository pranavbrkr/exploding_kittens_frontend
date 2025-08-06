import { Typography, Stack, Button } from "@mui/material";
import BaseModal from "./BaseModal";

function CatIndexModal({ show, indices, onSelect, onClose }) {
  return (
    <BaseModal show={show} onClose={onClose}>
      <Typography>Select a number to steal that card:</Typography>
      <Stack direction="row" spacing={2}>
        {indices.map(index => (
          <Button
            key={index}
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
            onClick={() => onSelect(index)}
          >
            {index}
          </Button>
        ))}
      </Stack>
    </BaseModal>
  );
}

export default CatIndexModal;
