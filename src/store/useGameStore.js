import { create } from "zustand";

const useGameStore = create((set) => ({
  playerId: null,
  playerName: '',
  lobbyId: null,
  opponentIds: [],

  setPlayer: (id, name) => set({ playerId: id, playerName: name }),
  setLobby: (lobbyId) => set({ lobbyId }),
  setOpponents: (ids) => set({ opponentIds: ids }),
  resetGame: () => set({ playerId: null, playerName: '', lobbyId: null, opponentIds: [] }),
  setLobbyId: (id) => set({ lobbyId: id }),
}));

export default useGameStore;