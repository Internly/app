import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SocialOnboard from "./tab/Info";



const KycStacks = () => {
  const KycStack = createNativeStackNavigator();

  return (
    <KycStack.Navigator
      screenOptions={{ headerShown: false, animation: "none" }}
    >
      <KycStack.Screen name="SocialOnboard" component={SocialOnboard} />
    </KycStack.Navigator>
  );
};

export default KycStacks;
