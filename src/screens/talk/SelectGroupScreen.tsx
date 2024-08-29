import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../config";
/** components */
import { ChannelDisplay } from "@/src/components/listitem/ChannelDisplay";
/** types */
import { type Channel } from "../../types/channel";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { ChannelContext } from "@/src/contexts/channelContext";
import { IconButton } from "@/src/components/IconButton";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "SelectGroup">;
  route: RouteProp<RootStackParamList, "SelectGroup">;
};

export const SelectGroupScreen = ({ navigation, route }: Props) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  // const { setChannel } = useContext(ChannelContext);

  useEffect(() => {
    navigation.setOptions({
      title: "Select Group",
      headerLeft: () => (
        <IconButton name="x" onPress={() => navigation.pop()} size={24} />
      ),
      headerRight: () => undefined,
    });
  }, []);

  useEffect(() => {
    const q = query(collection(db, "channels"), orderBy("channelName"));
    onSnapshot(
      q,
      (snapshot) => {
        const channelsResults: Channel[] = [];
        snapshot.forEach((doc) => {
          const { channelId, channelName, channelProp, channelMember } =
            doc.data() as Channel;
          channelsResults.push({
            channelId: doc.id,
            channelName,
            channelProp,
            channelMember,
          });
        });
        setChannels(channelsResults);
      },
      (error) => {
        console.log("onSnapshot at Channels", error);
      }
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity>
          <View style={styles.container}>
            {channels.map((channel) => (
              <ChannelDisplay
                channel={channel}
                id={String(channel.channelId)}
                key={channel.channelId}
              />
            ))}
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 22,
    fontWeight: "600",
  },
});
