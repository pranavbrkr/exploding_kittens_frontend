import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import apiConfig from "../config/apiConfig";

let stompClient = null;

export const connectToLobbySocket = (lobbyId, onGameStarted) => {
  const socket = new SockJS(apiConfig.lobbyWsUrl.replace('ws://', 'http://').replace('wss://', 'https://'));
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