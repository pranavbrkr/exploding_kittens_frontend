import { create } from "zustand";

const useGameStore = create((set) => ({
  playerId: null,
  playerName: '',
  lobbyId: null,
  participants: [],

  setPlayer: (id, name) => set({ playerId: id, playerName: name }),
  setLobby: (lobbyId) => set({ lobbyId }),
  setParticipants: (ids) => set({ participants: ids }),
  resetGame: () => set({ playerId: null, playerName: '', lobbyId: null, participants: [] }),
  setLobbyId: (id) => set({ lobbyId: id }),
}));

export default useGameStore;