import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../config";
import {
  getAuth,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { UserContext } from "@/src/contexts/userContext";
import { Button2 } from "@/src/components/Button2";
import { Octicons } from "@expo/vector-icons";
//画面遷移に必要
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";
import { pickImage } from "@/src/lib/image-picker";
import { getExtension } from "@/src/utils/file";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { IconButton } from "@/src/components/IconButton";
import { CoverProfilePicture } from "./CoverPrfilePicture";
import LogOutButton from "@/src/components/LogOutButton";
import KeyboardAvoidingView from "../../components/KeyboardAvoidingView";
import { Button } from "@/src/components/Button";
// import KeyboardAvoidingView from "react-native";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "Settings">;
};

export const SettingsScreen = ({ navigation }: Props): JSX.Element => {
  const [groupName, setGroupName] = useState<string>("");
  const { user, setUser } = useContext(UserContext);
  const [imageURL, setImageURL] = useState<string>("");
  const [originalURL, setOriginalURL] = useState<string>("");
  const [deletion, setDeletion] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(true);

  const isIOS = Platform.OS === "ios";

  const passwordCheck = (newText: string) => {
    const regex = /^[a-zA-Z0-9]+$/;
    const isValid = regex.test(newText);
    setIsValid(isValid);
  };

  useEffect(() => {
    navigation.setOptions({
      headerTintColor: "#800",
      title: "Settings",
      headerLeft: undefined,
      // () => (
      //   <IconButton name="x" onPress={() => navigation.goBack()} size={24} />
      // ),
      headerRight: () => <LogOutButton />,
    });
    setOriginalURL(user?.profilePicture ?? "");
  }, []);

  const onSubmitCreateNewGroup = async () => {
    if (groupName) {
      const docRef = await addDoc(collection(db, "channels"), {
        channelName: groupName,
        channelProp: user?.uid,
        channelMember: [],
      });
      const channelRef = doc(db, "channels", docRef.id);
      await updateDoc(channelRef, {
        channelId: docRef.id,
      });
    }
    setGroupName("");
    navigation.goBack();
  };

  const onPressProfilePicture = async () => {
    const uri = await pickImage();
    if (uri) {
      setImageURL(uri);
    }
  };

  const onPressPhotoSave = async () => {
    if (auth.currentUser === null) {
      return;
    }
    if (imageURL) {
      //document-IDを先に取得
      const userDocRef = doc(db, "users", String(auth.currentUser.uid));
      console.log("userDocRef:", userDocRef);
      // storageのpathを決定
      const ext = getExtension(imageURL);
      const storagePath = `profile/${userDocRef.id}.${ext}`;
      console.log("storagePath:", storagePath);
      const localUri = await fetch(imageURL);
      const blob = await localUri.blob();
      //storageにupload ref
      const storage = getStorage();
      const storageRef = ref(storage, storagePath);
      //画像をstorageにアップロード
      const uploadImage = uploadBytesResumable(storageRef, blob);
      uploadImage.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          console.log(err);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadImage.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            const userUpdateRef = doc(
              db,
              "users",
              String(auth.currentUser?.uid)
            );
            updateDoc(userUpdateRef, {
              profilePicture: downloadURL,
              updatedAt: Timestamp.fromDate(new Date()),
            })
              .then(() => {
                const docRef = doc(db, "users", String(auth.currentUser?.uid));
                getDoc(docRef)
                  .then((docSnap) => {
                    setUser({
                      id: docSnap.data()?.id,
                      email: docSnap.data()?.email,
                      coverPicture: "",
                      profilePicture: docSnap.data()?.profilePicture,
                      followers: docSnap.data()?.followers,
                      followings: docSnap.data()?.followings,
                      createdAt: docSnap.data()?.createdAt,
                      updatedAt: docSnap.data()?.updatedAt,
                      salesTalk: docSnap.data()?.salesTalk,
                      username: docSnap.data()?.username,
                      uid: String(auth.currentUser?.uid),
                    });
                  })
                  .catch((error) => {
                    console.log("No such document at LoginScreen", error);
                  });
                //usersが即時反映するために
              })
              .catch((error) => {
                console.log(error);
              });
          });
        }
      );
      // setImageURL("");
    }
  };

  const onPressDeleteAccount = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    // TODO(you): prompt the user to re-provide their sign-in credentials
    const credential = EmailAuthProvider.credential(
      auth.currentUser?.email ?? "",
      password
    );

    reauthenticateWithCredential(user, credential)
      .then(() => {
        deleteUser(user)
          .then(() => {
            console.log("User deleted.");
            // User deleted.
          })
          .catch((error) => {
            // An error ocurred
            const { code, message } = error;
            console.log(code, message);
          });
        // User re-authenticated.
      })
      .catch((error) => {
        // An error ocurred
        const { code, message } = error;
        console.log(code, message);
      });
  };

  return (
    <ScrollView keyboardDismissMode="on-drag">
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.boxContainer}>
          <Text style={styles.username}>User: {user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          <View style={styles.photoContainer}>
            {user?.profilePicture ? (
              <TouchableOpacity
                onPress={() => {
                  onPressProfilePicture();
                  setImageURL(imageURL);
                }}
              >
                <Image
                  style={styles.image}
                  source={{ uri: user?.profilePicture }}
                />
                <View style={styles.buffer}></View>
              </TouchableOpacity>
            ) : (
              <Octicons
                name="feed-person"
                size={80}
                color="gray"
                style={styles.avatar}
                onPress={() => {
                  onPressProfilePicture();
                  setImageURL(imageURL);
                }}
              />
            )}
            {!!imageURL && (
              <Image source={{ uri: imageURL }} style={styles.image} />
            )}
            <Text style={styles.label}>Change your Profile Picture?</Text>
            <Text style={styles.label}>Click green circle.</Text>
          </View>
          <Button2 onPress={onPressPhotoSave} label="save" />

          <Text style={styles.label}>Create Talk-Group-Name</Text>
          <Text style={styles.propText}>
            You are the proposer of the new group.
          </Text>
          <TextInput
            value={groupName}
            style={styles.input}
            numberOfLines={1}
            placeholder="  input new group name..."
            onChangeText={(text) => setGroupName(text)}
            // autoFocus
          />
          <Button2 onPress={onSubmitCreateNewGroup} label="save" />

          {/* <View> */}
          <Text style={styles.label}>Account Deletion</Text>
          <TextInput
            style={styles.passwordInput}
            value={password}
            maxLength={10}
            placeholder="passoword"
            autoCapitalize="none"
            secureTextEntry
            textContentType="password"
            autoFocus
            onChangeText={(text) => {
              setPassword(text);
              passwordCheck(text);
            }}
          />
          <Button2 onPress={onPressDeleteAccount} label="   execution     " />
          {/* </View> */}
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  username: {
    marginTop: 10,
    marginLeft: 5,
    fontSize: 18,
    lineHeight: 24,
  },
  email: {
    marginLeft: 5,
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    height: 40,
    fontSize: 20,
    borderColor: "#999",
    borderBottomWidth: 1,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: "#dddddd",
    backgroundColor: "#ffffff",
    height: 36,
    padding: 18,
    fontSize: 20,
    marginTop: 16,
  },
  propText: {
    fontSize: 14,
    lineHeight: 18,
    marginVertical: 5,
  },
  label: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "600",
    color: "#483c3c",
  },
  text: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
    margin: 5,
    color: "rgba(0, 0, 0, 0.7)",
  },
  photoContainer: {
    alignItems: "center",
  },
  avatar: {
    marginTop: 10,
    right: 3,
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: "green",
  },
  image: {
    position: "absolute",
    marginTop: 10,
    left: 2,
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: "cover",
    borderWidth: 3,
    borderColor: "green",
  },
  buffer: {
    margin: 45,
  },
});
