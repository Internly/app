import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../metrics/styles";

const CommunityPost = ({ bg, title, description, onPress }) => {
  return (
    <ImageBackground source={bg} className="rounded-[34px] overflow-hidden">
      <TouchableOpacity
        underlayColor={"#00000080"}
        onPress={onPress ? onPress : null}
        className="min-h-[350px] justify-end"
      >
        <LinearGradient
          colors={["transparent", "#00000090", "#000000", "#000", "#000"]}
        >
          <View className=" p-4 py-8">
            <Text style={styles.textbold} className="text-white text-base mb-1">
              {title}
            </Text>

            <Text
              style={styles.textmedium}
              className="text-xs text-[#FFFFFF] mb-3"
            >
              {description}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default CommunityPost;
