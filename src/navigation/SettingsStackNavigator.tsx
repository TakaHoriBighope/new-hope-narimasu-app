import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
/** screens */
import { SettingsScreen } from "../screens/user/SettingsScreen";
/** types */
import { RootStackParamList } from "../types/navigation";

const Stack = createStackNavigator<RootStackParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{ headerTintColor: "#000" }}
    >
      <Stack.Group>
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: true, headerTintColor: "#800" }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export const SettingsStackNavigator = () => (
  <RootStack.Navigator>
    <RootStack.Screen
      name="SettingStack"
      component={MainStack}
      options={{ headerShown: false, headerTintColor: "#800" }}
    />
  </RootStack.Navigator>
);
