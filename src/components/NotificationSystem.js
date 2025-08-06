import { Box, Typography } from "@mui/material";

function NotificationSystem({ eliminationNotification, actionNotifications, onDismissElimination, onDismissAction }) {
  return (
    <>
      {/* Elimination Notification */}
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

      {/* Action Notifications */}
      <Box sx={{
        position: 'absolute',
        top: 80,
        left: 20,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        maxWidth: 400,
        '@keyframes slideInRight': {
          from: {
            transform: 'translateX(100%)',
            opacity: 0
          },
          to: {
            transform: 'translateX(0)',
            opacity: 1
          }
        }
      }}>
        {actionNotifications.map((notification) => (
          <Box
            key={notification.id}
            sx={{
              backgroundColor: notification.type === 'info' ? '#4a90e2' :
                              notification.type === 'success' ? '#4caf50' :
                              notification.type === 'warning' ? '#ff9800' : '#f44336',
              color: 'white',
              padding: 1.5,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              minWidth: 300,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              animation: 'slideInRight 0.3s ease-out'
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold', flex: 1 }}>
              {notification.message}
            </Typography>
            <button
              onClick={() => onDismissAction(notification.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                padding: '0 2px',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
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
        ))}
      </Box>
    </>
  );
}

export default NotificationSystem;
