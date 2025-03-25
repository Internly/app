import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import EditProfile from "../Profile";
import KycOnboard from "../KYC/tab/Info";
import SocialOnboard from "../Socials/tab/Info";
import CustomTabBar from "../../../../../jobs/stack/tab/customTabBar";

const Tab = createMaterialTopTabNavigator();

function Profile() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen name="Edit Profile" component={EditProfile} />
      <Tab.Screen name="KYC" component={KycOnboard} />
    </Tab.Navigator>
  );
}

export default Profile;
