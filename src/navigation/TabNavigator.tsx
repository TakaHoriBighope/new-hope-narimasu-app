import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

/** screens */
import { HomeStackNavigator } from "./HomeStackNavigator";
import { ShareStackNavigator } from "./ShareStackNavigator";
import { TalkStackNavigator } from "./TalkStackNavigator";
import { SettingsStackNavigator } from "./SettingsStackNavigator";

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTintColor: "#900",
        tabBarActiveTintColor: "#900",
        tabBarInactiveTintColor: "#999",
      }}
    >
      <Tab.Screen
        name="Information"
        // component={HomeScreen}
        component={HomeStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: "週報",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
          // tabBarBadge: count,
        }}
      />
      <Tab.Screen
        name="Share"
        component={ShareStackNavigator}
        // component={ShareScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Share",
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-circle" color={color} size={size} />
          ),
          // tabBarBadge: count,
        }}
      />

      <Tab.Screen
        name="Talk"
        component={TalkStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: "Talk",
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-square" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingsStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="gear" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
