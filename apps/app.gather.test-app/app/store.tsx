import { create } from "zustand"
import { positionInterface } from "@repo/interface/interface"

interface PositionSlice {
  positions: Record<string, positionInterface>
  setPosition: (userId: string, pos: positionInterface) => void
  removeUser: (userId: string) => void
  reset: () => void
}

export const usePosition = create<PositionSlice>((set) => ({
  positions: {},

  setPosition: (userId, pos) =>
    set((state) => ({
      positions: {
        ...state.positions, 
        [userId]: pos       
      }
    })),

  removeUser: (userId) =>
    set((state) => {
      const { [userId]: _, ...rest } = state.positions
      return { positions: rest }
    }),

  reset: () => set({ positions: {} })
}))
