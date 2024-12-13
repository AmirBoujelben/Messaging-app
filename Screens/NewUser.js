import React, { useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import firebase from "../Config";
const auth = firebase.auth();
const database = firebase.database();

export default function NewUser(props) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [nom, setNom] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [telephone, setTelephone] = useState("");
  const refInput2 = useRef();
  const refInput3 = useRef();

  return (
    <View style={styles.container}>
      <ImageBackground
        style={{
          height: "100%",
          width: "100%",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        resizeMode="cover"
        source={require("../assets/download.jpg")}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1, // Ensures content can expand within the ScrollView
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 20, // Add padding to avoid clipping at the bottom
          }}
          style={{
            borderRadius: 8,
            backgroundColor: "#0005",
            width: "85%",
            height: "70%", // Set the ScrollView to 80% of the screen height
            marginTop: "20%", // Center ScrollView vertically
            marginBottom: "10%", // Add margin to the bottom to ensure it doesn't touch the screen edge
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "white",
              marginTop: 15,
            }}
          >
            Register
          </Text>
          <TextInput
            onChangeText={setNom}
            style={styles.input}
            placeholder="Name"
            keyboardType="default"
          />
          <TextInput
            onChangeText={setPseudo}
            style={styles.input}
            placeholder="Pseudo"
            keyboardType="default"
          />
          <TextInput
            onChangeText={setTelephone}
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />
          <TextInput
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            onSubmitEditing={() => refInput2.current.focus()}
            blurOnSubmit={false}
          />
          <TextInput
            ref={refInput2}
            onChangeText={setPwd}
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            onSubmitEditing={() => refInput3.current.focus()}
            blurOnSubmit={false}
          />
          <TextInput
            ref={refInput3}
            onChangeText={setConfirmPwd}
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={true}
          />
          <View style={{ marginTop: 20, flexDirection: "row", gap: 15 }}>
            <Button
              onPress={() => {
                if (pwd !== confirmPwd) {
                  alert("Passwords do not match!");
                } else {
                  auth
                    .createUserWithEmailAndPassword(email, pwd)
                    .then(() => {
                      const currentId = auth.currentUser.uid;
                      database.ref("TableProfils/unprofil" + currentId).set({
                        id: currentId,
                        nom,
                        pseudo,
                        telephone,
                        email,
                      });
                      props.navigation.replace("Home", {
                        currentid: currentId,
                      });
                    })
                    .catch((error) => {
                      alert(error.message);
                    });
                }
              }}
              title="Register"
            />
            <Button onPress={() => props.navigation.goBack()} title="Back" />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f09",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  input: {
    fontFamily: "serif",
    fontSize: 16,
    marginTop: 15,
    padding: 10,
    height: 60,
    width: "90%",
    borderRadius: 2.5,
    textAlign: "center",
    backgroundColor: "white",
  },
});
