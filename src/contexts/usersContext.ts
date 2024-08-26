import { createContext } from "react";
// import { type User } from "../types/user";

type UsersContextValue = {
  users: string[];
  setUsers: (users: string[]) => void;
};

export const UsersContext = createContext<UsersContextValue>({
  users: [],
  setUsers: () => {},
});
