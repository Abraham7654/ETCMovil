import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, LogBox } from "react-native"; // <-- LogBox añadido
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { initDB } from "./database/Database";
import { themeStore } from "./store/themeStore";
import { sessionStore } from "./store/sessionStore";
import { lightTheme, darkTheme } from "./theme/theme";

import InicioDeSesion from "./screens/InicioDeSesion";
import ListaDePacientes from "./screens/ListaDePacientes";
import CrearPaciente from "./screens/CrearPaciente";
import EditarPaciente from "./screens/EditarPaciente";
import HistorialPaciente from "./screens/HistorialPaciente";
import NotasPaciente from "./screens/NotasPaciente";
import SignosVitales from "./screens/SignosVitales";
import ListaDeCitas from "./screens/ListaDeCitas";
import CrearCita from "./screens/CrearCita";
import RecordatorioDeCita from "./screens/RecordatorioDeCita";
import Ajustes from "./screens/Ajustes";
import Perfil from "./screens/Perfil";
import CambiarPassword from "./screens/CambiarPassword";
import EditarCita from "./screens/EditarCita";

// ─── SILENCIAR ADVERTENCIAS EN LA TERMINAL ──────────────────
LogBox.ignoreLogs([
  'expo-notifications', 
  'SafeAreaView has been deprecated',
  'A navigator can only contain',
  'The action \'NAVIGATE\' with payload',
]);
// ───────────────────────────────────────────────────────────

// ─── Notificaciones compatibles con SDK 53 ──────────────────
let Notifications = null;
try {
  Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,   // Compatibilidad
      shouldShowBanner: true,  // Nuevo SDK 53
      shouldShowList: true,    // Nuevo SDK 53
      shouldPlaySound: true,
      shouldSetBadge: false, 
    }),
  });
} catch (e) {
  console.warn('expo-notifications no disponible:', e.message);
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function PacientesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListaDePacientes" component={ListaDePacientes} />
      <Stack.Screen name="CrearPaciente" component={CrearPaciente} />
      <Stack.Screen name="EditarPaciente" component={EditarPaciente} />
      <Stack.Screen name="HistorialPaciente" component={HistorialPaciente} />
      <Stack.Screen name="NotasPaciente" component={NotasPaciente} />
      <Stack.Screen name="SignosVitales" component={SignosVitales} />
    </Stack.Navigator>
  );
}

function CitasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListaDeCitas" component={ListaDeCitas} />
      <Stack.Screen name="CrearCita" component={CrearCita} />
      <Stack.Screen name="RecordatorioDeCita" component={RecordatorioDeCita} />
      <Stack.Screen name="EditarCita" component={EditarCita} />
    </Stack.Navigator>
  );
}

function AjustesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Ajustes" component={Ajustes} />
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="CambiarPassword" component={CambiarPassword} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const [darkMode, setDarkMode] = useState(themeStore.getDarkMode());
  const t = darkMode ? darkTheme : lightTheme;

  useEffect(() => {
    const unsub = themeStore.subscribe(setDarkMode);
    return unsub;
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: t.primary,
        tabBarInactiveTintColor: t.textMuted,
        tabBarStyle: {
          backgroundColor: t.tabBar,
          borderTopColor: t.tabBorder,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "500" },
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === "PacientesTab") iconName = "people";
          else if (route.name === "CitasTab") iconName = "calendar";
          else if (route.name === "AjustesTab") iconName = "settings";
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="PacientesTab" component={PacientesStack} options={{ title: "Pacientes" }} />
      <Tab.Screen name="CitasTab" component={CitasStack} options={{ title: "Citas" }} />
      <Tab.Screen name="AjustesTab" component={AjustesStack} options={{ title: "Ajustes" }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [sesionActiva, setSesionActiva] = useState(undefined);

  useEffect(() => {
    arrancar();
  }, []);

  const arrancar = async () => {
    await initDB().catch(e => console.error("Error DB:", e));

    if (Notifications) {
      try {
        await Notifications.requestPermissionsAsync();
      } catch (e) {
        // Silenciado para que no ensucie la terminal
      }
    }

    const sesion = await sessionStore.obtener();
    setSesionActiva(sesion || null);
    setDbReady(true);
  };

  if (!dbReady || sesionActiva === undefined) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={sesionActiva ? "Main" : "InicioDeSesion"}
      >
        <Stack.Screen name="InicioDeSesion" component={InicioDeSesion} />
        <Stack.Screen 
          name="Main" 
          component={MainTabs} 
          initialParams={sesionActiva ? { usuario: sesionActiva } : undefined} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}