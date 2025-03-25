import { View } from "react-native";
import React from "react";
import { NavItem } from "../ui/Navbar";
import Touchable from "./Touchable";
import { useAppContext } from "../../context/AppContext";
import { BottomNavBar } from "../../../assets/svgs";

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { isTabBarVisible } = useAppContext();

  const getTabIcon = (label, isFocused) => {
    if (label === "Home") {
      return (
        <NavItem
          name={"Home"}
          focusedIcon={BottomNavBar.HomeIconBlue}
          unFocusedIcon={BottomNavBar.HomeIcon}
          focused={isFocused}
        />
      );
    } else if (label === "Settings") {
      return (
        <NavItem
          name={"Settings"}
          focusedIcon={BottomNavBar.SettingIconBlue}
          unFocusedIcon={BottomNavBar.SettingIcon}
          focused={isFocused}
        />
      );
    } else if (label === "Adverts") {
      return (
        <NavItem
          name={"Adverts"}
          focusedIcon={BottomNavBar.WorkIconBlue}
          unFocusedIcon={BottomNavBar.WorkIcon}
          focused={isFocused}
        />
      );
    } else if (label === "Messages") {
      return (
        <NavItem
          name={"Messages"}
          focusedIcon={BottomNavBar.MessageIconBlue}
          unFocusedIcon={BottomNavBar.MessageIcon}
          focused={isFocused}
        />
      );
    }
  };

  return (
    <View
      className={`flex-row justify-around items-center w-full h-16 rounded-s-xl shadow-lg`}
      style={{
        backgroundColor: "#F8F8F8",
        // borderTopRightRadius: 20,
        // borderTopLeftRadius: 2,
        shadowColor: "black",
        shadowOpacity: 5,
        shadowOffset: { width: 100, height: 100 },
        shadowRadius: 20,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <Touchable
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            className="w-[100%] items-center justify-center px-2 shadow-lg"
          >
            {getTabIcon(label, isFocused)}
          </Touchable>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
