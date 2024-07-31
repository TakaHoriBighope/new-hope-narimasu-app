import { createContext } from "react";
import { type User } from "../types/user";

type UserContextValue = {
  user: User | null | undefined;
  setUser: (user: User | null | undefined) => void;
};

export const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {},
});
