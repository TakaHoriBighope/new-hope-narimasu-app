import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  onPress: (event: GestureResponderEvent) => void;
  name?: string;
  color?: string;
  size?: number;
};

export const HeaderButton: React.FC<Props> = ({
  onPress,
  name,
  color = "#800",
  size,
}: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <AntDesign name={name} color={color} size={size} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
});
