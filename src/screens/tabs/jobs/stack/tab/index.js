import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import axios from "axios";
import { Alert } from "react-native";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../../../../context/AppContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Applications } from "../Applications";
import { colors } from "../../../../../data/colors"; // Assuming you have a color palette defined
import CustomTabBar from "./customTabBar";
import PlusIcon from "../../../../../../assets/svgs/Plus .svg";

const Tab = createMaterialTopTabNavigator();
const BASE_URL = process.env.EXPO_PUBLIC_REMOTE_URL;

function Jobs() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        style={{ backgroundColor: "white" }}
        tabBar={(props) => <CustomTabBar {...props} />} // Use custom tab bar
      >
        <Tab.Screen name="Applications" component={Applications} />
      </Tab.Navigator>
    </View>
  );
}

export default Jobs;

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
