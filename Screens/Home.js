import React, { useEffect, useState } from "react";
import { AppState } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Group from "./Home/Group";
import ListProfil from "./Home/ListProfil";
import MyProfil from "./Home/MyProfil";
import firebase from "../Config";
import { MaterialCommunityIcons } from "react-native-vector-icons"; // Import MaterialCommunityIcons

const database = firebase.database();

const Tab = createMaterialBottomTabNavigator();

export default function Home(props) {
  const currentId = props.route.params.currentid;
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const refProfil = database.ref(`TableProfils/unprofil${currentId}`);
    const userStatusRef = refProfil.child("status");

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        userStatusRef.set("online");
      } else if (nextAppState === "background" || nextAppState === "inactive") {
        userStatusRef.set("offline");
      }
      setAppState(nextAppState);
    };

    // Add event listener and save the subscription object
    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Set the status to online when the app starts
    if (appState === "active") {
      userStatusRef.set("online");
    }

    // Cleanup function: remove the event listener
    return () => {
      appStateSubscription.remove();
      userStatusRef.set("offline"); // Ensure offline status when the component unmounts or the app goes to the background
    };
  }, [currentId, appState]);

  return (
    <Tab.Navigator
      activeColor="#1e90ff"
      barStyle={{
        backgroundColor: "#fff",
      }}
    >
      <Tab.Screen
        name="ListProfil"
        component={ListProfil}
        initialParams={{ currentid: currentId }}
        options={{
          tabBarLabel: "Friends", // Tab label

          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-multiple" // Icon for multiple accounts
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Group"
        component={Group}
        initialParams={{ currentid: currentId }}
        options={{
          tabBarLabel: "Groups", // Tab label
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-group" // Icon for group accounts
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyProfil"
        component={MyProfil}
        initialParams={{ currentid: currentId }}
        options={{
          tabBarLabel: "My Profile", // Tab label
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account" // Icon for user profile
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
