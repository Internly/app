import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import React, { useContext } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../../data/colors";
import { AppContext } from "../../context/AppContext";

const DashboardCard = ({ title, icon, amount, bgColor,style,className }) => {
  const {width,height} = useContext(AppContext)
  return (
    <View
      className={`${width<400?"w-[45%]":"w-[45%]"}  bg-[${
        bgColor || colors.primary_mint
      }] rounded-xl p-4 shadow-xl m-2 ${className}`}
      style={{backgroundColor:bgColor||colors.primary_blue,...style}}
    >
      <View className="flex-row items-center">
        <FontAwesome name={icon || "dashboard"} size={20} color={"white"} />
        <Text
          className="text-white font-[DMSans-Bold] text-left text-md mx-2"
          style={{ fontFamily: "DMSans-Medium" }}
        >
          {title || "Title coin"}
        </Text>
      </View>
      <Text
        className="text-white font-[DMSans-Bold] text-left text-xl my-2"
        style={{ fontFamily: "DMSans-Medium" }}
      >
        {amount || 0}
      </Text>
      <Text className="text-white font-[DMSans-Bold] text-left text-sm">0.2 % </Text>
    </View>
  );
};

export default DashboardCard;

const styles = StyleSheet.create({});
