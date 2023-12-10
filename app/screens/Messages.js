import React from "react";
import { ScrollView, TextInput, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Dialog,
  IconButton,
  Portal,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { getToken, getUser } from "../auth/auth";
import api from "../../axiosConfig";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

function Messages(props) {
  const { id } = props.route.params;
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [text, setText] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [selectedMessage, setSelectedMessage] = React.useState({});
  const [recording, setRecording] = React.useState();
  const [audioPath, setAudioPath] = React.useState();
  const [playing, setPlaying] = React.useState(0);
  const [ploading, setPloading] = React.useState(0);
  const [mloading, setMLoading] = React.useState(false);
  const [downloaded, setDownloaded] = React.useState({});
  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setAudioPath(uri);
    console.log("Recording stopped and stored at", uri);
  }

  const playVoice = async (filepath, id) => {
    if (Object.keys(downloaded).includes(`${id}`)) {
      playSound(downloaded[id], id);
    } else {
      api
        .post(
          `/fileupload`,
          {
            filepath: filepath,
          },
          {
            headers: { ignistoken: await getToken() },
          }
        )
        .then(async (res) => {
          console.log(res.data.message);
          setDownloaded({ ...downloaded, [id]: res.data.message });
          console.log(downloaded);
          playSound(res.data.message, id);
        })

        .catch((err) => {
          console.log(err);
          if (err.response && err.response.data && err.response.data.message)
            alert(err.response.data.message);
          else alert("Server Error");
        });
    }
  };

  const getURL = async () => {
    setMLoading(true);
    let filename = `${new Date().valueOf()}.m4a`;
    api
      .put(
        `/fileupload`,
        {
          type: "WO_Voice_Messages",
          type_name: `${id}`,
          file_name: filename,
          content_type: "audio/mpeg",
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
          console.log(uploadURL);
          console.log(audioPath);
          const options = {
            httpMethod: "PUT",
            headers: {
              "Content-Type": "audio/mpeg",
            },
          };
          await FileSystem.uploadAsync(uploadURL, audioPath, options)
            .then(async (res) => {
              console.log("Sucesfully Uploaded!");
              setAudioPath(undefined);
              setMLoading(false);
              await addMessage("Voice", filePath);
            })
            .catch((err) => {
              setMLoading(false);
              alert(err);
            });
        }
      })

      .catch((err) => {
        setMLoading(false);
        console.log(err);
        if (err.response && err.response.data && err.response.data.message)
          alert(err.response.data.message);
        else alert("Server Error");
      });
  };

  //Playing audio
  const [sound, setSound] = React.useState();

  async function playSound(audio, id = 1) {
    try {
      setPloading(id);
      console.log("Loading Sound");
      const { sound } = await Audio.Sound.createAsync({ uri: audio });
      setSound(sound);
      setPloading(0);
      console.log("Playing Sound");
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) =>
        setPlaying(status.isPlaying ? id : 0)
      );
    } catch (error) {
      // An error occurred!
      console.error("Failed to start playing", err);
    }
  }

  const getMessages = async () => {
    api
      .get(`/clientmessages/${id}`, {
        headers: { ignistoken: await getToken() },
      })
      .then(async (res) => {
        setLoading(false);
        console.log(res.data.message);

        let result = res.data.message.reduce(function (r, a) {
          let date = new Date(a.createdat).toDateString();
          r[date] = r[date] || [];
          r[date].push(a);
          return r;
        }, Object.create(null));
        setMessages(result);
      })

      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.response && err.response.data && err.response.data.message)
          alert(err.response.data.message);
        else alert("Server Error");
      });
  };

  const addMessage = async (type, filePath) => {
    setMLoading(true);
    api
      .post(
        `/clientmessages/${id}`,
        {
          message: type === "Voice" ? filePath : text,
          wo_id: id,
          type: type,
        },
        {
          headers: { ignistoken: await getToken() },
        }
      )
      .then(async (res) => {
        setMLoading(false);
        console.log(res.data.message);
        setText("");
        await getMessages();
      })

      .catch((err) => {
        setMLoading(false);
        console.log(err);
        if (err.response && err.response.data && err.response.data.message)
          alert(err.response.data.message);
        else alert("Server Error");
      });
  };

  const deleteMessage = async () => {
    api
      .delete(`/clientmessages/${id}`, {
        headers: {
          ignistoken: await getToken(),
        },
        data: { id: selectedMessage.id },
      })
      .then(async (res) => {
        alert(res.data.message);
        hideDialog();
        await getMessages();
      })

      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data && err.response.data.message)
          alert(err.response.data.message);
        else alert("Server Error");
      });
  };
  React.useEffect(() => {
    (async () => {
      setUser(await getUser());

      await getMessages();
    })();
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View
      style={{
        padding: 5,
        flex: 1,
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "space-between",
      }}
    >
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Delete Message</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{`"${selectedMessage.message}"`}</Text>
            <Text variant="bodyMedium">
              Do you want to delete this message?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={deleteMessage}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView>
          {Object.keys(messages).map((date) => {
            let messagesarray = messages[date];
            messagesarray.sort(function (a, b) {
              var keyA = new Date(a.createdat),
                keyB = new Date(b.createdat);
              if (keyA < keyB) return -1;
              if (keyA > keyB) return 1;
              return 0;
            });
            return (
              <View key={date}>
                <Text
                  variant="bodySmall"
                  style={{ margin: 5, alignSelf: "center" }}
                >
                  {date}
                </Text>
                {messagesarray.map((message) => {
                  return message.createdby === user.username ? (
                    <View
                      key={message.id}
                      style={{
                        margin: 5,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <View style={{ flexDirection: "column" }}>
                        <TouchableRipple
                          onLongPress={() => (
                            showDialog(), setSelectedMessage(message)
                          )}
                        >
                          <View
                            style={{
                              backgroundColor: "gray",
                              padding: 5,
                              borderRadius: 10,
                              borderTopRightRadius: 0,
                              flexDirection: "row",
                            }}
                          >
                            {message.type === "Voice" ? (
                              <View>
                                <Button
                                  loading={
                                    ploading === message.id ? true : false
                                  }
                                  style={{ margin: 3 }}
                                  onPress={() =>
                                    playVoice(message.message, message.id)
                                  }
                                  mode="elevated"
                                  icon={
                                    !Object.keys(downloaded).includes(
                                      `${message.id}`
                                    )
                                      ? "download"
                                      : playing === message.id
                                      ? "waveform"
                                      : "play"
                                  }
                                >
                                  Voice
                                </Button>
                              </View>
                            ) : (
                              <Text
                                style={{
                                  color: "white",
                                  margin: 5,
                                }}
                              >
                                {message.message}
                              </Text>
                            )}
                            <Text
                              style={{
                                color: "white",
                                alignSelf: "flex-end",
                                fontSize: 9,
                              }}
                            >
                              {new Date(message.createdat).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </Text>
                          </View>
                        </TouchableRipple>
                      </View>
                    </View>
                  ) : (
                    <View
                      key={message.id}
                      style={{
                        margin: 10,
                        flexDirection: "row",
                      }}
                    >
                      <Avatar.Icon size={24} icon="account" />
                      <View
                        style={{ marginHorizontal: 5, flexDirection: "column" }}
                      >
                        <View
                          style={{
                            backgroundColor: "white",
                            padding: 5,
                            borderRadius: 10,
                            borderTopRightRadius: 0,
                            flexDirection: "row",
                          }}
                        >
                          <View>
                            <Text
                              style={{
                                marginLeft: 5,
                                color: "purple",
                                fontSize: 10,
                              }}
                            >
                              {message.name}
                            </Text>

                            {message.type === "Voice" ? (
                              <View>
                                <Button
                                  loading={
                                    ploading === message.id ? true : false
                                  }
                                  style={{ margin: 3 }}
                                  onPress={() =>
                                    playVoice(message.message, message.id)
                                  }
                                  mode="elevated"
                                  icon={
                                    !Object.keys(downloaded).includes(
                                      `${message.id}`
                                    )
                                      ? "download"
                                      : playing === message.id
                                      ? "waveform"
                                      : "play"
                                  }
                                >
                                  Voice
                                </Button>
                              </View>
                            ) : (
                              <Text
                                style={{
                                  margin: 5,
                                }}
                              >
                                {message.message}
                              </Text>
                            )}
                          </View>
                          <Text
                            style={{
                              color: "grey",
                              alignSelf: "flex-end",
                              fontSize: 9,
                            }}
                          >
                            {new Date(message.createdat).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      )}
      <View
        style={{
          marginHorizontal: 5,
          backgroundColor: "white",
          borderRadius: 30,
          padding: 5,
          flexDirection: "row",
        }}
      >
        {mloading ? (
          <ActivityIndicator style={{ flexGrow: 1 }} />
        ) : audioPath ? (
          <View style={{ flexDirection: "row", flexGrow: 1 }}>
            <IconButton
              icon={playing === 1 ? "waveform" : "play"}
              onPress={() => playSound(audioPath)}
            />
            <IconButton
              iconColor="red"
              icon="delete"
              onPress={() => setAudioPath(undefined)}
            />
          </View>
        ) : !recording ? (
          <TextInput
            cursorColor={"black"}
            style={{
              flex: 1,
              borderRadius: 30,
              padding: 10,
              backgroundColor: "#f5f8f6",
            }}
            placeholder="Message"
            multiline={true}
            value={text}
            onChangeText={(text) => setText(text)}
          />
        ) : null}

        {!text ? (
          !recording ? (
            audioPath ? (
              <IconButton
                onPress={getURL}
                style={{ alignSelf: "flex-end" }}
                icon="send"
                mode="contained"
              />
            ) : (
              <IconButton
                onPress={recording ? stopRecording : startRecording}
                icon="microphone"
                mode="contained"
              />
            )
          ) : (
            <IconButton
              icon="stop"
              mode="contained"
              onPress={recording ? stopRecording : startRecording}
            />
          )
        ) : (
          <IconButton
            onPress={() => addMessage("Text")}
            style={{ alignSelf: "flex-end" }}
            icon="send"
            mode="contained"
          />
        )}
      </View>
    </View>
  );
}

export default Messages;
