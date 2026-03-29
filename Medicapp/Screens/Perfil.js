import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../store/useTheme";

export default function Perfil({ navigation }) {
  const { darkMode, t } = useTheme();
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg2 }]}>
      <StatusBar barStyle={t.statusBar} />
      <View style={[styles.header, { backgroundColor: t.card, borderBottomColor: t.separator }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={t.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.text }]}>Mi Perfil</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Ionicons name="pencil" size={20} color={t.primary} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarSection}>
          <View style={[styles.avatarCircle, { backgroundColor: t.bg3 }]}>
            <Ionicons name="person" size={40} color={t.textMuted} />
            <TouchableOpacity style={[styles.cameraBtn, { borderColor: t.bg2 }]}>
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.doctorName, { color: t.text }]}>Dr. Carlos Mendez</Text>
          <Text style={[styles.doctorRole, { color: t.textSub }]}>Medico General</Text>
        </View>
        <InfoSection title="Informacion Personal" icon="person-outline" iconColor="#2563EB" t={t}>
          <InfoRow label="Nombre Completo" value="Carlos Mendez Arriaga" t={t} />
          <InfoRow label="Email" value="demo@clinica.com" t={t} />
          <InfoRow label="Telefono" value="+52 612 345 678" t={t} last />
        </InfoSection>
        <InfoSection title="Informacion Profesional" icon="medical-outline" iconColor="#7C3AED" t={t}>
          <InfoRow label="Especialidad" value="Medicina General" t={t} />
          <InfoRow label="Colegio Medico" value="CM-28-45678" t={t} />
          <InfoRow label="Centro de Trabajo" value="Clinica San Rafael" t={t} last />
        </InfoSection>
        <View style={[styles.section, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={[styles.sectionHeader, { borderBottomColor: t.separator }]}>
            <View style={[styles.sectionIconBox, { backgroundColor: darkMode ? "#1E3A5F" : "#EFF6FF" }]}>
              <Ionicons name="shield-outline" size={18} color="#2563EB" />
            </View>
            <Text style={[styles.sectionTitle, { color: t.text }]}>Seguridad</Text>
          </View>
          <TouchableOpacity style={styles.row}>
            <Text style={[styles.rowLabel, { color: t.text }]}>Cambiar Contraseña</Text>
            <Ionicons name="chevron-forward" size={16} color={t.textMuted} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: t.separator }]} />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowLabel, { color: t.text }]}>Autenticacion en Dos Pasos</Text>
              <Text style={[styles.rowSub, twoFactor && { color: t.success }]}>{twoFactor ? "Activada" : "Desactivada"}</Text>
            </View>
            <Switch value={twoFactor} onValueChange={setTwoFactor} trackColor={{ false: "#E5E7EB", true: t.success }} ios_backgroundColor="#E5E7EB" />
          </View>
        </View>
        <View style={[styles.section, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={[styles.sectionHeader, { borderBottomColor: t.separator }]}>
            <View style={[styles.sectionIconBox, { backgroundColor: t.bg3 }]}>
              <Ionicons name="settings-outline" size={18} color={t.textSub} />
            </View>
            <Text style={[styles.sectionTitle, { color: t.text }]}>Configuracion de App</Text>
          </View>
          {["Notificaciones","Privacidad","Ayuda y Soporte"].map((item, i, arr) => (
            <React.Fragment key={item}>
              <TouchableOpacity style={styles.row}>
                <Text style={[styles.rowLabel, { color: t.text }]}>{item}</Text>
                <Ionicons name="chevron-forward" size={16} color={t.textMuted} />
              </TouchableOpacity>
              {i < arr.length - 1 && <View style={[styles.divider, { backgroundColor: t.separator }]} />}
            </React.Fragment>
          ))}
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace("InicioDeSesion")}>
          <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Cerrar Sesion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoSection({ title, icon, iconColor, t, children }) {
  const { darkMode } = useTheme();
  return (
    <View style={[styles.section, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
      <View style={[styles.sectionHeader, { borderBottomColor: t.separator }]}>
        <View style={[styles.sectionIconBox, { backgroundColor: t.bg3 }]}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <Text style={[styles.sectionTitle, { color: t.text }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function InfoRow({ label, value, last, t }) {
  return (
    <View>
      <TouchableOpacity style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.rowSublabel, { color: t.textMuted }]}>{label}</Text>
          <Text style={[styles.rowLabel, { color: t.text }]}>{value}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={t.textMuted} />
      </TouchableOpacity>
      {!last && <View style={[styles.divider, { backgroundColor: t.separator }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  editBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  scroll: { paddingHorizontal: 16, paddingBottom: 40 },
  avatarSection: { alignItems: "center", paddingVertical: 24 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  cameraBtn: { position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: "#2563EB", alignItems: "center", justifyContent: "center", borderWidth: 2 },
  doctorName: { fontSize: 20, fontWeight: "700" },
  doctorRole: { fontSize: 14, marginTop: 2 },
  section: { borderRadius: 14, marginBottom: 14, borderWidth: 1, overflow: "hidden" },
  sectionHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  sectionIconBox: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center", marginRight: 10 },
  sectionTitle: { fontSize: 15, fontWeight: "700" },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 12 },
  rowSublabel: { fontSize: 11, marginBottom: 2 },
  rowLabel: { fontSize: 14, fontWeight: "600" },
  rowSub: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, marginLeft: 14 },
  logoutBtn: { height: 52, backgroundColor: "#EF4444", borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 8 },
  logoutText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});