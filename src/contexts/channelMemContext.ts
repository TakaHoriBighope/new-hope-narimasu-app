import { createContext } from "react";

type ChannelMemContextValue = {
  channelMems: string[];
  setChannelMems: (channelMems: string[]) => void;
};

export const ChannelMemContext = createContext<ChannelMemContextValue>({
  channelMems: [],
  setChannelMems: () => {},
});
