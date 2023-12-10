import dayjs from "dayjs";
import React from "react";
import { View, Dimensions } from "react-native";
import { Calendar, modeToNum } from "react-native-big-calendar";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Surface,
  Text,
} from "react-native-paper";

const windowHeight = Dimensions.get("window").height;
import { getUser, getToken } from "../auth/auth";
import api from "../../axiosConfig";

function Dashboard(props) {
  const [user, setUser] = React.useState({});
  const [pending, setPending] = React.useState(0);
  const [completed, setCompleted] = React.useState(0);
  const [inprogress, setInprogress] = React.useState(0);
  const [schedule, setSchedule] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const getDash = async () => {
    let user = await getUser();
    setUser(user);

    api
      .get(`/dashboard`, { headers: { ignistoken: await getToken() } })
      .then(async (res) => {
        setLoading(false);
        console.log(res.data.message);
        res.data.message.data.map((data) => {
          data.status === "Pending"
            ? setPending(data.count)
            : data.status === "Completed"
            ? setCompleted(data.count)
            : setInprogress(data.count);
        });
        let schedule = res.data.message.events.map((item) => ({
          id: item.id,
          title: `${item.id}: ${item.name}(${item.building_name})`,
          start: new Date(item.wo_start),
          end: new Date(item.wo_end),
          status: item.status,
        }));
        setSchedule(schedule);
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
      await getDash();
    })();
  }, []);

  const today = new Date();
  const [date, setDate] = React.useState(today);

  const _onPrevDate = () => {
    setDate(
      dayjs(date)
        .add(modeToNum("week", date) * -1, "day")
        .toDate()
    );
  };

  const _onNextDate = () => {
    setDate(dayjs(date).add(modeToNum("week", date), "day").toDate());
  };
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ elevation: 2, backgroundColor: "white" }}>
        <Appbar.Content title={"Dashboard (Hi " + user.name + ")"} />
      </Appbar.Header>
      {loading === true ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      ) : (
        <View>
          <View
            style={{
              backgroundColor: "white",
              margin: 5,
              borderRadius: 10,
            }}
          >
            <Text
              style={{ margin: 10, marginVertical: 10 }}
              variant="titleMedium"
            >
              Work Orders
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-evenly" }}
            >
              <View
                style={{
                  margin: 10,
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: "rgba(255, 182, 72, 0.2)",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "rgba(255, 120, 0,1)" }}
                  variant="headlineMedium"
                >
                  {pending}
                </Text>
                <Text style={{ color: "rgba(255, 120, 0,1)" }}>Pending</Text>
              </View>
              <View
                style={{
                  margin: 10,
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: "rgba(47, 73, 209, 0.2)",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "rgba(47, 73, 209,1)" }}
                  variant="headlineMedium"
                >
                  {inprogress}
                </Text>
                <Text style={{ color: "rgba(47, 73, 209,1)" }}>
                  In Progress
                </Text>
              </View>
              <View
                style={{
                  margin: 10,
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: "rgba(75, 222, 151, 0.2)",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "rgba(0, 150, 0, 1)" }}
                  variant="headlineMedium"
                >
                  {completed}
                </Text>
                <Text style={{ color: "rgba(0, 150, 0, 1)" }}>Completed</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "white",
              margin: 5,
              borderRadius: 10,
            }}
          >
            <Text
              style={{ margin: 10, marginVertical: 10 }}
              variant="titleMedium"
            >
              Schedule
            </Text>
            <Surface
              style={{
                backgroundColor: "white",
                marginHorizontal: 10,
                borderRadius: 10,
                padding: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 2,
                  marginBottom: 20,
                }}
              >
                <Button
                  mode="outlined"
                  icon={"chevron-left"}
                  onPress={_onPrevDate}
                />

                <Text variant="bodyLarge">
                  {dayjs(date).format("MMMM YYYY")}
                </Text>

                <Button
                  mode="outlined"
                  icon={"chevron-right"}
                  onPress={_onNextDate}
                />
              </View>
              <Calendar
                onPressEvent={(item) =>
                  props.navigation.navigate("Work Orders", {
                    screen: "WODetails",
                    params: {
                      id: item.id,
                    },
                  })
                }
                eventCellStyle={(item) => {
                  return item.status === "Pending"
                    ? { backgroundColor: "tomato" }
                    : item.status === "Completed"
                    ? { backgroundColor: "green" }
                    : null;
                }}
                swipeEnabled={false}
                events={schedule}
                date={date}
                height={windowHeight}
              />
            </Surface>
          </View>
        </View>
      )}
    </View>
  );
}

export default Dashboard;
