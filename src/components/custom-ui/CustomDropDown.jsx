import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const CustomDropDown = ({ ChildComponent, className, label }) => {

  const [isOpen, setIsOpen] = useState(true)
  return (
    <View className={`${className} w-full h-auto p-4 `}>
      {/* header */}
      <View className=" flex-row justify-between items-center my-4">
        <Text className="text-[14px] text-[#1F2024] font-[DMSans-Regular]">
          {label}
        </Text>

        <Ionicons onPress={()=>setIsOpen(!isOpen)} name={isOpen?"chevron-up":"chevron-down"} color={"#8F9098"} size={14}></Ionicons>
      </View>
{
  isOpen && ChildComponent && ChildComponent
}
      
    </View>
  );
};

export default CustomDropDown;


