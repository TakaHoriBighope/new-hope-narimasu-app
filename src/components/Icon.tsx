import { createIconSetFromIcoMoon } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import fontData from "../../assets/fonts/icomoon.ttf";
import fontSelection from "../../assets/fonts/selection.json";

const CustomIcon = createIconSetFromIcoMoon(
  fontSelection,
  "IcoMoon",
  "icomoon.ttf"
);

type Props = {
  name: string;
  size: number;
  color: string;
};

const Icon = (props: Props): JSX.Element | null => {
  const { name, size, color } = props;
  const [fontLoaded] = useFonts({
    IcoMoon: fontData,
  });
  if (!fontLoaded) {
    return null;
  }
  return <CustomIcon name={name} size={size} color={color} />;
};

export default Icon;
