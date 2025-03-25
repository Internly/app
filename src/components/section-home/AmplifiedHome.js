import { View, Text, ScrollView } from "react-native";
import React from "react";
import SinglePost from "../ui/post/SinglePost";
import { AmplifiedPostCustomData } from "../../data/customPost";

const AmplifiedHome = () => {
  return (
    <ScrollView vertical showsVerticalScrollIndicator={false} className="pb-20">
      <SinglePost details={AmplifiedPostCustomData[0]} />
      <SinglePost details={AmplifiedPostCustomData[0]} />
      <SinglePost details={AmplifiedPostCustomData[0]} />
      <SinglePost details={AmplifiedPostCustomData[0]} />
    </ScrollView>
  );
};

export default AmplifiedHome;
