import { View, Text, ScrollView, StyleSheet } from "react-native";
import FloatingButton from "../../components/FloatingButton";
import Icon from "@/src/components/Icon";
import { auth, db } from "../../config";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";
import { RouteProp } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { IconButton } from "../../components/IconButton";
import { type Post } from "../../types/post";
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { UserContext } from "@/src/contexts/userContext";
import { CoverImage } from "@/src/components/CoverImage";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "ShareDetail">;
  route: RouteProp<RootStackParamList, "ShareDetail">;
};

export const ShareDetailScreen = ({ navigation, route }: Props) => {
  const { post } = route.params;
  const [postSingle, setpostSingle] = useState<Post | null>(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (post.read.includes(user?.uid ?? "")) {
      return;
    }
    const readRef = doc(db, "posts", String(post.id));
    const checkRead = async () => {
      await updateDoc(readRef, {
        read: arrayUnion(user?.uid),
      });
    };
    checkRead();
  }, []);

  useEffect(() => {
    if (auth.currentUser === null) {
      return;
    }
    navigation.setOptions({
      headerTintColor: "#800",
      title: "Detail of Share",
      headerLeft: () => (
        <IconButton name="x" onPress={() => navigation.pop()} size={24} />
      ),
      headerRight: () => undefined,
    });
    const ref = doc(db, "posts", String(post.id));
    const unsubscribe = onSnapshot(
      ref,
      (postDoc) => {
        setpostSingle({
          id: postDoc.id,
          desc: postDoc.data()?.desc,
          imgURL: postDoc.data()?.imgURL,
          uid: postDoc.data()?.uid,
          likes: postDoc.data()?.likes,
          createdAt: postDoc.data()?.createdAt,
          username: postDoc.data()?.username,
          read: postDoc.data()?.read,
        });
      },
      (error) => {
        // console.log("onSnapshot at ShareDetail", error);
      }
    );
    return () => {
      unsubscribe(); // ← 追加
    };
  }, []);

  const onPressEdit = (id: string): void => {
    navigation.navigate("ShareEdit", { id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.postHeader}>
        <Text style={styles.postTitle} numberOfLines={1}>
          {postSingle?.desc}
        </Text>
        <View style={styles.nameAndDate}>
          <Text style={styles.nameText}>{postSingle?.username}</Text>
          <Text style={styles.postDate}>
            {postSingle?.createdAt?.toDate().toLocaleString("en-US")}
          </Text>
        </View>
      </View>
      <ScrollView style={styles.postBody}>
        {postSingle?.imgURL ? (
          <View style={styles.imageVertical}>
            <CoverImage url={postSingle?.imgURL} />
          </View>
        ) : null}
        <View>
          <Text style={styles.postBodyText}>{postSingle?.desc}</Text>
        </View>
      </ScrollView>
      {auth.currentUser?.uid === postSingle?.uid ? (
        <FloatingButton
          onPress={() => {
            onPressEdit(post.id);
          }}
          style={{ top: 50, bottom: "auto" }}
        >
          <Icon name="pencil" size={40} color="white" />
        </FloatingButton>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  postHeader: {
    backgroundColor: "#900",
    height: 70,
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  nameAndDate: {
    marginHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameText: {
    color: "white",
    fontSize: 14,
    lineHeight: 16,
    fontWeight: 600,
    marginRight: 20,
  },
  imageVertical: {
    paddingVertical: 5,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    // marginTop: 15,
  },
  postTitle: {
    color: "white",
    fontSize: 15,
    lineHeight: 24,
    fontWeight: 600,
  },
  postDate: {
    color: "white",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 600,
  },
  postBody: {},
  postBodyText: {
    paddingHorizontal: 20,
    // paddingVertical: 32,
    fontSize: 15,
    lineHeight: 24,
    color: "#000000",
  },
});
