import {
  InfluxDB,
  Point,
  WriteApi,
} from "https://cdn.skypack.dev/@influxdata/influxdb-client-browser?dts";
import { DataSet } from "../types/data.ts";

let client: InfluxDB | null = null;
let writeClient: WriteApi | null = null;

const connect = () => {
  const url = Deno.env.get("INFLUX_URL");
  const token = Deno.env.get("INFLUX_TOKEN");
  const org = Deno.env.get("INFLUX_ORG");
  const bucket = Deno.env.get("INFLUX_BUCKET");

  if (!url || !token || !org || !bucket) {
    throw new Error("Env config missing... ");
  }

  client = new InfluxDB({ url, token });
  writeClient = client.getWriteApi(org, bucket, "ns");
};

const writeDataSet = (dataSet: DataSet) => {
  if (!writeClient) {
    console.error("No write client...");
    return;
  }

  const point = new Point("temperature")
    .tag("sensor", dataSet.usedSensors.join(":"))
    .floatField("value", dataSet.avgTemp)
    .timestamp(dataSet.timeStamp);

  writeClient.writePoint(point);
  writeClient.flush();
};

export const Influx = {
  writeDataSet,
  connect,
};
