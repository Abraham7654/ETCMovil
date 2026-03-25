import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Switch, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/useTheme';

export default function RecordatorioDeCita({ navigation, route }) {
  const { darkMode, t } = useTheme();
  const [r15min, setR15min] = useState(true);
  const [r1hora, setR1hora] = useState(false);
  const [r1dia, setR1dia] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />
      <View style={[styles.header, { borderBottomColor: t.separator }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={t.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.text }]}>Recordatorio de Cita</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.notifBanner, { backgroundColor: darkMode ? '#1E3A5F' : '#EFF6FF' }]}>
          <View style={[styles.notifIcon, { backgroundColor: t.primary }]}>
            <Ionicons name="notifications" size={20} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.notifTitle, { color: darkMode ? '#93C5FD' : '#1E40AF' }]}>Recordatorio Próximo</Text>
            <Text style={[styles.notifSub, { color: darkMode ? '#60A5FA' : '#3B82F6' }]}>Cita con María González mañana a las 10:30 AM</Text>
            <Text style={[styles.notifTime, { color: darkMode ? '#475569' : '#93C5FD' }]}>Hace 2 minutos</Text>
          </View>
        </View>

        <View style={[styles.citaCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={styles.citaCardHeader}>
            <Text style={[styles.citaCardTitle, { color: t.text }]}>Detalles de la Cita</Text>
            <Text style={[styles.confirmadaBadge, { color: t.success }]}>Confirmada</Text>
          </View>
          <View style={[styles.fechaBlock, { backgroundColor: t.bg3, borderColor: t.separator }]}>
            <Text style={[styles.fechaDia, { color: t.primary }]}>15</Text>
            <Text style={[styles.fechaMes, { color: t.primary }]}>Marzo 2024</Text>
            <Text style={[styles.fechaHora, { color: t.text }]}>10:30 AM</Text>
            <Text style={[styles.fechaDuracion, { color: t.textSub }]}>45 minutos de duración</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomColor: t.separator }]}>
            <View style={[styles.avatarSmall, { backgroundColor: t.bg3 }]}>
              <Ionicons name="person-circle-outline" size={24} color={t.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoName, { color: t.text }]}>María González</Text>
              <Text style={[styles.infoSub, { color: t.textMuted }]}>ID: 001234</Text>
            </View>
            <TouchableOpacity style={[styles.phoneBtn, { backgroundColor: darkMode ? '#1E3A5F' : '#EFF6FF' }]}>
              <Ionicons name="call" size={18} color={t.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={t.textSub} style={styles.rowIcon} />
            <View><Text style={[styles.detailLabel, { color: t.text }]}>Centro Médico San Rafael</Text><Text style={[styles.detailSub, { color: t.textSub }]}>Piso 3, Consultorio 301</Text></View>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="medical-outline" size={16} color={t.textSub} style={styles.rowIcon} />
            <View><Text style={[styles.detailLabel, { color: t.text }]}>Control de rutina</Text><Text style={[styles.detailSub, { color: t.textSub }]}>Consulta general</Text></View>
          </View>
        </View>

        <View style={[styles.reminderCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <Text style={[styles.reminderTitle, { color: t.text }]}>Opciones de Recordatorio</Text>
          <ReminderRow icon="notifications-outline" label="15 minutos antes" value={r15min} onValueChange={setR15min} t={t} />
          <ReminderRow icon="time-outline" label="1 hora antes" value={r1hora} onValueChange={setR1hora} t={t} />
          <ReminderRow icon="calendar-outline" label="1 día antes" value={r1dia} onValueChange={setR1dia} t={t} noBorder />
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: t.primary }]} onPress={() => navigation.goBack()}>
            <Ionicons name="checkmark" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>Entendido</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryBtn, { borderColor: t.cardBorder }]}>
            <Ionicons name="calendar-outline" size={18} color={t.text} style={{ marginRight: 8 }} />
            <Text style={[styles.secondaryBtnText, { color: t.text }]}>Reprogramar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dangerBtn, { borderColor: darkMode ? '#7F1D1D' : '#FEE2E2', backgroundColor: darkMode ? '#1C0A0A' : '#FFF5F5' }]}>
            <Ionicons name="close-circle-outline" size={18} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={styles.dangerBtnText}>Cancelar Cita</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ReminderRow({ icon, label, value, onValueChange, noBorder, t }) {
  return (
    <View style={[styles.reminderRow, !noBorder && { borderBottomWidth: 1, borderBottomColor: t.separator }]}>
      <Ionicons name={icon} size={18} color={value ? t.primary : t.textMuted} style={{ marginRight: 12 }} />
      <Text style={[styles.reminderLabel, { color: t.text }]}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange}
        trackColor={{ false: '#E5E7EB', true: t.primary }}
        thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
        ios_backgroundColor="#E5E7EB" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scroll: { padding: 16, paddingBottom: 40 },
  notifBanner: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: 14, padding: 14, marginBottom: 16 },
  notifIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  notifTitle: { fontSize: 14, fontWeight: '700' },
  notifSub: { fontSize: 12, marginTop: 2, lineHeight: 16 },
  notifTime: { fontSize: 11, marginTop: 4 },
  citaCard: { borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 16 },
  citaCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  citaCardTitle: { fontSize: 16, fontWeight: '700' },
  confirmadaBadge: { fontWeight: '700', fontSize: 13 },
  fechaBlock: { borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 14, borderWidth: 1 },
  fechaDia: { fontSize: 40, fontWeight: '800' },
  fechaMes: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  fechaHora: { fontSize: 20, fontWeight: '700' },
  fechaDuracion: { fontSize: 13, marginTop: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1 },
  avatarSmall: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  infoName: { fontSize: 15, fontWeight: '700' },
  infoSub: { fontSize: 12 },
  phoneBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  rowIcon: { marginRight: 8, marginTop: 2 },
  detailLabel: { fontSize: 14, fontWeight: '600' },
  detailSub: { fontSize: 12, marginTop: 2 },
  reminderCard: { borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 16 },
  reminderTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  reminderRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  reminderLabel: { flex: 1, fontSize: 14, fontWeight: '500' },
  actionsContainer: { gap: 10 },
  primaryBtn: { height: 52, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  secondaryBtn: { height: 50, borderWidth: 1, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { fontWeight: '600', fontSize: 14 },
  dangerBtn: { height: 50, borderWidth: 1, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  dangerBtnText: { color: '#EF4444', fontWeight: '600', fontSize: 14 },
});