import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

type Props = {
  onPress?: () => void;
  label: string;
};

export const Button2 = (props: Props): JSX.Element => {
  const { label, onPress } = props;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#900",
    height: 40,
    width: "40%",
    margin: 16,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#fff",
  },
});
