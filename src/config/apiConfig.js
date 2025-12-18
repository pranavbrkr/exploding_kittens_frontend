// API Configuration using environment variables
const getEnvVar = (name, defaultValue) => {
  // In production build, React replaces process.env.REACT_APP_* at build time
  // In development, we can use the actual process.env
  return process.env[name] || defaultValue;
};

const config = {
  playerServiceUrl: getEnvVar('REACT_APP_PLAYER_SERVICE_URL', 'http://localhost:8080'),
  lobbyServiceUrl: getEnvVar('REACT_APP_LOBBY_SERVICE_URL', 'http://localhost:8081'),
  gameServiceUrl: getEnvVar('REACT_APP_GAME_SERVICE_URL', 'http://localhost:8082'),
  lobbyWsUrl: getEnvVar('REACT_APP_LOBBY_WS_URL', 'ws://localhost:8081/ws/lobby'),
  gameWsUrl: getEnvVar('REACT_APP_GAME_WS_URL', 'ws://localhost:8082/ws-game'),
};

export default config;

