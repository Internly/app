import { ScrollView } from "react-native";
import React from "react";
import SinglePost from "../ui/post/SinglePost";
import { TeensPostCustomData } from "../../data/customPost";

const TeensHome = () => {
  return (
    <ScrollView vertical showsVerticalScrollIndicator={false} className="pb-20">
      <SinglePost details={TeensPostCustomData[0]} />
      <SinglePost details={TeensPostCustomData[0]} />
      <SinglePost details={TeensPostCustomData[0]} />
      <SinglePost details={TeensPostCustomData[0]} />
    </ScrollView>
  );
};

export default TeensHome;
