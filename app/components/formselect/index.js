import React from "react";
import { View, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { HelperText, Text, TextInput } from "react-native-paper";
import Select2 from "react-select2-native";

const FormSelect = ({
  control,
  name,
  rules = {},
  label,
  data,
  selectedValue,
  title = "Select " + label,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={{ marginVertical: 5, flexDirection: "column" }}>
          <Text>{label}</Text>
          <View
            style={[
              styles.container,
              { borderColor: error ? "red" : "#e8e8e8" },
            ]}
          >
            <Select2
              colorTheme={"black"}
              selectedTitleStyle={{ color: "black" }}
              isSelectSingle
              style={{
                borderColor: error && "red",
                height: 50,
                borderRadius: 5,
              }}
              popupTitle={"Select " + label}
              title={title}
              data={data}
              value={value}
              onSelect={(data, value) => {
                onChange(data[0]), selectedValue(value[0]);
              }}
            />

            {error && (
              <HelperText type="error">{error.message || "Error"}</HelperText>
            )}
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 5,
  },
});

export default FormSelect;
