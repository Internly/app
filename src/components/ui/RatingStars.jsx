import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const RatingStars = ({rating}) => {
  return (
    <View className= " flex-row items-center gap-1">
      <Ionicons color={rating >=1 ?"gold":"grey" } name='star' size={10}/>
      <Ionicons color={rating >=2 ?"gold":"grey" } name='star' size={10}/>
      <Ionicons color={rating >=3 ?"gold":"grey" } name='star' size={10}/>
      <Ionicons color={rating >=4 ?"gold":"grey" } name='star' size={10}/>
      <Ionicons color={rating ==5 ?"gold":"grey" } name='star' size={10}/>

    </View>
  )
}

export default RatingStars

const styles = StyleSheet.create({})