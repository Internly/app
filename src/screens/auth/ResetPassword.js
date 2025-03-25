import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../data/colors";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import Button from "../../components/button/Button";
import { AppContext } from "../../context/AppContext";
import axios from "axios";

const ResetPassword = ({ route, navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const { setAppLoading, storeData } = useContext(AppContext);
  const [formContent, setformContent] = useState({
    otp: "",
    newPassword: "",
    verifyPassword: "",
    email: "",
  });

  const { email: userMail } = route?.params;

  useEffect(() => {
    console.log("email: ", userMail);
    setformContent(({ email, ...others }) => ({
      email: userMail,
      ...others,
    }));
  }, []);
  async function ResetPassword() {
    const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

    // Validate form fields are not empty
    const areFieldsValid = Object.values(formContent).every(
      (field) => field !== ""
    );

    console.log(formContent, " is form content");
    // Check Password Match
    if (formContent.newPassword !== formContent.verifyPassword) {
      Alert.alert("Password Mismatch", "The passwords do not match.");
      return;
    }

    // Check Password Length
    if (formContent.newPassword.length < 6) {
      Alert.alert(
        "Password Too Short",
        "Password must be at least 6 characters."
      );
      return;
    }

    if (areFieldsValid) {
      try {
        setAppLoading(true);

        const response = await axios.put(
          `${baseUrl}/students/reset_password`,
          formContent
        );

        if (response?.status === 201) {
          setAppLoading(false);
          navigation.navigate("Signin");
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
    } else {
      Alert.alert("Reset Password Error", "Please fill all the input fields.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginHorizontal: 22 }}
      >
        <View style={{ marginVertical: 22 }}>
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="chevron-back"
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  marginVertical: 12,
                  color: "#222222",
                }}
              />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                marginVertical: 12,
                color: "#222222",
              }}
            >
              Reset Password
            </Text>
          </View>

          <Text
            style={{
              fontSize: 16,
              color: "#222222",
            }}
          >
            🔒 Your password should be a mixture of numbers,letters and symbols
            for maximum security
          </Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}
          >
            OTP
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
            <TextInput
              placeholder="Enter the OTP"
              placeholderTextColor={"gray"}
              onChangeText={(text) => {
                setformContent(({ otp, ...others }) => ({
                  otp: text,
                  ...others,
                }));
              }}
              value={formContent.otp}
              style={{
                width: "100%",
              }}
            />
          </View>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}
          >
            Password
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
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={"gray"}
              secureTextEntry={isPasswordShown}
              onChangeText={(text) => {
                setformContent(({ newPassword, ...others }) => ({
                  newPassword: text,
                  ...others,
                }));
              }}
              value={formContent.newPassword}
              style={{
                width: "100%",
              }}
            />

            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: "absolute",
                right: 12,
              }}
            >
              {isPasswordShown == true ? (
                <Ionicons name="eye-off" size={24} color={"#222222"} />
              ) : (
                <Ionicons name="eye" size={24} color={"#222222"} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}
          >
            Confirm Password
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
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={"gray"}
              secureTextEntry={isPasswordShown}
              onChangeText={(text) => {
                setformContent(({ verifyPassword, ...others }) => ({
                  verifyPassword: text,
                  ...others,
                }));
              }}
              value={formContent.verifyPassword}
              style={{
                width: "100%",
              }}
            />

            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: "absolute",
                right: 12,
              }}
            >
              {isPasswordShown == true ? (
                <Ionicons name="eye-off" size={24} color={"#222222"} />
              ) : (
                <Ionicons name="eye" size={24} color={"#222222"} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Reset Password"
          filled
          style={{
            marginTop: 18,
            marginBottom: 4,
          }}
          onPress={() => ResetPassword()}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: colors.grey,
              marginHorizontal: 10,
            }}
          />

          <Text style={{ fontSize: 14 }}>Didn't get OTP?</Text>

          <TouchableOpacity onPress={() => navigation.navigate("RequestOTP")}>
            <Text
              style={{
                fontSize: 14,
                color: colors.primary_blue,
                marginHorizontal: 10,
              }}
            >
              Resend here.
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: colors.grey,
              marginHorizontal: 10,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResetPassword;
