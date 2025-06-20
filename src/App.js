import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import WaitingRoom from "./pages/WaitingRoom";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/waiting" element={<WaitingRoom />} />
        <Route path="/lobby/:lobbyId" element={<Lobby />} />
        <Route path="/game/:lobbyId" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
