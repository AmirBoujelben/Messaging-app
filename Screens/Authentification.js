import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import firebase from "../Config";
const auth = firebase.auth();

export default function Authentification(props) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const refinput2 = useRef();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        style={styles.backgroundImage}
        resizeMode="cover"
        source={require("../assets/download.jpg")}
      >
        <View style={styles.authBox}>
          <Text style={styles.title}>Welcome Back</Text>
          <TextInput
            onChangeText={(txt) => setEmail(txt)}
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            onSubmitEditing={() => refinput2.current.focus()}
            blurOnSubmit={false}
          />
          <TextInput
            ref={refinput2}
            onChangeText={(txt) => setPwd(txt)}
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            keyboardType="default"
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (email !== "" && pwd !== "") {
                auth
                  .signInWithEmailAndPassword(email, pwd)
                  .then(() => {
                    const currentid = auth.currentUser.uid;
                    props.navigation.replace("Home", { currentid });
                  })
                  .catch((error) => alert(error));
              } else alert("Please fill in all fields!");
            }}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createAccount}
            onPress={() => props.navigation.navigate("NewUser")}
          >
            <Text style={styles.createAccountText}>Create a new account</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authBox: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  createAccount: {
    marginTop: 15,
  },
  createAccountText: {
    color: "#1e90ff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
