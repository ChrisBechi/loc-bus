import { Dimensions, StyleSheet } from "react-native";
import { IRouteBus } from "./types";

export const style = StyleSheet.create({
  boxTitle: {
    padding: 10,
    paddingBottom: 20,
    marginBottom: 20,
    borderColor: "#0099e1",
    borderBottomWidth: 1,
    borderRadius: 15,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
  },
  updatedAt: {
    textAlign: "right",
  },
  wrapperBottomUpdate: {
    alignItems: "center",
    marginVertical: 20,
  },
  bottomUpdate: {
    backgroundColor: "#0099e1",
    padding: 15,
    borderRadius: 50,
  },
});

export const itemBusLineStyle = (mtBox: number, data: IRouteBus) => {
  const numberScreen = Dimensions.get("screen").width - 178;

  return StyleSheet.create({
    wrapper: {
      borderColor: `#${data?.route?.route_color || "black"}`,
      borderWidth: 2,
      borderLeftWidth: 15,
      alignItems: "center",
      padding: 10,
      borderRadius: 10,
      marginTop: mtBox || 5,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 15,
    },
    boxInformationLine: {
      flexDirection: "row",
      alignItems: "center",
    },
    shapeIconBus: {
      backgroundColor: "white",
      borderRadius: 50,
      padding: 7,
    },
    iconBus: {
      width: 40,
      height: 40,
    },
    iconSPTrans: {
      width: 35,
      height: 35,
    },
    textLineBus: {
      fontWeight: "bold",
      color: "black",
      fontSize: 16,
    },
    boxText: {
      marginHorizontal: 15,
      width: numberScreen,
    },
    nextBusLabel: {
      textAlign: "right",
      margin: 0,
      padding: 0,
    },
    description: {
      marginTop: 1,
      textTransform: "uppercase",
      fontSize: 14,
    },
    boxTime: {
      backgroundColor: `#${data?.route?.route_color || "black"}`,
      paddingVertical: 3,
      paddingHorizontal: 9,
      borderRadius: 5,
      marginLeft: 3,
    },
    labelTime: {
      color: `#${data?.route?.route_text_color || "black"}`,
      fontWeight: "bold",
    },
  });
};
