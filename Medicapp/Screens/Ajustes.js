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

export default function Ajustes({ navigation }) {
  const [modoOscuro, setModoOscuro] = useState(false);
  const [notifPush, setNotifPush] = useState(true);
  const [notifCitas, setNotifCitas] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Ajustes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.profileRow} onPress={() => navigation.navigate('Perfil')}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={24} color="#9CA3AF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>Dr. Carlos Méndez</Text>
            <Text style={styles.profileRole}>Medico General</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
        </TouchableOpacity>

        <SectionTitle title="General" />
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: '#1E1B4B' }]}>
              <Ionicons name="moon" size={16} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Modo Oscuro</Text>
              <Text style={styles.settingDesc}>Tema visual de la app</Text>
            </View>
            <Switch
              value={modoOscuro}
              onValueChange={setModoOscuro}
              trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
              ios_backgroundColor="#E5E7EB"
            />
          </View>
          <View style={styles.divider} />
          <SettingItem 
            icon="language-outline" 
            iconBg="#3B82F6" 
            label="Idioma" 
            desc="Español" 
            arrow 
          />
        </View>

        <SectionTitle title="Notificaciones" />
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: '#2563EB' }]}>
              <Ionicons name="notifications" size={16} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Notificaciones Push</Text>
              <Text style={styles.settingDesc}>Alertas y recordatorios</Text>
            </View>
            <Switch 
              value={notifPush} 
              onValueChange={setNotifPush}
              trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
              ios_backgroundColor="#E5E7EB" 
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: '#7C3AED' }]}>
              <Ionicons name="calendar" size={16} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Recordatorios de Citas</Text>
              <Text style={styles.settingDesc}>30 min antes de cada cita</Text>
            </View>
            <Switch 
              value={notifCitas} 
              onValueChange={setNotifCitas}
              trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
              ios_backgroundColor="#E5E7EB" 
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: '#0EA5E9' }]}>
              <Ionicons name="mail" size={16} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Notificaciones por Email</Text>
              <Text style={styles.settingDesc}>Resúmenes diarios</Text>
            </View>
            <Switch 
              value={notifEmail} 
              onValueChange={setNotifEmail}
              trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
              ios_backgroundColor="#E5E7EB" 
            />
          </View>
        </View>

        <SectionTitle title="Seguridad" />
        <View style={styles.section}>
          <SettingItem icon="lock-closed" iconBg="#6B7280" label="Cambiar Contraseña" arrow />
        </View>

        <SectionTitle title="Soporte" />
        <View style={styles.section}>
          <SettingItem icon="help-circle" iconBg="#3B82F6" label="Centro de Ayuda" arrow />
          <View style={styles.divider} />
          <SettingItem icon="headset" iconBg="#6366F1" label="Contactar Soporte" arrow />
          <View style={styles.divider} />
          <SettingItem icon="shield-checkmark" iconBg="#2563EB" label="Política de Privacidad" arrow />
          <View style={styles.divider} />
          <SettingItem icon="document-text" iconBg="#374151" label="Términos y Condiciones" arrow />
        </View>

        <Text style={styles.version}>Versión 1.2.4</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ title }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function SettingItem({ icon, iconBg, label, desc, arrow }) {
  return (
    <TouchableOpacity style={styles.settingRow}>
      <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={16} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingLabel}>{label}</Text>
        {desc && <Text style={styles.settingDesc}>{desc}</Text>}
      </View>
      {arrow && <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 16, 
    paddingBottom: 12 
  },
  title: { 
    fontSize: 26, 
    fontWeight: '800', 
    color: '#111827' 
  },
  scroll: { 
    paddingHorizontal: 16, 
    paddingBottom: 40 
  },
  profileRow: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#fff', 
    borderRadius: 14,
    padding: 14, 
    marginBottom: 20,
    borderWidth: 1, 
    borderColor: '#E5E7EB',
  },
  profileAvatar: {
    width: 48, 
    height: 48, 
    borderRadius: 24,
    backgroundColor: '#F3F4F6', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12,
  },
  profileName: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#111827' 
  },
  profileRole: { 
    fontSize: 13, 
    color: '#6B7280', 
    marginTop: 2 
  },
  sectionTitle: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#9CA3AF', 
    textTransform: 'uppercase', 
    marginBottom: 6, 
    marginTop: 4, 
    letterSpacing: 0.5 
  },
  section: { 
    backgroundColor: '#fff', 
    borderRadius: 14, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    overflow: 'hidden' 
  },
  settingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 14 
  },
  settingIcon: { 
    width: 34, 
    height: 34, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  settingLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#111827' 
  },
  settingDesc: { 
    fontSize: 12, 
    color: '#9CA3AF', 
    marginTop: 1 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#F3F4F6', 
    marginLeft: 60 
  },
  version: { 
    textAlign: 'center', 
    color: '#9CA3AF', 
    fontSize: 12, 
    marginTop: 16 
  },
});