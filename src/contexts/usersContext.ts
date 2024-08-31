import { createContext } from "react";

type UsersContextValue = {
  users: string[];
  setUsers: (users: string[]) => void;
};

export const UsersContext = createContext<UsersContextValue>({
  users: [],
  setUsers: () => {},
});
