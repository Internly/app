import { View, Text, ImageBackground, Image } from "react-native";
import React from "react";
import logo from "../../../assets/icons/appIcon.png";
import LoadingDot from "./LoadingDot";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const LoadingScreen = () => {
  return (
    <Animated.View
      className="absolute left-0 right-0 top-0 bottom-0 flex-1"
      entering={FadeIn}
      exiting={FadeOut}
    >
      <ImageBackground
        // source={bg}
        className="flex-1 items-center justify-center bg-[#f0eeeee5]"
        resizeMode="cover"
      >
        <StatusBar style="light" />
        <View className="items-center">
          <Image source={logo} className=" w-[100] h-[100] bottom-2" />

          <LoadingDot />
          {/* <Text className="text-black font-semibold my-2">
            Loading ...
          </Text> */}
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

export default LoadingScreen;
