import { type Timestamp } from "firebase/firestore";

export type Message = {
  uid: string;
  createdAt: Timestamp;
  talk: string;
  profilePicture: string;
  email: string;
  username: string;
  read: string[];
};
