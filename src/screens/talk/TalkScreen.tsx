import { ScrollView, StyleSheet, TextInput, View, Text } from "react-native";
import { useContext, useEffect, useState } from "react";
import {
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { StackNavigationProp } from "@react-navigation/stack";
import { auth, db } from "../../config";
/* components */
import KeyboardAvoidingView from "../../components/KeyboardAvoidingView";
/* context */
import { UserContext } from "@/src/contexts/userContext";
import { ChannelContext } from "@/src/contexts/channelContext";
/* types */
import { RootStackParamList } from "@/src/types/navigation";

import { type Message } from "../../types/message";
import { HeaderButton } from "@/src/components/HeaderButton";
import { IconButton } from "@/src/components/IconButton";
import MessageListItem from "@/src/components/listitem/MessageListItem";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "Talking">;
};

export const TalkScreen = ({ navigation }: Props) => {
  const { user } = useContext(UserContext);
  const { channel } = useContext(ChannelContext);
  const [inputHeight, setInputHeight] = useState(0);
  const ADMIN = process.env.EXPO_PUBLIC_ADMIN_A;

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<Message>({
    createdAt: Timestamp.fromDate(new Date()),
    talk: "",
    uid: "",
    profilePicture: "",
    email: "",
    username: "",
    read: [],
  });

  useEffect(() => {
    navigation.setOptions({
      headerTintColor: "#800",
      title: "Talk",
      headerLeft: () => undefined,
      headerRight: () => (
        <HeaderButton
          label="addusergroup"
          onPress={() => navigation.navigate("SelectGroup")}
          size={32}
        />
      ),
    });
  }, []);

  useEffect(() => {
    let collectionRef = collection(
      db,
      "channels",
      String(channel?.channelId),
      "messages"
    );
    const collectionRefOrderBy = query(
      collectionRef,
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      collectionRefOrderBy,
      (snapshot) => {
        let results: Message[] = [];
        snapshot.docs.forEach((doc) => {
          const {
            talk,
            createdAt,
            uid,
            profilePicture,
            username,
            email,
            read,
          } = doc.data();
          results.push({
            createdAt,
            talk,
            uid,
            profilePicture,
            username,
            email,
            read,
          });
        });
        setMessages(results);
      },
      (error) => {
        // console.log("onSnapshot at Talk", error);
      }
    );
    return () => {
      unsubscribe(); // ← 追加
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel]);

  const onPressSend = (message: Message) => {
    if (auth.currentUser === null) {
      return;
    }
    if (message.talk === "") {
      return;
    }
    const ref = collection(
      db,
      "channels",
      String(channel?.channelId),
      "messages"
    );
    addDoc(ref, {
      talk: message.talk,
      createdAt: Timestamp.fromDate(new Date()),
      uid: auth.currentUser.uid,
      username: user?.username,
      email: user?.email,
      profilePicture: user?.profilePicture,
      read: [],
    })
      .then((docRef) => {
        setMessage("");
        // navigation.navigate("Talk");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.title}>{channel?.channelName}</Text>
      <ScrollView style={styles.container}>
        {channel?.channelName ? (
          channel?.channelProp === auth.currentUser?.uid ||
          channel?.channelMember.includes(auth.currentUser?.uid ?? "") ||
          ADMIN?.includes(auth.currentUser?.uid ?? "") ? (
            messages.map((message, index) => (
              <MessageListItem message={message} key={index} />
            ))
          ) : (
            ""
          )
        ) : (
          <View>
            <Text style={styles.title2}>Select Talk Group</Text>
          </View>
        )}
      </ScrollView>
      {channel?.channelName ? (
        <View style={[styles.inputView, { height: inputHeight }]}>
          <TextInput
            multiline
            numberOfLines={1}
            style={styles.input}
            value={message?.talk}
            placeholder="send message..."
            onChangeText={(text) => {
              setMessage({ ...message, talk: text });
            }}
            onContentSizeChange={(event) => {
              // console.log(event.nativeEvent.contentSize);
              if (event.nativeEvent.contentSize.height <= 300) {
                setInputHeight(event.nativeEvent.contentSize.height + 30);
              } else {
                setInputHeight(300);
              }
            }}
            // autoFocus
          />
          <IconButton
            name="send"
            color="#800"
            size={25}
            onPress={() => {
              onPressSend(message);
            }}
          />
        </View>
      ) : (
        ""
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    fontWeight: "bold",
    color: "#800",
  },
  separator: {
    marginVertical: 30,
    height: 1,
  },
  title2: {
    marginTop: 70,
    fontSize: 23,
    lineHeight: 45,
    fontWeight: "bold",
    alignItems: "center",
    textAlign: "center",
    color: "#800",
  },
  alertText: {
    alignItems: "center",
    textAlign: "center",
    color: "red",
  },
  inputView: {
    flex: 1,
    width: "100%",
    height: 50,
    backgroundColor: "lightgray",
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  input: {
    color: "black",
    fontSize: 16,
    width: "80%",
    overflow: "hidden",
    lineHeight: 19,
    backgroundColor: "#f4f2f2",
    borderColor: "#f4f2f2",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
  },
});
