import React from "react";
import { View } from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Avatar,
  Divider,
  List,
  Searchbar,
  SegmentedButtons,
  Text,
} from "react-native-paper";
import { getToken } from "../auth/auth";
import api from "../../axiosConfig";
import { useIsFocused } from "@react-navigation/native";

function WOHome(props) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState("Pending");
  const [searchQuery, setSearchQuery] = React.useState("");
  const isFocused = useIsFocused();
  const getWorkOrders = async () => {
    api
      .get(
        `/techworkorders?status=${status}&searchText=${searchQuery}&page=1&limit=10`,
        { headers: { ignistoken: await getToken() } }
      )
      .then(async (res) => {
        setLoading(false);
        console.log(res.data.message);
        let datas = res.data.message.map((item) => ({
          id: item.id,
          type: item.type,
          system: item.name,
          building: item.building_name,
          start: new Date(item.wo_start).toDateString(),
          end: new Date(item.wo_end).toDateString(),
        }));
        setData(datas);
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
        await getWorkOrders();
      })();
  }, [searchQuery, status, isFocused]);

  const onChangeSearch = (query) => setSearchQuery(query);
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <Appbar.Header style={{ elevation: 2, backgroundColor: "white" }}>
        <Appbar.Content title="Work Orders" />
      </Appbar.Header>

      <View style={{ padding: 10 }}>
        <SegmentedButtons
          value={status}
          onValueChange={setStatus}
          buttons={[
            {
              value: "Pending",
              label: "Pending",
            },
            {
              value: "In Progress",
              label: "In Progress",
            },
            { value: "Completed", label: "Completed" },
          ]}
        />
        <Searchbar
          style={{ marginVertical: 10 }}
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
      </View>
      {loading === true ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        data.map((wo) => (
          <View key={wo.id}>
            <List.Item
              descriptionNumberOfLines={4}
              style={{ paddingHorizontal: 10 }}
              onPress={() => {
                props.navigation.navigate("WODetails", { id: wo.id });
              }}
              title={wo.system}
              description={`${wo.building}\nWO: ${wo.id}\nType: ${wo.type}`}
              left={(props) =>
                status === "Pending" ? (
                  <Avatar.Icon
                    color="rgba(255, 182, 72,1)"
                    style={{ backgroundColor: "rgba(255, 182, 72, 0.2)" }}
                    size={40}
                    icon="exclamation-thick"
                  />
                ) : status === "Completed" ? (
                  <Avatar.Icon
                    color="rgba(75, 222, 151, 1)"
                    style={{ backgroundColor: "rgba(75, 222, 151, 0.2)" }}
                    size={40}
                    icon="check-bold"
                  />
                ) : (
                  <Avatar.Icon
                    color="rgba(47, 73, 209,1)"
                    style={{ backgroundColor: "rgba(47, 73, 209, 0.2)" }}
                    size={40}
                    icon="progress-clock"
                  />
                )
              }
              right={(props) => (
                <View
                  {...props}
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <Text variant="bodySmall">{wo.start}</Text>
                </View>
              )}
            />
            <Divider />
          </View>
        ))
      )}
    </View>
  );
}

export default WOHome;
