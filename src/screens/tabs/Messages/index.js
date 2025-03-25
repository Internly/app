
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AllChats from "./stack/AllChats";
import Chat from "./stack/Chat";

const MessageStacks = () => {
  const MessageStack = createNativeStackNavigator();

  return (
    <MessageStack.Navigator
      screenOptions={{ headerShown: false, animation: "none" }}
    >
      <MessageStack.Screen name="Chats"  component={AllChats} />

    </MessageStack.Navigator>
  );
};

export default MessageStacks;
