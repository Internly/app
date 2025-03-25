import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { styles } from "../../metrics/styles";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";

const LocationList = ({ image, description, location, distance }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      underlayColor={"#00000080"}
      onPress={() =>
        navigation.navigate("Jobs", {
          screen: "AdvertDetails",
          params: { title: location },
        })
      }
      className="border-b-[1px] py-4 px-4"
    >
      <View className="flex-row items-center">
        {/* the church's image */}
        {image && (
          <Image
            source={image}
            className="w-[107px] h-20 rounded-[14px]"
            resizeMode="cover"
          />
        )}

        {!image && (
          <View className="w-[107px] h-20 rounded-[14px] items-center justify-center bg-[#5F5F5F6E]">
            <FontAwesome5 name="church" size={60} color="#ffffff10" />
          </View>
        )}

        {/* church branch */}
        <View className="mx-3 flex-1">
          <Text style={styles.textbold} className="text-white text-xl">
            {location ? location : "-"}
          </Text>

          <Text
            numberOfLines={2}
            style={styles.textmedium}
            className="text-white text-xs mt-2"
          >
            {description ? description : "-"}
          </Text>
        </View>

        {/* kilometers away */}
        <View className="rounded-[5px] bg-[#5F5F5F6E] w-[76px] h-[59px] items-center justify-center">
          <Text
            style={styles.textmedium}
            className="text-white text-xs text-center"
          >
            {distance ? distance : "-"}
          </Text>
          <Text
            style={styles.textregular}
            className="text-white text-[10px] text-center"
          >
            KM
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LocationList;
