import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import Select2 from "react-select2-native";

const FormSelect = ({
  value,
  label,
  data,
  selectedValue,
  title = "Select " + label,
}) => {
  return (
    <View style={{ marginVertical: 5, flexDirection: "column" }}>
      <Text>{label}</Text>
      <View style={[styles.container, { borderColor: "#e8e8e8" }]}>
        <Select2
          colorTheme={"black"}
          selectedTitleStyle={{ color: "black" }}
          isSelectSingle
          style={{
            height: 50,
            borderRadius: 5,
          }}
          popupTitle={"Select " + label}
          title={title}
          data={data}
          value={value}
          onSelect={(data, value) => {
            selectedValue(value[0]);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 5,
  },
});

export default FormSelect;
