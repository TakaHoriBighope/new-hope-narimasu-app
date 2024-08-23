import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, FlatList, Button } from "react-native";
import Icon from "@/src/components/Icon";
import AntDesign from "@expo/vector-icons/AntDesign";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";
import { type Post } from "../../types/post";
import { auth, db } from "../../config";
import FloatingButton from "../../components/FloatingButton";
import { UserContext } from "../../contexts/userContext";
import { PostListItem } from "../../components/listitem/PostListItem";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { signOut } from "firebase/auth";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "Share">;
};

export const ShareScreen = ({ navigation }: Props) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (auth.currentUser === null) {
      return;
    }
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const resultPosts: Post[] = [];
        snapshot.forEach((doc) => {
          const { desc, imgURL, uid, likes, createdAt, username, read } =
            doc.data() as Post;
          resultPosts.push({
            id: doc.id,
            desc,
            imgURL,
            uid,
            likes,
            createdAt,
            username,
            read,
          });
        });
        setPosts(resultPosts);
      },
      (error) => {
        // console.log("onSnapshot at Share", error);
      }
    );
    return () => {
      unsubscribe(); // ← 追加
    };
  }, [signOut]);

  const onPressPost = (post: Post) => {
    navigation.navigate("ShareDetail", { post });
  };

  const onPressCreate = () => {
    navigation.navigate("ShareCreate");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }: { item: Post }) => (
          <PostListItem post={item} onPress={() => onPressPost(item)} />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <FloatingButton
        onPress={onPressCreate}
        style={{ position: "absolute", right: 30, bottom: 50 }}
      >
        {/* <AntDesign name="addfile" size={20} color="white" /> */}
        <Icon name="addfile" size={25} color="white" />
      </FloatingButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
