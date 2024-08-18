import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../config";
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

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "Settings">;
};

export const SettingsScreen = ({ navigation }: Props): JSX.Element => {
  const [text, setText] = useState<string>("");
  const { user } = useContext(UserContext);
  const [imageURL, setImageURL] = useState<string>("");
  const [originalURL, setOriginalURL] = useState<string>("");

  useEffect(() => {
    navigation.setOptions({
      headerTintColor: "#800",
      title: "Settings",
      headerLeft: () => (
        <IconButton name="x" onPress={() => navigation.goBack()} size={24} />
      ),
      headerRight: () => <LogOutButton />,
    });
    setOriginalURL(user?.profilePicture ?? "");
  }, []);

  const onSubmit = async () => {
    if (text) {
      const docRef = await addDoc(collection(db, "channels"), {
        channelName: text,
        channelProp: user?.uid,
        channelMember: [],
      });
      const channelRef = doc(db, "channels", docRef.id);
      await updateDoc(channelRef, {
        channelId: docRef.id,
      });
    }
    setText("");
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
              .then((docRef) => {
                //usersが即時反映するために
              })
              .catch((error) => {
                console.log(error);
              });
          });
        }
      );
      setImageURL("");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.boxContainer}>
        <Text style={styles.username}>User: {user?.username}</Text>
        <Text style={styles.label}>Create Talk-Group-Name</Text>
        <Text style={styles.propText}>
          You are the proposer of the new group.
        </Text>
        <TextInput
          style={styles.input}
          numberOfLines={1}
          placeholder="  input new group name..."
          onChangeText={(text) => setText(text)}
          value={text}
          // autoFocus
        />

        <Button2 onPress={onSubmit} label="save" />

        <Text style={styles.label}>Change your Profile Picture</Text>
        <View style={styles.photoContainer}>
          {user?.profilePicture ? (
            <TouchableOpacity
              onPress={() => {
                setImageURL(imageURL);
                onPressProfilePicture();
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
                setImageURL(imageURL);
                onPressProfilePicture();
              }}
            />
          )}
          {!!imageURL && (
            <Image source={{ uri: imageURL }} style={styles.image} />
          )}
        </View>
        <Button2 onPress={onPressPhotoSave} label="save" />
        {user?.profilePicture !== originalURL ? <CoverProfilePicture /> : null}
      </View>
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  separation: {
    // borderTopWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
  },
  username: {
    marginTop: 20,
    marginLeft: 5,
    fontSize: 18,
    lineHeight: 24,
  },
  input: {
    height: 40,
    fontSize: 22,
    borderColor: "#999",
    borderBottomWidth: 1,
  },
  propText: {
    fontSize: 14,
    lineHeight: 18,
    marginVertical: 15,
  },
  label: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#483c3c",
  },
  text: {
    fontSize: 18,
    lineHeight: 34,
    fontWeight: "bold",
    margin: 10,
    color: "rgba(0, 0, 0, 0.7)",
  },
  photoContainer: {
    alignItems: "center",
  },
  avatar: {
    marginTop: 15,
  },
  image: {
    position: "absolute",
    marginTop: 10,
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: "cover",
    borderWidth: 4,
    borderColor: "green",
  },
  buffer: {
    margin: 45,
  },
});
