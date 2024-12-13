import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ProfileItem from "./ProfileItem"; // Import the new component
import firebase from "../../Config";

const database = firebase.database();
const ref_TableProfils = database.ref("TableProfils");

export default function ListProfil(props) {
  const [data, setdata] = useState([]);
  const [currentUser, setcurrentUser] = useState({});
  const currentid = props.route.params.currentid;

  useEffect(() => {
    // Listen to profile changes and filter connected users
    ref_TableProfils.on("value", (snapshot) => {
      const connectedProfiles = [];
      snapshot.forEach((unprofil) => {
        const profilData = unprofil.val();
        if (profilData.id === currentid) {
          setcurrentUser(profilData);
        } else if (profilData.status === "online") {
          connectedProfiles.push(profilData); // Add only connected profiles
        }
      });
      setdata(connectedProfiles); // Update the state with connected profiles
    });

    return () => {
      ref_TableProfils.off();
    };
  }, [currentid]);

  return (
    <ImageBackground
      source={require("../../assets/download.jpg")}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text style={styles.textstyle}>Connected Profiles</Text>
      <FlatList
        style={{ backgroundColor: "#FFF3", width: "95%", borderRadius: 8 }}
        data={data}
        renderItem={({ item }) => (
          <ProfileItem
            profile={item}
            onPress={() =>
              props.navigation.navigate("Chat", {
                currentUser: currentUser,
                secondUser: item,
              })
            }
          />
        )}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  textstyle: {
    fontSize: 40,
    fontFamily: "serif",
    color: "white",
    fontWeight: "bold",
    paddingTop: 45,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
