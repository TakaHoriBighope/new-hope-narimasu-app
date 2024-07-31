import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
/** navigator */
import { TabNavigator } from "../navigation/TabNavigator";
/* screens */
/* contexts */
import { UserContext } from "../contexts/userContext";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import { AuthStackNavigation } from "./AuthStackNavigation";

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { user } = useContext(UserContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen
            name="Login"
            component={AuthStackNavigation}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Home"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
