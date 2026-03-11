import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Switch,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    console.log("Cerrar sesión");
    // Lógica para cerrar sesión e ir a la pantalla de Login
  };

  const renderSettingItem = (icon, title, onPress, showArrow = true, rightElement = null) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingItemLeft}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={20} color="#4B5563" />
        </View>
        <Text style={styles.settingItemTitle}>{title}</Text>
      </View>
      {rightElement ? (
        rightElement
      ) : showArrow ? (
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ajustes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Sección: Cuenta */}
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <View style={styles.sectionContainer}>
          {renderSettingItem('person-outline', 'Perfil', () => navigation.navigate('Profile'))}
          <View style={styles.divider} />
          {renderSettingItem(
            'notifications-outline', 
            'Notificaciones', 
            null, 
            false,
            <Switch
              trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
              thumbColor={notificationsEnabled ? "#2563EB" : "#F3F4F6"}
              ios_backgroundColor="#D1D5DB"
              onValueChange={setNotificationsEnabled}
              value={notificationsEnabled}
            />
          )}
        </View>

        {/* Sección: Clínica */}
        <Text style={styles.sectionTitle}>Clínica</Text>
        <View style={styles.sectionContainer}>
          {renderSettingItem('time-outline', 'Horarios de Atención', () => console.log('Horarios'))}
          <View style={styles.divider} />
          {renderSettingItem('card-outline', 'Métodos de Pago', () => console.log('Pagos'))}
        </View>

        {/* Sección: Soporte */}
        <Text style={styles.sectionTitle}>Soporte</Text>
        <View style={styles.sectionContainer}>
          {renderSettingItem('help-circle-outline', 'Ayuda', () => console.log('Ayuda'))}
          <View style={styles.divider} />
          {renderSettingItem('document-text-outline', 'Términos y Condiciones', () => console.log('TyC'))}
        </View>

        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom Tabs (Visual) */}
      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Patients')}>
          <Ionicons name="people" size={24} color="#9CA3AF" />
          <Text style={styles.tabText}>Pacientes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Appointments')}>
          <Ionicons name="calendar" size={24} color="#9CA3AF" />
          <Text style={styles.tabText}>Citas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="settings" size={24} color="#2563EB" />
          <Text style={[styles.tabText, { color: '#2563EB' }]}>Ajustes</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Fondo ligeramente gris
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Espacio para Bottom Tabs
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 10,
    marginLeft: 4,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingItemTitle: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 60, // Para alinear con el texto, saltando el icono
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2', // Rojo muy clarito
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#9CA3AF',
  },
});