import { ScrollView } from "react-native";
import React from "react";
import SinglePost from "../ui/post/SinglePost";
import { KidsPostCustomData } from "../../data/customPost";

const KidsHome = () => {
  return (
    <ScrollView vertical showsVerticalScrollIndicator={false} className="pb-20">
      <SinglePost details={KidsPostCustomData[0]} />
      <SinglePost details={KidsPostCustomData[0]} />
      <SinglePost details={KidsPostCustomData[0]} />
      <SinglePost details={KidsPostCustomData[0]} />
    </ScrollView>
  );
};

export default KidsHome;
