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
      <View style={styles.highlight} />
      <Image source={imageSource} style={[styles.image]} />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#11141A",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  highlight: {
    position: "absolute",
    top: -18,
    left: -10,
    width: 36,
    height: 36,
    borderRadius: 36,
    backgroundColor: "rgba(126,240,214,0.16)",
  },
  image: {
    objectFit: "contain",
    width: "100%",
    height: "100%",
  },
});
