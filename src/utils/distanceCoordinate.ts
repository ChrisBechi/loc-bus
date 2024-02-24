export enum EUnitCordinate {
  MILHAS = "M",
  KILOMETROS = "K",
  MILHAS_NAUTICAS = "N",
}

export function distanceCoordinate(
  initial_lat: number,
  initial_lon: number,
  end_lat: number,
  end_lon: number,
  unit: EUnitCordinate
) {
  if (initial_lat == end_lat && initial_lon == end_lon) {
    return 0;
  } else {
    const radlat1 = (Math.PI * initial_lat) / 180;
    const radlat2 = (Math.PI * end_lat) / 180;
    const theta = initial_lon - end_lon;
    const radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === "K") {
      dist = dist * 1.609344;
    }
    if (unit === "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
}
