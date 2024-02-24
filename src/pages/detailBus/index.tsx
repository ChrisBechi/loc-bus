import { ContextMap } from "../../context";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import ItemIntinerary from "../../components/pages/detailBus/itinerary/itemIntinerary";
import { styleHeader } from "./styles";
import SwitchModeButton, {
  EDisplayMode,
} from "@/components/pages/detailBus/switchModeButton";
import HeaderItinerary from "../../components/pages/detailBus/itinerary/headerItinerary";
import TimeBusContent, {
  IFrequency,
} from "@/components/pages/detailBus/timeBus";
import { api } from "@/service/configRequestAPI";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import {
  IDetailBus,
  ITimeNextBus,
  IVehicleFound,
} from "@/components/modalizer/stopBusList/types";
import { Modalize } from "react-native-modalize";
import { PickerIOS } from "@react-native-picker/picker";
import { IHandles } from "react-native-modalize/lib/options";
import { ItemValue } from "@react-native-picker/picker/typings/Picker";
import ErrorMessage from "@/components/feedback/errorMessage";

type RootStackParamList = {
  DetailBus: {
    backgroundColorLine: string;
    colorTextLine: string;
    numberLine: string;
    direction: string;
    lineDestination: string;
  };
};

type Props = {
  route: RouteProp<RootStackParamList, "DetailBus">;
};

interface IItineraryBus {
  trip_id: string;
  stops: { stop_id; stop_name: string; stop_desc: string };
  trips: {
    shape_id: string;
  };
}

interface IItineraryFormated {
  stopName: string;
  nextBusTime?: string;
  isCircular: boolean;
  refs: string;
}

