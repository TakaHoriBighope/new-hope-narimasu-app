import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";
import { type Post } from "../../types/post";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../../config";
import { useContext } from "react";
import { PostsContext } from "@/src/contexts/postContext";
import { UserContext } from "@/src/contexts/userContext";

type Props = {
  post: Post;
  onPress: () => void;
};

export const PostListItem = ({ post, onPress }: Props): JSX.Element | null => {
  const { desc, createdAt, imgURL, uid } = post;
  const { posts, setPosts } = useContext(PostsContext);
  const { user } = useContext(UserContext);

  if (desc === null || createdAt === null) {
    return null;
  }
  const dateString = createdAt.toDate().toLocaleString("en-US");
  let dateAry = dateString.split(",");

  const onPressDelete = (id: string): void => {
    if (auth.currentUser === null) {
      return;
    }
    const ref = doc(db, "posts", id);
    Alert.alert("Posted share deleted.", "Are you sure？", [
      {
        text: "Cancel",
      },
      {
        text: "deleted!",
        style: "destructive",
        onPress: () => {
          deleteDoc(ref).catch(() => {
            Alert.alert("failed");
          });
          setPosts(posts.filter((post) => post.id !== id));
        },
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.postListItem} onPress={onPress}>
      <View style={styles.itemContainer}>
        {imgURL ? (
          <View style={styles.leftContainer}>
            <Image
              style={styles.imageContainer}
              source={{ uri: imgURL }}
              // contenFit="cover"
            />
          </View>
        ) : (
          ""
        )}
        <View style={styles.rightContainer}>
          <Text numberOfLines={3} style={styles.postListItemTitle}>
            {desc}
          </Text>
          <View style={styles.read}>
            <Text style={styles.nameText}>{post?.username}</Text>
            {auth.currentUser?.uid === post.uid ? null : post.read.includes(
                auth.currentUser?.uid ?? ""
              ) ? null : user?.createdAt < createdAt ? (
              <View style={styles.mark} />
            ) : null}
            <Text style={styles.postListItemDate}>{dateAry[0]}</Text>
          </View>
          {auth.currentUser?.uid === post.uid ? (
            <View>
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => {
                  onPressDelete(post.id);
                }}
              >
                <AntDesign name="delete" size={20} color="#800" />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  postListItem: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
  },
  postListItemTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "bold",
    color: "#322e2e",
  },
  postListItemDate: {
    fontSize: 13,
    lineHeight: 13,
    color: "#676262",
    marginVertical: 8,
  },
  nameText: {
    color: "#292626",
    fontSize: 13,
    lineHeight: 13,
    marginRight: 20,
  },
  itemContainer: {
    height: 100,
    width: "100%",
    flexDirection: "row",
  },
  imageContainer: {
    width: 100,
    height: 100,
  },
  leftContainer: {
    width: 100,
  },
  rightContainer: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  read: {
    flexDirection: "row",
    alignItems: "center",
  },
  mark: {
    backgroundColor: "#06fa26",
    marginRight: 5,
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  deleteIcon: {
    position: "absolute",
    right: 5,
    bottom: 12,
  },
});
