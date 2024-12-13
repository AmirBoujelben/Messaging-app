import React, { useEffect } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Group from "./Home/Group";
import ListProfil from "./Home/ListProfil";
import MyProfil from "./Home/MyProfil";
import firebase from "../Config";

const database = firebase.database();

const Tab = createMaterialBottomTabNavigator();

export default function Home(props) {
  const currentid = props.route.params.currentid;

  useEffect(() => {
    // Set the user's status to "online"
    const refProfil = database.ref(`TableProfils/unprofil${currentid}`);
    const userStatusRef = refProfil.child("status");
    userStatusRef.set("online");

    // Clean up to ensure status is reset if needed in this component's unmount logic
    return () => {
      userStatusRef.set("offline"); // Temporary fallback; adjust as needed
    };
  }, [currentid]);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ListProfil"
        component={ListProfil}
        initialParams={{ currentid: currentid }}
      />
      <Tab.Screen
        name="Group"
        component={Group}
        initialParams={{ currentid: currentid }}
      />
      <Tab.Screen
        name="MyProfil"
        component={MyProfil}
        initialParams={{ currentid: currentid }}
      />
    </Tab.Navigator>
  );
}
