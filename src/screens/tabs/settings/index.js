import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./stacks/EditProfile/stack/tab";
import Settings from "./stacks/Settings";
import ChangePassword from "./stacks/ChangePassword";
import Feedback from "./stacks/Report";
import Payments from "./stacks/Payment/Payments";
import PaymentDetails from "./stacks/Payment/PaymentDetail";
import UserProfile from "./stacks/UserProfile";
import WithdrawalHistoty from "./stacks/Payment/WithdrawalHistoty";
import Withdrawal from "./stacks/Payment/Withdrawal";
import SettlementHistory from "./stacks/Payment/AdvertSettlements";

const SettingStacks = () => {
  const settingStack = createNativeStackNavigator();

  return (
    <settingStack.Navigator
      initialRouteName="SettingIndex"
      screenOptions={{ headerShown: false, animation: "none" }}
    >
      <settingStack.Screen name="SettingIndex" component={Settings} />
      <settingStack.Screen name="Profile" component={Profile} />
      <settingStack.Screen name="UserProfile" component={UserProfile} />
      <settingStack.Screen name="Password" component={ChangePassword} />
      <settingStack.Screen name="Feedback" component={Feedback} />

      {/* <settingStack.Screen name="Notifications" component={} />
      <settingStack.Screen
        options={{ animation: "none" }}
        name="ImageExpand"
        component={}
      /> */}
    </settingStack.Navigator>
  );
};

export default SettingStacks;
