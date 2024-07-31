import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";

const getCameraRollPermission = async () => {
  if (Constants.platform?.ios) {
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera roll permission is required to select images.");
    }
  }
};

export const pickImage = async () => {
  //パーミッションを取得する
  await getCameraRollPermission();
  //ImagePicker起動
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
  });
  if (!result.canceled) {
    return result.assets[0].uri;
  }
};
