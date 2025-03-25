import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

const NotificationBar = ({
  message,
  icon,
  iconColor,
  bgColor,
  textColor,
  onClick,
}) => {
  const [show, setshow] = useState(true);

  return (
    <>
      {show && (
        <TouchableOpacity
          onPress={onClick}
          className="p-2 px-4 w-full min-h-[50] flex flex-row justify-between items-center bg-[#ffeca1] rounded-md"
        //   style={{ backgroundColor: bgColor }}
        >
          <FontAwesome
            name={icon || "warning"}
            size={24}
            color={iconColor || "red"}
          />
          <Text
            className=" text-sm font-[DMSans-SemiBold]"
            // style={{ color: textColor }}
          >
            {message}.{"  "}
            <Text className="underline text-sm font-[DMSans-Bold]">
                fix here
            </Text>
          </Text>
          <FontAwesome
            onPress={(e) => setshow(false)}
            name={"close"}
            size={15}
            color={iconColor || "red"}
          />
        </TouchableOpacity>
      )}
    </>
  );
};

export default NotificationBar;

const styles = StyleSheet.create({});
