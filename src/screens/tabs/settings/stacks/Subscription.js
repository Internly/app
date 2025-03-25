// import { useNavigation } from "@react-navigation/native";
// import React, { useState } from "react";
// import {
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
//   Image,
// } from "react-native";
// import FeatherIcon from "react-native-vector-icons/Feather";
// import { colors } from "../../../../data/colors";
// import { Ionicons } from "@expo/vector-icons";

// const payments = [
//   {
//     img: "https://images.unsplash.com/photo-1632167764165-74a3d686e9f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2342&q=80",
//     name: "Lunge",
//     cal: 44,
//     amount: 500,
//     status: "pending",
//     type: "withdrawal",
//     date: Date.now() + 1000000000,
//   },
//   {
//     img: "https://images.unsplash.com/photo-1536922246289-88c42f957773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2404&q=80",
//     amount: 500,
//     status: "pending",
//     type: "withdrawal",
//     date: Date.now() + 1000000000,
//   },
//   {
//     img: "https://images.unsplash.com/photo-1597347316205-36f6c451902a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
//     amount: 500,
//     status: "success",
//     type: "withdrawal",
//     date: Date.now(),
//   },
//   {
//     img: "https://images.unsplash.com/photo-1616803689943-5601631c7fec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
//     amount: 500,
//     status: "failed",
//     type: "income",
//     date: Date.now(),
//   },
//   {
//     img: "https://images.unsplash.com/photo-1616803689943-5601631c7fec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
//     amount: 2000,
//     status: "success",
//     type: "income",
//     date: Date.now(),
//   },
// ];

// export default function Payments() {
//   const navigation = useNavigation();
//   const [showBalance, setShowBalance] = useState(false);
//   return (
//     <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
//       <ScrollView contentContainerStyle={styles.container}>
//         {/* Header */}
//         <View className="pb-5 flex-row items-center justify-between border-b-[1px] border-b-[#F0DA6B] w-full">
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="chevron-back" size={24} color={"black"} />
//           </TouchableOpacity>

//           <Text
//             style={{ ...styles.textbold, color: colors.primary_blue }}
//             className="text-black text-xl flex-1 ml-2"
//           >
//             Payments
//           </Text>
//         </View>
//         {/* <Text style={styles.title}>Transactions</Text> */}


//         <View className="flex flex-row items-center justify-between w-full py-4">
//                   {/* Account balance */}

//         <View className="bg-blue-200 min-w-[40%] rounded-lg py-2 p-4">
//           <Text className="text-lg font-black">Balance</Text>
//           <View className="flex items-center flex-row">
//             <Text className="text-lg text-gray-500 font-black mr-2">
//               {showBalance ? "$ 20,000" : "*****"}
//             </Text>

//             <TouchableOpacity
//               onPress={() => {
//                 setShowBalance(!showBalance);
//               }}
//             >
//               <FeatherIcon name="eye" size={20} color={colors.primary_mint} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View className="bg-green-200 min-w-[40%] rounded-lg py-2 p-4">
//           <Text className="text-lg font-black ">Total Income</Text>
//           <View className="flex items-center flex-row">
//             <Text className="text-lg text-gray-500 font-black mr-2">
//               {showBalance ? "$ 230,000" : "*****"}
//             </Text>

//             <TouchableOpacity
//               onPress={() => {
//                 setShowBalance(!showBalance);
//               }}
//             >
//               <FeatherIcon name="eye" size={20} color={colors.primary_mint} />
//             </TouchableOpacity>
//           </View>
//         </View>
//         </View>



//         {payments.map(({ date, img, type, amount, status }, index) => {
//           const paymentDetails = { date, img, type, amount, status };
//           return (
//             <TouchableOpacity
//               key={index}
//               onPress={() => {
//                 // handle onPress
//                 navigation.navigate("PaymentDetails", { PaymentDetails:paymentDetails });
//               }}
//             >
//               <View style={styles.card} >
//                 <View className="flex flex-row">
//                 <Image
//                   alt=""
//                   resizeMode="cover"
//                   style={styles.cardImg}
//                   source={{ uri: img }}
//                 />

//                 <View >
//                   <Text style={styles.cardTitle}>{type}</Text>

//                   <View style={styles.cardStats}>
//                     <View style={styles.cardStatsItem}>
//                       <FeatherIcon color="#636a73" name={"clock"} />

//                       <Text style={styles.cardStatsItemText} className="text-xs text-gray-500">
//                         {date? new Date(date).toDateString() : new Date().toDateString()}
//                       </Text>
//                     </View>

//                     <View style={styles.cardStatsItem}  >
//                       <FeatherIcon color="#636a73" name="zap" />

//                       <Text
//                         style={styles.cardStatsItemText}
//                         className={`${
//                           status == "success"
//                             ? "text-green-400"
//                             : status == "failed"
//                             ? "text-red-400"
//                             : "text-yellow-400"
//                         }`}
//                       >
//                         {status}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//                 </View>


//                 {/* amount */}
//                 <View>
//                   <Text
//                     className={`${
//                       type == "withdrawal" ? "text-red-400" : "text-green-400"
//                     } text-sm font-[DMSans-Bold]`}
//                   >
//                     {type == "withdrawal" ? "-" : "+"}${amount || 0.0}
//                   </Text>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           );
//         })}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: "700",
//     color: "#1d1d1d",
//     marginBottom: 12,
//   },
//   /** Card */
//   card: {
//     paddingVertical: 14,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   cardImg: {
//     width: 50,
//     height: 50,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   cardTitle: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#000",
//     marginBottom: 8,
//   },
//   cardStats: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   cardStatsItem: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     marginRight: 8,
//   },
//   cardStatsItemText: {
//     fontSize: 11,
//     fontWeight: "600",
//     // color: "#636a73",
//     marginLeft: 2,
//   },
//   cardAction: {
//     marginLeft: "auto",
//   },
// });
