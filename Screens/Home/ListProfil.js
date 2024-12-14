import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import ProfileItem from "./ProfileItem"; // Import the new component
import firebase from "../../Config";

const database = firebase.database();
const ref_TableProfils = database.ref("TableProfils");

export default function ListProfil(props) {
  const [data, setdata] = useState([]);
  const [currentUser, setcurrentUser] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const currentid = props.route.params.currentid;

  useEffect(() => {
    // Listen to profile changes and filter connected users
    ref_TableProfils.on("value", (snapshot) => {
      const Profiles = [];
      snapshot.forEach((unprofil) => {
        const profilData = unprofil.val();
        if (profilData.id === currentid) {
          setcurrentUser(profilData);
        } else {
          Profiles.push(profilData); // Add only connected profiles
        }
      });
      setdata(Profiles); // Update the state with connected profiles
      setLoading(false); // Set loading to false once data is fetched
    });

    return () => {
      ref_TableProfils.off();
    };
  }, [currentid]);

  // Loading state or empty data message
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/download.jpg")}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text style={styles.textstyle}>Connected Profiles</Text>
      <View style={styles.box}>
        <FlatList
          style={styles.flatList}
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
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  box: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    height: "83%",
    alignItems: "center",
  },
  textstyle: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
    paddingTop: 45,
    paddingBottom: 20,
    textAlign: "center",
  },
  flatList: {
    width: "95%",
    borderRadius: 8,
    marginBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0008",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0008",
  },
  emptyStateText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});
