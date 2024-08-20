import * as React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { type Message } from "../../types/message";
import { Timestamp } from "firebase/firestore";
import { Octicons } from "@expo/vector-icons";
// import Balloon from "react-native-balloon";

// type Props = {
//   messge: Message;
// };

type Props = {
  message: Message;
};

const MessageListItem = (props: Props): JSX.Element | null => {
  const { message } = props;
  const { talk, createdAt, uid, profilePicture, username, email } = message;
  if (talk === null || createdAt === null) {
    return null;
  }
  const dateString = createdAt.toDate().toLocaleString("en-US");
  let dateAry = dateString.split(",");

  return (
    <View style={styles.msgListItem}>
      <View style={styles.itemContainer}>
        <View style={styles.leftContainer}>
          {profilePicture ? (
            <Image
              style={styles.imageContainer}
              source={{ uri: profilePicture }}
              // contenFit="cover"
            />
          ) : (
            <Octicons
              name="feed-person"
              size={36}
              color="lightgray"
              style={styles.avatar}
            />
          )}
        </View>
        {/* <Balloon
          borderColor="#26dd12"
          backgroundColor="#FFF"
          borderWidth={1}
          borderRadius={10}
          triangleDirection="left"
        > */}

        <View style={styles.rightContainer}>
          <View style={styles.message}>
            <Text style={styles.nameText}>{username}</Text>
            <Text style={styles.dateText}>{dateAry[0]}</Text>
          </View>

          <Text style={styles.messageText}>{talk}</Text>
        </View>

        {/* </Balloon> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  msgListItem: {
    paddingVertical: 5,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    alignItems: "center",
    // borderBottomWidth: 1,
    // borderColor: "rgba(0,0,0,0.15)",
    marginVertical: 1,
  },
  message: {
    flexDirection: "row",
    justifyContent: "space-between",
    // color: "#676262",
    color: "black",
    // marginVertical: 15,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: "600",
    color: "#322e2e",
    // color: "black",
  },
  nameText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
  dateText: {
    marginRight: 10,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
  itemContainer: {
    width: "100%",
    flexDirection: "row",
    // marginVertical: 3,
  },
  imageContainer: {
    marginTop: 5,
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatar: {
    marginTop: 5,
  },
  leftContainer: {
    width: 40,
  },
  rightContainer: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
});

export default MessageListItem;
