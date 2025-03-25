import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Checkbox from "expo-checkbox";
import { colors } from "../../../../data/colors";
import Button from "../../../../components/button/Button";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../../../../context/AppContext";
import axios from "axios";
import * as yup from "yup";

// Define the validation schema
const feedbackSchema = yup.object().shape({
  subject: yup.string().required("Subject is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  reason: yup.string().required("Reason is required"),
  message: yup.string().required("Message is required"),
});

const Feedback = () => {
  const { setAppLoading, getData } = useContext(AppContext);
  const navigation = useNavigation();
  const { user } = useContext(AppContext);

  // Initialize react-hook-form with validation resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(feedbackSchema),
    defaultValues: {
      subject: "",
      email: "",
      reason: "",
      message: "",
    },
  });

  async function sendFeedback(formData) {
    const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;
    const token = await getData("authToken");

    try {
      setAppLoading(true);

      const response = await axios.post(
        `${baseUrl}/feedbacks/${user?.accountType?.toLowerCase()}/create`,
        formData,
        {
          headers: {
            "Content-Type": "Application/Json",
            "x-auth-token": token,
          },
        }
      );

      if (response) {
        setAppLoading(false);
        navigation.navigate("Dashboard");
      }
    } catch (error) {
      console.log(" feedback Error:", error);
      setAppLoading(false);
      Alert.alert(
        " feedback Error",
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

          <Text className="text-black text-[14px] font-[DMSans-Bold]">
            Send us a feedback
          </Text>
          <View className="" />
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
              Leave a feedback or report something fishy
            </Text>
          </View>

          {/* Subject */}
          <View>
            <Text className="text-[12px] font-[DMSans-Medium] my-3">
              Subject
            </Text>
            <View className="bg-[transparent] border border-[#C5C6CC] rounded-xl p-4 flex flex-row items-center mb-2">
              <Controller
                control={control}
                name="subject"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Enter the subject of your feedback"
                    placeholderTextColor={"#222222"}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={{ width: "100%" }}
                  />
                )}
              />
            </View>
            {errors.subject && (
              <Text style={{ color: "red" }}>{errors.subject.message}</Text>
            )}
          </View>

          {/* Email */}
          <View>
            <Text className="text-[12px] font-[DMSans-Medium] my-3">
              Email address
            </Text>
            <View className="bg-[transparent] border border-[#C5C6CC] rounded-xl p-4 flex flex-row items-center mb-2">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Enter your email address"
                    placeholderTextColor={"#222222"}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    style={{ width: "100%" }}
                  />
                )}
              />
            </View>
            {errors.email && (
              <Text style={{ color: "red" }}>{errors.email.message}</Text>
            )}
          </View>

          {/* Reason */}
          <View>
            <Text className="text-[12px] font-[DMSans-Medium] my-3">
              Reason
            </Text>
            <View className="bg-[transparent] border border-[#C5C6CC] rounded-xl p-4 flex flex-row items-center mb-2">
              <Controller
                control={control}
                name="reason"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="What's the reason for this feedback/report?"
                    placeholderTextColor={"#222222"}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline
                    style={{ width: "100%" }}
                  />
                )}
              />
            </View>
            {errors.reason && (
              <Text style={{ color: "red" }}>{errors.reason.message}</Text>
            )}
          </View>

          {/* Message */}
          <View>
            <Text className="text-[12px] font-[DMSans-Medium] my-3">
              Message
            </Text>
            <View className="bg-[transparent] border border-[#C5C6CC] rounded-xl p-4 flex flex-row items-center mb-2">
              <Controller
                control={control}
                name="message"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Enter your message ..."
                    placeholderTextColor={"#222222"}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline
                    style={{ width: "100%" }}
                  />
                )}
              />
            </View>
            {errors.message && (
              <Text style={{ color: "red" }}>{errors.message.message}</Text>
            )}
          </View>

          {/* Submit Button */}
          <Button
            title="Send Feedback"
            filled
            style={{
              marginTop: 18,
              marginBottom: 4,
              backgroundColor: colors.primary_blue,
              borderRadius: 30,
            }}
            onPress={handleSubmit(sendFeedback)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Feedback;
