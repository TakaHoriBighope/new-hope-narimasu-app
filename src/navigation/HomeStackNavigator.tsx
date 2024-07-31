import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
/** screens */
import { HomeScreen } from "../screens/info/HomeScreen";
import { InfoDetailScreen } from "../screens/info/InfoDetailScreen";
import { InfoEditScreen } from "../screens/info/InfoEditScreen";
/** types */
import { RootStackParamList } from "../types/navigation";
import { InfoCreateScreen } from "../screens/info/InfoCreateScreen";

const Stack = createStackNavigator<RootStackParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{ headerTintColor: "#800" }}
    >
      <Stack.Group>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="InfoDetail"
          component={InfoDetailScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="InfoEdit"
          component={InfoEditScreen}
          options={{ headerShown: true }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
export const HomeStackNavigator = () => (
  <RootStack.Navigator screenOptions={{ presentation: "modal" }}>
    <RootStack.Screen
      name="Main"
      component={MainStack}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="InfoCreate"
      component={InfoCreateScreen}
      options={{ headerShown: true }}
    />
  </RootStack.Navigator>
);
