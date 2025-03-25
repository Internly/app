import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AnimatedLottieView from 'lottie-react-native'
import emptyMessages from "../../../../assets/lottie/emptyMessage.json"
import { colors } from '../../../data/colors'

const EmptyMessage = ({isLoading}) => {
  return (
    <View className="w-full flex flex-col items-center justify-center">
    <AnimatedLottieView
      source={emptyMessages}
      className="animate-pulse"
      autoPlay
      duration={4000}
      loop={false}
      style={{
        backgroundColor: "transparent",
        width: 300,
        height: 300,
      }}
    />
    <Text
      className="m-2 text-md font-[DMSans-SemiBold] text-center"
      style={{
        color: colors.primary_blue,
        textAlign: "center",
        lineHeight: 27,
      }}
    >
      {isLoading?"Your messages are loading!":`Say "Hi" to start a conversation..`}
    </Text>

    <Text
      className="m-2 text-md font-[DMSans-SemiBold] text-center"
      style={{ color: "gray", textAlign: "center", lineHeight: 27 }}
    >
      {"Your messages appear here"}
    </Text>
  </View>
  )
}

export default EmptyMessage

const styles = StyleSheet.create({})