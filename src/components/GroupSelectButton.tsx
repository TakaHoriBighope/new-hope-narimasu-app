import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export const GroupSelectButton = (): JSX.Element => {
  const onPressGroup = (): void => {
    const navigation = useNavigation();
    navigation.navigate("SelectGroup");
  };
  return (
    <TouchableOpacity onPress={onPressGroup}>
      <MaterialCommunityIcons
        name="account-group"
        size={26}
        color="black"
        style={styles.button}
      />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    lineHeight: 20,
    margin: 5,
    marginRight: 15,
    color: "#800",
    // color: "#337cdb",
  },
});
