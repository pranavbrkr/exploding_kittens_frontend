import { Box } from "@mui/material";

const modalStyle = {
  position: 'absolute',
  top: '25%',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#fff',
  padding: 6,
  borderRadius: 6,
  boxShadow: '0 0 30px rgba(0,0,0,0.6)',
  zIndex: 1000,
  minWidth: 600
};

function BaseModal({ children, show, onClose, style = {} }) {
  if (!show) return null;

  return (
    <Box sx={{ ...modalStyle, ...style }}>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'transparent',
            border: 'none',
            fontSize: 32,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      )}
      {children}
    </Box>
  );
}

export default BaseModal;
