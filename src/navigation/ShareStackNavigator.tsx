import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
/** screens */
import { ShareScreen } from "../screens/share/ShareScreen";
import { ShareDetailScreen } from "../screens/share/ShareDetailScreen";
import { ShareEditScreen } from "../screens/share/ShareEditScreen";
import { ShareCreateScreen } from "../screens/share/ShareCreateScreen";
/** types */
import { RootStackParamList } from "../types/navigation";

const Stack = createStackNavigator<RootStackParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Share"
      screenOptions={{ headerTintColor: "#800" }}
    >
      <Stack.Group>
        <Stack.Screen
          name="Share"
          component={ShareScreen}
          options={{ headerShown: true, headerTintColor: "#800" }}
        />
        <Stack.Screen
          name="ShareDetail"
          component={ShareDetailScreen}
          options={{ headerShown: true, headerTintColor: "#800" }}
        />
        <Stack.Screen
          name="ShareEdit"
          component={ShareEditScreen}
          options={{ headerShown: true, headerTintColor: "#800" }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export const ShareStackNavigator = () => (
  <RootStack.Navigator screenOptions={{ presentation: "modal" }}>
    <RootStack.Screen
      name="ShareStack"
      component={MainStack}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="ShareCreate"
      component={ShareCreateScreen}
      options={{ headerShown: true }}
    />
  </RootStack.Navigator>
);
