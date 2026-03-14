import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Perfil({ navigation }) {
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Ionicons name="pencil" size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Sección de Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color="#9CA3AF" />
            <TouchableOpacity style={styles.cameraBtn}>
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.doctorName}>Dr. Carlos Méndez</Text>
          <Text style={styles.doctorRole}>Médico General</Text>
        </View>

        {/* Información Personal */}
        <InfoSection title="Información Personal" icon="person-outline" iconColor="#2563EB">
          <InfoRow label="Nombre Completo" value="Carlos Méndez Arriaga" />
          <InfoRow label="Email" value="carlos.mendez@clinica.com" />
          <InfoRow label="Teléfono" value="+34 612 345 678" last />
        </InfoSection>

        {/* Información Profesional */}
        <InfoSection title="Información Profesional" icon="medical-outline" iconColor="#7C3AED">
          <InfoRow label="Especialidad" value="Medicina General" />
          <InfoRow label="Colegio Médico" value="CM-28-45678" />
          <InfoRow label="Centro de Trabajo" value="Clínica San Rafael" last />
        </InfoSection>

        {/* Seguridad */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="shield-outline" size={18} color="#2563EB" />
            </View>
            <Text style={styles.sectionTitle}>Seguridad</Text>
          </View>

          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Cambiar Contraseña</Text>
            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Autenticación en Dos Pasos</Text>
              <Text style={[styles.rowSub, twoFactor && { color: '#10B981' }]}>
                {twoFactor ? 'Activada' : 'Desactivada'}
              </Text>
            </View>
            <Switch
              value={twoFactor}
              onValueChange={setTwoFactor}
              trackColor={{ false: '#E5E7EB', true: '#10B981' }}
              thumbColor={Platform.OS === 'ios' ? undefined : (twoFactor ? '#FFFFFF' : '#F4F3F4')}
            />
          </View>
        </View>

        {/* Configuración de App */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBox, { backgroundColor: '#F3F4F6' }]}>
              <Ionicons name="settings-outline" size={18} color="#374151" />
            </View>
            <Text style={styles.sectionTitle}>Configuración de App</Text>
          </View>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Notificaciones</Text>
            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Privacidad</Text>
            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Ayuda y Soporte</Text>
            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={() => navigation.replace('InicioDeSesion')}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Componentes Auxiliares ---

function InfoSection({ title, icon, iconColor, children }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIconBox, { backgroundColor: '#EFF6FF' }]}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function InfoRow({ label, value, last }) {
  return (
    <View>
      <TouchableOpacity style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowSublabel}>{label}</Text>
          <Text style={styles.rowLabel}>{value}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
      </TouchableOpacity>
      {!last && <View style={styles.divider} />}
    </View>
  );
}

// --- Estilos ---

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 16, 
    paddingVertical: 12,
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6',
  },
  backBtn: { 
    width: 40, 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#111827' 
  },
  editBtn: { 
    width: 40, 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  scroll: { 
    paddingHorizontal: 16, 
    paddingBottom: 40 
  },
  avatarSection: { 
    alignItems: 'center', 
    paddingVertical: 24 
  },
  avatarCircle: {
    width: 90, 
    height: 90, 
    borderRadius: 45,
    backgroundColor: '#E5E7EB', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 12,
  },
  cameraBtn: {
    position: 'absolute', 
    bottom: 0, 
    right: 0,
    width: 28, 
    height: 28, 
    borderRadius: 14,
    backgroundColor: '#2563EB', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 2, 
    borderColor: '#F9FAFB',
  },
  doctorName: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#111827' 
  },
  doctorRole: { 
    fontSize: 14, 
    color: '#6B7280', 
    marginTop: 2 
  },
  section: {
    backgroundColor: '#fff', 
    borderRadius: 14,
    marginBottom: 14, 
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: 14, 
    paddingVertical: 12,
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6',
  },
  sectionIconBox: {
    width: 32, 
    height: 32, 
    borderRadius: 8,
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 10,
  },
  sectionTitle: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#111827' 
  },
  row: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: 14, 
    paddingVertical: 12,
  },
  rowSublabel: { 
    fontSize: 11, 
    color: '#9CA3AF', 
    marginBottom: 2 
  },
  rowLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#111827' 
  },
  rowSub: { 
    fontSize: 12, 
    color: '#9CA3AF', 
    marginTop: 2 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#F3F4F6', 
    marginLeft: 14 
  },
  logoutBtn: {
    height: 52, 
    backgroundColor: '#EF4444', 
    borderRadius: 14,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 8,
  },
  logoutText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 16 
  },
});