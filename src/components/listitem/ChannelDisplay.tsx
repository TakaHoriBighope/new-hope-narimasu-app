import React, { useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Link, useNavigation } from "@react-navigation/native";
import { auth, db } from "../../config";
import { IconButton } from "../IconButton";
import { type Channel } from "../../types/channel";
import { ChannelContext } from "@/src/contexts/channelContext";
import { ChannelMemContext } from "@/src/contexts/channelMemContext";

type Props = {
  id: string;
  channel: Channel;
};

export const ChannelDisplay = ({ id, channel }: Props) => {
  const navigation = useNavigation();
  const { channelId, channelName, channelProp, channelMember } = channel;
  const [propName, setPropName] = useState<string>("");
  const { setChannel } = useContext(ChannelContext);
  const { setChannelMems } = useContext(ChannelMemContext);
  const ADMIN = process.env.EXPO_PUBLIC_ADMIN_A;

  const docRef = doc(db, "users", String(channelProp));
  useEffect(() => {
    const getUsername = async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPropName(docSnap.data().username);
      }
    };
    getUsername();
  }, []);

  const onPressAddDelete = (channel: Channel): void => {
    setChannelMems(channelMember);
    setChannel(channel);
    navigation.navigate("AddMem", { channel });
  };

  const onPressShowMessage = (): void => {
    navigation.navigate("Talking");
  };

  return (
    <ScrollView style={styles.container}>
      {channel?.channelProp === auth.currentUser?.uid ||
      channel?.channelMember.includes(auth.currentUser?.uid ?? "") ||
      ADMIN?.includes(auth.currentUser?.uid ?? "") ? (
        <TouchableOpacity
          onPress={() => {
            onPressShowMessage();
            setChannel(channel);
          }}
        >
          <View style={styles.subContainer}>
            <View style={styles.leftContainer}>
              {channel?.channelProp === auth.currentUser?.uid ? (
                <IconButton
                  name="users"
                  size={26}
                  color="#1605fd"
                  onPress={() => {
                    onPressAddDelete(channel);
                  }}
                />
              ) : null}
            </View>
            <View style={styles.rightContainer}>
              <Text style={styles.nameText}>{channelName}</Text>
              <Text style={styles.propText}>{propName}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.subContainer}>
          <View style={styles.leftContainer} />
          <View style={styles.rightContainer}>
            <Text style={styles.grayText}>{channelName}</Text>
            <Text style={styles.grayProp}>{propName}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    flexDirection: "row",
  },
  leftContainer: {
    marginLeft: 15,
    width: "15%",
  },
  rightContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: "85%",
  },
  nameText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  propText: {
    color: "#432e2e",
    fontSize: 12,
  },
  grayText: {
    color: "#c3b5b5",
    fontSize: 18,
    fontWeight: "bold",
  },
  grayProp: {
    color: "#c3b5b5",
    fontSize: 12,
  },
});
