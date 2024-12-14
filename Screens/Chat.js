import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TextInput,
  TouchableHighlight,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import firebase from "../Config";
import handleSendLocation from "../Utility/Location";

const database = firebase.database();
const ref_lesdiscussions = database.ref("lesdiscussions");

export default function Chat(props) {
  const currentUser = props.route.params.currentUser;
  const secondUser = props.route.params.secondUser;

  const iddisc =
    currentUser.id > secondUser.id
      ? currentUser.id + secondUser.id
      : secondUser.id + currentUser.id;
  const ref_unediscussion = ref_lesdiscussions.child(iddisc);

  const [Msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const flatListRef = useRef(null);

  const [typing, setTyping] = useState(false);

  // Retrieve chat messages
  useEffect(() => {
    const onValueChange = ref_unediscussion.on("value", (snapshot) => {
      const messages = [];
      snapshot.forEach((unmessage) => {
        messages.push(unmessage.val());
      });
      setData(messages);
    });

    return () => {
      ref_unediscussion.off("value", onValueChange);
    };
  }, []);

  const filteredData = data.filter(
    (item) => item.body && item.body.trim() !== ""
  );
  const sendMessage = () => {
    if (!Msg.trim()) return; // Prevent empty messages

    const key = ref_unediscussion.push().key;
    const ref_unmsg = ref_unediscussion.child(key);

    ref_unmsg
      .set({
        body: Msg,
        time: new Date().toLocaleString(),
        sender: currentUser.id,
        receiver: secondUser.id,
      })
      .then(() => setMsg("")) // Clear input on success
      .catch((error) => console.error("Error sending message:", error));
  };

  useEffect(() => {
    const typingRef = ref_unediscussion.child("typing").child(secondUser.id);
    typingRef.on("value", (snapshot) => {
      setTyping(snapshot.val()); // Store true/false in a state variable
    });

    return () => typingRef.off();
  }, []);
  useEffect(() => {
    const typingRef = ref_unediscussion.child("typing").child(currentUser.id);
    return () => typingRef.set(false); // Clear typing status on cleanup
  }, []);

  const debounceTyping = useRef(null);

  const handleTyping = (isTyping) => {
    clearTimeout(debounceTyping.current);
    debounceTyping.current = setTimeout(() => {
      const typingRef = ref_unediscussion.child("typing").child(currentUser.id);
      typingRef.set(isTyping);
    }, 500); // Update Firebase only after 500ms of inactivity
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
        <Text style={styles.headerText}>Discussion with {secondUser.nom}</Text>
        <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
          <FlatList
            ref={flatListRef}
            onContentSizeChange={() =>
              flatListRef.current.scrollToEnd({ animated: true })
            }
            onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
            style={styles.messageList}
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              const isCurrentUser = item.sender === currentUser.id;
              const messageStyle = isCurrentUser
                ? styles.currentUserMessage
                : styles.otherUserMessage;
              const messageBubleStyle = isCurrentUser
                ? styles.currentUserMessageBuble
                : styles.secondUserMessageBuble;

              const imguri = isCurrentUser
                ? currentUser.uriimage
                : secondUser.uriimage;
              const handleLinkPress = () => {
                const link = item.body.match(/https:\/\/\S+/)?.[0]; // Extract the URL from the message
                if (link) {
                  Linking.openURL(link).catch((err) =>
                    console.error("Failed to open URL:", err)
                  );
                }
              };

              return (
                <View style={messageStyle}>
                  <View style={messageBubleStyle}>
                    {containsLink(item.body) ? (
                      <TouchableOpacity onPress={handleLinkPress}>
                        <Text style={{ color: "white" }}>{item.body}</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={{ color: "white" }}>{item.body}</Text>
                    )}
                    {/* <Text style={{ color: "white" }}>{item.body}</Text> */}
                    <Text style={styles.timestamp}>{item.time}</Text>
                  </View>
                  <Image
                    source={{
                      uri: imguri || "https://via.placeholder.com/50", // Default image if no URL
                    }}
                    style={styles.image}
                  />
                </View>
              );
            }}
          />
          {typing && (
            <View style={{ alignSelf: "flex-start", marginLeft: 10 }}>
              <Text style={styles.typingIndicator}>
                {secondUser.nom} is typing...
              </Text>
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={Msg}
            onChangeText={(text) => {
              setMsg(text);
              handleTyping(!!text.trim()); // Update typing status
            }}
            onEndEditing={() => handleTyping(false)} // Stop typing when input loses focus
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
  secondUserMessageBuble: {
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
  typingIndicator: {
    color: "white",
  },
});
