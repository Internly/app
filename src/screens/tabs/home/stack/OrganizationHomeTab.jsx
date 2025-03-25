import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
  ImageBackground,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAppContext } from "../../../../context/AppContext";
import img from "../../../../../assets/icons/Avatar.png";

import OngoingAdverts from "../../../../components/ui/flatlist/OngoingAdverts";
import axios from "axios";
import { registerForPushNotificationsAsync } from "../../../../hooks/pushNotification";

const OrganizatiohHomeTab = () => {
  const [isMenuShown, setShowMenu] = React.useState(false);
  const { setTabBarVisible, setAppLoading, user, registerPushToken, getData } =
    useAppContext();
  const [adverts, setAdverts] = useState([]);
  const [students, setInfluencers] = useState([]);

  const navigate = useNavigation();
  const [requestFilters, setrequestFilters] = useState({
    name: "",
    status: "active",
    paymentVerified: true,
  });

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
      const fetchedAdverts = response?.data?.data;

      // response?.data?.data?.forEach((advert) => {
      //   if (advert?.status === "active") {
      //     setAdverts((prev) => [advert, ...prev]);
      //   }
      // })

      // filter ongoing adverts
      const filteredAdverts = fetchedAdverts.filter(
        (advert) => advert.status === "active"
      );

      setAdverts(filteredAdverts.length > 0 ? filteredAdverts : []);
      setAppLoading(false);
    } catch (error) {
      console.error("Failed to fetch adverts: ", error);
      setAdverts([]);
      setAppLoading(false);
    }
  };

  const getRecommendedInfluencers = async () => {
    const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;
    // Construct the query string
    const queryParams = new URLSearchParams({
      // Assuming this object has simple key-value pairs that need no further processing
      sort: "rating:asc,createdAt:desc,name:asc", // example how you could structure sorting in query string
    }).toString();

    try {
      setAppLoading(true);
      const response = await axios.get(
        `${baseUrl}/students/filter?${queryParams}`
      );
      setInfluencers(response.data.data || []);
      setAppLoading(false);
    } catch (error) {
      console.log("Failed to fetch students: ", error);
      // Alert.alert(
      //   "Error",
      //   error?.response?.data?.message ||
      //     error?.message ||
      //     "Unable to load adverts"
      // );
      setAppLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getBrandAdverts();
      getRecommendedInfluencers();
    }, [requestFilters]) // Reload the students whenever filters change
  );

  // set the tab bar visible after 500ms
  useEffect(() => {
    setTimeout(() => {
      setTabBarVisible(true);
    }, 500);

    return () => {
      clearTimeout(setTabBarVisible);
    };
  }, []);

  useEffect(() => {
    try {
      registerForPushNotificationsAsync();
    } catch (error) {
      console.log(error, "Push token registration error");
    }
  }, []);

  return (
    <View
      className="flex-1 bg-[white] px-4 pt-6"
      style={{ backgroundColor: "white" }}
    >
      <ScrollView
        vertical
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ backgroundColor: "white" }}
      >
        {/* Header */}
        <View
          className="py-5 flex-row items-center justify-between"
          style={{
            shadowColor: "grey",
            shadowOpacity: 1,
            shadowOffset: { width: 10, height: 10 },
            shadowRadius: 2,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setShowMenu(!isMenuShown);
              setTabBarVisible(false);
            }}
            className="flex-row items-center"
          >
            <Text
              className="mx-2 text-xl"
              style={{
                color: "black",
                fontWeight: "700",
                fontFamily: "DMSans-Black",
              }}
            >
              Hey, {user?.name || "Brand name"} 👋
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigate.navigate("Settings", {
                screen: "UserProfile",
              })
            }
          >
            {user?.avatar ? (
              <Image
                source={{ uri: user?.avatar || img }}
                className="flex-row items-center justify-center rounded-full w-[43] h-[43]"
              />
            ) : (
              <Image
                source={img}
                className="flex-row items-center justify-center rounded-full w-[43] h-[43]"
              />
            )}
          </TouchableOpacity>
        </View>

        {/* banner */}
        <View className="flex flex-row min-h-[150] w-full my-2 mb-4  items-start bg-[#EAF2FF] rounded-xl relative overflow-hidden">
          <View className="  flex-[0.6] h-full p-4">
            <Text className="text-[#1F2024] font-[DMSans-Bold] text-[16px] mb-1 ">
              Scout for the perfect fit for your organization
            </Text>

            <Text className="text-[#494A50] font-[DMSans-Regular] text-[12px] my-2 ">
              explore the best and make your pick
            </Text>
          </View>
          <ImageBackground
            source={require("../../../../../assets/post-images/student.png")}
            className="w-full flex-[0.4] h-full"
          />
        </View>

        <ScrollView>
          {/* adverts */}
          <View className=" w-full min-h-[30%] ">
            <View className="flex flex-row items-center justify-between w-[95%]">
              <Text
                className="text-black text-lg font-[DMSans-Black]"
                style={{ fontFamily: "DMSans-Medium" }}
              >
                Ongoing Adverts
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigate.navigate("Adverts");
                }}
              >
                <Text className="text-blue-500">See more </Text>
              </TouchableOpacity>
            </View>
            <View className="py-4 ">
              <OngoingAdverts horizontal data={adverts || []} />
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default OrganizatiohHomeTab;
