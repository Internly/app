import { useCallback, useContext, useState } from "react";
import { AppContext } from "../../../../context/AppContext";
import ApplicationFlatList from "../../../../components/ui/application/ApplicationFlatList";
import emptyPropsal from "../../../../../assets/lottie/emptyApplication.json";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

export function Applications({ navigation }) {
  const [applications, setApplications] = useState([]);
  const { setAppLoading, getData, user } = useContext(AppContext);

  const getApplications = async () => {
    const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

    try {
      setAppLoading(true);

      const authToken = await getData("authToken");
      const response = await axios.get(
        `${baseUrl}/applications/student/${user?._id}`,
        {
          headers: {
            "x-auth-token": authToken,
          },
        }
      );
      console.log("Applications : ", response.data);
      setApplications(
        response.data?.applications?.length > 0
          ? response.data?.applications?.reverse()
          : []
      );
      setAppLoading(false);
    } catch (error) {
      console.error(
        "Failed to fetch applications: ",
        error?.response?.message || error.message,
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
    <ApplicationFlatList
      data={applications}
      title={"Pending Applications"}
      emptyMessage={
        "Oops, you have not created an application yet.\n You can track your applications here"
      }
      emptyLottie={emptyPropsal}
    />
  );
}
