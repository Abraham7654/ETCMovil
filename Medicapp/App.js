import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, darkTheme } from './theme/theme';

import InicioDeSesion from './screens/InicioDeSesion';
import ListaDePacientes from './screens/ListaDePacientes';
import CrearPaciente from './screens/CrearPaciente';
import HistorialPaciente from './screens/HistorialPaciente';
import NotasPaciente from './screens/NotasPaciente';
import SignosVitales from './screens/SignosVitales';
import ListaDeCitas from './screens/ListaDeCitas';
import CrearCita from './screens/CrearCita';
import RecordatorioDeCita from './screens/RecordatorioDeCita';
import Ajustes from './screens/Ajustes';
import Perfil from './screens/Perfil';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// darkMode y toggleDark se pasan como initialParams a cada stack
function PacientesStack({ route }) {
  const { darkMode, toggleDark } = route?.params || {};
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListaDePacientes" component={ListaDePacientes} initialParams={{ darkMode, toggleDark }} />
      <Stack.Screen name="CrearPaciente" component={CrearPaciente} initialParams={{ darkMode }} />
      <Stack.Screen name="HistorialPaciente" component={HistorialPaciente} initialParams={{ darkMode }} />
      <Stack.Screen name="NotasPaciente" component={NotasPaciente} initialParams={{ darkMode }} />
      <Stack.Screen name="SignosVitales" component={SignosVitales} initialParams={{ darkMode }} />
    </Stack.Navigator>
  );
}

function CitasStack({ route }) {
  const { darkMode } = route?.params || {};
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListaDeCitas" component={ListaDeCitas} initialParams={{ darkMode }} />
      <Stack.Screen name="CrearCita" component={CrearCita} initialParams={{ darkMode }} />
      <Stack.Screen name="RecordatorioDeCita" component={RecordatorioDeCita} initialParams={{ darkMode }} />
    </Stack.Navigator>
  );
}

function AjustesStack({ route }) {
  const { darkMode, toggleDark } = route?.params || {};
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Ajustes" component={Ajustes} initialParams={{ darkMode, toggleDark }} />
      <Stack.Screen name="Perfil" component={Perfil} initialParams={{ darkMode }} />
    </Stack.Navigator>
  );
}

function MainTabs({ darkMode, toggleDark }) {
  const t = darkMode ? darkTheme : lightTheme;
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
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'PacientesTab') iconName = 'people';
          else if (route.name === 'CitasTab') iconName = 'calendar';
          else if (route.name === 'AjustesTab') iconName = 'settings';
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="PacientesTab" options={{ title: 'Pacientes' }}>
        {(props) => <PacientesStack {...props} route={{ ...props.route, params: { darkMode, toggleDark } }} />}
      </Tab.Screen>
      <Tab.Screen name="CitasTab" options={{ title: 'Citas' }}>
        {(props) => <CitasStack {...props} route={{ ...props.route, params: { darkMode } }} />}
      </Tab.Screen>
      <Tab.Screen name="AjustesTab" options={{ title: 'Ajustes' }}>
        {(props) => <AjustesStack {...props} route={{ ...props.route, params: { darkMode, toggleDark } }} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDark = () => setDarkMode(prev => !prev);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="InicioDeSesion" component={InicioDeSesion} />
        <Stack.Screen name="Main">
          {() => <MainTabs darkMode={darkMode} toggleDark={toggleDark} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}