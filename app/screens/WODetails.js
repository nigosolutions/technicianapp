import React from "react";
import { ScrollView, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  ActivityIndicator,
  Badge,
  Button,
  FAB,
  ProgressBar,
  Text,
} from "react-native-paper";
import { getToken } from "../auth/auth";
import api from "../../axiosConfig";
import { useIsFocused } from "@react-navigation/native";

function WODetails(props) {
  const { id } = props.route.params;
  const [data, setData] = React.useState({});
  const [wo, setWO] = React.useState({});
  const [message_count, setMessageCount] = React.useState(0);
  const [pendingcount, setPendingCount] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [completedcount, setCompletedCount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const isFocused = useIsFocused();
  const getWorkOrder = async () => {
    api
      .get(`/techworkorders/${id}`, {
        headers: { ignistoken: await getToken() },
      })
      .then(async (res) => {
        setLoading(false);
        console.log(res.data.message);
        let wo = res.data.message.data;
        let employees = res.data.message.employees;
        let resources = res.data.message.resources;
        setMessageCount(res.data.message.message_count.count);
        let pprocedures, cprocedures;
        !wo.pending_procedures
          ? (pprocedures = [])
          : (pprocedures = wo.pending_procedures);
        !wo.completed_procedures
          ? (cprocedures = [])
          : (cprocedures = wo.completed_procedures);
        setPendingCount(pprocedures.length);
        setCompletedCount(cprocedures.length);
        setProgress(
          !(pprocedures.length + cprocedures.length)
            ? 0
            : cprocedures.length / (pprocedures.length + cprocedures.length)
        );
        if (wo.notification_type === "Asset Tagging") {
          setWO(wo);
          setData({
            WO: id,
            Type: wo.notification_type,
            Status: wo.wo_status,
            Description: wo.description,
            "Notification ID": wo.notification_id,
            "Contract ID": wo.contract_id,
            "System Name": wo.name,
            "Building Name": wo.building_name,
            "Building Area": wo.building_area,
            "Contact No.": wo.contact_number,
            "Assigned Employees": employees.map(
              (employee) => `${employee.full_name}\n`
            ),
            "Assigned Resources": resources.map(
              (resource) => `${resource.name}\n`
            ),
            Address:
              "Building: " +
              wo.building_no +
              ",\nStreet: " +
              wo.street_no +
              ",\nZone: " +
              wo.zone_no,
          });
        } else
          setData({
            WO: id,
            Type: wo.notification_type,
            Status: wo.status,
            Description: wo.description,
            "Notification ID": wo.notification_id,
            "Contract ID": wo.contract_id,
            "No. of Procedures": pprocedures.length + cprocedures.length,
            "System Name": wo.name,
            "Building Name": wo.building_name,
            "Building Area": wo.building_area,
            "Contact No.": wo.contact_number,
            "Assigned Employees": employees.map(
              (employee) => `${employee.full_name}\n`
            ),
            "Assigned Resources": resources.map(
              (resource) => `${resource.name}\n`
            ),
            Address:
              "Building: " +
              wo.building_no +
              ",\nStreet: " +
              wo.street_no +
              ",\nZone: " +
              wo.zone_no,
          });
      })

      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.response && err.response.data && err.response.data.message)
          alert(err.response.data.message);
        else alert("Server Error");
      });
  };

  React.useEffect(() => {
    isFocused &&
      (async () => {
        setLoading(true);
        await getWorkOrder();
      })();
  }, [isFocused]);
  return loading === true ? (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
        padding: 20,
      }}
    >
      <ScrollView>
        {Object.keys(data).map((keyd) => {
          return (
            <View
              key={keyd}
              style={{
                marginVertical: 5,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: "grey" }} variant="bodyLarge">
                {keyd}
              </Text>

              <Text variant="bodyLarge">{data[keyd]}</Text>
            </View>
          );
        })}

        <View
          style={{
            borderRadius: 10,
            marginVertical: 10,
            backgroundColor: "rgba(0, 0, 0, .05)",
            padding: 5,
          }}
        >
          <MapView
            width={"100%"}
            height={200}
            region={{
              latitude: 25.1986,
              longitude: 51.5071,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: 25.1986,
                longitude: 51.5071,
              }}
              title={"Barwa City"}
              description={"Mesaimeer"}
            />
          </MapView>
        </View>
      </ScrollView>
      {data.Type === "Asset Tagging" ? (
        <View>
          <View
            style={{
              backgroundColor: "rgb(237, 221, 246)",
              marginVertical: 20,
              borderRadius: 10,
              padding: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text variant="bodyLarge">No. of Assets Added</Text>
            <Text variant="bodyLarge">{completedcount}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Button
              onPress={() => {
                props.navigation.navigate("AssetTagging", {
                  wo_id: id,
                  system_id: wo.system_id,
                  system_name: wo.name,
                });
              }}
              style={{ flex: 3 / 4, marginBottom: 7 }}
              mode="contained"
            >
              {data.Status === "Pending"
                ? "Start"
                : data.Status === "In Progress"
                ? "Continue"
                : "View"}
            </Button>
          </View>
        </View>
      ) : (
        <View>
          <View style={{ marginBottom: 30 }}>
            <View
              style={{
                marginVertical: 5,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: "grey" }} variant="bodyLarge">
                Progress
              </Text>
              <Text variant="bodyLarge">
                {completedcount + "/" + (completedcount + pendingcount)}
              </Text>
            </View>

            <ProgressBar progress={progress} />
          </View>

          <View style={{ flexDirection: "row" }}>
            <Button
              onPress={() => {
                props.navigation.navigate("WOITM", {
                  wo_id: id,
                });
              }}
              style={{ flex: 3 / 4, marginBottom: 7 }}
              mode="contained"
            >
              {progress === 1 ? "View" : progress === 0 ? "Start" : "Continue"}
            </Button>
          </View>
        </View>
      )}
      <View>
        <FAB
          style={{
            right: 0,
            bottom: 0,
            position: "absolute",
          }}
          icon="chat"
          onPress={() => {
            props.navigation.navigate("Messages", { id: id });
          }}
        />
        {message_count === "0" ? null : (
          <Badge
            style={{
              right: 0,
              bottom: 40,
              position: "absolute",
            }}
          >
            {message_count}
          </Badge>
        )}
      </View>
    </View>
  );
}

export default WODetails;
