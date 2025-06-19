import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import useGameStore from "../store/useGameStore";

let stompClient = null;
let onFuturePeek = null;
let onAlterFuture = null;

export const connectToGameSocket = (lobbyId, onTurnChange, onGameStateUpdate, futurePeekCallback, alterFutureCallback) => {
  onFuturePeek = futurePeekCallback
  onAlterFuture = alterFutureCallback

  const socket = new SockJS("http://localhost:8082/ws-game");
  stompClient = new Client({
    webSocketFactory: () => socket,
    onConnect: () => {
      stompClient.subscribe(`/topic/game/${lobbyId}/turn`, (msg) => {
        onTurnChange(msg.body);
      });

      stompClient.subscribe(`/topic/game/${lobbyId}/state`, () => {
        onGameStateUpdate();
      });

      stompClient.subscribe(`/topic/game/${lobbyId}/future/${useGameStore.getState().playerId}`, (msg) => {
        const cards = JSON.parse(msg.body);
        if (onFuturePeek) onFuturePeek(cards);
      });

      stompClient.subscribe(`/topic/game/${lobbyId}/alter/${useGameStore.getState().playerId}`, (msg) => {
        const cards = JSON.parse(msg.body);
        if (onAlterFuture) onAlterFuture(cards);
      });
    },
  });
  stompClient.activate();
};

export const disconnectGameSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
}