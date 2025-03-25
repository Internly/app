import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

const CustomAuthTextInput = ({
  label,
  placeholder,
  keyboardType,
  name,
  control,
  error,
  showError,
  secureTextEntry,
  icon,
  customComponent,
}) => {
  return (
    <View style={{ marginBottom: 4 }}>
      <Text
        className="font-[DMSans-Regular]"
        style={{
          fontSize: 13,
          fontWeight: "300",
          marginLeft: 30,
          marginVertical: 8,
          color: "#202020",
        }}
      >
        {label}
      </Text>

      <View
        style={{
          width: "100%",
          height: 48,
          borderColor: "none",
          borderWidth: 0,
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 22,
        }}
        className=" bg-[#F5F7F9] rounded-full flex flex-row items-center"
      >
        <Ionicons className="w-full " name={icon} color={"#696767"} size={14} />
        <View className="w-[1px] h-[40%] bg-[#696767] mx-2" />
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="text-[#929292] font-[DMSans-Light]"
              placeholder={placeholder}
              placeholderTextColor={"gray"}
              keyboardType={keyboardType}
              secureTextEntry={secureTextEntry}
              style={{ width: "90%", fontSize: 13 }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {customComponent}
      </View>
      {showError && <Text style={{ color: "red", fontSize: 12 }}>{error}</Text>}
    </View>
  );
};

export default CustomAuthTextInput;

export const CustomInput = ({
  label,
  placeholder,
  keyboardType,
  name,
  control,
  error,
  showError,
  editable,
  defaultValue,
  secureTextEntry,
  customComponent,
  customContainerStyle,
}) => {
  return (
    <View style={{ marginBottom: 4 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "300",
          marginVertical: 8,
          color: "#202020",
          ...customContainerStyle,
        }}
        className="font-[DMSans-Regular]"
      >
        {label}
      </Text>

      <View
        style={{
          width: "100%",
          minHeight: 48,
          borderColor: "none",
          borderWidth: 0,
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 22,
        }}
        className=" bg-[#F5F7F9] rounded-lg flex flex-row items-center"
      >
        {customComponent || (
          <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="text-[#323232] font-[DMSans-Light] "
                defaultValue={defaultValue}
                placeholder={placeholder}
                placeholderTextColor={"#929292"}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                style={{ width: "90%", fontSize: 13 }}
                onBlur={onBlur}
                editable={editable}
                onChangeText={onChange}
                value={value||defaultValue}
              />
            )}
          />
        )}
      </View>
      {showError && <Text style={{ color: "red", fontSize: 12 }}>{error}</Text>}
    </View>
  );
};
