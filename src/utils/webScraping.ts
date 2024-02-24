import axios from "axios";
import he from "he";

interface IParamsTimeBus {
  project: string;
  lincod: string;
  TpDiaID: number;
  dfsenid: number;
}

const removeTrash = (item: string): string => {
  const getIndexOfSymbol = item.indexOf(">") + 1;

  return item.slice(getIndexOfSymbol, -1);
};

const getLinesTable = (table: string) => {
  let separateLines = removeTrash(table).split("<tr");
  const separateAllLines = separateLines
    .filter((lines) => lines[1])
    .map((formated) => removeTrash(formated).split("</tr>")[0]);

  return separateAllLines;
};

const getColumnsTable = (lines: string, isHeader?: boolean) => {
  const tag = isHeader ? "th" : "td";
  let getValueColumn = lines.split(`<${tag}`);
  const separateAllLines = getValueColumn
    .filter((column) => column[1])
    .map((formated) => he.decode(removeTrash(formated).split(`</${tag}>`)[0]));

  return separateAllLines;
};

export const requestHTMLData = async (url: string, params: IParamsTimeBus) => {
  let textPageHtml = "";
  await axios
    .get(url, {
      params,
    })
    .then((response) => {
      textPageHtml = response.data;
    })
    .catch((error) => {
      textPageHtml = error.response.data;
    });

  return textPageHtml;
};

const getTableSPTransPage = (textPageHtml: string) => {
  const getBodyPage = textPageHtml.split("<body")[1];
  const getStartTable = getBodyPage.split("<table");
  const table = getStartTable.slice(1, -1).map((tag, idx) => {
    return tag.split("</table>")[0];
  });

  return table;
};

export interface IPeriodLineBus {
  periods: string[];
  range: string;
}

export const getTimeStartBus = (htmlPage: string) => {
  const table = getTableSPTransPage(htmlPage);
  const lines = getLinesTable(table[2]);
  lines.shift();
  const listPeriodLineBus: IPeriodLineBus[] = [];
  lines.forEach((item) => {
    const times = getColumnsTable(item).toString();
    const timeWithTrash = removeTrash(times).split("<span");
    const timesCleared = timeWithTrash.map((time) => {
      const clearTime = time.split("</span")[0];
      if (clearTime.includes(">")) {
        return clearTime.split(">")[1];
      } else {
        return clearTime;
      }
    });
    const objectPeriodLineBus = {
      periods: timesCleared,
      range: times.split(",")[0],
    };

    listPeriodLineBus.push(objectPeriodLineBus);
  });

  return listPeriodLineBus;
};

export enum EOperationStatus {
  NORMAL = 0,
  NOT_OPERATED = 1,
  IS_CIRCULAR = 2,
  REQUEST_ERROR = 3,
}

export const getOperationLine = (
  htmlPage: string,
  selectedDay: number
): EOperationStatus => {
  const table = getTableSPTransPage(htmlPage);
  const lines = getLinesTable(table[0]);
  const columns = getColumnsTable(lines[selectedDay + 1]);
  const start: string = columns[1];
  const back: string = columns[2];

  if (start === "N�o Opera" || start === "Não Opera") {
    return EOperationStatus.NOT_OPERATED;
  } else if (back.trim() === "0" || back.trim() === "-") {
    return EOperationStatus.IS_CIRCULAR;
  }

  return EOperationStatus.NORMAL;
};

export interface IEstimatedTravelTime {
  header: string[];
  times: string[];
}

export const EstimatedTravelTime = (
  htmlPage: string,
  selectedDay: number
): IEstimatedTravelTime => {
  const table = getTableSPTransPage(htmlPage);
  const lines = getLinesTable(table[3]);
  const header = getColumnsTable(lines[1], true);
  const removeHeader = lines.slice(2);
  const times = getColumnsTable(removeHeader[selectedDay]).slice(1);

  return {
    header,
    times,
  };
};