const DetailBusPage = ({ route }: Props) => {
  const [displayMode, setDisplayMode] = useState<EDisplayMode>(
    EDisplayMode.INTINERARY
  );
  const [listItinerary, setListItinerary] = useState<IItineraryFormated[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [shapeId, setShapeId] = useState<string>();
  const [timeFrequence, setTimeFrequence] = useState<IFrequency[]>([]);
  const [timeBus, setTimeBus] = useState<string>();
  const [weekday, setWeekday] = useState<ItemValue>(
    JSON.stringify({
      label: "Dias úteis",
      value: 0,
    })
  );

  const { supabase } = useContext(ContextMap);
  const navigation = useNavigation<any>();

  const refFlatList = useRef<FlatList<IItineraryFormated>>();
  const ref = useRef<IHandles>();

  const {
    numberLine,
    colorTextLine,
    backgroundColorLine,
    lineDestination,
    direction,
  } = route.params;

  const headerCustomProps = () => {
    navigation.setOptions({
      headerTitle: () => {
        return (
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: colorTextLine }}
            >
              {numberLine}
            </Text>
            <Text style={{ color: colorTextLine, fontSize: 12 }}>
              {lineDestination.toUpperCase()}
            </Text>
          </View>
        );
      },
      headerTintColor: colorTextLine,
      headerStyle: {
        backgroundColor: backgroundColorLine,
      },
    });
  };

  const getIntineraryLine = async () => {
    setIsLoading(true);
    if (refFlatList && listItinerary.length > 0) {
      refFlatList.current.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }

    try {
      const line = await api.get<IDetailBus[]>(`/Linha/BuscarLinhaSentido`, {
        params: {
          termosBusca: numberLine,
          sentido: parseInt(direction) + 1,
        },
      });

      const verifyDirection = (line.data[0].lc && "0") || direction;

      const itineraryBus = await supabase
        .from("stop_times")
        .select(
          "trip_id, stops(stop_id ,stop_name, stop_desc), trips(shape_id)"
        )
        .eq("trip_id", `${numberLine.toUpperCase()}-${verifyDirection}`)
        .returns<IItineraryBus[]>();

      if (itineraryBus.data.length > 0) {
        setShapeId(itineraryBus.data[0].trips?.shape_id || "");
      }

      const itineraryFormated = await Promise.all(
        itineraryBus.data.map(async (itinerary: IItineraryBus) => {
          const hasLine: boolean = line.data.length > 0;
          let timeRequest = "--:--";

          if (hasLine) {
            const timePrevisionBus = await api.get<ITimeNextBus>(
              `/Previsao?codigoParada=${itinerary.stops.stop_id}&codigoLinha=${line.data[0].cl}`
            );

            timeRequest = timePrevisionBus.data.p?.l[0]?.vs[0]?.t;
            setTimeBus(timePrevisionBus.data.hr);
          }

          if (itinerary.stops.stop_desc) {
            const clearName = itinerary.stops.stop_desc
              .replace(`${itinerary.stops.stop_name}`, "")
              .replace(`Tp ${numberLine}`, "")
              .trim();
            if (clearName !== "Ref.:") {
              let formatedRefs: string;
              const separateRef = clearName.split("Ref.: ");
              if (separateRef[0] && separateRef[1]) {
                formatedRefs = `${separateRef[0]}- ${separateRef[1]}`;
              } else if (separateRef[1]) {
                formatedRefs = separateRef[1];
              } else if (separateRef[0]) {
                formatedRefs = separateRef[0];
              }

              return {
                stopName: itinerary.stops.stop_name,
                nextBusTime: timeRequest,
                isCircular: line?.data[0]?.lc || false,
                refs: formatedRefs,
              };
            } else {
              return {
                stopName: itinerary.stops.stop_name,
                nextBusTime: timeRequest,
                isCircular: line?.data[0]?.lc || false,
                refs: "",
              };
            }
          } else {
            return {
              stopName: itinerary.stops.stop_name,
              nextBusTime: timeRequest,
              isCircular: line?.data[0]?.lc || false,
              refs: "",
            };
          }
        })
      );

      await getTimeIntinerary();

      setListItinerary(itineraryFormated);
      setIsError(false);
    } catch (error) {
      console.log(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeIntinerary = async () => {
    const { data: frequence } = await supabase
      .from("frequence")
      .select()
      .eq("trip_id", `${numberLine}-${direction}`)
      .returns<IFrequency[]>();

    setTimeFrequence(frequence);
  };

  useEffect(() => {
    headerCustomProps();
    getIntineraryLine();
  }, []);

  const styleHeaderFlatList = styleHeader(backgroundColorLine);

  return (
    <>
      <SafeAreaView>
        <View style={{ padding: 5, height: "100%" }}>
          <SwitchModeButton
            colorLine={backgroundColorLine}
            displayMode={displayMode}
            onDisplayMode={setDisplayMode}
          />

          {(isLoading && (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator color="#0099e1" size="large" />
            </View>
          )) ||
            (displayMode === EDisplayMode.INTINERARY && (
              <FlatList
                ref={refFlatList}
                data={listItinerary}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                  <View style={styleHeaderFlatList.wrapperHeader}>
                    {displayMode === EDisplayMode.INTINERARY && (
                      <HeaderItinerary
                        colorLine={backgroundColorLine}
                        numberStopBus={listItinerary?.length || 0}
                        shapeId={shapeId}
                        updatedRequest={timeBus}
                        lineNumber={`${numberLine}-${direction}`}
                      />
                    )}
                  </View>
                )}
                stickyHeaderIndices={[0]}
                contentContainerStyle={isError && { flex: 1 }}
                ListEmptyComponent={isError && <ErrorMessage />}
                renderItem={({ item, index }) =>
                  displayMode === EDisplayMode.INTINERARY && (
                    <ItemIntinerary
                      finishBorderRadius={index === listItinerary.length - 1}
                      data={item}
                      colorLine={backgroundColorLine}
                      colorFontLine={colorTextLine}
                    />
                  )
                }
                ListFooterComponent={() =>
                  !isError && (
                    <View
                      style={{
                        alignItems: "center",
                        marginVertical: 5,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#0099e1",
                          padding: 15,
                          borderRadius: 50,
                        }}
                        onPress={getIntineraryLine}
                      >
                        <SimpleLineIcons
                          onPress={getIntineraryLine}
                          name="reload"
                          size={20}
                          color="white"
                        />
                      </TouchableOpacity>
                    </View>
                  )
                }
              />
            )) || (
              <TimeBusContent
                refWeekDay={ref}
                direction={direction}
                lineNumber={numberLine}
                weekdaySelected={weekday}
                colorLineText={colorTextLine}
                colorLine={backgroundColorLine}
              />
            )}
        </View>
      </SafeAreaView>
      {Platform.OS === "ios" && (
        <Modalize ref={ref} adjustToContentHeight disableScrollIfPossible>
          <PickerIOS
            selectedValue={weekday}
            onValueChange={(itemValue) => setWeekday(itemValue)}
          >
            <PickerIOS.Item
              label="Dias Úteis"
              value={JSON.stringify({
                label: "Dias úteis",
                value: 0,
              })}
            />
            <PickerIOS.Item
              label="Sábado"
              value={JSON.stringify({
                label: "Sábado",
                value: 1,
              })}
            />
            <PickerIOS.Item
              label="Domingo"
              value={JSON.stringify({
                label: "Domingo",
                value: 2,
              })}
            />
          </PickerIOS>
        </Modalize>
      )}
    </>
  );
};

export default DetailBusPage;
