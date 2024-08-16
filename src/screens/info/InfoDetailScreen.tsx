import { View, Text, ScrollView, StyleSheet } from "react-native";
import FloatingButton from "../../components/FloatingButton";
import Icon from "@/src/components/Icon";
import { auth, db } from "../../config";
import { useContext, useEffect, useState } from "react";
import { IconButton } from "../../components/IconButton";
import { Info } from "../../types/info";
import { InfoContext } from "../../contexts/infoContext";
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
//画面遷移に必要
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";
import { RouteProp } from "@react-navigation/native";
import { UserContext } from "@/src/contexts/userContext";
import { CoverImage } from "@/src/components/CoverImage";
type Props = {
  navigation: StackNavigationProp<RootStackParamList, "InfoDetail">;
  route: RouteProp<RootStackParamList, "InfoDetail">;
};

export const InfoDetailScreen = ({ navigation, route }: Props) => {
  const { info } = route.params;
  // const { setInfo } = useContext(InfoContext);
  const [infoSingle, setInfoSingle] = useState<Info | null>(null);
  const { user } = useContext(UserContext);
  const ADMIN = process.env.EXPO_PUBLIC_ADMIN_A;

  useEffect(() => {
    if (info.read.includes(user?.uid ?? "")) {
      return;
    }
    const readRef = doc(db, "infos", String(info.id));
    const checkRead = async () => {
      await updateDoc(readRef, {
        read: arrayUnion(user?.uid),
      });
    };
    checkRead();
  }, []);

  useEffect(() => {
    if (auth.currentUser === null) {
      return;
    }
    navigation.setOptions({
      headerTintColor: "#800",
      title: "Detail of NHN 週報",
      headerLeft: () => (
        <IconButton name="x" onPress={() => navigation.pop()} />
      ),
      headerRight: () => undefined,
    });
    const ref = doc(db, "infos", String(info.id));
    const unsubscribe = onSnapshot(
      ref,
      (infoDoc) => {
        setInfoSingle({
          id: infoDoc.id,
          desc: infoDoc.data()?.desc,
          imgURL: infoDoc.data()?.imgURL,
          uid: infoDoc.data()?.uid,
          likes: infoDoc.data()?.likes,
          createdAt: infoDoc.data()?.createdAt,
          read: infoDoc.data()?.read,
        });
      },
      (error) => {
        // console.log("onSnapshot at InfoDetail", error);
      }
    );
    return () => {
      unsubscribe(); // ← 追加
    };
  }, []);

  const onPressEdit = (id: string): void => {
    navigation.navigate("InfoEdit", { id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoHeader}>
        <Text style={styles.infoTitle} numberOfLines={1}>
          {infoSingle?.desc}
        </Text>
        <Text style={styles.infoDate}>
          {infoSingle?.createdAt?.toDate().toLocaleString("en-US")}
        </Text>
      </View>
      <ScrollView style={styles.infoBody}>
        {infoSingle?.imgURL ? (
          <View style={styles.imageVertical}>
            <CoverImage url={infoSingle?.imgURL} />
          </View>
        ) : null}
        <View>
          <Text style={styles.infoBodyText}>{infoSingle?.desc}</Text>
        </View>
      </ScrollView>
      {ADMIN?.includes(auth.currentUser?.uid ?? "") ? (
        // {auth.currentUser?.uid === infoSingle?.uid ? (
        <FloatingButton
          onPress={() => {
            onPressEdit(info.id);
          }}
          style={{ position: "absolute", top: 50, right: 20 }}
        >
          <Icon name="pencil" size={33} color="white" />
        </FloatingButton>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  infoHeader: {
    backgroundColor: "#900",
    height: 70,
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  imageVertical: {
    paddingVertical: 5,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  infoTitle: {
    color: "white",
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "bold",
  },
  infoDate: {
    color: "white",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "bold",
  },
  infoBody: {},
  infoBodyText: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    fontSize: 16,
    lineHeight: 28,
    color: "#000000",
  },
});
