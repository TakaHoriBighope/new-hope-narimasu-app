import { createContext } from "react";
import { type Message } from "../types/message";

type MessageContextValue = {
  message: Message | null | undefined;
  setMessage: (message: Message | null | undefined) => void;
};

export const MessageContext = createContext<MessageContextValue>({
  message: null,
  setMessage: () => {},
});
