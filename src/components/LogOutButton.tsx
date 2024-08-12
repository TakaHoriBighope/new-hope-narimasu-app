import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";

const LogOutButton = (): JSX.Element => {
  const { setUser } = useContext(UserContext);
  const handlePress = (): void => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setUser(null);
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
    fontSize: 16,
    lineHeight: 20,
    margin: 8,
    color: "rgba(155, 52, 52, 0.7)",
  },
});
export default LogOutButton;
