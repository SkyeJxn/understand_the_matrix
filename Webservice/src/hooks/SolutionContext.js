import { createContext, useContext } from "react";

export const SolutionContext = createContext(null);

export function useSolution() {
  return useContext(SolutionContext);
}
