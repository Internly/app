import { View, Text, ScrollView } from "react-native";
import React from "react";
import SinglePost from "../ui/post/SinglePost";
import { AgapePostCustomData } from "../../data/customPost";

const AgapeHome = () => {
  return (
    <ScrollView vertical showsVerticalScrollIndicator={false} className="pb-20">
      <SinglePost details={AgapePostCustomData[0]} />
      <SinglePost details={AgapePostCustomData[1]} />
      <SinglePost details={AgapePostCustomData[0]} />
      <SinglePost details={AgapePostCustomData[1]} />
    </ScrollView>
  );
};

export default AgapeHome;
