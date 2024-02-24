import { Dimensions, StyleSheet } from "react-native";

export const styleDefination = (
  colorLine: string,
  colorFontLine: string,
  finishBorderRadius: boolean
) => {
  return StyleSheet.create({
    wrapperListItinerary: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    boxInformation: {
      width: Dimensions.get("window").width - 70,
      flexDirection: "row",
      height: "100%",
      paddingTop: 10,
      paddingRight: 5,
      borderBottomWidth: finishBorderRadius ? undefined : 1,
      borderColor: finishBorderRadius ? undefined : "lightgray",
    },
    boxLabel: {
      justifyContent: "center",
      flex: 1,
      paddingHorizontal: 5,
      paddingLeft: 6,
    },
    wrapperTimeLine: {
      width: 60,
      alignItems: "center",
      justifyContent: "center",
    },
    timeLine: {
      width: 5,
      position: "absolute",
      height: "100%",
      backgroundColor: colorLine,
      borderBottomLeftRadius: finishBorderRadius ? 5 : 0,
      borderBottomRightRadius: finishBorderRadius ? 5 : 0,
    },
    boxArrowDown: {
      width: 45,
      height: 45,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: colorLine,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
    },
    boldLabel: {
      fontWeight: "bold",
    },
    nextBusLabel: {
      textAlign: "right",
      margin: 0,
      padding: 0,
    },
    boxTime: {
      backgroundColor: `${colorLine || "black"}`,
      paddingVertical: 3,
      paddingHorizontal: 9,
      borderRadius: 5,
      marginLeft: 3,
    },
    labelTime: {
      color: `${colorFontLine || "black"}`,
      fontWeight: "bold",
    },
  });
};

export const styleHeader = (lineColor: string) => {
  return StyleSheet.create({
    wrapperHeader: {
      backgroundColor: "#f2f2f2",
    },
    wrapperHeaderSubInfo: {
      flexDirection: "row",
      paddingRight: 5,
      paddingTop: 5,
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
    buttonSeeRoute: {
      borderRadius: 5,
      marginLeft: 5,
      paddingVertical: 5,
      paddingHorizontal: 20,
      backgroundColor: lineColor,
    },
  });
};
