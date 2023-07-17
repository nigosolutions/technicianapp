import React from "react";
import { View, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { HelperText, SegmentedButtons, Text } from "react-native-paper";

const FormBoolean = ({ control, name, rules = {}, label }) => {
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
            <SegmentedButtons
              value={value}
              onValueChange={onChange}
              buttons={[
                {
                  value: true,
                  label: "Yes",
                },
                {
                  value: false,
                  label: "No",
                },
              ]}
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

export default FormBoolean;
