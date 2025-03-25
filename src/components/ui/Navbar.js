import { View, Text, Image } from "react-native";
import React from "react";
import { styles } from "../metrics/styles";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../../data/colors";
import Icon from ".././../../assets/svgs/Message - Iconly Pro-1.svg"


export const NavItem = ({ focused,focusedIcon,unFocusedIcon }) => {
  return (
    <View className={`justify-center items-center h-[100%] min-w-[20]`} style={{borderTopWidth:focused?1:0, borderTopColor:colors.primary_blue}}>
      {
        focused ? focusedIcon():unFocusedIcon()
      }
    </View>
  );
};

