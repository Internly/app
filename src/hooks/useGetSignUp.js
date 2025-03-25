import React from "react";
import axios from "axios"; // Make sure to import axios
import { useAppContext } from "../context/AppContext";
import { BASE_URL } from "../components/url/url";
import { Alert } from "react-native";

const useGetSignUp = ({ userInfo }) => {
  const { setAppLoading } = useAppContext();
  const [data, setData] = React.useState({});
  const [error, setError] = React.useState(null);

  const fetchData = async () => {
    try {
      setAppLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/users/register`,
        userInfo
      );

      console.log(userInfo,"user Info");
      // const json = await response.json();
      setData(response.data);
      console.log(response.data.message);
      console.log("done....");
    } catch (error) {
      console.log("Error from request:", error);
      console.log(userInfo,"user Info");

  
      if (error.response) {
        // The request was made and the server responded with a status code
        // other than 2xx. Access the response data for more details.
        console.log("Server response data:", error.response.data);
        console.log("Status code:", error.response.status);
      Alert.alert("Error", error.response.data.message);

      } else if (error.request) {
        // The request was made but no response was received
        console.log("No response received. The request was made but no response was received.");
        console.log("Request config:", error.config);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error message:", error.message);
      Alert.alert("Error", "Something went wrong. Please try again later.");

      }
  
      setError(error);
    } finally {
      setAppLoading(false);
    }
  };

  const signup = () => {
    fetchData();
  };

  return { data, error, signup };
};

export default useGetSignUp;
