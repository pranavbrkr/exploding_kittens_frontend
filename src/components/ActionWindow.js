import { Box, Typography } from "@mui/material";

function ActionWindow({ actions }) {
  const getBgColor = (type) => {
    switch (type) {
      case 'success': return '#2e7d32';
      case 'warning': return '#ed6c02';
      case 'error': return '#c62828';
      default: return '#1565c0';
    }
  };

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderLeft: '1px solid rgba(255,255,255,0.2)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{
        px: 2,
        py: 1.5,
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        backgroundColor: 'rgba(0,0,0,0.2)'
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white' }}>
          Game actions
        </Typography>
      </Box>
      <Box sx={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 1.5
      }}>
        {actions.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
            No actions yet
          </Typography>
        ) : (
          actions.map((item) => (
            <Box
              key={item.id}
              sx={{
                backgroundColor: getBgColor(item.type),
                color: 'white',
                padding: 1.25,
                borderRadius: 1.5,
                border: '1px solid rgba(255,255,255,0.15)'
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {item.message}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}

export default ActionWindow;
