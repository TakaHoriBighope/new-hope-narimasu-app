import { auth, db } from "@/src/config";
import { Info } from "../types/info";
import {
  CollectionReference,
  DocumentData,
  Timestamp,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

export const updateUser = async (userId: string, params: any) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { params }); // {name: "Taka"}
};

export const infoCreateRef = async (infoId: string) => {
  let collectionRef: CollectionReference<DocumentData> = collection(
    db,
    "infos",
    String(infoId)
  );
  return await doc(collectionRef);
};

export const userCreateRef = async (userId: string) => {
  let collectionRef: CollectionReference<DocumentData> = collection(
    db,
    "users",
    String(userId)
  );
  return await doc(collectionRef);
};
export const postCreateRef = async (postId: string) => {
  let collectionRef: CollectionReference<DocumentData> = collection(
    db,
    "posts",
    String(postId)
  );
  return await doc(collectionRef);
};

export const getInfos = async () => {
  if (auth.currentUser === null) {
    return;
  }
  const q = query(collection(db, "infos"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const remoteInfos: Info[] = [];
  querySnapshot.forEach((doc) => {
    const { desc, imgURL, uid, likes, createdAt, read } = doc.data();
    remoteInfos.push({
      id: doc.id,
      desc,
      imgURL,
      uid,
      likes,
      createdAt,
      read,
    });
  });
  return remoteInfos;
};
