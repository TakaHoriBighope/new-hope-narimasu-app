import { type Timestamp } from "firebase/firestore";

export type Post = {
  id: string;
  desc: string;
  imgURL: string;
  likes: string[];
  uid: string;
  createdAt: Timestamp;
  username: string;
  read: string[];
};
