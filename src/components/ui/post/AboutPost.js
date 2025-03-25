import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { styles } from "../../metrics/styles";
import { colors } from "../../metrics/colors";
import { LinearGradient } from "expo-linear-gradient";
import { SimpleLineIcons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import Touchable from "../../custom-ui/Touchable";

const AboutPost = ({ bg, icon, title, description }) => {
  const [isShown, setShown] = React.useState(false);

  return (
    <ImageBackground
      source={bg}
      className="rounded-[23px] mb-24 overflow-hidden"
      resizeMode={"cover"}
    >
      <LinearGradient
        colors={[
          "rgba(0,0,0,0.99)",
          "transparent",
          "#00000080",
          "#00000099",
          "#000000",
        ]}
        className=""
      >
        {!isShown && (
          <Touchable onPress={() => setShown(true)} className="min-h-[238px]">
            {!isShown && (
              <Animated.View
                entering={FadeInUp}
                exiting={FadeOut}
                className="p-4 flex-row  flex-1 px-5"
              >
                <SimpleLineIcons name="info" size={15} color={colors.gold} />
                <Text
                  style={styles.textmedium}
                  className="text-white text-xs ml-1"
                >
                  Tap to read
                </Text>
              </Animated.View>
            )}

            {!isShown && (
              <Animated.View
                entering={FadeInDown}
                exiting={FadeOut}
                className="p-4 px-5 flex-row items-center"
              >
                {/* icon */}
                <Image
                  source={icon}
                  className="w-[30px] h-[27px]"
                  resizeMode="contain"
                />
                <Text
                  style={styles.textsemibold}
                  className="text-base text-white ml-1"
                >
                  {title}
                </Text>
              </Animated.View>
            )}
          </Touchable>
        )}

        {/* the about description */}
        {/*  */}
        {isShown && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            className="bg-[#5A5A5A] min-h-[238px] rounded-[23px]"
          >
            <View className="p-4 px-5 flex-row items-center">
              {/* icon */}
              <Image
                source={icon}
                className="w-[30px] h-[27px]"
                resizeMode="contain"
              />
              <Text
                style={styles.textsemibold}
                className="text-base text-white ml-1 flex-1"
              >
                {title}
              </Text>

              {/* The cancel button */}
              <TouchableOpacity onPress={() => setShown(false)}>
                <MaterialIcons name="cancel" size={20} color="#7A7A7A" />
              </TouchableOpacity>
            </View>

            {/* The description */}
            <Text
              style={styles.textregular}
              className="text-white text-sm px-5 pl-6 pb-5"
            >
              {description}
            </Text>
          </Animated.View>
        )}
      </LinearGradient>
    </ImageBackground>
  );
};

export default AboutPost;
