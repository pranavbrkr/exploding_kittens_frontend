import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import useGameStore from "../store/useGameStore";

let stompClient = null;
let onFuturePeek = null;
let onAlterFuture = null;
let onFavorTargetRequest = null;
let onFavorRequest = null;
let onTargetedAttackRequest = null;
let onActionNotification = null;

export const connectToGameSocket = (lobbyId, onTurnChange, onGameStateUpdate, futurePeekCallback, alterFutureCallback, favorTargetCallback, favorRequestCallback, targetedAttackCallback, actionNotificationCallback) => {
  onFuturePeek = futurePeekCallback
  onAlterFuture = alterFutureCallback
  onFavorTargetRequest = favorTargetCallback;
  onFavorRequest = favorRequestCallback;
  onTargetedAttackRequest = targetedAttackCallback;
  onActionNotification = actionNotificationCallback;

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

      stompClient.subscribe(`/topic/game/${lobbyId}/favor/select/${useGameStore.getState().playerId}`, (msg) => {
        const targets = JSON.parse(msg.body);
        if (onFavorTargetRequest) onFavorTargetRequest(targets);
      });

      stompClient.subscribe(`/topic/game/${lobbyId}/favor/request/${useGameStore.getState().playerId}`, (msg) => {
        const fromPlayerId = msg.body;
        if (onFavorRequest) onFavorRequest(fromPlayerId);
      });

      stompClient.subscribe(`/topic/game/${lobbyId}/targeted/select/${useGameStore.getState().playerId}`, (msg) => {
        const targets = JSON.parse(msg.body);
        if (onTargetedAttackRequest) onTargetedAttackRequest(targets);
      });

      stompClient.subscribe(`/topic/game/${lobbyId}/cat/select-opponent/${useGameStore.getState().playerId}`, (msg) => {
        const targets = JSON.parse(msg.body);
        if (window.onCatOpponentSelect) window.onCatOpponentSelect(targets);
      });

      stompClient.subscribe(`/topic/game/${lobbyId}/cat/select-number/${useGameStore.getState().playerId}`, (msg) => {
        const options = JSON.parse(msg.body);
        if (window.onCatIndexSelect) window.onCatIndexSelect(options);
      });

      stompClient.subscribe(`/topic/game/${lobbyId}/action`, (msg) => {
        const actionData = JSON.parse(msg.body);
        if (onActionNotification) onActionNotification(actionData.message, actionData.type);
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