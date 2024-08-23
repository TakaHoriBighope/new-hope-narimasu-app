import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useState, useContext, useEffect } from "react";
import { Button } from "../../components/Button";
import { UserContext } from "../../contexts/userContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
//画面遷移に必要
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/src/config";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "Login">;
};

export const LoginScreen = ({ navigation }: Props): JSX.Element => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
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

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      // console.log("user?.uid:", user?.uid);
      if (user) {
        const docRef = doc(db, "users", String(user.uid));
        getDoc(docRef)
          .then((docSnap) => {
            setUser({
              id: docSnap.data()?.id,
              email: docSnap.data()?.email,
              coverPicture: "",
              profilePicture: docSnap.data()?.profilePicture,
              followers: docSnap.data()?.followers,
              followings: docSnap.data()?.followings,
              createdAt: docSnap.data()?.createdAt,
              updatedAt: docSnap.data()?.updatedAt,
              salesTalk: docSnap.data()?.salesTalk,
              username: docSnap.data()?.username,
              uid: user.uid,
            });
          })
          .catch((error) => {
            console.log("No such document at LoginScreen", error);
          });
      } else {
        console.log("User is signed out");
      }
    });
  }, []);

  const onPressSubmit = async (email: string, password: string) => {
    //ログイン
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user.uid);
        navigation.navigate("Main");
      })
      .catch((error) => {
        const { code, message } = error;
        console.log(code, message);
        Alert.alert(message);
      });
  };

  const onPressSignUp = (): void => navigation.navigate("SignUp");

  return (
    <ScrollView style={styles.container} keyboardDismissMode="on-drag">
      <View style={styles.inner}>
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>New Hope</Text>
          <Text style={styles.subTitle}>Narimasu</Text>
        </View>
        <Text style={styles.title}>Log In</Text>
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
          maxLength={10}
          placeholder="passoword"
          autoCapitalize="none"
          secureTextEntry
          textContentType="password"
          onChangeText={(text) => {
            setPassword(text);
            passwordCheck(text);
          }}
        />
        <Button
          label="Submit"
          onPress={() => {
            onPressSubmit(email, password);
          }}
        />
        <View style={styles.footer}>
          <Text style={styles.footerText}>Not registered yet ?</Text>
          <GestureHandlerRootView>
            <TouchableOpacity onPress={onPressSignUp}>
              <Text style={styles.footerLink}>Sign up here</Text>
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
    fontWeight: "600",
    marginTop: 60,
  },
  subTitle: {
    color: "#800",
    fontSize: 16,
    lineHeight: 36,
    fontWeight: "600",
    marginTop: 60,
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
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
