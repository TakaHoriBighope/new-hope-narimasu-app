import { createContext } from "react";
import { type Info } from "../types/info";

type InfosContextValue = {
  infos: Info[];
  setInfos: (infos: Info[]) => void;
};

export const InfosContext = createContext<InfosContextValue>({
  infos: [],
  setInfos: () => {},
});
