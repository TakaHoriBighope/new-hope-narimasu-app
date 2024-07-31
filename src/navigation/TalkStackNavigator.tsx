import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
/** screens */
import { TalkScreen } from "../screens/talk/TalkScreen";
import { GroupScreen } from "../screens/talk/GroupScreen";
/** types */
import { RootStackParamList } from "../types/navigation";
import { SelectGroupScreen } from "../screens/talk/SelectGroupScreen";
import { AddMemberScreen } from "../screens/talk/AddMemberScreen";

const Stack = createStackNavigator<RootStackParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Talking"
      screenOptions={{ headerTintColor: "#000" }}
    >
      <Stack.Group>
        <Stack.Screen
          name="Talking"
          component={TalkScreen}
          options={{ headerShown: true, headerTintColor: "#800" }}
        />
        <Stack.Screen
          name="Group"
          component={GroupScreen}
          options={{ headerShown: true, headerTintColor: "#800" }}
        />
        <Stack.Screen
          name="AddMem"
          component={AddMemberScreen}
          options={{ headerShown: true, headerTintColor: "#800" }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export const TalkStackNavigator = () => (
  <RootStack.Navigator screenOptions={{ presentation: "modal" }}>
    <RootStack.Screen
      name="TalkStack"
      component={MainStack}
      options={{ headerShown: false, headerTintColor: "#800" }}
    />
    <RootStack.Screen
      name="SelectGroup"
      component={SelectGroupScreen}
      options={{ headerShown: true, headerTintColor: "#800" }}
    />
  </RootStack.Navigator>
);
