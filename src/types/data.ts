export interface DataSet {
  timeStamp: Date;
  usedSensors: Array<"dht" | "bme">;
  avgTemp: number;
}
