import React, { useEffect } from "react";
import axios from "axios"; // Make sure to import axios
import { useAppContext } from "../context/AppContext";
import { BASE_URL } from "../components/url/url";
import { Alert } from "react-native";
import { stringify } from "postcss";

const useGetLogin = ({ userInfo }) => {
  const { setAppLoading } = useAppContext();
  const [data, setData] = React.useState({});
  const [error, setError] = React.useState(null);

  const fetchData = async () => {
    try {
      setAppLoading(true);
      const response = await axios.post(
        `https://api.agapechristianministries.com/api/users/login`,
        {
          emailOrUsername: userInfo.emailOrUsername,
          password: userInfo.password,
        }
      );
  
      console.log(userInfo);
      console.log(response.data.token, "response");
      setData(response.data)
      console.log("done....");
    } catch (error) {
      console.log("Error from request:", error);
  
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
  

  const fetchDetails = () => {
    fetchData();
  };

  return { data, error, fetchDetails };
};

export default useGetLogin;
