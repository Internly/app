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
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../data/colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import Button from "../../components/button/Button";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomAuthTextInput from "../../components/custom-ui/CustomInput";

// Form validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  // firstName: yup.string().required("First name is required"),
  name: yup.string().required("Last name is required"),
  phone: yup.string().required("Phone number is required"),
  // countryCode: yup.string().required("Country code is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  verifyPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const OrganizationSignupScreen = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { setAppLoading, storeData } = useContext(AppContext);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function SignUp(data) {
    const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

    try {
      console.log("Submitting form with content:", data);
      setAppLoading(true);

      const response = await axios.post(
        `${baseUrl}/organizations/register`,
        data
      );

      if (response?.status === 201) {
        setAppLoading(false);
        navigation.navigate("Signin");
      }
    } catch (error) {
      console.log("Sign up error:", error);
      setAppLoading(false);
      Alert.alert(
        "Sign Up Error",
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        style={{
          flex: 1,
          marginHorizontal: 22,
          paddingVertical: 20,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <FontAwesome
          name="chevron-left"
          color={"gray"}
          size={12}
          className=" font-[DMSans-Regular]"
          onPress={() => navigation.navigate("Signin")}
        />
        <View style={{}} className="my-4">
          <Image
            source={require("../../../assets/icons/sowapo-logo.png")}
            resizeMode="contain"
            className="w-[150] h-[50] "
          />
          <Text
            style={{
              fontSize: 21,
              fontWeight: "bold",
              marginVertical: 12,
              color: "#222222",
            }}
          >
            Create Account
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: "gray",
            }}
          >
            Connect with big organizations today!
          </Text>
        </View>

        {/* email */}
        <CustomAuthTextInput
          keyboardType={"email-address"}
          name={"email"}
          icon={"mail-outline"}
          label={"Company email"}
          control={control}
          placeholder={"Enter your email address"}
          showError={errors?.email}
          error={errors?.email?.message}
        />

        {/* name */}
        <CustomAuthTextInput
          name={"name"}
          label={"Brand name"}
          icon={"person-outline"}
          control={control}
          placeholder={"Sowapo Inc"}
          showError={errors?.name}
          error={errors?.name?.message}
        />

        <CustomAuthTextInput
          name={"phone"}
          label={"Phone number"}
          control={control}
          icon={"phone-portrait-outline"}
          keyboardType={"phone-pad"}
          placeholder={"+1-"}
          showError={errors?.phone}
          error={errors?.phone?.message}
        />

        <CustomAuthTextInput
          secureTextEntry={!isPasswordShown}
          name={"password"}
          label={"Password"}
          icon={"lock-closed-outline"}
          control={control}
          placeholder={"Enter your password"}
          showError={errors?.password}
          error={errors?.password?.message}
          customComponent={
            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: "absolute",
                right: 12,
              }}
            >
              {isPasswordShown ? (
                <Ionicons name="eye-off-outline" size={20} color={"gray"} />
              ) : (
                <Ionicons name="eye-outline" size={20} color={"gray"} />
              )}
            </TouchableOpacity>
          }
        />

        <CustomAuthTextInput
          secureTextEntry={!isPasswordShown}
          name={"verifyPassword"}
          icon={"lock-closed-outline"}
          label={"confirm password"}
          control={control}
          placeholder={"Enter your password"}
          showError={errors?.verifyPassword}
          error={errors?.verifyPassword?.message}
          customComponent={
            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: "absolute",
                right: 12,
              }}
            >
              {isPasswordShown ? (
                <Ionicons name="eye-off-outline" size={20} color={"gray"} />
              ) : (
                <Ionicons name="eye-outline" size={20} color={"gray"} />
              )}
            </TouchableOpacity>
          }
        />

        <View
          style={{
            flexDirection: "row",
            marginVertical: 6,
            alignItems: "center",
          }}
        >
          <Checkbox
            style={{ marginRight: 8, width: 15, height: 15 }}
            value={isChecked}
            onValueChange={() => setIsChecked(!isChecked)}
            color={isChecked ? colors.primary : undefined}
          />
          <Text className="text-[12px] text-[#272727] ">
            I agree with terms and conditions
          </Text>
        </View>

        <Button
          title="Sign up"
          filled
          style={{
            marginTop: 18,
            marginBottom: 4,
            borderRadius: 4,
            backgroundColor: colors.primary_purple,
            border: "none",
          }}
          onPress={handleSubmit(SignUp)}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 22,
            paddingBottom: 20,
          }}
        >
          <Text style={{ fontSize: 14, color: "gray" }}>
            Already have an account?
          </Text>
          <Pressable onPress={() => navigation.navigate("Signin")}>
            <Text
              style={{
                fontSize: 14,
                color: colors.primary,
                fontWeight: "bold",
                marginLeft: 6,
              }}
            >
              Login
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrganizationSignupScreen;
