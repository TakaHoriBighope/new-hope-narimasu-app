import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const LogOutButton = (): JSX.Element => {
  const handlePress = (): void => {
    const navigation = useNavigation();
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigation.navigate("Login");
      })
      .catch(() => {
        Alert.alert("Unabled Log Out!");
      });
  };
  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.text}>Log out</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    lineHeight: 34,
    margin: 15,
    color: "rgba(0, 0, 0, 0.7)",
  },
});
export default LogOutButton;
