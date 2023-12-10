import React from "react";
import { ScrollView, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Chip,
  List,
} from "react-native-paper";
import { getToken } from "../auth/auth";
import api from "../../axiosConfig";

function WOITMView(props) {
  const { wo_id, asset_id } = props.route.params;
  const [loading, setLoading] = React.useState(false);
  const [details, setDetails] = React.useState({});

  const getAssetDetails = async () => {
    api
      .get(`/ITMView?wo_id=${wo_id}&asset_id=${asset_id}`, {
        headers: { ignistoken: await getToken() },
      })
      .then(async (res) => {
        setLoading(false);
        console.log(res.data.message);
        setDetails(res.data.message);
      })

      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.response && err.response.data && err.response.data.message)
          alert(err.response.data.message);
        else alert("Server Error");
      });
  };

  const resetResults = async () => {
    api
      .post(
        `/ITMView`,
        {
          wo_id: details.wo_id,
          asset_id: details.asset_id,
          itm_id: details.id,
        },
        {
          headers: { ignistoken: await getToken() },
        }
      )
      .then(async (res) => {
        setLoading(false);
        alert(res.data.message);
        props.navigation.navigate("WOITM", { wo_id: wo_id });
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

            <Card.Content style={{ marginVertical: 10 }}>
              <ScrollView>
                {(details.result ? details.result : []).map((result) => {
                  let description;
                  if (result.type === "condition") {
                    if (result.condition === "in_between")
                      description = `${result.value} (Reference Range: ${result.condition_value_1}-${result.condition_value_2})`;
                    else if (result.condition === "greater_than")
                      description = `${result.value} (Reference Range: >${result.condition_value})`;
                    else if (result.condition === "less_than")
                      description = `${result.value} (Reference Range: <${result.condition_value})`;
                  } else description = result.value;
                  return (
                    <List.Item
                      key={result.name}
                      title={`${result.name}`}
                      description={description}
                      right={(props) =>
                        result.type === "condition" ||
                        result.type === "boolean" ? (
                          result.result ? (
                            <Avatar.Icon
                              color="rgba(0, 150, 0, 1)"
                              style={{
                                backgroundColor: "rgba(75, 222, 151, 0.2)",
                                alignSelf: "center",
                              }}
                              size={30}
                              icon="check-bold"
                            />
                          ) : (
                            <Avatar.Icon
                              color="rgba(251, 0, 0, 1)"
                              style={{
                                backgroundColor: "rgba(251, 0, 0, 0.2)",
                                alignSelf: "center",
                              }}
                              size={30}
                              icon="close"
                            />
                          )
                        ) : null
                      }
                    />
                  );
                })}

                <List.Item title={`Remarks`} description={details.remarks} />
                <List.Item
                  title={`ITM Result`}
                  right={(props) =>
                    details.pass ? (
                      <Chip
                        textStyle={{ color: "rgba(0, 150, 0, 1)" }}
                        style={{
                          backgroundColor: "rgba(75, 222, 151, 0.2)",
                          alignSelf: "center",
                        }}
                      >
                        PASS
                      </Chip>
                    ) : (
                      <Chip
                        textStyle={{ color: "rgba(251, 0, 0, 1)" }}
                        style={{
                          backgroundColor: "rgba(251, 0, 0, 0.2)",
                          alignSelf: "center",
                        }}
                      >
                        FAIL
                      </Chip>
                    )
                  }
                />
              </ScrollView>
              <Button
                onPress={resetResults}
                style={{ margin: 10 }}
                mode="outlined"
              >
                Reset Results
              </Button>
            </Card.Content>
          </Card>
        </View>
      )}
    </View>
  );
}

export default WOITMView;
