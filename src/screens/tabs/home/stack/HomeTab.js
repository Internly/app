import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
  Modal,
  Button,
  ImageBackground,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppContext, useAppContext } from "../../../../context/AppContext";
import { colors } from "../../../../data/colors";
import JobCard from "../../../../components/cards/JobCard";
import img from "../../../../../assets/icons/Avatar.png";
import JobFlatList from "../../../../components/ui/job/JobFlatList";
import { useContext } from "react";
import axios from "axios";
import { registerForPushNotificationsAsync } from "../../../../hooks/pushNotification";
import { ToastAndroid } from "react-native";
import NotificationBar from "../../../../components/ui/NotificationBar";
import emptyLottie from "../../../../../assets/lottie/empty.json";
import AnimatedLottieView from "lottie-react-native";
import AnalyticsChart from "../../../../components/custom-ui/AnalticsChart";

const HomeTab = () => {
  const [isMenuShown, setShowMenu] = React.useState(false);
  const { setTabBarVisible, verifyToken, user } = useAppContext();
  const navigate = useNavigation();
  const [searchValue, setSearchValue] = useState("");
  const [adverts, setAdverts] = useState([]);
  const [filteredAdverts, setFilteredAdverts] = useState([]);
  const [requestFilters, setRequestFilters] = useState({
    q: "",
    minApplications: "",
    maxApplications: "",
    minBudget: "",
    maxBudget: "",
    startDate: "",
    endDate: "",
  });
  const [page, setPage] = useState(1);
  const { setAppLoading, getData } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("Recommended");
  const [sort, setSort] = useState("createdAt:desc,name:asc");
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    if (activeTab == "latest") {
      setSort("createdAt:desc");
    } else if (activeTab === "Recommended") {
      // Additional logic for Recommended tab if needed
    }
  }, [activeTab]);

  useEffect(() => {
    try {
      registerForPushNotificationsAsync();
    } catch (error) {
      console.log(error, "Push token registration error");
    }
  }, []);

  const getAdverts = async () => {
    const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;
    const authToken = await getData("authToken");

    try {
      setAppLoading(true);
      const response = await axios.get(`${baseUrl}/adverts/recommended`, {
        headers: {
          "x-auth-token": authToken,
        },
      });
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
      console.log("Failed to fetch adverts: ", error?.response?.data);
      ToastAndroid.showWithGravityAndOffset(
        error?.response?.data?.message ||
          error.message ||
          `Unable to fetch adverts`,
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50
      );
      setAdverts(error?.response?.data?.data || []);
      setAppLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAdverts();
    }, [requestFilters, sort, activeTab]) // Reload the adverts whenever filters change
  );

  useEffect(() => {
    async () => {
      await verifyToken();
    };
  });

  async () => {
    await verifyToken();

    console.log(verifyToken);
  };

  // set the tab bar visible after 500ms
  useEffect(() => {
    setTimeout(() => {
      setTabBarVisible(true);
    }, 500);

    return () => {
      clearTimeout(setTabBarVisible);
    };
  }, []);

  const handleFilterChange = (name, value) => {
    setRequestFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setRequestFilters({
      q: "",
      minApplications: "",
      maxApplications: "",
      minBudget: "",
      maxBudget: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <View
      className="flex-1 bg-[white] px-4 pt-6"
      style={{ backgroundColor: "#FAFAFA" }}
    >
      <ScrollView
        vertical
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ backgroundColor: "#FAFAFA" }}
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
                color: "#272727B2",
                fontWeight: "500",
                // fontFamily: "DMSans-black",
                fontSize: 16,
              }}
            >
              Hey, {user?.firstName} 👋
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate.navigate("Settings")}>
            {user?.avatar && typeof user.avatar === "string" ? (
              <Image
                source={{ uri: user.avatar }} // Ensure it's a string URL
                className="flex-row items-center justify-center rounded-full w-[43] h-[43]"
              />
            ) : (
              <Image
                source={img} // Fallback to default image if avatar isn't available or valid
                className="flex-row items-center justify-center rounded-full w-[43] h-[43]"
              />
            )}
          </TouchableOpacity>
        </View>

        {/*  */}

        <View className="flex flex-row justify-between  items-center w-full">
          <Text
            className="mx-2 text-2xl text-left max-w-[70%] py-2"
            style={{
              color: "#272727",
              fontWeight: "700",
              fontSize: 24,
              fontFamily: "DMSans-Medium",
            }}
          >
            Find your next internship here
          </Text>

          {/* <TouchableOpacity
            onPress={() => {
              navigate.navigate("SearchScreen");
            }}
            className="bg-[#5FBDFF] p-2 w-[40] h-[40] flex items-center justify-center rounded-full"
          >
            <FontAwesome name="search" color={"white"} size={15} />
          </TouchableOpacity> */}
        </View>
        <View className="flex flex-row min-h-[150] w-full my-2 mb-4  items-start bg-[#EAF2FF] rounded-xl relative overflow-hidden">
          <View className="  flex-[0.6] h-full p-4">
            <Text className="text-[#1F2024] font-[DMSans-Bold] text-[16px] mb-1 ">
              Scout for the perfect internship experienced for you.
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

        {/* adverts */}

        <Text
          className="mx-2 text-left max-w-[90%] py-3"
          style={{
            color: "#272727",
            fontWeight: "600",
            fontSize: 18,
            fontFamily: "DMSans-SemiBold",
          }}
        >
          Reccommendations
        </Text>

        {user?.profileCreated ? (
          <ScrollView>
            {/* JobFlatList Component */}
            <JobFlatList
              headerStyle="mt-2"
              horizontal={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              numColumns={2}
              data={adverts}
              renderItem={({ item }) => (
                <JobCard
                  item={item}
                  onPress={() =>
                    navigate.navigate("AdvertDetail", { id: item._id })
                  }
                />
              )}
              keyExtractor={(item) => item._id}
            />
          </ScrollView>
        ) : (
          <View className="w-full flex flex-col items-center justify-center">
            <Text
              className="m-2 my-4 text-base font-[DMSans-Bold] text-center"
              style={{
                color: colors.primary_blue,
                textAlign: "center",
                lineHeight: 27,
              }}
            >
              {"Complete your profile to start seeing adverts"}
            </Text>
            <AnimatedLottieView
              source={emptyLottie}
              // duration={1000}
              autoPlay
              // ref={animation}
              style={{
                backgroundColor: "transparent",
                // alignSelf:'center',
                width: 300,
                height: 300,
              }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeTab;
