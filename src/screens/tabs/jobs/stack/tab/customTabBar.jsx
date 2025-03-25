import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View clasName=" w-full flex flex-row justify-center items-center px-4">
      <View style={styles.tabContainer}>
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
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                styles.tab,
                isFocused ? styles.tabActive : styles.tabInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 5,
    width:"90%",
    backgroundColor: "#F8F9FE",
    borderRadius: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: "#FFFFFF", // Background for active tab
  },
  tabInactive: {
    backgroundColor: "transparent",
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  tabLabelActive: {
    color: "#1F2024",
  },
  tabLabelInactive: {
    color:"#71727A" ,
  },
});

export default CustomTabBar;
