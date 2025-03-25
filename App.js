import React, { useCallback } from "react";
import { AppProvider } from "./src/context/AppContext";
import { NativeWindStyleSheet } from "nativewind";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import MainScreen from "./src/screens/general/MainScreen";
import { setCustomText } from "react-native-global-props";

// @@iconify-code-gen

// SplashScreen.preventAutoHideAsync();
export default function App() {
  // making the tailwind stylesheet available
  NativeWindStyleSheet.setOutput({
    default: "native",
  });

  // Ensuring the fonts are loaded before loading the app
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  //  importing the font family
  const [fontsLoaded] = useFonts({
    "DMSans-Black": require("./assets/fonts/DMSans-Black.ttf"),
    "DMSans-Regular": require("./assets/fonts/DMSans-Regular.ttf"),
    "DMSans-Light": require("./assets/fonts/DMSans-Light.ttf"),
    "DMSans-Medium": require("./assets/fonts/DMSans-Medium.ttf"),
    "DMSans-SemiBold": require("./assets/fonts/DMSans-SemiBold.ttf"),
    "DMSans-Bold": require("./assets/fonts/DMSans-Bold.ttf"),
  });

  const customTextProps = {
    style: {
      fontFamily: "DMSans-Regular",
    },
  };

  setCustomText(customTextProps);

  if (!fontsLoaded) {
    return null
  }

  return (
    <AppProvider>
      <MainScreen />
    </AppProvider>
  );
}
