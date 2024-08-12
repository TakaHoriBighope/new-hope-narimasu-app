import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useContext, useState } from "react";
import { Button } from "../../components/Button";
import { auth, db } from "../../config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserContext } from "../../contexts/userContext";
import { Timestamp, doc, setDoc } from "firebase/firestore";

//画面遷移に必要

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "SignUp">;
};

export const SignUpScreen = ({ navigation }: Props): JSX.Element => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(true);
  const { setUser } = useContext(UserContext);

  const validateEmail = (text: string) => {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!regex.test(text)) {
      setError("This is not a valid email address");
    } else {
      setError("");
    }
  };

  const passwordCheck = (newText: string) => {
    const regex = /^[a-zA-Z0-9]+$/;
    const isValid = regex.test(newText);
    setIsValid(isValid);
  };

  const handlePress = async (
    email: string,
    password: string,
    username: string
  ): Promise<void> => {
    //会員登録
    console.log(email, password);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user.uid);
        setDoc(doc(db, "users", userCredential.user.uid), {
          email: email,
          coverPicture: "",
          profilePicture: "",
          followers: [],
          followings: [],
          createdAt: Timestamp.fromDate(new Date()),
          updatedAt: Timestamp.fromDate(new Date()),
          salesTalk: "",
          username: username,
          uid: userCredential.user.uid,
        });
        // setUser(userCredential.user)
        navigation.navigate("Login");
      })
      .catch((error) => {
        const { code, message } = error;
        console.log(code, message);
      });
  };

  const onPressLogin = (): void => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} keyboardDismissMode="on-drag">
      <View style={styles.inner}>
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>New Hope</Text>
          <Text style={styles.subTitle}>Narimasu</Text>
        </View>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          value={username}
          placeholder="username..."
          keyboardType="default"
          autoCapitalize="sentences"
          textContentType="username"
          onChangeText={(text) => {
            setUsername(text);
          }}
        />
        <TextInput
          style={styles.input}
          value={email}
          placeholder="email address"
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          onChangeText={(text) => {
            setEmail(text);
            validateEmail(text);
          }}
        />
        {error && <Text style={{ color: "red" }}>{error}</Text>}
        <TextInput
          style={styles.input}
          value={password}
          placeholder="passoword"
          autoCapitalize="none"
          secureTextEntry
          textContentType="password"
          onChangeText={(text) => {
            setPassword(text);
            passwordCheck(text);
          }}
        />
        {!isValid && <div>There is an error in the input content.</div>}
        <Button
          label="Submit"
          onPress={() => {
            handlePress(email, password, username);
          }}
        />
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already registered ?</Text>
          <GestureHandlerRootView>
            <TouchableOpacity onPress={onPressLogin}>
              <Text style={styles.footerLink}>Log in here</Text>
            </TouchableOpacity>
          </GestureHandlerRootView>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0d1d1",
  },
  titleContainer: {
    flexDirection: "row",
  },
  mainTitle: {
    color: "#800",
    fontSize: 26,
    lineHeight: 32,
    fontWeight: 700,
    marginTop: 60,
  },
  subTitle: {
    color: "#800",
    fontSize: 16,
    lineHeight: 36,
    fontWeight: 600,
    marginTop: 60,
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 600,
    marginBottom: 24,
  },
  inner: {
    paddingVertical: 24,
    paddingHorizontal: 27,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dddddd",
    backgroundColor: "#ffffff",
    height: 48,
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },

  footer: {
    flexDirection: "row",
  },
  footerText: {
    fontSize: 16,
    lineHeight: 24,
    marginRight: 8,
    color: "#000000",
  },
  footerLink: {
    fontSize: 16,
    lineHeight: 24,
    color: "#800",
  },
});
