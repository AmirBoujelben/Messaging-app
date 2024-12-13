import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import firebase from "../../Config";

const database = firebase.database();
const ref_Groups = database.ref("Groups");

export default function Group(props) {
  const [groups, setGroups] = useState([]);
  const currentid = props.route.params.currentid;

  // Fetch groups from Firebase
  useEffect(() => {
    ref_Groups.on("value", (snapshot) => {
      const groupList = [];
      snapshot.forEach((group) => {
        groupList.push(group.val());
      });
      setGroups(groupList);
    });

    return () => ref_Groups.off();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Groups</Text>
      <FlatList
        style={styles.groupList}
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.groupItem}
            onPress={() =>
              props.navigation.navigate("GroupChat", {
                currentid: currentid,
                groupId: item.id,
              })
            }
          >
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  groupList: {
    flex: 1,
  },
  groupItem: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  groupDescription: {
    fontSize: 14,
    color: "#555",
  },
});
