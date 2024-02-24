import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import DetailBusPage from "../../pages/detailBus";
import MapComponent from "../../pages/maps";

const Router: React.FC = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="/">
        <Stack.Screen
          name="/"
          component={MapComponent}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DetailBus"
          component={DetailBusPage}
          options={{
            title: "Detalhe da linha",
            headerBackTitle: "Voltar",
            headerTintColor: "white",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
            },
            headerShadowVisible: true,
            headerStyle: {
              backgroundColor: "#0099e1",
            },
          }}
        />
        <Stack.Screen
          name="searchLine"
          component={DetailBusPage}
          options={{
            title: "Detalhe da linha",
            headerBackTitle: "Voltar",
            headerTintColor: "white",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
            },
            headerShadowVisible: true,
            headerStyle: {
              backgroundColor: "#0099e1",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
