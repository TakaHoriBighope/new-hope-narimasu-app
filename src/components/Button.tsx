import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  GestureResponderEvent,
} from "react-native";

type Props = {
  onPress: (event: GestureResponderEvent) => void;
  label: string;
};

export const Button: React.FC<Props> = ({ onPress, label }: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#900",
    // backgroundColor: "#467FD3",
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
