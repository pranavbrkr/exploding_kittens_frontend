import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react"

function WelcomePage({ onSubmitName }) {
  const [name, setName] = useState('')

  const handleSubmit = () => {
    if(name.trim() !== '') {
      onSubmitName(name.trim());
    }
  }

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        background: 'linear-gradient(to bottom right, #780178, #330133)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          minWidth: 350,
          backgroundColor: 'white',
          textAlign: 'center',
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome to Exploding Kittens
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Enter your game name
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" fullWidth onClick={handleSubmit}>
          Continue
        </Button>        
      </Paper>      
    </Box>
  )
}
export default WelcomePage