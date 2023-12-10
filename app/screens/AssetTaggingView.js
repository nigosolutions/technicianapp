import React from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { getToken } from "../auth/auth";
import api from "../../axiosConfig";

function AssetTaggingView(props) {
  const { wo_id, asset_id, system_id, system_name, status } =
    props.route.params;
  const [loading, setLoading] = React.useState(false);
  const [bloading, setBLoading] = React.useState(false);
  const [details, setDetails] = React.useState({});
  const [general_info, setGeneralInfo] = React.useState({});
  const getAssetDetails = async () => {
    api
      .get(`/AssetTagging?asset_id=${asset_id}`, {
        headers: { ignistoken: await getToken() },
      })
      .then(async (res) => {
        setLoading(false);
        console.log(res.data.message);
        setDetails(res.data.message);
        setGeneralInfo(res.data.message.general_info);
      })

      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.response && err.response.data && err.response.data.message)
          alert(err.response.data.message);
        else alert("Server Error");
      });
  };

  const deleteAsset = async () => {
    setBLoading(true);
    api
      .delete(
        `/AssetTagging`,

        {
          headers: { ignistoken: await getToken() },
          data: { id: asset_id, wo_id: wo_id },
        }
      )
      .then(async (res) => {
        setBLoading(false);
        alert(res.data.message);
        props.navigation.navigate("AssetTagging", {
          wo_id: wo_id,
          system_id: system_id,
          system_name: system_name,
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
  React.useEffect(() => {
    (async () => {
      setLoading(true);
      await getAssetDetails();
    })();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View>
          <Card
            elevation={0}
            style={{ backgroundColor: "white", height: "100%" }}
          >
            {details.url ? (
              <Card.Cover
                resizeMode="contain"
                style={{ margin: 10 }}
                source={{ uri: details.url }}
              />
            ) : null}

            <Card.Content style={{ marginVertical: 10, padding: 10 }}>
              <ScrollView>
                <View
                  style={{
                    marginVertical: 5,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text variant="titleMedium">Device Name</Text>
                  <Text variant="bodyLarge">{details.name}</Text>
                </View>
                <View
                  style={{
                    marginVertical: 5,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text variant="titleMedium">System Name</Text>
                  <Text variant="bodyLarge">{system_name}</Text>
                </View>
                <View
                  style={{
                    marginVertical: 5,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text variant="titleMedium">Asset Tag</Text>
                  <Text variant="bodyLarge">{details.tag}</Text>
                </View>
                <View
                  style={{
                    marginVertical: 5,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text variant="titleMedium">Next Service</Text>
                  <Text variant="bodyLarge">
                    {new Date(details.next_service).toLocaleDateString()}
                  </Text>
                </View>

                {Object.keys(general_info).map((field) => {
                  return (
                    <View
                      key={field}
                      style={{
                        marginVertical: 5,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text variant="titleMedium">{field}</Text>
                      <Text variant="bodyLarge">
                        {details.general_info[field]}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </Card.Content>
            {status ? null : (
              <Card.Actions>
                <Button
                  disabled={bloading}
                  loading={bloading}
                  onPress={deleteAsset}
                >
                  Delete Asset
                </Button>
              </Card.Actions>
            )}
          </Card>
        </View>
      )}
    </View>
  );
}

export default AssetTaggingView;
