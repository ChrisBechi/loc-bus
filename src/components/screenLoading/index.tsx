import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

const ScreenLoading = () => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3,
      }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          opacity: 0.7,
          backgroundColor: "black",
        }}
      />
      <ActivityIndicator size="large" color="white" />
      <Text style={{ color: "white", fontSize: 16, marginTop: 15 }}>
        Carregando sua posição...
      </Text>
    </View>
  );
};

export default ScreenLoading;
