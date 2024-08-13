import { auth, db } from "@/src/config";
import { User } from "@/src/types/user";
import { Info } from "../types/info";
import { initialUser } from "@/src/types/user";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  CollectionReference,
  DocumentData,
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

// export const getInfos = async () => {
//   const q = query(collection(db, "infos"), orderBy("createdAt", "desc"));

//   const querySnapshot = await getDocs(q);
//   const shops = querySnapshot.docs.map(
//     (doc) => ({ ...doc.data(), id: doc.id } as Info)
//   );
//   return shops;
// };

export const updateUser = async (userId: string, params: any) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { params }); // {name: "Taka"}
};

// export const signin = async (email: string, password: string) => {
//   // const auth = getAuth();
//   const userCredential = await signInWithEmailAndPassword(
//     auth,
//     email,
//     password
//   );
//   const { uid } = userCredential.user;
//   const docRef = doc(db, "users", uid);
//   const docSnap = await getDoc(docRef);
//   if (docSnap.exists()) {
//     return {
//       id: uid,
//       ...docSnap.data(),
//     } as User;
//   } else {
//     console.log("No such document!");
//     await setDoc(doc(db, "users", uid), {
//       name: "",
//       createdAt: Timestamp.fromDate(new Date()),
//       updatedAt: Timestamp.fromDate(new Date()),
//     });
//     return {
//       ...initialUser,
//       id: uid,
//     } as User;
//   }
// };

// export const signup = async (
//   email: string,
//   password: string,
//   username: string
// ) => {
//   const userCredential = await createUserWithEmailAndPassword(
//     auth,
//     email,
//     password
//   );
//   const uid = userCredential.user.uid;
//   await setDoc(doc(db, "users", uid), {
//     email,
//     coverPicture: "",
//     profilePicture: "",
//     followes: [],
//     followings: [],
//     createdAt: Timestamp.fromDate(new Date()),
//     updatedAt: Timestamp.fromDate(new Date()),
//     salesTalk: "",
//     username,
//     uid,
//   });
// };

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
