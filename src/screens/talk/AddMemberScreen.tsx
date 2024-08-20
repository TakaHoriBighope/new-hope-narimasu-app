import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../config";
import { type User } from "../../types/user";
import UserListItem from "../../components/listitem/UserListItem";
//画面遷移に必要
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";
import { ChannelContext } from "@/src/contexts/channelContext";
import { IconButton } from "@/src/components/IconButton";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "AddMem">;
};

export const AddMemberScreen = ({ navigation }: Props): JSX.Element => {
  const { channel, setChannel } = useContext(ChannelContext);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    navigation.setOptions({
      title: "Group Members",
      headerLeft: () => (
        <IconButton name="x" onPress={() => navigation.pop()} size={24} />
      ),
      headerRight: () => undefined,
    });
  }, []);

  useEffect(() => {
    const ref = query(collection(db, "users"), orderBy("username"));
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const usersResults: User[] = [];
        snapshot.forEach((doc) => {
          const {
            id,
            email,
            coverPicture,
            createdAt,
            followers,
            followings,
            profilePicture,
            salesTalk,
            updatedAt,
            username,
            uid,
          } = doc.data() as User;
          usersResults.push({
            id: doc.data().id,
            email,
            coverPicture,
            createdAt,
            followers,
            followings,
            profilePicture,
            salesTalk,
            updatedAt,
            username,
            uid,
          });
        });
        setUsers(usersResults);
      },
      (error) => {
        console.log("onSnapshot at AddMem", error);
      }
    );
    return () => {
      unsubscribe(); // ← 追加
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{channel?.channelName}</Text>
      <FlatList
        data={users}
        renderItem={({ item }) => <UserListItem user={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  text: {
    margin: 10,
    fontSize: 20,
    fontWeight: "600",
    color: "#972752",
  },
  idText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
