import { View } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import SigninScreen from "../auth/SigninScreen";
import SignupScreen from "../auth/SignupScreen";
import LoadingScreen from "../loading/LoadingScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppContext, useAppContext } from "../../context/AppContext";
import { colors } from "../../components/metrics/colors";
import DashboardScreen from "../tabs/TabHome";
import Onboarding from "../onboardin/Onboarding";
import CreateProfileStacks from "../auth/Profile";
import RequestOTPScreen from "../auth/RequestOTP";
import ResetPassword from "../auth/ResetPassword";
import VerifyEmailScreen from "../auth/VerifyEmail";
import * as Linking from "expo-linking";
import Chat from "../tabs/Messages/stack/Chat";
import OrganizationSignupScreen from "../auth/OrganizationSignUp";

const Stack = createNativeStackNavigator();

const prefix = Linking.createURL("/");

const MainScreen = () => {
  const { isAppLoading, verifyToken } = useAppContext();
  const navigationRef = useRef();
  const [currentScreen, setCurrentScreen] = useState();

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Home: "home",
        Profile: "profile/:id",
        Dashboard: {
          screens: {
            Settings: {
              screens: {
                Payments: "payments",
              },
            },
          },
        },
      },
    },
  };

  function getCurrentRouteName() {
    const currentRoute = navigationRef?.current?.getCurrentRoute().name;

    if (currentRoute) {
      console.log(currentScreen);
      setCurrentScreen(currentRoute);
    }
  }

  useEffect(() => {
    getCurrentRouteName();
    verifyToken();
  }, [currentScreen]);

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <NavigationContainer ref={navigationRef} linking={linking}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            options={{
              statusBarColor: "#0e0e0e",
            }}
          />
          <Stack.Screen
            name="Signin"
            component={SigninScreen}
            options={{
              statusBarColor: "#0e0e0e",
            }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{
              statusBarColor: "#0e0e0e",
            }}
          />
          <Stack.Screen
            name="OrganizationSignup"
            component={OrganizationSignupScreen}
            options={{
              statusBarColor: "#0e0e0e",
            }}
          />
          <Stack.Screen
            name="RequestOTP"
            component={RequestOTPScreen}
            options={{
              statusBarColor: "#0e0e0e",
            }}
          />

          <Stack.Screen
            name="VerifyEmail"
            component={VerifyEmailScreen}
            options={{
              statusBarColor: "#0e0e0e",
            }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{
              statusBarColor: "#0e0e0e",
            }}
          />
          <Stack.Screen
            name="ProfileStack"
            component={CreateProfileStacks}
            options={{
              statusBarColor: "#0e0e0e",
            }}
          />
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              statusBarColor: "#0e0e0e",
            }}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{
              statusBarColor: "#0e0e0e",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      {/* The loading screen */}
      {isAppLoading && <LoadingScreen />}
    </View>
  );
};

export default MainScreen;
