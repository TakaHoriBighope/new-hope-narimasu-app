import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { type Info } from "../../types/info";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../../config";
import { useContext } from "react";
import { UserContext } from "@/src/contexts/userContext";
import { InfosContext } from "@/src/contexts/infosContext";

type Props = {
  info: Info;
  onPress: () => void;
};

export const InfoListItem = ({ info, onPress }: Props): JSX.Element | null => {
  const ADMIN = process.env.EXPO_PUBLIC_ADMIN_A;
  // const ADMIN2 = process.env.EXPO_PUBLIC_ADMIN_B;

  const { desc, createdAt, imgURL, uid, likes, read } = info;

  if (desc === null || createdAt === null) {
    return null;
  }

  const { user } = useContext(UserContext);

  // console.log("User:", user?.uid);
  // console.log("uid:", uid);
  const { infos, setInfos } = useContext(InfosContext);
  const dateString = createdAt.toDate().toLocaleString("en-US");
  let dateAry = dateString.split(",");

  const onPressDelete = (id: string): void => {
    if (auth.currentUser === null) {
      return;
    }
    const ref = doc(db, "infos", id);
    Alert.alert("Information deleted.", "Are you sure？", [
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
          setInfos(infos.filter((info) => info.id !== id));
        },
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.infoListItem} onPress={onPress}>
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
          <Text numberOfLines={3} style={styles.infoListItemTitle}>
            {desc}
          </Text>
          <View style={styles.read}>
            {user?.uid === uid &&
            // user?.uid ===
            ADMIN?.includes(user?.uid) ? null : info?.read.includes(
                user?.uid ?? ""
              ) ? null : user?.createdAt < createdAt ? (
              <View style={styles.mark} />
            ) : null}
            <Text style={styles.infoListItemDate}>{dateAry[0]}</Text>
          </View>
          {/* {user?.uid === uid && ADMIN?.includes(user?.uid) ? ( */}
          {ADMIN?.includes(user?.uid ?? "") ? (
            <View>
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => {
                  onPressDelete(info.id);
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
  infoListItem: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
  },
  infoListItemTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: 600,
    color: "#322e2e",
  },
  infoListItemDate: {
    fontSize: 13,
    lineHeight: 13,
    color: "#676262",
    marginVertical: 8,
  },
  itemContainer: {
    height: 100,
    width: "100%",
    flexDirection: "row",
    // marginVertical: 3,
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
    // paddingHorizontal: 1,
  },
});
