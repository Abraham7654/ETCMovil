import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../store/useTheme";
import { sessionStore } from "../store/sessionStore";

export default function Ajustes({ navigation }) {
  const { darkMode, t, toggleDark } = useTheme();
  const [notifPush, setNotifPush] = useState(true);
  const [notifCitas, setNotifCitas] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    sessionStore.obtener().then(u => { if (u) setUsuario(u); });
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg2 }]}>
      <StatusBar barStyle={t.statusBar} />
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
        <Text style={[styles.title, { color: t.text }]}>Ajustes</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Perfil row - muestra datos reales */}
        <TouchableOpacity
          style={[styles.profileRow, { backgroundColor: t.card, borderColor: t.cardBorder }]}
          onPress={() => navigation.navigate("Perfil", { usuario })}
        >
          <View style={[styles.profileAvatar, { backgroundColor: t.bg3 }]}>
            {usuario ? (
              <Text style={[styles.avatarInitials, { color: t.primary }]}>
                {usuario.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </Text>
            ) : (
              <Ionicons name="person" size={24} color={t.textMuted} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.profileName, { color: t.text }]}>
              {usuario?.nombre || 'Dr. Carlos Méndez'}
            </Text>
            <Text style={[styles.profileRole, { color: t.textSub }]}>
              {usuario?.especialidad || 'Médico General'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={t.textMuted} />
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: t.textMuted }]}>GENERAL</Text>
        <View style={[styles.section, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: "#1E1B4B" }]}>
              <Ionicons name="moon" size={16} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: t.text }]}>Modo Oscuro</Text>
              <Text style={[styles.settingDesc, { color: t.textMuted }]}>Tema visual de la app</Text>
            </View>
            <Switch value={darkMode} onValueChange={toggleDark}
              trackColor={{ false: "#E5E7EB", true: t.primary }} ios_backgroundColor="#E5E7EB" />
          </View>
          <View style={[styles.divider, { backgroundColor: t.separator }]} />
          <TouchableOpacity style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: "#3B82F6" }]}>
              <Ionicons name="language-outline" size={16} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: t.text }]}>Idioma</Text>
              <Text style={[styles.settingDesc, { color: t.textMuted }]}>Español</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={t.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: t.textMuted }]}>NOTIFICACIONES</Text>
        <View style={[styles.section, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: "#2563EB" }]}>
              <Ionicons name="notifications" size={16} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: t.text }]}>Notificaciones Push</Text>
              <Text style={[styles.settingDesc, { color: t.textMuted }]}>Alertas y recordatorios</Text>
            </View>
            <Switch value={notifPush} onValueChange={setNotifPush}
              trackColor={{ false: "#E5E7EB", true: t.primary }} ios_backgroundColor="#E5E7EB" />
          </View>
          <View style={[styles.divider, { backgroundColor: t.separator }]} />
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: "#7C3AED" }]}>
              <Ionicons name="calendar" size={16} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: t.text }]}>Recordatorios de Citas</Text>
              <Text style={[styles.settingDesc, { color: t.textMuted }]}>30 min antes</Text>
            </View>
            <Switch value={notifCitas} onValueChange={setNotifCitas}
              trackColor={{ false: "#E5E7EB", true: t.primary }} ios_backgroundColor="#E5E7EB" />
          </View>
          <View style={[styles.divider, { backgroundColor: t.separator }]} />
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: "#0EA5E9" }]}>
              <Ionicons name="mail" size={16} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: t.text }]}>Notificaciones por Email</Text>
              <Text style={[styles.settingDesc, { color: t.textMuted }]}>Resúmenes diarios</Text>
            </View>
            <Switch value={notifEmail} onValueChange={setNotifEmail}
              trackColor={{ false: "#E5E7EB", true: t.primary }} ios_backgroundColor="#E5E7EB" />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: t.textMuted }]}>SEGURIDAD</Text>
        <View style={[styles.section, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <TouchableOpacity style={styles.settingRow}
            onPress={() => navigation.navigate('Perfil', { usuario })}>
            <View style={[styles.settingIcon, { backgroundColor: "#6B7280" }]}>
              <Ionicons name="lock-closed" size={16} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: t.text }]}>Cambiar Contraseña</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={t.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: t.textMuted }]}>SOPORTE</Text>
        <View style={[styles.section, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <TouchableOpacity style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: "#3B82F6" }]}><Ionicons name="help-circle" size={16} color="#fff" /></View>
            <View style={{ flex: 1 }}><Text style={[styles.settingLabel, { color: t.text }]}>Centro de Ayuda</Text></View>
            <Ionicons name="chevron-forward" size={16} color={t.textMuted} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: t.separator }]} />
          <TouchableOpacity style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: "#6366F1" }]}><Ionicons name="headset" size={16} color="#fff" /></View>
            <View style={{ flex: 1 }}><Text style={[styles.settingLabel, { color: t.text }]}>Contactar Soporte</Text></View>
            <Ionicons name="chevron-forward" size={16} color={t.textMuted} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: t.separator }]} />
          <TouchableOpacity style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: "#374151" }]}><Ionicons name="document-text" size={16} color="#fff" /></View>
            <View style={{ flex: 1 }}><Text style={[styles.settingLabel, { color: t.text }]}>Términos y Condiciones</Text></View>
            <Ionicons name="chevron-forward" size={16} color={t.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.version, { color: t.textMuted }]}>Versión 1.2.4</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 26, fontWeight: "800" },
  scroll: { paddingHorizontal: 16, paddingBottom: 40 },
  profileRow: { flexDirection: "row", alignItems: "center", borderRadius: 14, padding: 14, marginBottom: 20, borderWidth: 1 },
  profileAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", marginRight: 12 },
  avatarInitials: { fontSize: 18, fontWeight: '800' },
  profileName: { fontSize: 16, fontWeight: "700" },
  profileRole: { fontSize: 13, marginTop: 2 },
  sectionTitle: { fontSize: 12, fontWeight: "700", textTransform: "uppercase", marginBottom: 6, marginTop: 4, letterSpacing: 0.5 },
  section: { borderRadius: 14, marginBottom: 16, borderWidth: 1, overflow: "hidden" },
  settingRow: { flexDirection: "row", alignItems: "center", padding: 14 },
  settingIcon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 12 },
  settingLabel: { fontSize: 14, fontWeight: "600" },
  settingDesc: { fontSize: 12, marginTop: 1 },
  divider: { height: 1, marginLeft: 60 },
  version: { textAlign: "center", fontSize: 12, marginTop: 16 },
});