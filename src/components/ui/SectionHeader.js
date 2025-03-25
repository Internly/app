import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "../metrics/styles";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../metrics/colors";
import { useNavigation } from "@react-navigation/native";

const SectionHeader = ({ name, image, type, image2 }) => {
  const navigation = useNavigation();
  return (
    <View className="p-4 flex-row items-center">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color={colors.gold} />
      </TouchableOpacity>

      {/* icon */}
      {type == 1 && (
        <Image
          source={image}
          className="h-9 w-[35] ml-1"
          resizeMode="contain"
        />
      )}

      {/* section image for type 2 */}
      {type == 2 && (
        <Image
          source={image2}
          className="h-9 w-[35] ml-2 mr-1"
          resizeMode="contain"
        />
      )}

      <Text
        style={styles.textbold}
        className="text-white flex-1 ml-2 text-base"
      >
        {name}
      </Text>

      {/* icon */}
      {type == 2 && (
        <Image
          source={image}
          className="h-9 w-[35] ml-1 mr-2"
          resizeMode="contain"
        />
      )}

      <Image
        resizeMode="cover"
        source={require("../../../assets/icons/notification-icon.png")}
        className="w-7 h-8"
      />
    </View>
  );
};

export default SectionHeader;
