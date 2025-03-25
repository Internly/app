import { View, Text, TextInput } from "react-native";
import React from "react";

const CustomProfileInput = ({
  onChange,
  value,
  multiline,
  editable = true,
  type,
  placeholder,
  label,
}) => {
  return (
    <View
      style={{
        flexDirection: "column",
        marginBottom: 6,
      }}
      //   className="my-2"
    >
      <Text style={{}}>{label}</Text>
      <View
        style={{
          width: "100%",
          borderColor: "none",
          height: type === "textArea" ? 120 : 48,
          marginVertical: 10,
          borderWidth: 0,
          paddingLeft: 10,
        }}
        className={` bg-[#F5F7F9] rounded-lg flex flex-row ${
          type != "textArea" && "items-center justify-center"
        }`}
      >
        <TextInput
          //   value={value}
          onChangeText={(value) => onChange(value)}
          editable={editable}
          multiline={type === "textArea"}
          placeholder={placeholder}
          style={{
            minHeight: type === "textArea" && 170,
            padding: 5,
            // height:312,
            textAlignVertical: "top",
          }}
          className={`${type === "textArea" && "min-h-[300px]"} w-full`}
        />
      </View>
    </View>
  );
};

export default CustomProfileInput;
