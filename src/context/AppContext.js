// AppContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert, useWindowDimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import io from "socket.io-client";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { width, height } = useWindowDimensions();
  const [isAppLoading, setAppLoading] = useState(false);
  const [isTabBarVisible, setTabBarVisible] = useState(false);
  const [user, setUser] = useState();
  const [userType, setUserType] = useState();
  const [socket, setSocket] = useState(null);
  // a simple state to count incoming messages
  const [messageCount, setmessageCount] = useState(0);
  // const toast = useToast()

  const baseUrl = process.env.EXPO_PUBLIC_REMOTE_URL;

  useEffect(() => {
    const newSocket = io("https://sowapo-server.onrender.com");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [baseUrl]);

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      // console.log(`retieved data ${key}: ${value}`)
      if (value !== null) {
        return value;
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // get current user data

  const getUser = async () => {
    const token = await getData("authToken");
    if (!token) {
      // Token is not present, navigate to SignIn screen
      return false;
    }

    console.log(" userType : ", userType);
    try {
      // Send a request to fetch user details
      const response = await axios.get(`${baseUrl}/${userType}s/details`, {
        headers: {
          "x-auth-token": token,
        },
      });

      const { data } = response.data;

      setUser(data);

      return data;
    } catch (error) {
      console.log(error, " is get student error");
    }
  };

  // util function to verify user token
  const verifyToken = async () => {
    const token = await getData("authToken");
    if (!token) {
      // Token is not present, navigate to SignIn screen
      return false;
    }

    try {
      // Send a request to verify the token
      const response = await axios.get(`${baseUrl}/students/verify_token`, {
        headers: {
          "x-auth-token": token,
        },
      });

      return true;
    } catch (error) {
      // Token verification failed, navigate to SignIn screen
      Alert.alert(
        error?.response?.data?.message ||
          error.message ||
          "Invalid token please sign in again"
      );

      console.log(error, " is verify tokn error");
      // navigation.navigate("Signin");
      return false;
    }
  };

  const logOut = async () => {
    await AsyncStorage.removeItem("authToken");
    await storeData("rememberMe", "no");
  };

  const contextValue = {
    isAppLoading,
    setAppLoading,
    isTabBarVisible,
    setTabBarVisible,
    width,
    height,
    getData,
    storeData,
    verifyToken,
    user,
    getUser,
    logOut,
    socket,
    setmessageCount,
    messageCount,
    userType,
    setUserType,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
