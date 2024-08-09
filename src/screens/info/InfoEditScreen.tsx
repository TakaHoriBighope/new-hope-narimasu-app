import { Alert, View, TextInput, StyleSheet } from "react-native";
import FloatingButton from "../../components/FloatingButton";
import { FontAwesome6 } from "@expo/vector-icons";
// import Icon from "@/src/components/Icon";
import { useState, useEffect, useContext } from "react";
import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config";
import KeyboardAvoidingView from "../../components/KeyboardAvoidingView";
import { Info } from "../../types/info";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";
import { RouteProp } from "@react-navigation/native";
import { InfosContext } from "../../contexts/infosContext";
import { IconButton } from "@/src/components/IconButton";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "InfoEdit">;
  route: RouteProp<RootStackParamList, "InfoEdit">;
};

export const InfoEditScreen = ({ navigation, route }: Props): JSX.Element => {
  const { id } = route.params;
  const { infos, setInfos } = useContext(InfosContext);
  const [info, setInfo] = useState<Info>({
    id: "",
    desc: "",
    createdAt: Timestamp.fromDate(new Date()),
    imgURL: "",
    likes: [],
    uid: "",
    read: [],
  });

  useEffect(() => {
    if (auth.currentUser === null) {
      return;
    }
    navigation.setOptions({
      headerTintColor: "#800",
      title: "Edit Info",
      headerLeft: () => (
        <IconButton name="x" onPress={() => navigation.pop()} size={24} />
      ),
      headerRight: () => undefined,
    });

    const ref = doc(db, "infos", id);
    getDoc(ref)
      .then((infoDocRef) => {
        const { desc, imgURL, uid, likes, createdAt, read } =
          infoDocRef.data() as Info;
        setInfo({
          id: infoDocRef.id,
          desc,
          imgURL,
          uid,
          likes,
          createdAt,
          read,
        });
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Failed to update.");
      });
  }, []);

  const onPressEdit = (id: string, text: string): void => {
    if (auth.currentUser === null) {
      return;
    }
    const ref = doc(db, "infos", id);
    updateDoc(ref, {
      desc: text,
      createdAt: Timestamp.fromDate(new Date()),
    })
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Failde to update!");
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.textContainer}>
        <TextInput
          multiline
          style={styles.input}
          value={info?.desc}
          onChangeText={(text) => {
            setInfo({ ...info, desc: text });
          }}
          autoFocus
        />
      </View>
      <FloatingButton
        onPress={() => {
          onPressEdit(id, info.desc);
        }}
        style={{ right: 30, bottom: 30 }}
      >
        <FontAwesome6 name="save" size={24} color="white" />
        {/* <Icon name="save" size={24} color="white" /> */}
      </FloatingButton>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    marginTop: 10,
    paddingBottom: 60,
  },
  input: {
    flex: 1,
    textAlignVertical: "top",
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 27,
  },
});
