import React from "react";
import { ScrollView, View } from "react-native";
import { getToken } from "../auth/auth";
import api from "../../axiosConfig";
import {
  ActivityIndicator,
  Button,
  Divider,
  FAB,
  List,
  Text,
  Title,
} from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";

function AssetTagging(props) {
  const { wo_id, system_id, system_name } = props.route.params;
  const [loading, setLoading] = React.useState(false);
  const [bloading, setBLoading] = React.useState(false);
  const [status, setStatus] = React.useState(false);
  const [assets, setAssets] = React.useState([]);
  const isFocused = useIsFocused();

  const CompleteWO = async () => {
    setBLoading(true);
    api
      .put(
        `/AssetTagging`,
        { id: wo_id },

        {
          headers: { ignistoken: await getToken() },
        }
      )
      .then(async (res) => {
        setBLoading(false);
        alert(res.data.message);
        props.navigation.navigate("WODetails", {
          id: wo_id,
        });
      })

      .catch((err) => {
        setBLoading(false);
        console.log(err);
        if (err.response && err.response.data && err.response.data.message)
          alert(err.response.data.message);
        else alert("Server Error");
      });
  };

  const getAssets = async () => {
    api
      .get(`/AssetTagging/${wo_id}`, {
        headers: { ignistoken: await getToken() },
      })
      .then(async (res) => {
        setLoading(false);
        setAssets(res.data.message.data);
        res.data.message.status === "Completed" ? setStatus(true) : false;
        console.log(res.data.message);
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
    (async () => {
      setLoading(true);
      await getAssets();
    })();
  }, [isFocused]);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          padding: 10,
          margin: 10,
          backgroundColor: "white",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 10,
        }}
      >
        <View>
          <Text variant="titleSmall">System Name</Text>
          <Text>{system_name}</Text>
          <Text style={{ marginTop: 10 }} variant="titleSmall">
            No. of Assets Added
          </Text>
          <Text>{assets.length}</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Button
            onPress={CompleteWO}
            disabled={bloading || status}
            loading={bloading}
            mode="contained"
          >
            {status ? "Completed" : "Complete"}
          </Button>
          {status ? (
            <Button onPress={() => setStatus(false)}>Reopen</Button>
          ) : null}
        </View>
      </View>
      <Title style={{ alignSelf: "center", marginBottom: 5 }}>Assets</Title>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "white",
            borderRadius: 10,
            marginHorizontal: 10,
          }}
        >
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: 10,
            marginHorizontal: 10,
            padding: 5,
          }}
        >
          {assets.map((asset) => {
            return (
              <View key={asset.id}>
                <List.Item
                  onPress={() =>
                    props.navigation.navigate("AssetTaggingView", {
                      asset_id: asset.id,
                      wo_id: wo_id,
                      system_id: system_id,
                      system_name: system_name,
                      status: status,
                    })
                  }
                  title={asset.name}
                  description={`Tag: ${asset.tag}`}
                />
                <Divider />
              </View>
            );
          })}
          <Divider />
        </ScrollView>
      )}
      {status ? null : (
        <FAB
          style={{
            right: 15,
            bottom: 10,
            position: "absolute",
          }}
          label="Add Asset"
          icon="plus"
          onPress={() => {
            props.navigation.navigate("AssetTaggingExec", {
              wo_id: wo_id,
              system_id: system_id,
              system_name: system_name,
            });
          }}
        />
      )}
    </View>
  );
}

export default AssetTagging;
