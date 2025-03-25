import { View, Text, Image } from "react-native";
import React from "react";
import logo from "../../../assets/icon.png";
import { styles } from "../metrics/styles";

const AuthHeader = () => {
  return (
    <View className="flex-row gap-2 items-center">
      <Image source={logo} className="w-11 h-11" />
      <Text className="text-white text-sm w-[145px]" style={styles.textbold}>
        The Agape Christian Ministries{" "}
      </Text>
    </View>
  );
};

export default AuthHeader;
