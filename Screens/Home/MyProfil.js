import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Alert,
} from "react-native";
import firebase from "../../Config";
const database = firebase.database();
import { supabase } from "../../Config";

export default function MyProfil(props) {
  const [nom, setNom] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [telephone, setTelephone] = useState("");
  const [uriImage, setUriImage] = useState("");
  const [isDefaultImage, setIsDefaultImage] = useState(true);
  const currentid = props.route.params.currentid;

  const uploadImageToSupabase = async () => {
    try {
      const response = await fetch(uriImage);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const { data, error } = await supabase.storage
        .from("profilsimages")
        .upload(`${currentid}.jpg`, arrayBuffer, { upsert: true });

      if (error) {
        console.error("Supabase upload error:", error);
        Alert.alert("Error", "Failed to upload image.");
        return "";
      }

      const { data: publicUrlData } = supabase.storage
        .from("profilsimages")
        .getPublicUrl(`${currentid}.jpg`);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("Error uploading image:", err);
      Alert.alert("Error", "An error occurred while uploading the image.");
      return "";
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypes,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setIsDefaultImage(false);
      setUriImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const refProfile = database.ref(`TableProfils/unprofil${currentid}`);
      const snapshot = await refProfile.once("value");
      const data = snapshot.val();
      if (data) {
        setNom(data.nom || "");
        setPseudo(data.pseudo || "");
        setTelephone(data.telephone || "");
        if (data.uriimage) {
          setIsDefaultImage(false);
          setUriImage(data.uriimage);
        }
      }
    };
    fetchData();
  }, [currentid]);

  const saveProfile = async () => {
    try {
      const refProfile = database.ref(`TableProfils/unprofil${currentid}`);
      const imageUri =
        uriImage && !isDefaultImage ? await uploadImageToSupabase() : "";

      await refProfile.update({
        nom,
        pseudo,
        telephone,
        uriimage: imageUri || uriImage,
      });

      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/download.jpg")}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text style={styles.textStyle}>My Account</Text>
      <TouchableHighlight onPress={pickImage}>
        <Image
          source={
            isDefaultImage
              ? require("../../assets/profil.png")
              : { uri: uriImage }
          }
          style={{
            borderRadius: 100,
            height: 200,
            width: 200,
          }}
        />
      </TouchableHighlight>
      <TextInput
        onChangeText={setNom}
        value={nom}
        textAlign="center"
        placeholderTextColor="#fff"
        placeholder="Name"
        style={styles.textInputStyle}
      />
      <TextInput
        onChangeText={setPseudo}
        value={pseudo}
        textAlign="center"
        placeholderTextColor="#fff"
        placeholder="Pseudo"
        style={styles.textInputStyle}
      />
      <TextInput
        onChangeText={setTelephone}
        value={telephone}
        placeholderTextColor="#fff"
        textAlign="center"
        placeholder="Phone Number"
        keyboardType="phone-pad"
        style={styles.textInputStyle}
      />
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor="#DDDDDD"
        style={styles.saveButton}
        onPress={saveProfile}
      >
        <Text style={{ color: "#FFF", fontSize: 24 }}>Save</Text>
      </TouchableHighlight>
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor="#DDDDDD"
        style={styles.saveButton}
        onPress={() => {
          props.navigation.replace("Authentification");
        }}
      >
        <Text style={{ color: "#FFF", fontSize: 24 }}>Disconnect</Text>
      </TouchableHighlight>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  textInputStyle: {
    fontWeight: "bold",
    backgroundColor: "#0004",
    fontSize: 20,
    color: "#fff",
    width: "75%",
    height: 50,
    borderRadius: 10,
    margin: 5,
  },
  textStyle: {
    fontSize: 40,
    fontFamily: "serif",
    color: "#07f",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    marginBottom: 10,
    borderColor: "#00f",
    borderWidth: 2,
    backgroundColor: "#08f6",
    height: 60,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
});
