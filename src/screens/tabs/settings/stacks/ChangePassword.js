import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../../data/colors";
import Button from "../../../../components/button/Button";
import { AppContext } from "../../../../context/AppContext";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Define validation schema using Yup
const schema = yup.object().shape({
  oldPassword: yup.string().required("Old Password is required"),
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .required("New Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm Password is required"),
});

const ChangePassword = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const { setAppLoading, getData, logOut } = useContext(AppContext);
  const navigation = useNavigation();

  // Initialize react-hook-form with validation schema
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const togglePasswordVisibility = () => {
    setIsPasswordShown(!isPasswordShown);
  };

  // Change password logic
  async function changePassword(data) {
    const token = await getData("authToken");
    const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

    try {
      setAppLoading(true);

      const response = await axios.put(
        `${baseUrl}/students/change_password`,
        data,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      if (response?.status === 201) {
        setAppLoading(false);
        await logOut();
        navigation.navigate("Signin");
        Alert.alert(
          "Success",
          "Password successfully changed, redirecting to sign in page"
        );
      }
    } catch (error) {
      console.log("Reset Password Error:", error);
      setAppLoading(false);
      Alert.alert(
        "Reset Password Error",
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="p-5 px-4 w-full flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.primary_blue}
            />
          </TouchableOpacity>
          <Text className="text-black text-[14px] font-[DMSans-Bold] ">
            Change Password
          </Text>
          <View />
        </View>

        <View style={{ flex: 1, marginHorizontal: 22 }}>
          <View style={{ marginVertical: 22 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "DMSans-SemiBold",
                marginVertical: 12,
                color: "#222222",
              }}
            >
              Hi there!
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#71727A",
                fontFamily: "DMSans-Regular",
              }}
            >
              Update your password to a more secure one.
            </Text>
          </View>

          {/* Old password */}
          <Text className="text-[12px] font-[DMSans-Medium] my-3">
            Old Password
          </Text>
          <View className=" bg-[transparent] border border-[#C5C6CC] rounded-xl p-4 flex flex-row items-center mb-2">
            <Controller
              name="oldPassword"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor={"#8F9098"}
                  secureTextEntry={!isPasswordShown}
                  className="text-[#929292] "
                  style={{ width: "90%", fontSize: 13 }}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={{ position: "absolute", right: 12 }}
            >
              <Ionicons
                name={isPasswordShown ? "eye-off" : "eye"}
                size={24}
                color={"#222222"}
              />
            </TouchableOpacity>
          </View>
          {errors.oldPassword && (
            <Text style={{ color: "red" }}>{errors.oldPassword.message}</Text>
          )}

          {/* New password */}
          <Text className="text-[12px] font-[DMSans-Medium] my-3">
            New Password
          </Text>
          <View className=" bg-[transparent] border border-[#C5C6CC] rounded-xl p-4 flex flex-row items-center mb-2">
            <Controller
              name="newPassword"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor={"#8F9098"}
                  secureTextEntry={!isPasswordShown}
                  className="text-[#929292] "
                  style={{ width: "90%", fontSize: 13 }}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={{ position: "absolute", right: 12 }}
            >
              <Ionicons
                name={isPasswordShown ? "eye-off" : "eye"}
                size={24}
                color={"#222222"}
              />
            </TouchableOpacity>
          </View>
          {errors.newPassword && (
            <Text style={{ color: "red" }}>{errors.newPassword.message}</Text>
          )}

          {/* Confirm password */}
          <Text className="text-[12px] font-[DMSans-Medium] my-3">
            Confirm New Password
          </Text>
          <View className=" bg-[transparent] border border-[#C5C6CC] rounded-xl p-4 flex flex-row items-center mb-2">
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Enter your password again"
                  placeholderTextColor={"#8F9098"}
                  secureTextEntry={!isPasswordShown}
                  className="text-[#929292] "
                  style={{ width: "90%", fontSize: 13 }}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={{ position: "absolute", right: 12 }}
            >
              <Ionicons
                name={isPasswordShown ? "eye-off" : "eye"}
                size={24}
                color={"#222222"}
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={{ color: "red" }}>
              {errors.confirmPassword.message}
            </Text>
          )}

          {/* Submit Button */}
          <Button
            title="Update"
            filled
            style={{
              marginTop: 18,
              marginBottom: 4,
              backgroundColor: colors.primary_blue,
              borderRadius: 30,
            }}
            onPress={handleSubmit(changePassword)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
