import React, { useEffect, useState } from "react";
import { Image, View, Dimensions, StyleSheet } from "react-native";

interface Props {
  url: string;
}

export const CoverImage = ({ url }: Props) => {
  const [imageWidth, setImageWidth] = useState(Dimensions.get("window").width);
  const [imageHeight, setImageHeight] = useState(200);
  useEffect(() => {
    Image.getSize(url, (width, height) => {
      if (width && height) {
        setImageHeight((height * imageWidth) / width);
      }
    });
  }, []);
  return (
    <Image
      source={{ uri: url }}
      resizeMode="cover"
      style={{ width: imageWidth, height: imageHeight }}
    ></Image>
  );
};
