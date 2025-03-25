import { useCallback, useContext, useState } from "react";
import { AppContext } from "../../../../context/AppContext";
import ApplicationFlatList from "../../../../components/ui/application/ApplicationFlatList";
import emptyPropsal from "../../../../../assets/lottie/emptyApplication.json";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../../../components/metrics/styles";
import { colors } from "../../../../data/colors";

export function OrganizationApplications({ navigation, route }) {
  const { id, applications: defaultPropsals } = route.params;
  const [applications, setApplications] = useState(defaultPropsals || []);
  const { setAppLoading, getData, user } = useContext(AppContext);

  const getApplications = async () => {
    const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

    try {
      setAppLoading(true);

      const authToken = await getData("authToken");
      const response = await axios.get(`${baseUrl}/applications/advert/${id}`, {
        headers: {
          "x-auth-token": authToken,
        },
      });
      setApplications(
        response.data?.applications?.length > 0
          ? response.data?.applications
          : []
      );
      setAppLoading(false);
    } catch (error) {
      console.error(
        "Failed to fetch applications: ",
        error?.response?.message || error?.message,
        error
      );
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load applications"
      );
      setAppLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getApplications();
    }, [])
  );
  return (
    <View className="bg-white min-w-full h-full">
      {/* Header */}
      <View className="p-5 px-4 w-full flex-row items-center justify-between mt-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary_blue} />
        </TouchableOpacity>

        <View>
          <Text
            style={{ color: "#272727" }}
            className="text-[#1F2024] font-[DMSans-Medium] text-[14px] flex-1"
          >
            Advert Applications
          </Text>
        </View>

        <View />
      </View>
      <ApplicationFlatList
        data={applications}
        title={"Pending Applications"}
        emptyMessage={
          "Oops, you have not recieved any application yet.\n You can track  applications here"
        }
        emptyLottie={emptyPropsal}
      />
    </View>
  );
}
