import React from "react";
import { View } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

const NotOperatedIcon = () => {
  return (
    <View>
      <View
        style={{
          position: "absolute",
          height: 6,
          borderRadius: 2,
          backgroundColor: "#bfbfbf",
          width: 80,
          top: 20,
          left: -17,
          borderTopColor: "#f0f0f0",
          zIndex: 9,
          borderTopWidth: 4,
          transform: [{ rotate: "42deg" }],
        }}
      />
      <FontAwesome6 name="bus-simple" size={50} color="#bfbfbf" />
    </View>
  );
};

export default NotOperatedIcon;
