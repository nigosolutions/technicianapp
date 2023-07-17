import React from "react";
import { View, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { HelperText, Text, TextInput } from "react-native-paper";

const FormInput = ({
  control,
  name,
  rules = {},
  label,
  secureTextEntry,
  placeholder,
  disabled,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <View
          style={{
            marginVertical: 5,
            flexDirection: "column",
          }}
        >
          <Text>{label}</Text>
          <View
            style={[
              styles.container,
              { borderColor: error ? "red" : "#e8e8e8" },
            ]}
          >
            <TextInput
              mode="outlined"
              outlineColor={error && "red"}
              value={value}
              onChangeText={onChange}
              style={{ fontSize: 15 }}
              onBlur={onBlur}
              placeholder={placeholder == null ? "Enter " + label : placeholder}
              secureTextEntry={secureTextEntry}
              disabled={disabled}
            />
            {error && (
              <HelperText type="error">
                {error.message || label + " is required"}
              </HelperText>
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
  },
});

export default FormInput;
