import {
  Text,
  StyleSheet,
  type ViewStyle,
  TouchableOpacity,
} from "react-native";

type Props = {
  children: JSX.Element;
  style?: ViewStyle;
  onPress?: () => void;
};

const FloatingButton = (props: Props): JSX.Element => {
  const { children, style, onPress } = props;
  return (
    <TouchableOpacity onPress={onPress} style={[styles.floatingButton, style]}>
      <Text>{children}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  floatingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#900",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 5, height: 8 },
    elevation: 8,
  },
});

export default FloatingButton;
