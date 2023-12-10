import React from "react";
import { Calendar, modeToNum } from "react-native-big-calendar";
import dayjs from "dayjs";
import { getToken } from "../auth/auth";
import { View } from "react-native";
import { ActivityIndicator, Appbar, Button, Text } from "react-native-paper";
import api from "../../axiosConfig";

function Schedule(props) {
  const [schedule, setSchedule] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      getSchedule();
    })();
  }, []);

  const getSchedule = async () => {
    setLoading(true);
    api
      .get(`/dashboard`, {
        headers: { ignistoken: await getToken() },
      })
      .then((res) => {
        setLoading(false);
        let schedule = res.data.message.events.map((item) => ({
          id: item.id,
          title: `${item.id}: ${item.name}(${item.building_name})`,
          start: new Date(item.wo_start),
          end: new Date(item.wo_end),
          status: item.status,
        }));
        setSchedule(schedule);
        console.log(schedule);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.response && err.response.data && err.response.data.message)
          alert(err.response.data.message);
        else alert("Server Error");
      });
  };
  const today = new Date();

  const [date, setDate] = React.useState(today);

  const _onPrevDate = () => {
    setDate(
      dayjs(date)
        .add(dayjs(date).date() * -1, "day")
        .toDate()
    );
  };

  const _onNextDate = () => {
    setDate(dayjs(date).add(modeToNum("month", date), "day").toDate());
  };

  const _onToday = () => {
    setDate(today);
  };
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ elevation: 2, backgroundColor: "white" }}>
        <Appbar.Content title={"Schedule"} />
      </Appbar.Header>
      {loading === true ? (
        <View style={{ justifyContent: "center", flex: 1 }}>
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <View
          style={{
            padding: 10,
            marginTop: 2,
            backgroundColor: "white",
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
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

            <Text variant="bodyLarge">{dayjs(date).format("MMMM YYYY")}</Text>

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
            showAdjacentMonths
            date={date}
            events={schedule}
            height={100}
            mode="month"
          />
        </View>
      )}
    </View>
  );
}

export default Schedule;
