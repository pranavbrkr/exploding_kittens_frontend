import { create } from "zustand";
import { persist } from "zustand/middleware";

const useGameStore = create(
  persist(
    (set) => ({
      token: null,
      playerId: null,
      playerName: '',
      lobbyId: null,
      participants: [],

      setPlayer: (id, name) => set({ playerId: id, playerName: name }),
      setAuth: (token, playerId, name) => set({ token, playerId, playerName: name }),
      setLobby: (lobbyId) => set({ lobbyId }),
      setParticipants: (ids) => set({ participants: ids }),
      resetGame: () => set({ playerId: null, playerName: '', lobbyId: null, participants: [] }),
      logout: () => set({ token: null, playerId: null, playerName: '', lobbyId: null, participants: [] }),
      setLobbyId: (id) => set({ lobbyId: id }),
    }),
    {
      name: "kitten-storage",
      partialize: (state) => ({ token: state.token, playerId: state.playerId, playerName: state.playerName }),
    }
  )
);

export default useGameStore;