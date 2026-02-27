import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

/**
 * @param {string} lobbyId
 * @param {() => void} onGameStarted
 * @param {{ onConnected?: () => void, onDisconnected?: () => void }} [opts] - optional connection state callbacks
 */
export const connectToLobbySocket = (lobbyId, onGameStarted, opts = {}) => {
  const { onConnected, onDisconnected } = opts;
  const socket = new SockJS("http://localhost:8080/ws/lobby");
  stompClient = new Client({
    webSocketFactory: () => socket,
    onConnect: () => {
      onConnected?.();
      stompClient.subscribe(`/topic/lobby/${lobbyId}`, (message) => {
        if (message.body === "gameStarted") {
          onGameStarted();
        }
      });
    },
    onDisconnect: () => {
      onDisconnected?.();
    },
  });
  stompClient.activate();
};

export const disconnectLobbySocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};