import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { ScrollView, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Divider,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { getToken } from "../auth/auth";
import api from "../../axiosConfig";

function WOITM(props) {
  const { wo_id } = props.route.params;
  const [pending_procedures, setPendingProcedures] = React.useState([]);
  const [completed_procedures, setCompletedProcedures] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const getPendingProcedures = async () => {
    api
      .get(`/ITM?wo_id=${wo_id}`, {
        headers: { ignistoken: await getToken() },
      })
      .then(async (res) => {
        setLoading(false);
        console.log(res.data.message);
        setPendingProcedures(res.data.message.pprocedures);
        setCompletedProcedures(res.data.message.cprocedures);
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
      await getPendingProcedures();
    })();
  }, [props.route]);

  const Tab = createMaterialTopTabNavigator();

  const Pending = () => {
    if (loading)
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      );
    else
      return !pending_procedures.length ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No Pending Procedures!</Text>
          <Button onPress={() => props.navigation.navigate("WOHome")}>
            Go Back to Work Orders
          </Button>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          {pending_procedures.map((procedure) => {
            return (
              <View key={procedure.id}>
                <TouchableRipple
                  key={procedure.id}
                  onPress={() => {
                    props.navigation.navigate("WOITMExec", {
                      wo_id: wo_id,
                      procedure_id: procedure.id,
                    });
                  }}
                  rippleColor="rgba(0, 0, 0, .32)"
                >
                  <View
                    style={{
                      flexDirection: "row",
                      padding: 10,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{ marginHorizontal: 20, flexDirection: "column" }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ flex: 1 }} variant="titleMedium">
                          {procedure.procedure}
                        </Text>
                      </View>
                      <Text variant="bodyLarge">
                        {"Activity: " + procedure.activity}
                      </Text>
                      <Text variant="bodyLarge">{"AHJ: " + procedure.ahj}</Text>
                    </View>
                  </View>
                </TouchableRipple>
                <Divider />
              </View>
            );
          })}
        </ScrollView>
      );
  };
  const Completed = () => {
    if (loading)
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      );
    else
      return (
        <ScrollView style={{ flex: 1 }}>
          {completed_procedures.map((procedure) => {
            return (
              <View key={procedure.id}>
                <TouchableRipple
                  onPress={() => {
                    props.navigation.navigate("WOITMView", {
                      wo_id: wo_id,
                      procedure_id: procedure.id,
                    });
                  }}
                  rippleColor="rgba(0, 0, 0, .32)"
                >
                  <View
                    style={{
                      flexDirection: "row",
                      padding: 10,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{ marginHorizontal: 20, flexDirection: "column" }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ flex: 1 }} variant="titleMedium">
                          {procedure.procedure}
                        </Text>
                      </View>
                      <Text variant="bodyLarge">
                        {"Activity: " + procedure.activity}
                      </Text>
                      <Text variant="bodyLarge">{"AHJ: " + procedure.ahj}</Text>
                    </View>
                  </View>
                </TouchableRipple>
                <Divider />
              </View>
            );
          })}
        </ScrollView>
      );
  };
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator sceneContainerStyle={{ backgroundColor: "white" }}>
        <Tab.Screen name="Pending" component={Pending} />
        <Tab.Screen name="Completed" component={Completed} />
      </Tab.Navigator>
    </View>
  );
}

export default WOITM;
