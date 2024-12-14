import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import firebase from "../../Config";

const database = firebase.database();
const ref_Groups = database.ref("Groups");

export default function Group(props) {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateGroup, setShowCreateGroup] = useState(false); // New state for showing create group UI
  const currentid = props.route.params.currentid;

  // Fetch groups from Firebase
  useEffect(() => {
    ref_Groups.on("value", (snapshot) => {
      const groupList = [];
      snapshot.forEach((group) => {
        groupList.push(group.val());
      });
      setGroups(groupList);
      setLoading(false);
    });

    return () => ref_Groups.off();
  }, []);

  // Function to create a new group
  const createGroup = () => {
    if (!newGroupName.trim()) {
      alert("Group name cannot be empty.");
      return;
    }

    const groupId = ref_Groups.push().key;
    const newGroup = {
      id: groupId,
      name: newGroupName,
      description: newGroupDescription || "",
      members: { [currentid]: true },
    };

    ref_Groups.child(groupId).set(newGroup);
    setNewGroupName("");
    setNewGroupDescription("");
    alert("Group created successfully!");
    setShowCreateGroup(false); // Hide the form after creating the group
  };

  return (
    <ImageBackground
      source={require("../../assets/download.jpg")}
      style={styles.container}
    >
      {/* Header */}
      <Text style={styles.header}>Groups</Text>

      {/* Button to toggle create group form */}
      <TouchableOpacity
        style={styles.toggleCreateButton}
        onPress={() => setShowCreateGroup(!showCreateGroup)}
      >
        <Text style={styles.toggleCreateButtonText}>
          {showCreateGroup ? "Cancel" : "Create Group"}
        </Text>
      </TouchableOpacity>

      {/* Create Group Form (only visible when showCreateGroup is true) */}
      {showCreateGroup && (
        <View style={styles.createContainer}>
          <TextInput
            style={styles.input}
            placeholder="Group Name"
            value={newGroupName}
            onChangeText={setNewGroupName}
          />
          <TextInput
            style={styles.input}
            placeholder="Description (optional)"
            value={newGroupDescription}
            onChangeText={setNewGroupDescription}
          />
          <TouchableOpacity style={styles.createButton} onPress={createGroup}>
            <Text style={styles.createButtonText}>Create Group</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#FFF" style={styles.loader} />
      ) : (
        // List Groups
        <FlatList
          style={styles.groupList}
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.groupItem}
              onPress={() => {
                if (!item.members || !item.members[currentid]) {
                  // Add the current user to the members
                  const updatedMembers = { ...item.members, [currentid]: true };

                  ref_Groups
                    .child(item.id)
                    .update({ members: updatedMembers })
                    .then(() => {
                      console.log(
                        `User ${currentid} added to group ${item.name}`
                      );
                      props.navigation.navigate("GroupChat", {
                        currentid: currentid,
                        groupId: item.id,
                      });
                    })
                    .catch((error) => {
                      console.error("Error adding user to group:", error);
                    });
                } else {
                  // User is already a member, just navigate
                  props.navigation.navigate("GroupChat", {
                    currentid: currentid,
                    groupId: item.id,
                    groupName: item.name,
                  });
                }
              }}
            >
              <Text style={styles.groupName}>{item.name}</Text>
              <Text style={styles.groupDescription}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 30,
  },
  header: {
    fontSize: 36,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  toggleCreateButton: {
    backgroundColor: "#1e90ff",
    height: 55,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 10,
  },
  toggleCreateButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  createContainer: {
    backgroundColor: "#0008",
    padding: 20,
    borderRadius: 15,
    marginVertical: 20,
    width: "90%",
    alignItems: "center",
  },
  input: {
    fontWeight: "bold",
    backgroundColor: "#fff",
    fontSize: 18,
    color: "black",
    width: "80%",
    height: 50,
    borderRadius: 12,
    marginVertical: 10,
    paddingLeft: 10,
  },
  createButton: {
    marginTop: 15,
    borderColor: "#00f",
    backgroundColor: "#1e90ff",
    height: 55,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  createButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  groupList: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "90%",
    borderRadius: 15,
    marginVertical: 10,
  },
  groupItem: {
    backgroundColor: "#FFF",
    padding: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  groupName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  groupDescription: {
    fontSize: 16,
    color: "#777",
    marginTop: 5,
  },
  loader: {
    marginTop: 50,
  },
});
