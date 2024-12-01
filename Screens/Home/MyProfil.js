import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
} from "react-native";
import firebase from "../../Config";
const database = firebase.database();
import { supabase } from "../../Config";

export default function MyProfil(props) {
  const [nom, setNom] = useState();
  const [pseudo, setpseudo] = useState();
  const [telephone, setTelephone] = useState();
  const [uriImage, seturiImage] = useState();
  const [isDefaultImage, setisDefaultImage] = useState(true);
  const currentid = props.route.params.currentid;

  const uploadImageToSupabase = async () => {
    // convert uri to text
    const reponse = await fetch(uriImage);
    const blob = await response.blob();
    const arraybuffer = await new Response(blob).arrayBuffer();
    // save arraybuffer to storage
    supabase.storage
      .from("profilsimages")
      .upload(currentid + ".jpg", arraybuffer, { upsert: true });
    // get public uri
    const { data } = supabase.storage
      .from("profilsimages")
      .getPublicUrl(currentid + ".jpg");
    return data.publicUrl;
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.mediaTypes,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setisDefaultImage(false);
      seturiImage(result.assets[0].uri);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/profil.png")}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text style={styles.textstyle}>My Account</Text>

      <TouchableHighlight
        onPress={() => {
          pickImage();
        }}
      >
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
        onChangeText={(text) => {
          setNom(text);
        }}
        textAlign="center"
        placeholderTextColor="#fff"
        placeholder="Nom"
        keyboardType="name-phone-pad"
        style={styles.textinputstyle}
      ></TextInput>
      <TextInput
        onChangeText={(text) => {
          setpseudo(text);
        }}
        textAlign="center"
        placeholderTextColor="#fff"
        placeholder="Pseudo"
        keyboardType="name-phone-pad"
        style={styles.textinputstyle}
      ></TextInput>
      <TextInput
        onChangeText={(text) => {
          setTelephone(text);
        }}
        placeholderTextColor="#fff"
        textAlign="center"
        placeholder="Telephone"
        style={styles.textinputstyle}
      ></TextInput>
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor="#DDDDDD"
        style={{
          marginBottom: 10,
          borderColor: "#00f",
          borderWidth: 2,
          backgroundColor: "#08f6",
          textstyle: "italic",
          fontSize: 24,
          height: 60,
          width: "50%",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 5,
          marginTop: 20,
        }}
        onPress={async () => {
          const ref_TableProfils = database.ref("TableProfils");
          const ref_unprofil = ref_TableProfils.child("unprofil" + currentid);
          const urlimage = await uploadImageToSupabase();
          ref_unprofil.set({
            id: currentid,
            nom,
            pseudo,
            telephone,
            uriimage: urlimage,
          });
        }}
      >
        <Text
          style={{
            color: "#FFF",
            fontSize: 24,
          }}
        >
          Save
        </Text>
      </TouchableHighlight>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  textinputstyle: {
    fontWeight: "bold",
    backgroundColor: "#0004",
    fontSize: 20,
    color: "#fff",
    width: "75%",
    height: 50,
    borderRadius: 10,
    margin: 5,
  },
  textstyle: {
    fontSize: 40,
    fontFamily: "serif",
    color: "#07f",
    fontWeight: "bold",
  },
  container: {
    color: "blue",
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
