import "jsr:@std/dotenv/load";
import { DataSet } from "./src/types/data.ts";
import { Influx } from "./src/util/influx.ts";
import { MQTT } from "./src/util/mqtt.ts";

Influx.connect();

await MQTT.connect((topic: string, msg: string) => {
  console.log(msg, topic, (new Date()).toISOString());
  if (topic !== "sensordata") return;

  const [temperature, rest] = msg.split(",");
  const sensors = rest.split(":") as Array<"dht" | "bme">;

  const dataSet: DataSet = {
    timeStamp: new Date(),
    avgTemp: Number(temperature),
    usedSensors: sensors,
  };

  Influx.writeDataSet(dataSet);
});
