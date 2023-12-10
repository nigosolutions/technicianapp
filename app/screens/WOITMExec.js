import React from "react";
import { useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import FormBoolean from "../components/formboolean";
import ImageComponent from "../components/ImageComponent";
import FormInput from "../components/forminput";
import { getToken } from "../auth/auth";
import api from "../../axiosConfig";
import * as FileSystem from "expo-file-system";

function WOITMExec(props) {
  const { wo_id, asset_id } = props.route.params;
  const [pickedImagePath, setPickedImagePath] = React.useState("");
  const [data, setData] = React.useState([]);
  const [generalinfo, setGeneralInfo] = React.useState({});

  const [loading, setLoading] = React.useState(false);
  const [bloading, setBLoading] = React.useState(false);
  function setImage(img) {
    setPickedImagePath(img);
  }
  const getAssetDetails = async () => {
    api
      .get(`/ITM/${asset_id}`, {
        headers: { ignistoken: await getToken() },
      })
      .then(async (res) => {
        setLoading(false);
        console.log(res.data.message);
        let asset = res.data.message;
        setData(
          [].concat(
            !asset.inspection_fields ? [] : asset.inspection_fields,
            !asset.testing_fields ? [] : asset.testing_fields,
            !asset.maintenance_fields ? [] : asset.maintenance_fields
          )
        );
        setGeneralInfo(asset.general_info);
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

      await getAssetDetails();
    })();
  }, []);

  const onSubmit = async (formdata) => {
    let pass = true;
    setBLoading(true);
    let itmdata = data.map((field) => {
      if (field.type === "condition") {
        let result = false;
        if (field.condition === "in_between") {
          let a = parseFloat(generalinfo[field.value_1]);
          let b = parseFloat(generalinfo[field.value_2]);
          let c = parseFloat(formdata[field.name]);
          if (c >= a && c <= b) result = true;
          else pass = false;
          return {
            name: field.name,
            type: field.type,
            value: formdata[field.name],
            condition: field.condition,
            condition_value_1: generalinfo[field.value_1],
            condition_value_2: generalinfo[field.value_2],
            result: result,
          };
        } else if (field.condition === "greater_than") {
          let a = parseFloat(generalinfo[field.value]);
          let b = parseFloat(formdata[field.name]);
          if (b >= a) result = true;
          else pass = false;
          return {
            name: field.name,
            type: field.type,
            value: formdata[field.name],
            condition: field.condition,
            condition_value: generalinfo[field.value],
            result: result,
          };
        } else if (field.condition === "less_than") {
          let a = parseFloat(generalinfo[field.value]);
          let b = parseFloat(formdata[field.name]);
          if (b <= a) result = true;
          else pass = false;
          return {
            name: field.name,
            type: field.type,
            value: formdata[field.name],
            condition: field.condition,
            condition_value: generalinfo[field.value],
            result: result,
          };
        }
      } else if (field.type === "boolean") {
        let result = false;
        if (formdata[field.name] === "Yes") result = true;
        else pass = false;
        return {
          name: field.name,
          type: field.type,
          value: formdata[field.name],
          result: result,
        };
      } else
        return {
          name: field.name,
          type: field.type,
          value: formdata[field.name],
        };
    });
    if (pickedImagePath != "") {
      api
        .put(
          `/fileupload`,
          {
            type: "WO_Asset_Images",
            type_name: `${wo_id}`,
            file_name: `${asset_id}.jpeg`,
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
                  asset_id: asset_id,
                  wo_id: wo_id,
                  result: itmdata,
                  pass: pass,
                  remarks: formdata.remarks,
                  image: filePath,
                };
                console.log(itmdata);
                api
                  .post("/ITM", body, {
                    headers: { ignistoken: await getToken() },
                  })
                  .then(async (res) => {
                    setBLoading(false);
                    console.log(res);
                    if (res.status === 200) {
                      alert(
                        `Results Submitted! ITM Result: ${
                          !pass ? "FAIL" : "PASS"
                        }`
                      );
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
        asset_id: asset_id,
        wo_id: wo_id,
        result: itmdata,
        pass: pass,
        remarks: formdata.remarks,
        image: null,
      };
      console.log(itmdata);
      api
        .post("/ITM", body, { headers: { ignistoken: await getToken() } })
        .then(async (res) => {
          setBLoading(false);
          console.log(res);
          if (res.status === 200) {
            alert(`Results Submitted! ITM Result: ${!pass ? "FAIL" : "PASS"}`);
            props.navigation.navigate("WOITM", { wo_id: wo_id });
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
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return loading ? (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <View
      style={{
        margin: 10,
        borderRadius: 10,
        backgroundColor: "white",
        flex: 1,
        padding: 10,
      }}
    >
      <ScrollView>
        {data.map((field) =>
          field.type === "boolean" ? (
            <FormBoolean
              key={field.name}
              control={control}
              name={field.name}
              rules={
                !field.mandatory
                  ? null
                  : { required: field.name + " is required" }
              }
              label={field.name}
            />
          ) : field.type === "condition" || "numeric" ? (
            <FormInput
              inputMode="numeric"
              control={control}
              name={field.name}
              rules={
                !field.mandatory
                  ? null
                  : { required: field.name + " is required" }
              }
              label={field.name}
              placeholder={"Enter " + field.name}
            />
          ) : field.type === "text" ? (
            <FormInput
              control={control}
              name={field.name}
              rules={
                !field.mandatory
                  ? null
                  : { required: field.name + " is required" }
              }
              label={field.name}
              placeholder={"Enter " + field.name}
            />
          ) : null
        )}
        <FormInput
          multiline={true}
          control={control}
          name={"remarks"}
          label={"Remarks"}
          placeholder={"Enter " + "remarks"}
        />
        <Text style={{ marginVertical: 10 }}>Device Image</Text>
        <ImageComponent setImage={setImage} />
      </ScrollView>

      <Button
        style={{ marginTop: 20 }}
        loading={bloading}
        disabled={bloading}
        onPress={handleSubmit(onSubmit)}
        mode="contained"
      >
        Submit
      </Button>
    </View>
  );
}

export default WOITMExec;
