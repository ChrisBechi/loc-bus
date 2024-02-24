import { LocationObject, LocationObjectCoords } from "expo-location";
import React, { useContext, useEffect, useState } from "react";
import * as Notification from "expo-notifications";
import { Text, TouchableOpacity, View, ActionSheetIOS } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ContextMap, IHistory } from "../../../../context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IOwnProps {
  showClearRoute: boolean;
  onGetLocation(): Promise<LocationObject | undefined>;
  onMoveRegion(coords: LocationObjectCoords): void;
}

const ButtonLocation: React.FC<IOwnProps> = ({
  showClearRoute,
  onGetLocation,
  onMoveRegion,
}) => {
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [updateLine, setUpdateLine] = useState<IHistory>();
  const {
    setPlotRouteInMap,
    getLineRoute,
    setPlotMarkerInMap,
    refModalize,
    visibleHandleHeader,
    plotMarkerInMap,
    onLoadingPositionBus,
  } = useContext(ContextMap);
  const navigation = useNavigation<any>();

  const getCurrentLocation = () => {
    onGetLocation().then(({ coords }) => {
      onMoveRegion(coords);
    });
  };

  const clearLine = () => {
    setPlotRouteInMap([]);
    setPlotMarkerInMap([]);
    getCurrentLocation();
  };

  const showListActionButton = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Close", "8025-10", "748R-10"],
        destructiveButtonIndex: 3,
        cancelButtonIndex: 0,
        userInterfaceStyle: "dark",
      },
      (actionButton) => {
        switch (actionButton) {
          case 1:
            getLineRoute("79626", "red", "8025-10-0").then(() => {
              refModalize?.current?.close();
              navigation.navigate("/");
            });
            break;
          case 2:
            getLineRoute("63949", "blue", "748R-10-0").then(() => {
              refModalize?.current?.close();
              navigation.navigate("/");
            });
            break;
          default:
            break;
        }
      }
    );
  };

  useEffect(() => {
    const getItemUpdate = async () => {
      const history = await AsyncStorage.getItem("historyBus");
      if (history) {
        const convertedHistory: IHistory[] = JSON.parse(history);
        setUpdateLine(convertedHistory[0]);
      }
    };

    getItemUpdate();
  }, []);

  return (
    <View
      style={{
        position: "absolute",
        bottom: 40,
        right: 10,
      }}
    >
      {showClearRoute && (
        <>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 100,
              marginBottom: 3,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "black",
                opacity: 0.6,
                width: 50,
                height: 50,
                borderRadius: 100,
              }}
              onPress={() =>
                onLoadingPositionBus(
                  updateLine.intinerary,
                  updateLine.cl,
                  () => {}
                )
              }
            />
            <MaterialCommunityIcons
              name="reload"
              style={{ position: "absolute" }}
              size={25}
              color="white"
              onPress={() =>
                onLoadingPositionBus(
                  updateLine.intinerary,
                  updateLine.cl,
                  () => {}
                )
              }
            />
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 100,
              marginBottom: 6,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "black",
                opacity: 0.6,
                width: 50,
                height: 50,
                borderRadius: 100,
              }}
              onPress={clearLine}
            />
            <MaterialCommunityIcons
              name="broom"
              style={{ position: "absolute" }}
              size={25}
              color="white"
              onPress={clearLine}
            />
          </View>
        </>
      )}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 100,
          bottom: 3,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "black",
            opacity: 0.6,
            width: 50,
            height: 50,
            borderRadius: 100,
          }}
          onPress={() => {
            setShowHistory(!showHistory);
            visibleHandleHeader(!showHistory);
          }}
        />
        <MaterialIcons
          name="star"
          style={{ position: "absolute" }}
          size={25}
          color="white"
          onPress={() => {
            setShowHistory(!showHistory);
            visibleHandleHeader(!showHistory);
          }}
        />
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 100,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "black",
            opacity: 0.6,
            width: 50,
            height: 50,
            borderRadius: 100,
          }}
          onPress={getCurrentLocation}
        />
        <MaterialIcons
          name="my-location"
          style={{ position: "absolute" }}
          size={25}
          color="white"
          onPress={getCurrentLocation}
        />
      </View>
      {/* <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 100,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "black",
            opacity: 0.6,
            width: 50,
            height: 50,
            borderRadius: 100,
          }}
          onPress={showListActionButton}
        />
        <MaterialIcons
          name="my-location"
          style={{ position: "absolute" }}
          size={25}
          color="white"
          onPress={showListActionButton}
        />
      </View> */}
    </View>
  );
};

export default ButtonLocation;
