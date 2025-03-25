import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import FilterIcon from "../../../../../assets/svgs/filter.svg";
import JobFlatList from "../../../../components/ui/job/JobFlatList";
import axios from "axios";
import SearchLottie from "../../../../../assets/lottie/search.json";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../../../data/colors";
import CustomDropDown from "../../../../components/custom-ui/CustomDropDown";
import { filters } from "../../../../data/searchFilterData";

const SearchTab = ({ navigation }) => {
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState("createdAt:desc,name:asc");
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
    paymentVerified: false,
  });
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(
    () => {
      filterAdverts();
    },
    [requestFilters, sort] // Reload the adverts whenever filters change
  );
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
      paymentVerified: false,
    });
  };

  const filterAdverts = async () => {
    const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

    // Construct the query string
    const queryParams = new URLSearchParams({
      ...requestFilters, // Assuming this object has simple key-value pairs that need no further processing
      sort: sort, // example how you could structure sorting in query string
    }).toString();

    try {
      const response = await axios.get(
        `${baseUrl}/adverts/filter?${queryParams}`
      );
      setAdverts(response.data.data || []);
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
    }
  };

  // Debounced handle for the search input
  const debouncedFilterChange = useCallback(
    (name, value) => {
      const handler = setTimeout(() => {
        handleFilterChange(name, value);
      }, 300); // Adjust the debounce time (300ms is typical)

      return () => {
        clearTimeout(handler);
      };
    },
    [handleFilterChange] // Include handleFilterChange as a dependency
  );

  return (
    <>
      <View className="w-full flex-1 bg-white">
        {/* search and filter bar */}
        <View
          className="w-[95%] my-4 mt-0 flex-row p-4 bg-[#F8F9FE]"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.primary_blue}
            />
          </TouchableOpacity>
          {/* search text input */}
          <View
            className=" my-4 flex-row bg-transparent "
            style={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TextInput
              style={{ borderWidth: 0 }}
              placeholder="Search for internships..."
              className=" min-h-[40px] mx-2 text-xs w-[65%]"
              value={searchValue}
              onChangeText={(value) => {
                setSearchValue(value); // Keep local state for immediate feedback
                debouncedFilterChange("q", value); // Only update filters after debounce
              }}
              textContentType="name"
            />
          </View>
          {/* Filter button */}
          <TouchableOpacity
            onPress={() => setFilterModalVisible(true)}
            className="rounded-lg flex flex-row items-center justify-between border border-[#C5C6CC] p-2 "
          >
            <FilterIcon />
            <Text className="text-[12px] mx-2 text-[#1F2024]">Filter</Text>

            <View className=" items-center flex justify-center w-[25] h-[25] bg-[#4785FF] rounded-full ">
              <Text className="text-[10px]   text-white">0</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/*  advert search results */}

        <View className="w-full px-2 my-2">
          <ScrollView>
            <JobFlatList
              emptyLottie={SearchLottie}
              emptyMessage={
                "No advert matches your search. Try something else."
              }
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
        </View>
      </View>
      {/* filter modal */}

      {isFilterModalVisible && (
        <View className="absolute flex-1 w-full h-full bg-white p-6">
          {/* filter header */}

          <View className="flex flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => {
                setFilterModalVisible(false);
              }}
            >
              <Text
                className={`text-[${colors.primary_blue}] text-[12px] font-[DMSans-SemiBold]`}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <Text className={`text-black text-[14px] font-[DMSans-Bold]`}>
              Filter
            </Text>

            <TouchableOpacity
              onPress={() => {
                clearFilters();
              }}
            >
              <Text
                className={`text-[${colors.primary_blue}] text-[12px] font-[DMSans-SemiBold]`}
              >
                Clear All
              </Text>
            </TouchableOpacity>
          </View>

          {/* filter sections */}
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          >
            {filters.map((filter, i) => (
              <>
                <CustomDropDown
                  label={filter.title}
                  ChildComponent={
                    <View className="flex-row items-center flex-wrap gap-2">
                      {filter.options.map((category) => (
                        <Text className=" text-[#4785FF] py-1 px-2 mr-2 rounded-full bg-[#EAF2FF]">
                          {category}
                        </Text>
                      ))}
                    </View>
                  }
                />
                {i < filters.length - 1 && (
                  <View className="bg-[#8F9098] h-[1px] w-full" />
                )}
              </>
            ))}
          </ScrollView>

          <View className="  bottom-0  w-full items-center justify-center">
            <TouchableOpacity
              className=" w-full rounded-full py-3 px-4"
              style={{
                backgroundColor: colors.primary_blue,
                borderRadius: 6,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 12 }}>
                Apply filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default SearchTab;

const styles = StyleSheet.create({});
