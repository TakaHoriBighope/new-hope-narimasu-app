import { createContext } from "react";
import { type Info } from "../types/info";

type InfoContextValue = {
  info: Info | null | undefined;
  setInfo: (info: Info | null | undefined) => void;
};

export const InfoContext = createContext<InfoContextValue>({
  info: null,
  setInfo: () => {},
});
