import { Box, Typography } from "@mui/material";

function NotificationSystem({ eliminationNotification, onDismissElimination }) {
  return (
    <>
      {eliminationNotification && (
        <Box sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          backgroundColor: '#d66f6f',
          color: 'white',
          padding: 2,
          borderRadius: 2,
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          minWidth: 300
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
            {eliminationNotification}
          </Typography>
          <button
            onClick={onDismissElimination}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              padding: '0 4px',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </Box>
      )}
    </>
  );
}

export default NotificationSystem;
