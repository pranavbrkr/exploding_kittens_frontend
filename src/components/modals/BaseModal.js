import { Box } from "@mui/material";

const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.35)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  zIndex: 999
};

const modalStyle = {
  position: 'fixed',
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
    <>
      <Box sx={backdropStyle} onClick={onClose || undefined} aria-hidden />
      <Box sx={{ ...modalStyle, ...style }} onClick={(e) => e.stopPropagation()}>
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
    </>
  );
}

export default BaseModal;
