import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TextInput,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import firebase from "../Config";
import handleSendLocation from "../Utility/Location";

const database = firebase.database();
const ref_groupChats = database.ref("groupChats");

export default function GroupChat(props) {
  const currentid = props.route.params.currentid;
  const [currentUser, setcurrentUser] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const refProfile = database.ref(`TableProfils/unprofil${currentid}`);
      const snapshot = await refProfile.once("value");
      const data = snapshot.val();
      if (data) {
        setcurrentUser(data);
      }
    };
    fetchData();
  }, []);

  const groupId = props.route.params.groupId;
  const groupName = props.route.params.groupName;
  const ref_group = ref_groupChats.child(groupId);

  const [Msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    const onValueChange = ref_group.on("value", (snapshot) => {
      const messages = [];
      snapshot.forEach((message) => {
        messages.push(message.val());
      });
      setData(messages);
    });

    return () => {
      ref_group.off("value", onValueChange);
    };
  }, []);

  const sendMessage = () => {
    if (!Msg.trim()) return;

    const key = ref_group.push().key;
    const ref_message = ref_group.child(key);

    ref_message
      .set({
        body: Msg,
        time: new Date().toLocaleString(),
        senderId: currentUser.id,
        senderName: currentUser.nom,
      })
      .then(() => setMsg(""))
      .catch((error) => console.error("Error sending message:", error));
  };
  function containsLink(string) {
    return string.includes("https://");
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/download.jpg")}
        style={styles.background}
      >
        <Text style={styles.headerText}>Group Chat: {groupName}</Text>
        <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
          <FlatList
            ref={flatListRef}
            onContentSizeChange={() =>
              flatListRef.current.scrollToEnd({ animated: true })
            }
            onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
            style={styles.messageList}
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              const isCurrentUser = item.senderId === currentUser.id;
              const messageStyle = isCurrentUser
                ? styles.currentUserMessage
                : styles.otherUserMessage;
              const messageBubleStyle = isCurrentUser
                ? styles.currentUserMessageBuble
                : styles.otherUserMessageBuble;
              const handleLinkPress = () => {
                const link = item.body.match(/https:\/\/\S+/)?.[0]; // Extract the URL from the message
                if (link) {
                  Linking.openURL(link).catch((err) =>
                    console.error("Failed to open URL:", err)
                  );
                }
              };
              const renderMessage = () => {
                if (isCurrentUser && containsLink(item.body)) {
                  return (
                    <TouchableOpacity onPress={handleLinkPress}>
                      <Text style={{ color: "white" }}>{item.body}</Text>
                    </TouchableOpacity>
                  );
                } else if (containsLink(item.body)) {
                  return (
                    <TouchableOpacity onPress={handleLinkPress}>
                      <Text style={{ color: "white" }}>
                        {item.senderName} : {item.body}
                      </Text>
                    </TouchableOpacity>
                  );
                } else {
                  return (
                    <Text style={{ color: "white" }}>
                      {item.senderName} : {item.body}
                    </Text>
                  );
                }
              };
              return (
                <View style={messageStyle}>
                  <View style={messageBubleStyle}>
                    {renderMessage()}
                    <Text style={styles.timestamp}>{item.time}</Text>
                  </View>
                </View>
              );
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={Msg}
            onChangeText={setMsg}
            placeholder="Type a message"
            style={styles.textInput}
          />
          <TouchableHighlight
            activeOpacity={0.5}
            underlayColor="#DDDDDD"
            style={styles.sendButton}
            onPress={sendMessage}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableHighlight>
          <TouchableHighlight
            activeOpacity={0.5}
            underlayColor="#DDDDDD"
            style={styles.sendButton}
            onPress={async () => {
              let locationUrl = await handleSendLocation();
              setMsg(locationUrl);
            }}
          >
            <Text style={styles.sendButtonText}>⚲</Text>
          </TouchableHighlight>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    marginVertical: 35,
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFF",
  },
  messageList: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "90%",
    borderRadius: 8,
    height: "70%",
  },
  currentUserMessageBuble: {
    margin: 5,
    padding: 10,
    borderRadius: 15,
    maxWidth: "75%",
    backgroundColor: "#1e90ff",
  },
  otherUserMessageBuble: {
    margin: 5,
    padding: 10,
    borderRadius: 15,
    maxWidth: "75%",
    backgroundColor: "gray",
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    flexDirection: "row",
    maxWidth: "75%",
    alignItems: "center",
  },
  otherUserMessage: {
    alignSelf: "flex-start",
    flexDirection: "row-reverse",
    maxWidth: "75%",
    alignItems: "center",
  },
  timestamp: {
    fontSize: 10,
    color: "#AA",
    marginTop: 5,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    margin: 10,
  },
  textInput: {
    fontWeight: "bold",
    backgroundColor: "#fff",
    fontSize: 20,
    color: "black",
    width: "65%",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: "#1e90ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 10,
    width: "15%",
  },
  sendButtonText: {
    color: "#FFF",
    fontSize: 40,
    marginBottom: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
});
