import { StatusBar } from "expo-status-bar";
import "react-native-url-polyfill/auto";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ProviderMap } from "./src/context";
import Router from "./src/service/router";
import { useEffect } from "react";
import * as Notification from "expo-notifications";
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const requestPermissions = async () => {
    const { status } = await Notification.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Não foi concedida a permissão para o envio de notificação!");
      return;
    }

    const notificationListner = Notification.addNotificationReceivedListener(
      (notification) => {
        Notification.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            priority:
              Platform.OS === "android"
                ? Notification.AndroidNotificationPriority.MAX
                : null,
          }),
        });
      }
    );

    return () => {
      notificationListner.remove();
    };
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" backgroundColor="black" />
      <ProviderMap>
        <Router />
      </ProviderMap>
    </GestureHandlerRootView>
  );
}
