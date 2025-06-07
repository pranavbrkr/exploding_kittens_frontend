import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export const connectToGameSocket = (lobbyId, onTurnChange, onGameStateUpdate) => {
  const socket = new SockJS("http://localhost:8082/ws-game");
  stompClient = new Client({
    webSocketFactory: () => socket,
    onConnect: () => {
      stompClient.subscribe(`/topic/game/${lobbyId}/turn`, (msg) => {
        onTurnChange(msg.body);
      });

      stompClient.subscribe(`/topic/game/${lobbyId}/state`, () => {
        onGameStateUpdate();
      })
    },
  });
  stompClient.activate();
};

export const disconnectGameSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
}