import { View, Text } from "react-native";
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "./Info";
import UploadAvatar from "./UploadAvatar";
import CreateProfile from "./ProfileDetails";
import CreateOrganizationProfile from "./OrganizationProfileDetails";
import { AppContext } from "../../../context/AppContext";

const CreateProfileStacks = () => {
  const ProfileStack = createNativeStackNavigator();
  const { user } = useContext(AppContext);
  const { accountType } = user;

  return (
    <ProfileStack.Navigator
      screenOptions={{ headerShown: false, animation: "none" }}
    >
      <ProfileStack.Screen name="welcome" component={Welcome} />
      <ProfileStack.Screen name="UploadAvatar" component={UploadAvatar} />
      <ProfileStack.Screen
        name="CreateProfile"
        component={
          accountType === "Organization"
            ? CreateOrganizationProfile
            : CreateProfile
        }
      />
    </ProfileStack.Navigator>
  );
};

export default CreateProfileStacks;
