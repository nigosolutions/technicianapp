import React from "react";
import { View } from "react-native";
import { Avatar, Button, Card, Text, Title } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

function ImageComponent(props) {
  const [pickedImagePath, setPickedImagePath] = React.useState("");
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    // Explore the result

    if (!result.canceled) {
      setPickedImagePath(result.assets[0].uri);

      props.setImage(result.assets[0].uri);
    }
  };
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result

    if (!result.canceled) {
      setPickedImagePath(result.assets[0].uri);
      props.setImage(result.assets[0].uri);
    }
  };

  return (
    <View>
      {pickedImagePath == "" ? (
        <View style={{ flexDirection: "row" }}>
          <Card onPress={showImagePicker} style={{ flex: 1, margin: 5 }}>
            <Card.Content
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar.Icon size={50} icon="upload" />
              <Text style={{ marginVertical: 10 }}>Upload Image</Text>
            </Card.Content>
          </Card>
          <Card onPress={openCamera} style={{ flex: 1, margin: 5 }}>
            <Card.Content
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar.Icon size={50} icon="camera" />
              <Text style={{ marginVertical: 10 }}>Open Camera</Text>
            </Card.Content>
          </Card>
        </View>
      ) : (
        <Card>
          <Card.Cover
            style={{ height: 300 }}
            resizeMode="contain"
            source={{ uri: pickedImagePath }}
          />
          <Card.Actions style={{ alignSelf: "center" }}>
            <Button
              onPress={() => {
                setPickedImagePath("");
                props.setImage("");
              }}
            >
              Change Photo
            </Button>
          </Card.Actions>
        </Card>
      )}
    </View>
  );
}

export default ImageComponent;
