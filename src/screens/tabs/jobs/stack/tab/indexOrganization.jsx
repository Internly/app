import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import JobFlatList from "../../../../../components/ui/job/JobFlatList";
import axios from "axios";
import { Alert, TouchableOpacity, View, StyleSheet } from "react-native";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../../../../context/AppContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { colors } from "../../../../../data/colors";
import PlusIcon from "../../../../../../assets/svgs/Plus .svg";
import CustomTabBar from "./customTabBar";

const Tab = createMaterialTopTabNavigator();

function Adverts() {
  const [adverts, setAdverts] = useState([]);
  const { setAppLoading, getData, user } = useContext(AppContext);
  const [completedAdverts, setCompletedAdverts] = useState([]);
  const [ongoingAdverts, setOngoingAdverts] = useState([]);
  const [pendingAdverts, setPendingAdverts] = useState([]);

  const navigation = useNavigation();

  const getBrandAdverts = async () => {
    const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

    try {
      setAppLoading(true);

      const authToken = await getData("authToken");

      console.log("authToken: ", authToken);
      const response = await axios.get(
        `${baseUrl}/adverts/organization/${user._id}`,
        {
          headers: {
            "x-auth-token": authToken,
          },
        }
      );
      setAdverts(response.data.data.length > 0 ? response.data.data : []);
      setAppLoading(false);
    } catch (error) {
      console.log("Failed to fetch adverts: ", error?.response?.data);
      // Alert.alert(
      //   "Camapign Error",
      //   error?.response?.data?.message ||
      //     error?.message ||
      //     "Unable to load adverts"
      // );
      setAdverts([]);
      setAppLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getBrandAdverts();
    }, []) // Run only once on mount
  );

  useEffect(() => {
    // Reset the completed and ongoing adverts arrays before setting
    setCompletedAdverts([]);
    setOngoingAdverts([]);
    setPendingAdverts([]);

    adverts.forEach((advert) => {
      if (advert?.status === "completed") {
        setCompletedAdverts((prev) => [advert, ...prev]);
      } else if (advert?.status === "active") {
        setOngoingAdverts((prev) => [advert, ...prev]);
      } else if (advert?.status === "pending") {
        setPendingAdverts((prev) => [advert, ...prev]);
      }
    });
  }, [adverts]); // Run whenever adverts change

  return (
    <View style={styles.container}>
      <Tab.Navigator
        style={{ backgroundColor: "white" }}
        tabBar={(props) => <CustomTabBar {...props} />} // Use custom tab bar
      >
        <Tab.Screen name="Pending">
          {() => <PendingJobs data={pendingAdverts} />}
        </Tab.Screen>
        <Tab.Screen name="Ongoing">
          {() => <OngoingJobs data={ongoingAdverts} />}
        </Tab.Screen>
      </Tab.Navigator>
      <TouchableOpacity
        onPress={() => navigation.navigate("CreateAdvert")}
        style={styles.addButton}
      >
        <PlusIcon width={20} height={20} />
      </TouchableOpacity>
    </View>
  );
}

function OngoingJobs({ data }) {
  return (
    <JobFlatList
      data={data}
      emptyMessage={"No ongoing Advert at the moment... "}
      title={"Active Adverts"}
    />
  );
}

function PendingJobs({ data }) {
  return (
    <JobFlatList
      data={data}
      emptyMessage={
        "No pending Advert at the moment... \nCreate a by clicking the add button at the bottom-right corner"
      }
      title={"Pending Adverts"}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative", // Ensures absolute positioning of children is relative to this container
  },
  addButton: {
    position: "absolute",
    bottom: "3%",
    right: "6%",
    backgroundColor: colors.primary_blue,
    borderRadius: 10, // Makes it fully rounded
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Adverts;
