import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import firebase from "../../Config";
const database = firebase.database();
const auth = firebase.auth();
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

  const pickImage = async (useCamera) => {
    try {
      // Request permissions based on the choice
      const permission = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permission.status !== "granted") {
        alert(
          `Permission to access ${useCamera ? "camera" : "gallery"} was denied`
        );
        return;
      }

      // Open camera or gallery
      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypes,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
          });

      if (!result.canceled) {
        setIsDefaultImage(false);
        setUriImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
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

  const handleImagePick = () => {
    Alert.alert("Upload Picture", "", [
      { text: "Open Camera", onPress: () => pickImage(true) },
      { text: "Select from Gallery", onPress: () => pickImage(false) },
    ]);
  };

  return (
    <ImageBackground
      source={require("../../assets/download.jpg")}
      style={styles.container}
    >
      <View style={styles.box}>
        <Text style={styles.textStyle}>My Account</Text>

        {/* Profile Image */}
        <TouchableOpacity
          onPress={handleImagePick}
          style={styles.profileImageContainer}
        >
          <Image
            source={
              isDefaultImage
                ? require("../../assets/profil.png")
                : { uri: uriImage }
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>

        {/* Name Input */}
        <TextInput
          onChangeText={setNom}
          value={nom}
          textAlign="center"
          placeholderTextColor="#fff"
          placeholder="Name"
          style={styles.textInputStyle}
        />

        {/* Pseudo Input */}
        <TextInput
          onChangeText={setPseudo}
          value={pseudo}
          textAlign="center"
          placeholderTextColor="#fff"
          placeholder="Pseudo"
          style={styles.textInputStyle}
        />

        {/* Phone Number Input */}
        <TextInput
          onChangeText={setTelephone}
          value={telephone}
          placeholderTextColor="#fff"
          textAlign="center"
          placeholder="Phone Number"
          keyboardType="phone-pad"
          style={styles.textInputStyle}
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.buttonStyle} onPress={saveProfile}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

        {/* Disconnect Button */}
        <TouchableOpacity
          style={[styles.buttonStyle, styles.disconnectButton]}
          onPress={() => {
            auth
              .signOut()
              .then(() => {
                props.navigation.replace("Authentification");
              })
              .catch((error) => {
                console.error("Error signing out:", error.message);
              });
          }}
        >
          <Text style={styles.buttonText}>Disconnect</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  box: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    borderRadius: 100,
    height: 200,
    width: 200,
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  textInputStyle: {
    fontWeight: "bold",
    backgroundColor: "#fff",
    fontSize: 18,
    color: "black",
    width: "80%",
    height: 50,
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  textStyle: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonStyle: {
    width: "80%",
    backgroundColor: "#1e90ff",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 10,
  },
  disconnectButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
