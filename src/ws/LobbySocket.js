import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export const connectToLobbySocket = (lobbyId, onGameStarted) => {
  const socket = new SockJS("http://localhost:8081/ws/lobby");
  stompClient = new Client({
    webSocketFactory: () => socket,
    onConnect: () => {
      stompClient.subscribe(`/topic/lobby/${lobbyId}`, (message) => {
        if (message.body === "gameStarted") {
          onGameStarted();
        }
      });
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