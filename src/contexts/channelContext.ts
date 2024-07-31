import { createContext } from "react";
import { type Channel } from "../types/channel";

type ChannelContextValue = {
  channel: Channel | null | undefined;
  setChannel: (channel: Channel | null | undefined) => void;
};

export const ChannelContext = createContext<ChannelContextValue>({
  channel: null,
  setChannel: () => {},
});
