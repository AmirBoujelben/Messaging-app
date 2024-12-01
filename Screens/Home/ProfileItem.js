import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function ProfileItem({ profile, onPress }) {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: profile.uriimage || "https://via.placeholder.com/50", // Default image if no URL
        }}
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.name}>{profile.nom}</Text>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Start Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    margin: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    marginTop: 5,
    backgroundColor: "#007BFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});