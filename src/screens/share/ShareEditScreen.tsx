import { Alert, View, TextInput, StyleSheet } from "react-native";
import FloatingButton from "../../components/FloatingButton";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState, useEffect, useContext } from "react";
import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config";
import KeyboardAvoidingView from "../../components/KeyboardAvoidingView";
import { Post } from "../../types/post";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";
import { RouteProp } from "@react-navigation/native";
import { IconButton } from "@/src/components/IconButton";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "ShareEdit">;
  route: RouteProp<RootStackParamList, "ShareEdit">;
  // post: Post;
};

export const ShareEditScreen = ({ navigation, route }: Props): JSX.Element => {
  const { id } = route.params;
  const [post, setPost] = useState<Post>({
    id: "",
    desc: "",
    createdAt: Timestamp.fromDate(new Date()),
    imgURL: "",
    likes: [],
    uid: "",
    username: "",
    read: [],
  });

  useEffect(() => {
    if (auth.currentUser === null) {
      return;
    }
    navigation.setOptions({
      headerTintColor: "#800",
      title: "Edit Share",
      headerLeft: () => (
        <IconButton name="x" onPress={() => navigation.pop()} size={24} />
      ),
      headerRight: () => undefined,
    });
    const ref = doc(db, "posts", id);
    getDoc(ref)
      .then((infoDocRef) => {
        const { desc, imgURL, uid, likes, createdAt, username, read } =
          infoDocRef.data() as Post;
        setPost({
          id: infoDocRef.id,
          desc,
          imgURL,
          uid,
          likes,
          createdAt,
          username,
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
    const ref = doc(db, "posts", id);
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
          value={post?.desc}
          onChangeText={(text) => {
            setPost({ ...post, desc: text });
          }}
          autoFocus
        />
      </View>
      <FloatingButton
        onPress={() => {
          onPressEdit(id, post.desc);
        }}
        bottomNum={30}
      >
        <FontAwesome6 name="save" size={24} color="white" />
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
