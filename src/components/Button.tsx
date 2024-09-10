import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  GestureResponderEvent,
} from "react-native";

type Props = {
  label: string;
  onPress?: () => void;
};

export const Button = (props: Props): JSX.Element => {
  const { label, onPress } = props;
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#800",
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  buttonLabel: {
    fontSize: 16,
    lineHeight: 24,
    color: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
});
