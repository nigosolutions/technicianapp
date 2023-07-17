import { Appbar, Button, SegmentedButtons, Text } from "react-native-paper";
import FormInput from "../components/forminput";
import { useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import ImageComponent from "../components/ImageComponent";
import FormSelect from "../components/formselect";
import React from "react";
import FormBoolean from "../components/formboolean";

function AssetTagging(props) {
  const [value, setValues] = React.useState("");
  const mockData = [
    { id: 1, name: "React Native Developer", checked: true },
    { id: 2, name: "Android Developer" },
    { id: 3, name: "iOS Developer" },
  ];

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title="Asset Tagging" />
      </Appbar.Header>
      <ScrollView>
        <View style={{ padding: 10 }}>
          <Text>Device Image</Text>
          <ImageComponent />
        </View>
        <View style={{ margin: 10 }}>
          <FormSelect
            control={control}
            name={"device_id"}
            data={mockData}
            rules={{ required: "Device is required" }}
            label="Device"
          />
          <FormBoolean
            control={control}
            name={"yesno"}
            rules={{ required: "YesNo is required" }}
            label="Satisfactory"
          />

          <View style={{ alignItems: "center", flexDirection: "row" }}>
            <View style={{ flex: 3 / 2 }}>
              <FormInput
                control={control}
                name="asset_tag"
                rules={{ required: "Tag is required" }}
                label="Asset Tag"
                placeholder={"Enter Tag or Generate New"}
              />
            </View>
            <View style={{ flex: 1, padding: 10 }}>
              <Button style={{ marginTop: 20 }} mode="outlined">
                Generate
              </Button>
            </View>
          </View>
          <Button style={{ marginVertical: 20 }} mode="contained">
            Submit
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

export default AssetTagging;
