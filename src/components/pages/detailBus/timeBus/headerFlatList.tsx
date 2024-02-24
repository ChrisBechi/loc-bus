import { convertSecondsToHour } from "@/utils/convertTime";
import { EOperationStatus, IEstimatedTravelTime } from "@/utils/webScraping";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { IHandles } from "react-native-modalize/lib/options";
import Ionicon from "react-native-vector-icons/Ionicons";
import CircularBusIcon from "@/components/icons/circularBus";

export interface IItemPicker {
  label: string;
  value: number;
}

interface IOwnProps {
  colorLine: string;
  colorLineText: string;
  estimatedTime: IEstimatedTravelTime;
  refWeekDay: React.MutableRefObject<IHandles>;
  weekDayName: IItemPicker;
  statusOperation: EOperationStatus;
}

const HeaderFlatList: React.FC<IOwnProps> = ({
  colorLine,
  colorLineText,
  estimatedTime,
  refWeekDay,
  weekDayName,
  statusOperation,
}) => {
  return (
    <View style={{ backgroundColor: "#f0f0f0" }}>
      <View>
        <Text
          style={{
            textAlign: "center",
            marginBottom: 3,
            fontSize: 14,
            paddingVertical: 4,
            fontWeight: "bold",
          }}
        >
          Tempo estimado das viagens{" "}
        </Text>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <View
            style={{
              marginRight: 1,
              flex: 1,
              borderRadius: 10,
              overflow: "hidden",
              borderColor: colorLine,
              borderWidth: 2,
            }}
          >
            <View
              style={{
                borderBottomColor: colorLineText,
                borderBottomWidth: 1,
                padding: 5,
                backgroundColor: colorLine,
              }}
            >
              <Text style={{ textAlign: "center", color: colorLineText }}>
                Partida
              </Text>
            </View>

            <View style={{ padding: 4 }}>
              <View style={{ flexDirection: "row" }}>
                {estimatedTime.header.slice(0, 3).map((time, idx) => (
                  <View
                    key={idx}
                    style={{
                      flex: 1,
                      paddingVertical: 5,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "black",
                      }}
                    >
                      {time.trim()}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: "row" }}>
                {estimatedTime.times.slice(0, 3).map((time, idx) => (
                  <View
                    key={idx}
                    style={{
                      flex: 1,
                      paddingVertical: 5,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "black",
                      }}
                    >
                      {convertSecondsToHour(time.trim())}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          {(statusOperation !== EOperationStatus.IS_CIRCULAR && (
            <View
              style={{
                marginLeft: 1,
                flex: 1,
                borderRadius: 10,
                overflow: "hidden",
                borderColor: colorLine,
                borderWidth: 2,
              }}
            >
              <View
                style={{
                  borderBottomColor: colorLineText,
                  borderBottomWidth: 1,
                  padding: 5,
                  backgroundColor: colorLine,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: colorLineText,
                  }}
                >
                  Retorno
                </Text>
              </View>
              <View style={{ padding: 4 }}>
                <View style={{ flexDirection: "row" }}>
                  {estimatedTime.header.slice(3).map((time, idx) => (
                    <View
                      key={idx}
                      style={{
                        flex: 1,
                        paddingVertical: 5,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: "black",
                        }}
                      >
                        {time.trim()}
                      </Text>
                    </View>
                  ))}
                </View>
                <View style={{ flexDirection: "row" }}>
                  {estimatedTime.times.slice(3).map((time, idx) => (
                    <View
                      key={idx}
                      style={{
                        flex: 1,
                        paddingVertical: 5,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: "black",
                        }}
                      >
                        {convertSecondsToHour(time.trim())}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )) || (
            <View
              style={{
                marginLeft: 1,
                borderRadius: 10,
                overflow: "hidden",
                borderColor: colorLine,
                borderWidth: 2,
              }}
            >
              <View
                style={{
                  borderBottomColor: colorLineText,
                  borderBottomWidth: 1,
                  padding: 5,
                  backgroundColor: colorLine,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: colorLineText,
                  }}
                >
                  Ônibus circular
                </Text>
              </View>
              <CircularBusIcon sizeIconBus={23} sizeIconCircular={57} />
            </View>
          )}
        </View>
      </View>
      <View
        style={{
          alignItems: "center",
          borderBottomColor: colorLine,
          borderBottomWidth: 2,
          paddingVertical: 15,
        }}
      >
        <TouchableOpacity
          onPress={() => refWeekDay.current.open()}
          style={{
            width: 250,
            paddingLeft: 10,
            paddingRight: 5,
            paddingVertical: 5,
            borderColor: colorLine,
            borderRadius: 5,
            borderWidth: 2,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicon size={20} name="calendar-outline" />
          <Text style={{ marginLeft: 8, flex: 1 }}>{weekDayName.label}</Text>
          <Ionicon size={20} name="chevron-down" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderFlatList;
