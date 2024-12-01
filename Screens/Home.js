import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Group from "./Home/Group";
import ListProfil from "./Home/ListProfil";
import MyProfil from "./Home/MyProfil";

const Tab = createMaterialBottomTabNavigator();

export default function Home(props) {
  const currentid = props.route.params.currentid;
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ListProfil"
        component={ListProfil}
        initialParams={{ currentid: currentid }}
      />
      <Tab.Screen name="Group" component={Group} />
      <Tab.Screen
        name="MyProfil"
        component={MyProfil}
        initialParams={{ currentid: currentid }}
      />
    </Tab.Navigator>
  );
}
