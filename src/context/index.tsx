import { api } from "../service/configRequestAPI";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { AxiosResponse } from "axios";
import React, {
  ReactNode,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { LatLng, Marker } from "react-native-maps";
import { Modalize } from "react-native-modalize";
import { IHandles } from "react-native-modalize/lib/options";
import * as Notification from "expo-notifications";
import { Alert, Animated, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface IPlotLines {
  listCoords: LatLng[];
  lineColor: string;
  lineNumber: string;
  shapeId: string;
}

export interface IPlotLocationBus {
  p: string; //prefixo do veiculo
  a: boolean; // acessivel para deficientes
  ta: string; // horario da ultima captura
  py: string; // latitude
  px: string; // longitude
  itinerary: string;
}

export interface IHistory {
  intinerary: string;
  cl: number;
}

interface IReturnPositionBus {
  hr: string;
  vs: IPlotLocationBus[];
}

interface IContextMap {
  supabase: SupabaseClient<any, "public", any>;
  plotRouteInMap: IPlotLines[];
  refModalize: React.MutableRefObject<IHandles>;
  authApiSPTrans(): Promise<AxiosResponse<any, any>>;
  setPlotRouteInMap: React.Dispatch<React.SetStateAction<IPlotLines[]>>;
  setPlotMarkerInMap: React.Dispatch<React.SetStateAction<IPlotLocationBus[]>>;
  getLineRoute(
    shapeId: string,
    lineColor: string,
    lineNumber: string
  ): Promise<void>;
  scheduleNotification(
    data: Notification.NotificationContentInput,
    dispatch: Notification.NotificationTriggerInput
  ): Promise<void>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  plotMarkerInMap: IPlotLocationBus[];
  onLoadingPositionBus(
    lineNumber: string,
    cl: number,
    onIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<void>;
  refAnimationHistory: Animated.Value;
  refAnimationOverlay: Animated.Value;
  refAnimationOpacity: Animated.Value;
  visibleHandleHeader(show: boolean): void;
}

interface IItineraryBus {
  shape_id: string;
  route: {
    route_color: string;
  };
}

export const ContextMap = createContext<IContextMap>({} as IContextMap);

interface IOwnProps {
  children: ReactNode;
}

export const ProviderMap: React.FC<IOwnProps> = ({ children }) => {
  // States
  const [plotRouteInMap, setPlotRouteInMap] = useState<IPlotLines[]>([]);
  const [plotMarkerInMap, setPlotMarkerInMap] = useState<IPlotLocationBus[]>(
    []
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // refs
  const refModalize = useRef<Modalize>();

  const scheduleNotification = async (
    data: Notification.NotificationContentInput,
    dispatch: Notification.NotificationTriggerInput
  ) => {
    Notification.scheduleNotificationAsync({
      content: {
        ...data,
        sound: true,
      },
      trigger: dispatch,
    });

    const listSchedule = await Notification.getAllScheduledNotificationsAsync();
  };

  // effects
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notification.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Não foi concedida a permissão para o envio de notificação!"
        );
        return;
      }

      const notificationListner = Notification.addNotificationReceivedListener(
        (notification) => {
          Notification.setNotificationHandler({
            handleNotification: async () => ({
              shouldShowAlert: true,
              shouldPlaySound: true,
              shouldSetBadge: true,
            }),
          });
        }
      );

      scheduleNotification(null, null);

      return () => {
        notificationListner.remove();
      };
    };

    requestPermissions();
  }, []);

  const supabase = createClient(
    "https://ncqjupuejtypopidpmnj.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcWp1cHVlanR5cG9waWRwbW5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTY3MjA0OCwiZXhwIjoyMDE3MjQ4MDQ4fQ.SrpBL7UsvHBKjDrsMOe-s4-rDANaGv1tDRGCrur3i0Y"
  );

  const authApiSPTrans = async () => {
    const response = await api.post(
      "/Login/Autenticar?token=43707db095cd3aac6931044b1cdd332535a4a4b2dcbdfbef9a534653cff65ea8"
    );

    return response;
  };

  const getLineRoute = async (
    shapeId: string,
    lineColor: string,
    lineNumber: string
  ) => {
    const { data } = await supabase
      .from("shapes")
      .select("shape_pt_lat, shape_pt_lon")
      .eq("shape_id", shapeId)
      .order("shape_pt_sequence");

    const coords = data.map((data) => {
      return {
        latitude: parseFloat(data.shape_pt_lat),
        longitude: parseFloat(data.shape_pt_lon),
      };
    });

    setPlotRouteInMap((state) => [
      ...state,
      {
        listCoords: coords,
        lineColor: lineColor || "black",
        shapeId: shapeId,
        lineNumber,
      },
    ]);
  };

  const onLoadingPositionBus = async (
    lineNumber: string,
    cl: number,
    onIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    onIsLoading(true);
    try {
      let existLine = false;
      plotRouteInMap.forEach((line) => {
        if (line.lineNumber === lineNumber) existLine = true;
      });
      if (existLine === false) {
        const route = await supabase
          .from("trips")
          .select("shape_id, route(route_color)")
          .eq("trip_id", lineNumber.toUpperCase())
          .returns<IItineraryBus[]>();

        await getLineRoute(
          route.data[0].shape_id,
          `#${route.data[0].route.route_color}`,
          lineNumber
        );
      }

      const responsePositionBus = await api.get<IReturnPositionBus>(
        `/Posicao/Linha?codigoLinha=${cl}`
      );

      if (responsePositionBus.data.vs.length > 0) {
        const lastHistory = await AsyncStorage.getItem("historyBus");

        if (lastHistory) {
          const convertedHistory: IHistory[] = JSON.parse(lastHistory);
          const filteredHistory = convertedHistory.filter(
            (item) => item.cl !== cl
          );

          await AsyncStorage.setItem(
            "historyBus",
            JSON.stringify([
              { intinerary: lineNumber, cl: cl },
              ...filteredHistory,
            ])
          );
        } else {
          await AsyncStorage.setItem(
            "historyBus",
            JSON.stringify([{ intinerary: lineNumber, cl: cl }])
          );
        }

        setPlotMarkerInMap((value) => {
          const newListMarkerBus = value.filter(
            (marker) => marker?.itinerary !== lineNumber
          );

          responsePositionBus?.data?.vs?.forEach(
            (position) => (position.itinerary = lineNumber)
          );

          return [...newListMarkerBus, ...responsePositionBus.data.vs];
        });
        setIsOpen(false);
      } else {
        console.log("vazio");
      }
    } finally {
      onIsLoading(false);
    }
  };

  const refAnimationHistory = useRef(new Animated.Value(0)).current;
  const refAnimationOpacity = useRef(new Animated.Value(0)).current;
  const refAnimationOverlay = useRef(new Animated.Value(0)).current;

  const visibleHandleHeader = (isShow: boolean) => {
    Animated.timing(refAnimationOverlay, {
      delay: 0,
      toValue: isShow ? 174 : 0,
      duration: 800,
      useNativeDriver: false,
    }).start();

    Animated.timing(refAnimationOpacity, {
      delay: 300,
      toValue: isShow ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();

    Animated.timing(refAnimationHistory, {
      delay: isShow ? 400 : 23,
      toValue: isShow ? 60 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <ContextMap.Provider
      value={{
        supabase,
        plotRouteInMap,
        refModalize,
        isOpen,
        plotMarkerInMap,
        refAnimationOpacity,
        refAnimationOverlay,
        refAnimationHistory,
        onLoadingPositionBus,
        setPlotMarkerInMap,
        setIsOpen,
        setPlotRouteInMap,
        authApiSPTrans,
        getLineRoute,
        scheduleNotification,
        visibleHandleHeader,
      }}
    >
      {children}
    </ContextMap.Provider>
  );
};
