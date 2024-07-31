import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { db, auth } from "../../config";
import { UserContext } from "@/src/contexts/userContext";
import { Channel } from "@/src/types/channel";
import { doc, updateDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Button2 } from "@/src/components/Button2";

// type Props = {
//   url: string;
// };

export const CoverProfilePicture = () => {
  const { user, setUser } = useContext(UserContext);
  const [channels, setChannels] = useState<Channel[]>([]);
  if (auth.currentUser === null) {
    return;
  }

  useEffect(() => {
    const fetchChannels = async () => {
      const querySnapshot = await getDocs(collection(db, "channels"));
      const resultChannels: Channel[] = [];
      querySnapshot.forEach((doc) => {
        const { channelId, channelName, channelProp, channelMember } =
          doc.data() as Channel;
        resultChannels.push({
          channelId: doc.id,
          channelName,
          channelProp,
          channelMember,
        });
      });
      setChannels(resultChannels);
    };
    fetchChannels();
  }, []);

  const onPressPhotoChange = () => {
    console.log(channels.length);
    for (let i = 0; i < channels.length; i++) {
      channels[i].channelMember.includes(auth.currentUser?.uid ?? "")
        ? console.log(channels[i].channelName)
        : null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Do you want to change your profile image from group talk messages?
      </Text>

      <Button2 onPress={onPressPhotoChange} label="  change   " />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    // justifyContent: "center",
  },

  text: {
    fontSize: 16,
    lineHeight: 18,
    maxWidth: "80%",
    textAlign: "center",
    marginVertical: 15,
  },
});
