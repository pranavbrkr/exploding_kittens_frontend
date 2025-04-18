import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import WaitingRoom from "./pages/WaitingRoom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/waiting" element={<WaitingRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
