import { View, Text } from "react-native";
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeTab from "./stack/HomeTab";
import AdvertDetails from "../jobs/stack/AdvertDetails";
import SearchTab from "./stack/SearchTab";
import { AppContext } from "../../../context/AppContext";
import OrganizatiohHomeTab from "./stack/OrganizationHomeTab";

const HomeStacks = () => {
  const HomeStack = createNativeStackNavigator();
  const { user } = useContext(AppContext);

  return (
    <HomeStack.Navigator
      screenOptions={{ headerShown: false, animation: "none" }}
    >
      <HomeStack.Screen
        name="HomeScreen"
        component={
          user?.accountType === "Organization" ? OrganizatiohHomeTab : HomeTab
        }
      />

      <HomeStack.Screen name="SearchScreen" component={SearchTab} />
      <HomeStack.Screen name="AdvertDetails" component={AdvertDetails} />
    </HomeStack.Navigator>
  );
};

export default HomeStacks;
