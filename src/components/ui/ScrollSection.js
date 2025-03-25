import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import { sections } from "../metrics/sections";
import { styles } from "../metrics/styles";
import { useNavigation } from "@react-navigation/native";

const ScrollSection = () => {
  const navigation = useNavigation();
  return (
    <View className="bg-[#D9D9D930]">
      <FlatList
        data={sections}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="py-4"
        snapToInterval={93}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.6}
            className="px-4 items-center"
            onPress={() => navigation.navigate(item.name)}
          >
            <Image source={item.img} className="h-[43] w-[61]" />
            <Text
              className="text-white  text-xs mt-2"
              style={styles.textsemibold}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ScrollSection;
