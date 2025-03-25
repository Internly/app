import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useContext } from "react";
import { styles } from "../metrics/styles";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors } from "../../data/colors";
import { organization } from "expo-device";
import img from "../../../assets/icons/Avatar.png";
import { AppContext } from "../../context/AppContext";

export function getTimeDifference(startDate, endDate) {
  // Ensure dates are instances of Date
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the difference in milliseconds
  const diff = end - start;

  // Time calculations for days, hours, and minutes
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  // Determine the most appropriate unit to use
  if (days > 0) {
    return days + (days === 1 ? " day" : " days");
  } else if (hours > 0) {
    return hours + (hours === 1 ? " hour" : " hours");
  } else if (minutes > 0) {
    return minutes + (minutes === 1 ? " minute" : " minutes");
  } else {
    return "0 minutes";
  }
}
const JobCard = ({ advert, status }) => {
  const navigation = useNavigation();
  const { userType } = useContext(AppContext);
  advert;
  return (
    <TouchableOpacity
      // underlayColor={colors.light_mint}

      className="border-t shadow-sm border-blue-200 bg-white px-4 py-2 rounded-3xl my-2 w-full"
    >
      <View className="flex-col my-2 items-start w-full">
        {/* the advert image
        {image && (
          <Image
            source={image}
            className="w-[107px] h-20 rounded-[14px]"
            resizeMode="cover"
          />
        )} */}

        {/* organization Info */}
        <View className="relative" style={{ width: "auto" }}>
          <View className="flex flex-row w-full items-start  py-2 ">
            {advert?.organization?.avatar ? (
              <Image
                source={{ uri: advert?.organization?.avatar }}
                className="flex-row items-start justify-center rounded-full w-[40] h-[40]"
              />
            ) : (
              <Image
                source={img}
                className="flex-row items-start justify-center rounded-full w-[40] h-[40]"
              />
            )}

            <View className=" mx-2 w-full">
              <Text
                style={{ ...styles.textbold }}
                className="text-black text-lg font-black "
              >
                {advert?.title ? advert?.title : "Brand name"}
              </Text>
              <Text className="text-[#272727] text-[10px] font-[DMSans-Bold]">
                {advert?.organization?.name || "advert title"}{" "}
                <Text className="text-[#272727] text-[10px] mx-2 font-[DMSans-Medium] ">
                  {" "}
                  posted {new Date(advert.createdAt).toDateString()}
                </Text>
              </Text>

              <View className="flex flex-row w-full my-2 relative  items-center">
                {/* Duration */}
                <View className="py-1 pr-2 rounded-lg flex flex-col  justify-center">
                  <Text className=" text-[#272727] text-[10px] ">Duration</Text>
                  <Text className=" text-black text-[13px] font-[DMSans-Black]">
                    {advert?.duration}{" "}
                  </Text>
                </View>

                {/* Applications */}
                <View className="py-1 px-2 rounded-lg flex flex-col  justify-center">
                  <Text className=" text-[#272727] text-[10px] ">
                    Applications
                  </Text>
                  <Text className=" text-black text-[13px] font-[DMSans-Black]">
                    {advert?.adverts?.length || "0"}{" "}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <>
          <View className="flex flex-row justify-between items-center mt-3 flex-wrap">
            {advert?.tags?.length > 0 &&
              advert?.tags?.map((tag, i) => (
                <Text
                  key={i}
                  style={{ flex: 1 }}
                  className="text-[#272727B2] w-full text-center my-2  min-w-[100]  text-[10px]  px-4 py-2 rounded-full bg-[#27272740] mr-2"
                >
                  {tag}
                </Text>
              ))}

            {status != "completed" && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Adverts", {
                    initial: true,
                    screen: "AdvertDetails",
                    params: advert,
                  });
                }}
                style={{ flex: 1 }}
                className=" bg-[#4785FF] min-w-[100] w-full flex items-center my-2 justify-center rounded-full px-4 py-2"
              >
                <Text className=" text-white text-[12px] ">
                  {status === "current" || userType === "organization"
                    ? "View"
                    : "Apply"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      </View>
    </TouchableOpacity>
  );
};

export default JobCard;
