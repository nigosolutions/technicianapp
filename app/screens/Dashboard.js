import dayjs from "dayjs";
import React from "react";
import { SafeAreaView, View, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import Calendar, { modeToNum } from "react-native-big-calendar";
import { Appbar, Button, Surface, Text } from "react-native-paper";
const screenWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function Dashboard(props) {
  const data = [
    {
      name: "Pending",
      population: 52,
      color: "rgba(255, 182, 72,1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "In Progress",
      population: 20,
      color: "rgba(47, 73, 209,1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Completed",
      population: 28,
      color: "rgba(75, 222, 151, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];
  const events = [
    {
      title: "Meeting",
      start: new Date(2020, 1, 11, 10, 0),
      end: new Date(2020, 1, 11, 10, 30),
    },
    {
      title: "Coffee break",
      start: new Date(2020, 1, 11, 15, 45),
      end: new Date(2020, 1, 11, 16, 30),
    },
  ];

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
    <View
      style={{
        borderRadius: 10,
      }}
    >
      <Appbar.Header>
        <Appbar.Content title="Dashboard" />
      </Appbar.Header>

      <PieChart
        data={data}
        width={screenWidth}
        height={0.2 * windowHeight}
        chartConfig={{
          backgroundGradientFrom: "white",
          backgroundGradientTo: "white",
          color: (opacity = 1, _index) => `rgba(0,0,0,${opacity})`,
        }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        absolute
      />

      <Text style={{ margin: 10, marginVertical: 10 }} variant="titleMedium">
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
          <Button mode="outlined" icon={"chevron-left"} onPress={_onPrevDate} />

          <Text variant="bodyLarge">{dayjs(date).format("MMMM YYYY")}</Text>

          <Button
            mode="outlined"
            icon={"chevron-right"}
            onPress={_onNextDate}
          />
        </View>
        <Calendar
          swipeEnabled={false}
          events={events}
          date={date}
          height={0.53 * windowHeight}
        />
      </Surface>
    </View>
  );
}

export default Dashboard;
