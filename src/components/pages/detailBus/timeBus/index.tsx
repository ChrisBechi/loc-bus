import {
  EOperationStatus,
  EstimatedTravelTime,
  IEstimatedTravelTime,
  IPeriodLineBus,
  getOperationLine,
  getTimeStartBus,
  requestHTMLData,
} from "@/utils/webScraping";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Text,
  View,
} from "react-native";
import { IHandles } from "react-native-modalize/lib/options";
import { ItemValue } from "@react-native-picker/picker/typings/Picker";
import HeaderFlatList, { IItemPicker } from "./headerFlatList";
import ErrorMessage from "@/components/feedback/errorMessage";
import NotOperatedIcon from "@/components/icons/notOperated";

export interface IFrequency {
  created_at: string;
  end_time: string;
  headway_secs: string;
  id: number;
  start_time: string;
  trip_id: string;
}

interface IOwnProps {
  lineNumber: string;
  colorLine: string;
  colorLineText: string;
  weekdaySelected: ItemValue;
  direction: string;
  refWeekDay: React.MutableRefObject<IHandles>;
}

const TimeBusContent: React.FC<IOwnProps> = ({
  lineNumber,
  direction,
  refWeekDay,
  weekdaySelected,
  colorLine,
  colorLineText,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [listBus, setListBus] = useState<IPeriodLineBus[]>([]);
  const [estimatedTime, setEstimatedTime] = useState<IEstimatedTravelTime>({
    header: [],
    times: [],
  });
  const [statusOperation, setStatusOperation] = useState<EOperationStatus>();
  const weekDayName: IItemPicker = JSON.parse(weekdaySelected.toString());

  useEffect(() => {
    setLoading(true);
    const scrapingData = async () => {
      const url = `https://sistemas.sptrans.com.br/PlanOperWeb/detalheLinha.asp`;
      const params = {
        lincod: lineNumber,
        TpDiaID: 0,
        project: "OV",
        TpDiaIDpar: weekDayName.value,
        dfsenid: parseInt(direction) + 1,
      };

      try {
        let html = await requestHTMLData(url, params);
        const estimatedTime = EstimatedTravelTime(html, weekDayName.value);
        setEstimatedTime(estimatedTime);
        const operation = getOperationLine(html, weekDayName.value);
        if (operation === EOperationStatus.NORMAL) {
          const lisTime = getTimeStartBus(html);
          setListBus(lisTime);
          setStatusOperation(EOperationStatus.NORMAL);
        } else if (operation === EOperationStatus.IS_CIRCULAR) {
          if (params.dfsenid === 2) {
            params.dfsenid = 1;
            html = await requestHTMLData(url, params);
          }
          const lisTime = getTimeStartBus(html);
          setListBus(lisTime);
          setStatusOperation(EOperationStatus.IS_CIRCULAR);
        } else if (operation === EOperationStatus.NOT_OPERATED) {
          setListBus([]);
          setStatusOperation(EOperationStatus.NOT_OPERATED);
        }
        setLoading(false);
      } catch (error) {
        setListBus([]);
        setStatusOperation(EOperationStatus.REQUEST_ERROR);
        setLoading(false);
      }
    };

    scrapingData();
  }, [weekdaySelected]);

  return (
    (loading && (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator color="#0099e1" size="large" />
      </View>
    )) || (
      <FlatList
        data={listBus}
        ListHeaderComponent={
          <HeaderFlatList
            {...{
              colorLine,
              colorLineText,
              estimatedTime,
              refWeekDay,
              weekDayName,
              statusOperation,
            }}
          />
        }
        contentContainerStyle={
          statusOperation !== EOperationStatus.NORMAL &&
          statusOperation !== EOperationStatus.IS_CIRCULAR && { flex: 1 }
        }
        stickyHeaderIndices={[0]}
        ListEmptyComponent={
          (statusOperation === EOperationStatus.NOT_OPERATED && (
            <ErrorMessage
              title={`Está linha não opera ${
                weekDayName.value === 0 ? "nos" : "no"
              } ${weekDayName.label}`}
            >
              <NotOperatedIcon />
            </ErrorMessage>
          )) || <ErrorMessage />
        }
        renderItem={({ index, item }) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 15,
            }}
          >
            <View
              style={{
                width: 110,
                paddingRight: 10,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                }}
                key={Math.random()}
              >
                {item.range}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderLeftWidth: 2,
                borderLeftColor: colorLine,
                width: Dimensions.get("window").width - 150,
              }}
            >
              {item.periods.map((period, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: "green",
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    marginRight: 3,
                    borderRadius: 3,
                    flexWrap: "wrap",
                    width: 60,
                    marginVertical: 2,
                  }}
                >
                  <Text
                    style={{
                      color: colorLineText,
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    {period}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      />
    )
  );
};

export default TimeBusContent;
