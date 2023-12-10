import React from "react";
import { getToken } from "../auth/auth";
import api from "../../axiosConfig";
import { ScrollView, View } from "react-native";
import { useForm } from "react-hook-form";
import FormSelect from "../components/formselect";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import FormInput from "../components/forminput";
import ImageComponent from "../components/ImageComponent";
import * as FileSystem from "expo-file-system";

function AssetTaggingExec(props) {
  const { wo_id, system_id, system_name } = props.route.params;
  const [loading, setLoading] = React.useState(false);
  const [bloading, setBLoading] = React.useState(false);
  const [pickedImagePath, setPickedImagePath] = React.useState("");
  const [selectedDeviceType, setSelectedDeviceType] = React.useState("");
  const [tag, setTag] = React.useState("");
  const [inputDate, setInputDate] = React.useState(null);
  const [frequency, setFrequency] = React.useState("");
  const [generalfields, setGeneralFields] = React.useState([]);
  const [devicetypes, setDeviceTypes] = React.useState([]);

  function setImage(img) {
    setPickedImagePath(img);
  }

  const addAsset = async (general) => {
    let next_service = new Date(inputDate);
    next_service.setDate(next_service.getDate() + parseInt(frequency));
    setBLoading(true);
    console.log(general);
    if (pickedImagePath != "") {
      api
        .put(
          `/fileupload`,
          {
            type: "WO_Asset_Images",
            type_name: `${wo_id}`,
            file_name: `${tag}.jpeg`,
            content_type: "image/jpeg",
          },
          {
            headers: { ignistoken: await getToken() },
          }
        )
        .then(async (res) => {
          console.log(res.data.message);
          if (res.status === 200) {
            let uploadURL = res.data.message.uploadURL;
            let filePath = res.data.message.filepath;

            const options = {
              httpMethod: "PUT",
              headers: {
                "Content-Type": "image/jpeg",
              },
            };
            await FileSystem.uploadAsync(uploadURL, pickedImagePath, options)
              .then(async (res) => {
                console.log("Sucesfully Uploaded!");
                const body = {
                  id: wo_id,
                  data: {
                    system_id: parseInt(system_id),
                    type_id: parseInt(selectedDeviceType),
                    frequency: parseInt(frequency),
                    next_service: next_service,
                    tag: tag,
                    general_info: general,
                    image: filePath,
                  },
                };

                api
                  .post("/AssetTagging", body, {
                    headers: { ignistoken: await getToken() },
                  })
                  .then(async (res) => {
                    setBLoading(false);
                    console.log(res);
                    if (res.status === 200) {
                      alert(`Asset Successfully Added!`);
                      props.navigation.navigate("WOITM", { wo_id: wo_id });
                    }
                  })
                  .catch((err) => {
                    setBLoading(false);
                    console.log(err);
                    if (
                      err.response &&
                      err.response.data &&
                      err.response.data.message
                    )
                      alert(err.response.data.message);
                    else alert("Server Error");
                  });
              })
              .catch((err) => {
                alert(err);
              });
          }
        })

        .catch((err) => {
          console.log(err);
          if (err.response && err.response.data && err.response.data.message)
            alert(err.response.data.message);
          else alert("Server Error");
        });
    } else {
      const body = {
        id: wo_id,
        data: {
          system_id: parseInt(system_id),
          type_id: parseInt(selectedDeviceType),
          frequency: parseInt(frequency),
          next_service: next_service,
          tag: tag,
          general_info: general,
          image: null,
        },
      };

      api
        .post("/AssetTagging", body, {
          headers: { ignistoken: await getToken() },
        })
        .then(async (res) => {
          setBLoading(false);
          console.log(res);
          if (res.status === 200) {
            alert(`Asset Successfully Added!`);
            props.navigation.navigate("AssetTagging", {
              wo_id: wo_id,
              system_id: system_id,
              system_name: system_name,
            });
          }
        })
        .catch((err) => {
          setBLoading(false);
          console.log(err);
          if (err.response && err.response.data && err.response.data.message)
            alert(err.response.data.message);
          else alert("Server Error");
        });
    }
  };

  const getDeviceTypes = async () => {
    api
      .get(`/dropdown/devicetypes?system_id=${system_id}`, {
        headers: { ignistoken: await getToken() },
      })
      .then(async (res) => {
        setLoading(false);
        console.log(res.data.message);
        setDeviceTypes(res.data.message);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.response && err.response.data && err.response.data.message)
          alert(err.response.data.message);
        else alert("Server Error");
      });
  };

  const getGeneralFields = async (devicetype) => {
    console.log(devicetype);

    setSelectedDeviceType(devicetype.id);
    api
      .get(`/dropdown/devicefields?id=${devicetype.id}`, {
        headers: { ignistoken: await getToken() },
      })
      .then(async (res) => {
        setTag("");
        setInputDate(null);
        setFrequency(`${devicetype.frequency}`);
        res.data.message.general_fields.map((field) => {
          setValue(field.name, "");
        });
        setGeneralFields(res.data.message.general_fields);
        console.log(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data && err.response.data.message)
          alert(err.response.data.message);
        else alert("Server Error");
      });
  };

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      setGeneralFields([]);
      await getDeviceTypes();
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          margin: 10,
          marginBottom: 0,
          borderRadius: 10,
          backgroundColor: "rgb(237, 221, 246)",
          padding: 10,
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Text variant="titleSmall">System</Text>
        <Text>{system_name}</Text>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          margin: 10,
          marginBottom: 5,
          padding: 10,
          borderRadius: 10,
        }}
      >
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator />
          </View>
        ) : (
          <ScrollView>
            <FormSelect
              value={selectedDeviceType}
              name={"device_id"}
              data={devicetypes}
              label="Device Type"
              selectedValue={getGeneralFields}
              title={"Select Device Type"}
            />
            {generalfields.map((field) => {
              return (
                <FormInput
                  key={field.name}
                  control={control}
                  name={field.name}
                  rules={{ required: field.mandatory }}
                  label={field.name}
                />
              );
            })}
            {!generalfields.length ? null : (
              <View>
                <View
                  style={{
                    marginVertical: 5,
                    flexDirection: "column",
                  }}
                >
                  <Text>{`Frequency (Changing will override default NFPA Frequency)`}</Text>
                  <TextInput
                    inputMode="numeric"
                    value={frequency}
                    onChangeText={setFrequency}
                    style={{ fontSize: 15 }}
                    placeholder={"Enter Frequency"}
                  />
                </View>
                <View
                  style={{
                    marginVertical: 5,
                    flexDirection: "column",
                  }}
                >
                  <Text>Lasr Service Date</Text>
                  <DatePickerInput
                    locale={"en"}
                    value={inputDate}
                    onChange={setInputDate}
                    inputMode="start"
                  />
                </View>
                <View
                  style={{
                    marginVertical: 5,
                    flexDirection: "column",
                  }}
                >
                  <Text>Asset Tag</Text>
                  <TextInput
                    value={tag}
                    onChangeText={setTag}
                    style={{ fontSize: 15 }}
                    placeholder={"Enter Asset Tag"}
                  />
                </View>
                <Text>Asset Image</Text>
                <ImageComponent setImage={setImage} />
              </View>
            )}
          </ScrollView>
        )}
        {!generalfields.length ? null : (
          <Button
            disabled={!tag || !frequency || bloading ? true : false}
            loading={bloading}
            onPress={handleSubmit(addAsset)}
            mode="contained"
          >
            Add Asset
          </Button>
        )}
      </View>
    </View>
  );
}

export default AssetTaggingExec;
