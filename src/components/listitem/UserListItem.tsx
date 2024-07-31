import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
// import { Link, router } from "expo-router";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../config";
import { Octicons } from "@expo/vector-icons";
import { User } from "../../types/user";
import { Fontisto } from "@expo/vector-icons";
import { useContext, useEffect } from "react";
import { ChannelContext } from "@/src/contexts/channelContext";
import { ChannelMemContext } from "@/src/contexts/channelMemContext";

type Props = {
  user: User;
};

const UserListItem = (props: Props): JSX.Element | null => {
  const { user } = props;
  const { uid, profilePicture, username } = user;
  const { channel, setChannel } = useContext(ChannelContext);
  const { channelMems, setChannelMems } = useContext(ChannelMemContext);

  if (uid === channel?.channelProp) {
    return null;
  }
  useEffect(() => {
    const docRef = doc(db, "channels", String(channel?.channelId));
    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        setChannel({
          channelId: doc.data()?.channelId,
          channelName: doc.data()?.channelName,
          channelProp: doc.data()?.channelProp,
          channelMember: doc.data()?.channelMember,
        });
        setChannelMems(doc.data()?.channelMember);
      },
      (error) => {
        console.log("channel at AddMem", error);
      }
    );
    return () => {
      unsubscribe(); // ← 追加
    };
  }, []);

  const handlePressActive = async (
    uid: string,
    channelId: string
  ): Promise<void> => {
    if (auth.currentUser === null) {
      return;
    }
    if (uid) {
      const groupDocRef = doc(db, "channels", String(channel?.channelId));
      await updateDoc(groupDocRef, {
        channelMember: arrayUnion(uid),
      });
    }
  };

  const handlePressPassive = async (
    uid: string,
    channelId: string
  ): Promise<void> => {
    if (auth.currentUser === null) {
      return;
    }
    Alert.alert("Member deleted.", "Are you sure？", [
      {
        text: "Cancel",
      },
      {
        text: "deleted!",
        style: "destructive",
        onPress: () => {
          if (uid) {
            const groupOutDocRef = doc(db, "channels", String(channelId ?? ""));
            updateDoc(groupOutDocRef, {
              channelMember: arrayRemove(uid),
            })
              .then(() => {
                setChannelMems(
                  channelMems.filter((channelMem) => channelMem !== uid)
                );
              })
              .catch((error) => {
                Alert.alert("failed", error);
              });
          }
        },
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.listItem}>
        {profilePicture ? (
          <Image
            style={styles.imageContainer}
            source={{ uri: profilePicture }}
          />
        ) : (
          <Octicons
            name="feed-person"
            size={36}
            color="lightgray"
            style={styles.avatar}
          />
        )}
        <View style={styles.subItem}>
          <Text style={styles.text}>{username}</Text>
          {/* <Text style={styles.text2}>{uid}</Text> */}
        </View>
      </View>
      <Fontisto
        name={
          channelMems.includes(uid) ? "checkbox-active" : "checkbox-passive"
        }
        size={20}
        color="#800"
        style={styles.button}
        onPress={() => {
          channel?.channelMember.includes(uid)
            ? handlePressPassive(uid, channel?.channelId ?? "")
            : handlePressActive(uid, channel?.channelId ?? "");
        }}
      />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "70%",
  },
  imageContainer: {
    marginTop: 5,
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  subItem: {
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    marginTop: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 15,
  },
  text2: {
    fontSize: 8,
    fontWeight: "bold",
    marginLeft: 15,
  },
  button: {
    position: "absolute",
    right: 10,
  },
});

export default UserListItem;
