import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
/** screens */
import { LoginScreen } from "../screens/auth/LoginScreen";
import { SignUpScreen } from "../screens/auth/SignUpScreen";
/** types */
import { RootStackParamList } from "../types/navigation";

const Stack = createStackNavigator<RootStackParamList>();

export const AuthStackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName={"Login"}>
      <Stack.Screen
        name="LoginAuth"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
