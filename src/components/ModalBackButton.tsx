import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { router } from "expo-router";

const handlePress = (): void => {
  router.push("/(tabs)/talk");
};

const ModalBackButton = (): JSX.Element => {
  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.text}>Back</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 20,
    margin: 5,
    color: "#337cdb",
  },
});
export default ModalBackButton;
