import { type Timestamp } from "firebase/firestore";

export type Info = {
  id: string;
  desc: string;
  imgURL: string;
  likes: string[];
  uid: string;
  createdAt: Timestamp;
  read: string[];
};
