import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Alert,
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
  deleteDoc,
  getCountFromServer,
  getDocs,
  arrayRemove,
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
import { type Channel } from "@/src/types/channel";
import { type User } from "../../types/user";
import FloatingButton from "@/src/components/FloatingButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Loading } from "@/src/components/Loading";

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
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const isIOS = Platform.OS === "ios";

  const passwordCheck = (newText: string) => {
    const regex = /^[a-zA-Z0-9]+$/;
    const isValid = regex.test(newText);
    setIsValid(false);
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
    setLoading(true);
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
                    const {
                      email,
                      coverPicture,
                      createdAt,
                      followers,
                      followings,
                      profilePicture,
                      salesTalk,
                      updatedAt,
                      username,
                    } = docSnap.data() as User;
                    setUser({
                      id: docSnap.data()?.id,
                      email,
                      coverPicture,
                      profilePicture,
                      followers,
                      followings,
                      createdAt,
                      updatedAt,
                      salesTalk,
                      username,
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
      setLoading(false);
      setIsShow(false);
      setImageURL("");
    }
  };

  const onPressDeleteAccount = (password: string) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = auth.currentUser?.uid;

    Alert.alert("Account deleted.", "Are you sure?", [
      {
        text: "Cancel",
      },
      {
        text: "deleted!",
        style: "destructive",
        onPress: () => {
          //emailを使ってcredentialを新規に得る、これをしないとaccount削除が出来ない
          const credential = EmailAuthProvider.credential(
            auth.currentUser?.email ?? "",
            password
          );
          setLoading(true);
          console.log("credential:", credential);
          //１．ます最初にchannelsのデータを取得
          let channelsResult: Channel[] = [];
          getDocs(collection(db, "channels"))
            .then((snapshot) => {
              snapshot.docs.forEach((doc) => {
                const { channelName, channelProp, channelMember } =
                  doc.data() as Channel;
                channelsResult.push({
                  channelId: doc.id,
                  channelName,
                  channelProp,
                  channelMember,
                });
              });
              setChannels(channelsResult);
            })
            .catch((error) => {
              const { code, message } = error;
              console.log(code, message);
            });
          //２．channels.channelMemberのuidを削除する
          for (let i = 0; i < channels.length; i++) {
            const groupOutDocRef = doc(
              db,
              "channels",
              String(channels[i].channelId ?? "")
            );
            updateDoc(groupOutDocRef, { channelMember: arrayRemove(uid) })
              .then(() => {
                console.log(`deleted ${channels[i].channelName}:${uid}`);
              })
              .catch((error) => {
                const { code, message } = error;
                console.log(code, message);
              });
          }
          //3．usersのuidを削除する
          deleteDoc(doc(db, "users", String(uid)))
            .then(() => {
              if (user) {
                reauthenticateWithCredential(user, credential)
                  .then(() => {
                    deleteUser(user)
                      .then(() => {
                        console.log("User deleted.", uid);
                        // User deleted.
                        setUser(null);
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
              }
            })
            .catch((error) => {
              // An error ocurred
              const { code, message } = error;
              console.log(code, message);
            });
        },
      },
    ]);
    setLoading(false);
  };

  const onContentSizeChange = () => {
    setIsShow(true);
    // console.log("onContentSizeChange");
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
                // onContentSizeChange={() => {
                //   onContentSizeChange();
                // }}
              />
            )}
            {!!imageURL && (
              <Image source={{ uri: imageURL }} style={styles.image} />
            )}
            <Text style={styles.label}>Change your Profile Picture?</Text>
            <Text style={styles.subText}>Click green circle.</Text>
          </View>
          {/* <Button2 onPress={onPressPhotoSave} label="save" /> */}
          <View>
            {!!imageURL ? (
              <FloatingButton
                onPress={onPressPhotoSave}
                style={{ position: "absolute", right: -150, top: -140 }}
              >
                <AntDesign name="save" size={20} color="white" />
              </FloatingButton>
            ) : null}
          </View>

          <Text style={styles.label}>Create Talk-Group-Name</Text>
          <Text style={styles.subText}>
            You are the proposer of the new group.
          </Text>
          <TextInput
            value={groupName}
            style={styles.input}
            numberOfLines={1}
            placeholder="input new group name"
            onChangeText={(text) => setGroupName(text)}
            onContentSizeChange={() => {
              onContentSizeChange();
            }}
            // autoFocus
          />
          {/* <Button2 onPress={onSubmitCreateNewGroup} label="save" /> */}
          <View>
            {!!groupName ? (
              <FloatingButton
                onPress={onSubmitCreateNewGroup}
                // label="save"
                style={{ position: "absolute", right: -150, bottom: 5 }}
              >
                <AntDesign name="save" size={20} color="white" />
              </FloatingButton>
            ) : null}
          </View>
          <Text style={styles.label}>Account Deletion</Text>
          <TextInput
            value={password}
            style={styles.input}
            numberOfLines={1}
            // maxLength={10}
            placeholder="input your passoword"
            autoCapitalize="none"
            secureTextEntry
            textContentType="password"
            // autoFocus
            onChangeText={(text) => {
              setPassword(text);
              passwordCheck(text);
            }}
            onContentSizeChange={() => {
              onContentSizeChange();
            }}
          />
          <View>
            {!!password ? (
              <FloatingButton
                onPress={() => onPressDeleteAccount(password)}
                style={{ position: "absolute", right: -150, bottom: 20 }}
              >
                <AntDesign name="enter" size={20} color="white" />
              </FloatingButton>
            ) : null}
            {/* <Button2
              onPress={() => onPressDeleteAccount(password)}
              label="    execute    "
                /> */}
          </View>
        </View>
        <Loading visible={loading} />
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
  // button: {
  //   flexDirection: "row",
  // },
  // passwordInput: {
  //   height: 40,
  //   fontSize: 20,
  //   borderColor: "#999",
  //   borderBottomWidth: 1,
  //   // padding: 20,
  //   // marginTop: 16,
  // },
  subText: {
    fontSize: 14,
    lineHeight: 18,
    marginVertical: 5,
  },
  label: {
    marginTop: 25,
    fontSize: 18,
    fontWeight: "600",
    color: "#483c3c",
  },
  // text: {
  //   fontSize: 18,
  //   lineHeight: 24,
  //   fontWeight: "600",
  //   margin: 5,
  //   color: "rgba(0, 0, 0, 0.7)",
  // },
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
