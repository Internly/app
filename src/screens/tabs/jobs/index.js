import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdvertDetails from "./stack/AdvertDetails.jsx";
import Jobs from "./stack/tab";
import Application from "./stack/Application.jsx";
import ApplicationDetails from "./stack/ApplicationDetails.jsx";
import EditApplication from "./stack/EditApplication.jsx";
import CreateAdvert from "./stack/CreateAdvert.jsx";
import { AppContext } from "../../../context/AppContext.js";
import OrganizationAdvertDetails from "./stack/OrganizationAdvertDetails.jsx";
import Adverts from "./stack/tab/indexOrganization.jsx";
import EditAdvert from "./stack/EditAdvert.jsx";
import { OrganizationApplications } from "./stack/OrganizationApplications.jsx";
import { Applications } from "./stack/Applications.jsx";
import OrganizationApplicationDetails from "./stack/OrganizationApplicationDetails.jsx";

const JobStacks = () => {
  const JobStack = createNativeStackNavigator();
  const { user } = useContext(AppContext);
  const { accountType } = user;
  return (
    <JobStack.Navigator
      screenOptions={{ headerShown: false, animation: "none" }}
    >
      <JobStack.Screen
        name="JobStack"
        component={accountType === "Organization" ? Adverts : Jobs}
      />
      <JobStack.Screen
        name="AdvertDetails"
        component={
          accountType === "Organization"
            ? OrganizationAdvertDetails
            : AdvertDetails
        }
      />
      <JobStack.Screen
        name="ApplicationDetails"
        component={
          accountType === "Organization"
            ? OrganizationApplicationDetails
            : ApplicationDetails
        }
      />
      <JobStack.Screen name="EditApplication" component={EditApplication} />
      <JobStack.Screen name="EditAdvert" component={EditAdvert} />
      <JobStack.Screen name="CreateAdvert" component={CreateAdvert} />
      <JobStack.Screen name="Application" component={Application} />
      <JobStack.Screen
        name="Applications"
        component={
          accountType === "Organization"
            ? OrganizationApplications
            : Applications
        }
      />
    </JobStack.Navigator>
  );
};

export default JobStacks;
