import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavItem } from "../../components/ui/Navbar";
import CustomTabBar from "../../components/custom-ui/CustomTabBar";
import HomeStacks from "./home";
import SettingStacks from "./settings";
import JobStacks from "./jobs";
import MessageStacks from "./Messages";
// import JobStacks from "./jobs/index";

const DashboardScreen = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {/* The home tab */}
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => {
            return <NavItem name={"Home"} icon={"home"} focused={focused} />;
          },
        }}
        name="Home"
      >
        {(props) => <HomeStacks {...props} />}
      </Tab.Screen>

      {/* settings tab */}

      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <NavItem name={"Adverts"} icon={"briefcase"} focused={focused} />
            );
          },
        }}
        name="Adverts"
        component={JobStacks}
      />

      {/* Messages
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <NavItem name={"Messages"} icon={"comments"} focused={focused} />
            );
          },
        }}
        name="Messages"
        component={MessageStacks}
      /> */}

      {/* The settings tab */}
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <NavItem name={"Settings"} icon={"gear"} focused={focused} />
            );
          },
        }}
        name="Settings"
        component={SettingStacks}
      />
    </Tab.Navigator>
  );
};

export default DashboardScreen;
