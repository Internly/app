import {
  View,
  Text,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

const Touchable = ({ onPress, children, style, radius }) => {
  // Use TouchableNativeFeedback on Android, TouchableOpacity on other platforms
  const Touchable =
    Platform.OS === "android" ? TouchableNativeFeedback : TouchableOpacity;

  // Define ripple effect for Android
  const androidRipple =
    Platform.OS === "android"
      ? {
          background: TouchableNativeFeedback.Ripple("#00000030", true),
        }
      : {};

  return (
    <View style={{ borderRadius: radius }} className="overflow-hidden">
      <Touchable onPress={onPress} {...androidRipple}>
        <View style={style}>{children}</View>
      </Touchable>
    </View>
  );
};

export default Touchable;
