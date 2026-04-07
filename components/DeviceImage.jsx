import { Image, StyleSheet, View } from "react-native";

export default function DeviceImage({
  type = "mobile",
  isCharging = false,
  size = 90,
}) {
  let imageSource;

  switch (type) {
    case "laptop":
      imageSource = require("../assets/images/laptop.webp");
      break;
    case "phone":
      imageSource = require("../assets/images/phone.webp");
      break;
    case "tablet":
      imageSource = require("../assets/images/tablet.png");
      break;
    default:
      imageSource = require("../assets/images/phone.webp");
  }

  return (
    <View style={[styles.imageContainer, { width: size, height: size }]}>
      <Image source={imageSource} style={[styles.image]} />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#242528",
    borderRadius: 8,
  },
  image: {
    objectFit: "contain",
    width: "100%",
    height: "100%",
  },
});
