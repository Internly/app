import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../data/colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import Button from "../../components/button/Button";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import DropDownPicker from "react-native-dropdown-picker";
import { useFocusEffect } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Define the validation schema
const schema = yup.object().shape({
  emailOrUsername: yup.string().required("Email or username is required"),
  password: yup.string().required("Password is required"),
});

const SigninScreen = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const {
    setAppLoading,
    storeData,
    getData,
    getUser,
    verifyToken,
    setUserType,
    userType,
    logOut,
  } = useContext(AppContext);
  const [isChecked, setIsChecked] = useState(false);

  const [accountTypeOpen, setAccountTypeOpen] = useState(false);
  const [accountType, setAccountType] = useState(null);
  const [accountTypeOptions, setAccountTypeOptions] = useState([
    { label: "Student", value: "student" },
    { label: "Organization", value: "organization" },
  ]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function SignIn(data) {
    const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

    console.log(baseUrl, " is base url");
    if (!accountType) {
      return Alert.alert("Account type is required");
    }
    try {
      setAppLoading(true);

      const response = await axios.post(
        `${baseUrl}/${accountType}s/login`,
        data
      );

      if (response) {
        setAppLoading(false);
        storeData("rememberMe", isChecked ? "yes" : "no");

        const { token } = response.data;
        storeData("authToken", token);
        const user = await getUser();

        console.log(" fetched user");

        if (!user?.email_verified) {
          navigation.navigate("VerifyEmail", { email: user?.email });
        } else if (user && user?.profileCreated) {
          navigation.navigate("Dashboard");
        } else {
          Alert.alert(
            "Create Profile",
            `Create your ${
              user?.accounType?.toLowerCase || userType
            } profile to continue`
          );
          navigation.navigate("ProfileStack");
        }
      }
    } catch (error) {
      setAppLoading(false);
      console.log(error?.response?.data?.message, error?.response?.data?.error);

      Alert.alert(
        "Sign in error",
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    }
  }

  const autoSignIn = async () => {
    const rememberMe = await getData("rememberMe");

    if (rememberMe === "yes") {
      const tokenValid = await verifyToken();
      if (tokenValid) {
        const user = await getUser();

        // if (user) {
        //   Alert.alert(
        //     "Auto Sign in",
        //     `An account ${
        //       user?.email || ""
        //     } is already logged in to this device.\nLog out if you wish to sign in to another account`,
        //     [
        //       {
        //         text: "Log out",
        //         onPress: async () => {
        //           await logOut();
        //           navigation.navigate("Signin");
        //         },
        //         style: "cancel",
        //       },
        //       {
        //         text: "Continue",
        //         onPress: () => {
        //           if (!user?.email_verified) {
        //             navigation.navigate("VerifyEmail", { email: user?.email });
        //           } else if (user && user?.profileCreated) {
        //             navigation.navigate("Dashboard");
        //           } else {
        //             Alert.alert(
        //               "Create Profile",
        //               "Create your student profile to continue"
        //             );
        //             navigation.navigate("ProfileStack");
        //           }
        //         },
        //       },
        //     ],
        //     { cancelable: false }
        //   );

        //   console.log("user info : ", user);
        // }
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      reset({
        emailOrUsername: "",
        password: "",
      });
      // autoSignIn();
    }, [])
  );

  useEffect(() => {
    if (accountType) {
      setUserType(accountType);
    }
  }, [accountType]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{ flex: 1, marginHorizontal: 22 }}
        className="justify-center"
      >
        <FontAwesome
          name="chevron-left"
          color={"gray"}
          size={12}
          className=" font-normal"
        />
        <View style={{}} className="my-4">
          <Image
            source={require("../../../assets/icons/sowapo-logo.png")}
            resizeMode="contain"
            className="w-[150] h-[50] mx-[-10]"
          />
          <Text
            style={{
              fontSize: 21,
              fontWeight: "bold",
              marginVertical: 12,
              color: "#222222",
            }}
          >
            Hi Welcome Back !
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: "gray",
            }}
          >
            Hello again, you have been missed!
          </Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "300",
              marginLeft: 30,
              marginVertical: 8,
              color: "#202020",
            }}
          >
            Email
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
            <Ionicons
              className="w-full "
              name="mail-outline"
              color={"#696767"}
              size={14}
            />
            <View className="w-[1px] h-[40%] bg-[#696767] mx-2" />
            <Controller
              control={control}
              name="emailOrUsername"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="text-[#929292] "
                  placeholder="Enter your email address"
                  placeholderTextColor={"gray"}
                  keyboardType="email-address"
                  style={{ width: "90%", fontSize: 13 }}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
          {errors.emailOrUsername && (
            <Text style={{ color: "red", fontSize: 12 }}>
              {errors.emailOrUsername.message}
            </Text>
          )}
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "300",
              marginLeft: 30,
              marginVertical: 8,
              color: "#202020",
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
            <Ionicons
              className="w-full "
              name="lock-closed-outline"
              color={"#696767"}
              size={14}
            />
            <View className="w-[1px] h-[40%] bg-[#696767] mx-2" />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="text-[#929292] "
                  style={{ width: "90%", fontSize: 13 }}
                  placeholder="Enter your password"
                  placeholderTextColor={"gray"}
                  secureTextEntry={!isPasswordShown}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

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
          </View>
          {errors.password && (
            <Text style={{ color: "red", fontSize: 12 }}>
              {errors.password.message}
            </Text>
          )}
        </View>

        <View
          style={{
            flexDirection: "column",
            marginBottom: 6,
          }}
        >
          <Text style={{}} className="my-2">
            Account type
          </Text>
          <DropDownPicker
            open={accountTypeOpen}
            value={accountType}
            items={accountTypeOptions}
            setOpen={setAccountTypeOpen}
            setValue={setAccountType}
            setItems={setAccountTypeOptions}
            zIndex={10}
          />
        </View>
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
            onValueChange={setIsChecked}
            color={isChecked ? colors.primary : undefined}
          />
          <Text className="text-[12px] text-[#272727] ">Remember Me</Text>
        </View>

        <Button
          title="Login"
          filled
          style={{
            marginTop: 18,
            marginBottom: 4,
            borderRadius: 4,
            backgroundColor: colors.primary_purple,
            border: "none",
          }}
          onPress={handleSubmit(SignIn)}
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
          <Text style={{ fontSize: 14 }}>Forgot password?</Text>

          <TouchableOpacity
            onPress={() => {
              if (!accountType) {
                return Alert.alert("Error", "Account type is required");
              }
              navigation.navigate("RequestOTP", {});
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: colors.primary_blue,
                marginHorizontal: 10,
              }}
            >
              Reset here.
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

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 22,
          }}
        >
          <Text style={{ fontSize: 14, color: "gray" }}>
            Don't have an account?{" "}
          </Text>
          <Pressable
            onPress={() => {
              if (!accountType) {
                return Alert.alert("Error", "Account type is required");
              }
              navigation.navigate(
                accountType === "organization" ? "OrganizationSignup" : "Signup"
              );
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: colors.primary,
                fontWeight: "bold",
                marginLeft: 6,
              }}
            >
              Register
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SigninScreen;
