import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../data/colors";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../components/button/Button";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import validateEmail from "../../hooks/validateEmail";
import AnimatedLottieView from "lottie-react-native";
import mailLottie from "../../../assets/lottie/mail.json";

const VerifyEmailScreen = ({ navigation, route }) => {
  const { setAppLoading } = useContext(AppContext);

  // pull email from route params

  const { email: studentMail } = route.params;

  const [formContent, setformContent] = useState({
    otp: "",
  });
  const { user, userType } = useContext(AppContext);
  useEffect(
    () =>
      setformContent(({ email, ...prev }) => ({ email: studentMail, ...prev })),
    []
  );

  async function VerifyEmail() {
    const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

    console.log(baseUrl, " is base url");
    try {
      console.log("Emails", studentMail, studentMail);
      if (!validateEmail(studentMail)) throw new Error("Invalid email address");

      if (studentMail && formContent.otp) {
        console.log(formContent, " is form content");
        setAppLoading(true);

        const response = await axios.put(
          `${baseUrl}/${userType}s/verify_email`,
          {
            ...formContent,
            email: studentMail,
          }
        );

        if (response) {
          setAppLoading(false);

          Alert.alert("Successful", "Email Verified");

          navigation.navigate("Signin");
        }
      } else {
        Alert.alert("Email verification error", "fill all input fields");
      }
    } catch (error) {
      setAppLoading(false);
      console.log(error?.response?.data?.message, error?.response?.data?.error);

      Alert.alert(
        "Email verification error",
        error?.response?.data?.message ||
          error?.message ||
          "something went wrong"
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={{ flex: 1, marginHorizontal: 22 }}>
        <View style={{ marginVertical: 22 }}>
          <View className="flex flex-row items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="chevron-back"
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  marginVertical: 12,
                  color: "#222222",
                }}
              ></Ionicons>
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                marginVertical: 12,
                color: "#222222",
              }}
            >
              📨 Verify Email
            </Text>
          </View>

          <View className="flex flex-col w-full items-center">
            <AnimatedLottieView
              source={mailLottie}
              duration={5000}
              // loop={false}
              autoPlay
              // ref={animation}
              style={{
                backgroundColor: "transparent",
                // alignSelf:'center',
                width: 200,
                height: 200,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: "#222222",
              }}
            >
              Enter the OTP you recieved in your Email : {studentMail}
            </Text>
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
              placeholder="Enter your OTP "
              placeholderTextColor={"#222222"}
              keyboardType="numeric"
              style={{
                width: "100%",
              }}
              onChangeText={(text) =>
                setformContent({
                  otp: text,
                })
              }
              value={formContent.otp}
            />
          </View>
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

            <Text style={{ fontSize: 14 }}>No OTP?</Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("RequestOTP", { nextRoute: "VerifyEmail" })
              }
            >
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
        </View>

        <Button
          title="Verify Email"
          filled
          style={{
            marginTop: 18,
            marginBottom: 4,
            backgroundColor: colors.primary_blue,
          }}
          onPress={() => VerifyEmail()}
        />
      </View>
    </SafeAreaView>
  );
};

export default VerifyEmailScreen;
