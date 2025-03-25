import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

const RatingStarsClickable = ({onRatingChange,width}) => {
    const [rating, setRating] = useState(0)

    useEffect(()=>{
        onRatingChange(rating)
    },[rating])
  return (
    <View className= " flex-row items-center gap-1">
      <Ionicons onPress={()=>{setRating(1)}} color={rating >=1 ?"gold":"grey" } name='star' size={width||12}/>
      <Ionicons onPress={()=>{setRating(2)}} color={rating >=2 ?"gold":"grey" } name='star' size={width||12}/>
      <Ionicons onPress={()=>{setRating(3)}} color={rating >=3 ?"gold":"grey" } name='star' size={width||12}/>
      <Ionicons onPress={()=>{setRating(4)}} color={rating >=4 ?"gold":"grey" } name='star' size={width||12}/>
      <Ionicons onPress={()=>{setRating(5)}} color={rating ==5 ?"gold":"grey" } name='star' size={width||12}/>
    </View>
  )
}

export default RatingStarsClickable

const styles = StyleSheet.create({})