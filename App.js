import Authentification from "./Screens/Authentification";
import Home from "./Screens/Home";
import NewUser from "./Screens/NewUser";
import Chat from "./Screens/Chat";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GroupChat from "./Screens/GroupChat";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Authentification"
          component={Authentification}
        ></Stack.Screen>
        <Stack.Screen
          name="NewUser"
          component={NewUser}
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen name="Home" component={Home}></Stack.Screen>
        <Stack.Screen name="Chat" component={Chat}></Stack.Screen>
        <Stack.Screen name="GroupChat" component={GroupChat}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
