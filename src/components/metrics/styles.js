import { Platform, StyleSheet, StatusBar, Dimensions } from "react-native";

export const deviceWidth = Dimensions.get("window").width;
export const deviceHeight = Dimensions.get("window").height;

export const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
  },
  textregular: {
    fontFamily: "DMSans-Regular",
  },
  textmedium: {
    fontFamily: "DMSans-Medium",
  },
  textsemibold: {
    fontFamily: "DMSans-SemiBold",
  },
  textbold: {
    fontFamily: "DMSans-Bold",
    fontSize: 14,
  },
});
