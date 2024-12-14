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
  TouchableOpacity,
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
      <StatusBar style="light" />
      <ImageBackground
        style={styles.backgroundImage}
        resizeMode="cover"
        source={require("../assets/download.jpg")}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.overlay}>
            <Text style={styles.header}>Register</Text>
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
              secureTextEntry
              onSubmitEditing={() => refInput3.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              ref={refInput3}
              onChangeText={setConfirmPwd}
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
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
              >
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={() => props.navigation.goBack()}
              >
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
            </View>
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
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    padding: 20,
    width: "85%",
    alignItems: "center",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 15,
    marginVertical: 10,
    width: "90%",
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
