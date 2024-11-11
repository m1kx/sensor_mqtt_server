import { Mqtt, MqttClient } from "jsr:@ymjacky/mqtt5";

export let client: MqttClient | null = null;

const connect = async (
  onMessageReceived: (msg: string, topic: string) => void,
) => {
  const username = Deno.env.get("MQTT_USER") ?? null;
  const password = Deno.env.get("MQTT_PASS") ?? null;
  const url = Deno.env.get("MQTT_URL") ?? null

  if (!username || !password || !url) {
    console.error("Missing env vars...", username, password, url);
    Deno.exit(-1);
  }

  client = new MqttClient({
    url: new URL(url),
    clientId: "server",
    username,
    password,
    clean: true,
    protocolVersion: Mqtt.ProtocolVersion.MQTT_V5,
  });
  await client.connect();

  const decoder = new TextDecoder();
  client.on("publish", (event) => {
    const packet = event.detail;
    const receiveMessage = decoder.decode(packet.payload);
    onMessageReceived(packet.topic, receiveMessage);
  });

  await client.subscribe("sensordata", Mqtt.QoS.AT_LEAST_ONCE);
};

export const MQTT = {
  connect,
};
