import { ScrollView, StyleSheet, View } from "react-native";

import { useEffect, useState } from "react";
import { type Channel } from "../../types/channel";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db, auth } from "../../config";
import { ChannelDisplay } from "../../components/listitem/ChannelDisplay";

export const GroupScreen = () => {
  const [channels, setChannels] = useState<Channel[]>([]);

  if (auth.currentUser === null) {
    return;
  }

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
    <ScrollView>
      <View style={styles.container}>
        {channels.map((channel) => (
          <ChannelDisplay
            channel={channel}
            id={String(channel.channelId)}
            key={channel.channelId}
          />
        ))}
        {/* <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} /> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  separator: {
    marginVertical: 30,
    height: 1,
  },
});
