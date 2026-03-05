import { Box, Typography } from "@mui/material";

// Same purple as Welcome/login screen gradient (#780178)
const MOVE_ITEM_PURPLE = '#780178';

function ActionWindow({ actions }) {
  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      backgroundColor: '#d0d0d0',
      borderLeft: '1px solid #bdbdbd',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{
        px: 2,
        py: 1.5,
        borderBottom: '1px solid #424242',
        backgroundColor: '#424242'
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white' }}>
          Moves history
        </Typography>
      </Box>
      <Box sx={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 1.5,
        backgroundColor: '#9e9e9e'
      }}>
        {actions.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#757575', fontStyle: 'italic' }}>
            No moves yet
          </Typography>
        ) : (
          actions.map((item) => (
            <Box
              key={item.id}
              sx={{
                backgroundColor: MOVE_ITEM_PURPLE,
                color: 'white',
                padding: 1.25,
                borderRadius: 1.5,
                border: '1px solid rgba(255,255,255,0.2)'
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
