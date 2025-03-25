import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../data/colors";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../components/button/Button";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import validateEmail from "../../hooks/validateEmail";
import AnimatedLottieView from "lottie-react-native";
import mailLottie from "../../../assets/lottie/mail.json";

const RequestOTPScreen = ({ navigation, route }) => {
  const { setAppLoading } = useContext(AppContext);
  const { nextRoute } = route.params;
  console.log(nextRoute, " is next route");
  const [formContent, setformContent] = useState({
    email: "",
    password: "",
  });

  const { user, userType } = useContext(AppContext);

  async function RequestOTP() {
    const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

    console.log(baseUrl, " is base url");
    try {
      if (!validateEmail(formContent?.email))
        throw new Error("Invalid email address");

      if (formContent?.email) {
        console.log(formContent, " is form content");
        setAppLoading(true);

        const response = await axios.put(
          `${baseUrl}/${userType}s/reset_password_otp`,
          formContent
        );

        if (response) {
          setAppLoading(false);
          ToastAndroid.showWithGravityAndOffset(
            `OTP sent to ${formContent?.email}!`,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );

          !nextRoute
            ? navigation.navigate("ResetPassword", {
                email: formContent?.email,
              })
            : navigation.navigate(nextRoute, { email: formContent?.email });
        }
      } else {
        Alert.alert("Reset password error", "fill all input fields");
      }
    } catch (error) {
      setAppLoading(false);
      console.log(error?.response?.data?.message, error?.response?.data?.error);

      Alert.alert(
        "Request OTP error",
        error?.response?.data?.message ||
          error?.message ||
          "something went wrong"
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
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
              🔒 Request OTP
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
              Enter the E-mail address you registered with to recieve an OTP!
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 400,
              marginVertical: 8,
            }}
          >
            Email address
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
              placeholder="Enter your email address "
              placeholderTextColor={"#222222"}
              keyboardType="email-address"
              style={{
                width: "100%",
              }}
              onChangeText={(text) =>
                setformContent({
                  email: text,
                })
              }
              value={formContent.email}
            />
          </View>
        </View>

        <Button
          title="Send OTP"
          filled
          style={{
            marginTop: 18,
            marginBottom: 4,
            borderRadius: 4,
            backgroundColor: colors.primary_blue,
            border: "none",
          }}
          onPress={() => RequestOTP()}
        />
      </View>
    </SafeAreaView>
  );
};

export default RequestOTPScreen;
