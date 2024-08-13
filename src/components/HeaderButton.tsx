import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  label: string;
  color?: string;
  size?: number;
  onPress?: () => void;
};

export const HeaderButton = ({
  label,
  color = "#800",
  size,
  onPress,
}: Props): JSX.Element => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <AntDesign name={label} color={color} size={size} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
});
