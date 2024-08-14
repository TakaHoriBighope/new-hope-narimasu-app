import React, { useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  Text,
} from "react-native";
import FloatingButton from "../../components/FloatingButton";
import { FontAwesome6 } from "@expo/vector-icons";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { db, auth } from "../../config";
import { infoCreateRef } from "../../lib/firebase";
import { useContext, useState, useEffect } from "react";
import KeyboardAvoidingView from "../../components/KeyboardAvoidingView";
// import { KeyboardAvoidingView } from "react-native";
import { type Info } from "../../types/info";
import { pickImage } from "../../lib/image-picker";
import { IconButton } from "../../components/IconButton";
import { getExtension } from "../../utils/file";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";
import { InfosContext } from "../../contexts/infosContext";
import { Loading } from "../../components/Loading";
import { RouteProp } from "@react-navigation/native";
import { UserContext } from "@/src/contexts/userContext";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "InfoCreate">;
  // route: RouteProp<RootStackParamList, "InfoCreate">;
};

export const InfoCreateScreen: React.FC<Props> = ({ navigation }: Props) => {
  const [info, setInfo] = useState<Info>({
    id: "",
    desc: "",
    createdAt: Timestamp.fromDate(new Date()),
    imgURL: "",
    likes: [],
    uid: "",
    read: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [imageURL, setImageURL] = useState<string>("");
  const { infos, setInfos } = useContext(InfosContext);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerTintColor: "#800",
      title: "Create NHN 週報",
      headerRight: () => undefined,
      headerLeft: () => (
        <IconButton
          name="x"
          onPress={() => navigation.navigate("Main")}
          size={24}
        />
      ),
      // headerTransparent: true,
    });
  }, [info, navigation]);

  const onPickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      setImageURL(uri);
    }
  };

  const handlePress = async (info: Info) => {
    if (auth.currentUser === null) {
      return;
    }
    const { desc, imgURL, uid, likes, read } = info;

    if (!desc) {
      Alert.alert("no text or photo.");
      return;
    }
    setLoading(true);
    if (imgURL) {
      //document-IDを先に取得
      const infoDocRef = await infoCreateRef(info.id);
      // storageのpathを決定
      const ext = getExtension(imgURL);
      const storagePath = `image/${infoDocRef.id}.${ext}`;
      //infoドキュメントを作る
      const localUri = await fetch(imgURL);
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
            // console.log("File available at", downloadURL);
            const ref = collection(db, "infos");
            addDoc(ref, {
              desc,
              imgURL: downloadURL,
              uid: auth.currentUser?.uid,
              likes,
              createdAt: Timestamp.fromDate(new Date()),
              read,
            })
              .then((docRef) => {
                //infoが即時反映するために
                setInfos([info, ...infos]);
                setLoading(false);
                navigation.goBack();
              })
              .catch((error) => {
                console.log(error);
              });
          });
        }
      );
    } else {
      const ref = collection(db, "infos");
      addDoc(ref, {
        desc,
        imgURL,
        uid: auth.currentUser.uid,
        likes,
        createdAt: Timestamp.fromDate(new Date()),
        read,
      })
        .then((docRef) => {
          //infoが即時反映するために
          setInfos([info, ...infos]);
          setLoading(false);
          navigation.goBack();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const ImageTextAlert = () => {
    if (imageURL) {
      return null;
    } else {
      return (
        <Text style={{ color: "gray", fontSize: 16 }}>
          Image should be selected first before texting.
        </Text>
      );
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets={true}
        automaticallyAdjustsScrollIndicatorInsets={true}
        contentInsetAdjustmentBehavior="always"
        showsVerticalScrollIndicator={true}
        style={styles.textContainer}
      >
        <View style={styles.photoContainer}>
          <IconButton
            name="image"
            onPress={onPickImage}
            color="#9f6c6c"
            size={40}
          />
          {!!imageURL && (
            <Image source={{ uri: imageURL }} style={styles.image} />
          )}
          <ImageTextAlert />
        </View>
        {/* <TextInputWithStyleChanged /> */}
        <TextInput
          placeholder="input text ....."
          multiline={true}
          style={{
            marginTop: 70,
            flex: 1,
            textAlignVertical: "top",
            fontSize: 16,
            lineHeight: 24,
          }}
          // style={styles.input}
          value={info.desc}
          onChangeText={(text) => {
            // setDesc(text);
            setInfo({ ...info, desc: text, imgURL: imageURL });
          }}
          onContentSizeChange={(event) => {
            // console.log(event.nativeEvent.contentSize);
            if (event.nativeEvent.contentSize.height >= 200) {
              scrollViewRef.current?.scrollTo({
                x: 0,
                y: event.nativeEvent.contentSize.height - 192,
                animated: true,
              });
            }
          }}
          // autoFocus
        />
      </ScrollView>
      <FloatingButton
        onPress={() => {
          handlePress(info);
        }}
        style={{ position: "absolute", right: 30, bottom: 30 }}
      >
        <FontAwesome6 name="save" size={24} color="white" />
      </FloatingButton>
      <Loading visible={loading} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    flex: 1,
  },
  input: {
    flex: 1,
    textAlignVertical: "top",
    fontSize: 16,
    lineHeight: 24,
  },
  photoContainer: {
    marginLeft: 2,
    marginTop: 15,
  },
  image: {
    position: "absolute",
    top: -20,
    width: 150,
    height: 150,
    margin: 1,
    // resizeMode: "cover",
    resizeMode: "contain",
    zIndex: 10,
  },
});
