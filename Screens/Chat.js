import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TextInput,
  TouchableHighlight,
} from "react-native";
import React, { useState, useEffect } from "react";
import firebase from "../Config";

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
  const [data, setdata] = useState([]);
  // récupérer les données
  useEffect(() => {
    ref_unediscussion.on("value", (snapshot) => {
      let d = [];
      snapshot.forEach((unmessage) => {
        d.push(unmessage.val());
      });
      setdata(d);
    });

    return () => {
      ref_unediscussion.off();
    };
  }, []);

  return (
    <View>
      <ImageBackground
        source={require("../assets/imgbleu.jpg")}
        style={styles.container}
      >
        <Text style={{ marginTop: 50 }}>
          Chat {currentUser.nom}+ {secondUser.nom}
        </Text>
        <FlatList
          style={{
            backgroundColor: "#FFF3",
            width: "90%",
            borderRadius: 8,
            height: "70%",
          }}
          data={data}
          renderItem={({ item }) => {
            const color = item.sender == currentUser.id ? "green" : "white";
            const image =
              item.sender == currentUser.id
                ? currentUser.uriimage
                : secondUser.uriimage;
            return (
              <View style={{ backgroundColor: color }}>
                <Text>{item.body}</Text>
                <Text>{item.time}</Text>
              </View>
            );
          }}
        />
        <View
          style={{
            flexDirection: "row",
            flex: 2,
            margin: 10,
          }}
        >
          <TextInput
            onChangeText={(text) => {
              setMsg(text);
            }}
            placeholderTextColor="#fff"
            textAlign="center"
            placeholder="Msg"
            style={styles.textinputstyle}
          ></TextInput>
          <TouchableHighlight
            activeOpacity={0.5}
            underlayColor="#DDDDDD"
            style={{
              borderColor: "#00f",
              borderWidth: 2,
              backgroundColor: "#08f6",
              textstyle: "italic",
              fontSize: 24,
              height: 50,
              width: "30%",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
              marginLeft: 10,
            }}
            onPress={() => {
              const key = ref_unediscussion.push().key;
              const ref_unmsg = ref_unediscussion.child(key);
              ref_unmsg.set({
                body: Msg,
                time: new Date().toLocaleString(),
                sender: currentUser.id,
                receiver: secondUser.id,
              });
            }}
          >
            <Text
              style={{
                color: "#FFF",
                fontSize: 24,
              }}
            >
              Send
            </Text>
          </TouchableHighlight>
        </View>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  textinputstyle: {
    fontWeight: "bold",
    backgroundColor: "#0004",
    fontSize: 20,
    color: "#fff",
    width: "50%",
    height: 50,
    borderRadius: 10,
  },
  textstyle: {
    fontSize: 40,
    fontFamily: "serif",
    color: "white",
    fontWeight: "bold",
    paddingTop: 45,
  },
  container: {
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
