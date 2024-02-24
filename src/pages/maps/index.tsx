import {
  LocationAccuracy,
  LocationObject,
  LocationObjectCoords,
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import React, { useContext, useEffect, useRef, useState } from "react";
import RNMaps, { LatLng, Marker, Polyline } from "react-native-maps";
import { ActionSheetIOS, Platform, View } from "react-native";
import { styles } from "./styles";
import ScreenLoading from "../../components/screenLoading";
import locationStopBus from "../../assets/images/bus-stop.png";
import locationStopBusAndroid from "../../assets/images/bus-stop-android.png";
import startLocation from "../../assets/images/bus-location.png";
import finishLocation from "../../assets/images/finishRoute.png";
import finishLocationAndroid from "../../assets/images/finishRouteAndroid.png";
import { Modalize } from "react-native-modalize";
import Modalizer from "../../components/modalizer";
import {
  ICoords,
  ILinesInCurrentBuStop,
  IStopBus,
} from "../../components/types";
import {
  EUnitCordinate,
  distanceCoordinate,
} from "../../utils/distanceCoordinate";
import ButtonLocation from "../../components/pages/home/buttonLocation";
import { ContextMap, IPlotLines } from "../../context";
import BusStop from "../../components/modalizer/stopBusList";
import HeaderHome from "@/components/pages/home/header";
import ModalSearchLine from "@/components/modal";

const MapComponent = () => {
  // states
  const [lineSearch, setLineSearch] = useState<string>("");
  const [isLoadingPosition, setIsLoadingPosition] = useState<boolean>(true);
  const [isLoadingStopBus, setIsLoadingStopBus] = useState<boolean>(false);
  const [aroundStopBus, setAroundStopBus] = useState<IStopBus[]>([]);
  const [selectStopBus, setSelectStopBus] = useState<IStopBus>();
  const [linesInCurrentBuStop, setLinesInCurrentBuStop] = useState<
    ILinesInCurrentBuStop[]
  >([]);
  const {
    supabase,
    plotRouteInMap,
    refModalize,
    plotMarkerInMap,
    setPlotRouteInMap,
  } = useContext(ContextMap);
  // refs
  const mapsRef = useRef<RNMaps | null>(null);

  const searchStopBusByLocation = async (locationCoords: ICoords) => {
    const { data: stops, error } = await supabase.from("stops").select();

    const filteredList = stops.filter((stopBus) => {
      if (
        distanceCoordinate(
          locationCoords.latitude,
          locationCoords.longitude,
          stopBus.stop_lat,
          stopBus.stop_lon,
          EUnitCordinate.KILOMETROS
        ) > 1
      ) {
        return false;
      } else {
        return true;
      }
    });

    setAroundStopBus(filteredList);
  };

  const moveToRegionMap = ({ latitude, longitude }: LocationObjectCoords) => {
    mapsRef.current.animateToRegion(
      {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0055,
        longitudeDelta: 0.0055,
      },
      2000
    );

    setIsLoadingPosition(false);
  };

  const getLocation = async (): Promise<LocationObject | undefined> => {
    setIsLoadingPosition(true);
    const permition = await requestForegroundPermissionsAsync();

    if (permition.granted) {
      try {
        const currentLocation = await getCurrentPositionAsync({
          accuracy: LocationAccuracy.Low,
        });
        return currentLocation;
      } catch (error) {
        console.log("error", error);
      }
    }
    return null;
  };

  const correctDirection = (
    listLineStopBus: ILinesInCurrentBuStop[]
  ): ILinesInCurrentBuStop[] => {
    let goingCenter = 0;
    let goingNeighborhood = 0;

    listLineStopBus.forEach((lineStopBus) => {
      const direction = lineStopBus.trip_id.split("-")[2];
      if (direction === "0") {
        goingCenter += 1;
      } else {
        goingNeighborhood += 1;
      }
    });

    const oficialDirection = goingCenter > goingNeighborhood ? "0" : "1";

    listLineStopBus.forEach((lineStopBus) => {
      const direction = lineStopBus.trip_id.split("-");
      if (direction[2] != oficialDirection) {
        lineStopBus.trip_id = `${direction[0]}-${direction[1]}-${oficialDirection}`;
      }
    });

    return listLineStopBus;
  };

  useEffect(() => {
    getLocation().then(async (currentLocation) => {
      await searchStopBusByLocation(currentLocation.coords);

      moveToRegionMap(currentLocation.coords);
    });
  }, []);

  useEffect(() => {
    if (plotRouteInMap?.length > 0) {
      const allCordinates: LatLng[] =
        plotRouteInMap[plotRouteInMap.length - 1].listCoords;
      mapsRef.current.fitToCoordinates(allCordinates, {
        edgePadding: {
          bottom: 20,
          left: 20,
          right: 20,
          top: 20,
        },
      });
    }
  }, [plotRouteInMap]);

  const handlePolyline = (shapeId: string, title: string) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Destacar linha", "Remover do mapa", "Fechar"],
        cancelButtonIndex: 2,
        cancelButtonTintColor: "red",
        title: `${title.slice(0, -2)}\n${
          (title.slice(-1) == "0" && "sentido centro") || "sentido bairro"
        }`,
      },
      (actionButton) => {
        switch (actionButton) {
          case 1:
            setPlotRouteInMap((listRoutes) =>
              listRoutes.filter((route) => route.shapeId !== shapeId)
            );
            break;
          case 0:
            setPlotRouteInMap((listRoutes) => {
              let emphasis: IPlotLines;
              const newListRoute: IPlotLines[] = [];

              listRoutes.forEach((value) => {
                if (value.shapeId === shapeId) {
                  emphasis = value;
                } else {
                  newListRoute.push(value);
                }
              });

              return [...newListRoute, emphasis];
            });
            break;
          default:
            break;
        }
      }
    );
  };

  return (
    <>
      {isLoadingPosition && <ScreenLoading />}
      <HeaderHome setLineSearch={setLineSearch} />
      <View style={styles.container}>
        <RNMaps
          style={{ flex: 1, width: "100%" }}
          ref={mapsRef}
          initialRegion={{
            latitude: -23.5475,
            longitude: -46.63611,
            latitudeDelta: 0.8082,
            longitudeDelta: 0.7551,
          }}
          showsUserLocation
          onRegionChangeComplete={async (event) => {
            if (event.latitudeDelta > 0.03 && event.longitudeDelta > 0.03) {
              setAroundStopBus([]);
            } else {
              if (aroundStopBus.length === 0 && !isLoadingStopBus) {
                setIsLoadingStopBus(true);
                await searchStopBusByLocation(event);
                setIsLoadingStopBus(false);
              }
            }
          }}
          showsMyLocationButton={false}
        >
          {aroundStopBus.map((stop) => (
            <Marker
              key={stop.stop_id}
              onPress={async () => {
                if (refModalize.current) {
                  const { data: stop_times } = await supabase
                    .from("stop_times")
                    .select()
                    .eq("stop_id", stop.stop_id);
                  setSelectStopBus(stop);
                  setLinesInCurrentBuStop(stop_times);
                  refModalize.current.open();
                }
              }}
              coordinate={{
                latitude: parseFloat(stop.stop_lat),
                longitude: parseFloat(stop.stop_lon),
              }}
              image={
                Platform.OS === "ios" ? locationStopBus : locationStopBusAndroid
              }
            />
          ))}
          {plotMarkerInMap.map((bus) => (
            <Marker
              key={bus.p}
              coordinate={{
                latitude: parseFloat(bus.py),
                longitude: parseFloat(bus.px),
              }}
              image={startLocation}
              style={{ marginBottom: 10 }}
            />
          ))}
          {plotRouteInMap?.length > 0 &&
            plotRouteInMap.map((routesCoordinate, idx) => (
              <React.Fragment key={idx}>
                <Polyline
                  coordinates={routesCoordinate.listCoords}
                  strokeWidth={5}
                  strokeColor={routesCoordinate.lineColor}
                  onPress={() =>
                    handlePolyline(
                      routesCoordinate.shapeId,
                      routesCoordinate.lineNumber
                    )
                  }
                />
                <Marker
                  coordinate={routesCoordinate.listCoords[0]}
                  onPress={() =>
                    handlePolyline(
                      routesCoordinate.shapeId,
                      routesCoordinate.lineNumber
                    )
                  }
                />
                <Marker
                  onPress={() =>
                    handlePolyline(
                      routesCoordinate.shapeId,
                      routesCoordinate.lineNumber
                    )
                  }
                  coordinate={
                    routesCoordinate.listCoords[
                      routesCoordinate.listCoords.length - 1
                    ]
                  }
                  image={
                    Platform.OS === "android"
                      ? finishLocationAndroid
                      : finishLocation
                  }
                  style={{ paddingBottom: -150 }}
                />
              </React.Fragment>
            ))}
        </RNMaps>
        <ButtonLocation
          onGetLocation={getLocation}
          onMoveRegion={moveToRegionMap}
          showClearRoute={plotRouteInMap?.length > 0}
        />
      </View>
      <Modalizer refModalizer={refModalize}>
        <BusStop
          currentStopBus={selectStopBus}
          linesInCurrentBuStop={correctDirection(linesInCurrentBuStop)}
        />
      </Modalizer>
      <ModalSearchLine lineSearch={lineSearch} />
    </>
  );
};

export default MapComponent;
