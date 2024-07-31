import { createContext } from "react";

type InfoReadCountValue = {
  infoReadCount: number;
  setInfoReadCount: (infoReadCount: number) => void;
};

export const InfoReadCountContext = createContext<InfoReadCountValue>({
  infoReadCount: 0,
  setInfoReadCount: () => {},
});
