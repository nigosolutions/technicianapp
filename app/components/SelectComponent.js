import React from "react";
import { View } from "react-native";
import { Appbar, Divider, List, Searchbar, Text } from "react-native-paper";

function SelectComponent(props) {
  let data = [
    { id: 1, name: "Nihal" },
    { id: 2, name: "Gokul" },
  ];
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sData, setsData] = React.useState(data);
  const onChangeSearch = (query) => {
    setSearchQuery(query);
    setsData(
      data.filter((data) => {
        var re = new RegExp(query, "gi");
        return data.name.match(re);
      })
    );
  };

  return (
    <View style={{ padding: 10 }}>
      <View style={{ padding: 10, borderRadius: 10, backgroundColor: "white" }}>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
      </View>
      {sData.map((item) => (
        <View key={item.id}>
          <List.Item title={item.name} />
          <Divider />
        </View>
      ))}
    </View>
  );
}

export default SelectComponent;
