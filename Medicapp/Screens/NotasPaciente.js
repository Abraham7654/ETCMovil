import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/useTheme';

export default function NotasPaciente({ navigation, route }) {
  const { darkMode, t } = useTheme();
  const [notas, setNotas] = useState('');
  const STATS = [{ label: 'Última Cita', val: '15 Ene', blue: false },{ label: 'Próxima', val: '22 Ene', blue: true },{ label: 'Total Citas', val: '24', blue: false }];
  const TABS = ['Historial', 'Citas', 'Fotos', 'Notas'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />
      <View style={[styles.header, { borderBottomColor: t.separator }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={t.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.text }]}>Ficha del Paciente</Text>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color={t.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[styles.patientCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={[styles.patientAvatar, { backgroundColor: t.bg3 }]}>
            <Ionicons name="person" size={28} color={t.textMuted} />
          </View>
          <View style={styles.patientInfo}>
            <Text style={[styles.patientName, { color: t.text }]}>María González</Text>
            <Text style={[styles.patientId, { color: t.textSub }]}>ID: 001234</Text>
            <Text style={[styles.statusBadge, { color: t.success }]}>Activo</Text>
          </View>
          <View style={styles.patientMeta}>
            <Text style={[styles.ageText, { color: t.text }]}>42 años</Text>
            <Text style={[styles.generoText, { color: t.textSub }]}>Femenino</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <View key={i} style={[styles.statBox, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
              <Text style={[styles.statLabel, { color: t.textMuted }]}>{s.label}</Text>
              <Text style={[styles.statValue, { color: s.blue ? t.primary : t.text }]}>{s.val}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.tabsContainer, { backgroundColor: t.bg3 }]}>
          {TABS.map(tab => (
            <TouchableOpacity key={tab}
              style={[styles.tab, tab === 'Notas' && { backgroundColor: t.card, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }]}
              onPress={() => tab !== 'Notas' && navigation.goBack()}>
              <Text style={[styles.tabText, { color: tab === 'Notas' ? t.primary : t.textMuted }, tab === 'Notas' && { fontWeight: '700' }]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.notesSection}>
          <View style={[styles.notesCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
            <Text style={[styles.notesTitle, { color: t.text }]}>Observaciones Médicas</Text>
            <TextInput style={[styles.notesInput, { color: t.text }]}
              placeholder="Escriba las observaciones médicas... • Síntomas • Examen físico • Diagnóstico • Plan de tratamiento"
              placeholderTextColor={t.textMuted} value={notas} onChangeText={setNotas} multiline textAlignVertical="top" />
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: t.primary }]}>
            <Ionicons name="save-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.saveBtnText}>Guardar Notas</Text>
          </TouchableOpacity>
          <View style={styles.secondaryRow}>
            <TouchableOpacity style={[styles.draftBtn, { backgroundColor: t.bg3 }]}>
              <Ionicons name="time-outline" size={16} color={t.text} style={{ marginRight: 6 }} />
              <Text style={[styles.draftText, { color: t.text }]}>Borrador</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <Ionicons name="share-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.shareText}>Compartir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  moreBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  patientCard: { flexDirection: 'row', alignItems: 'center', margin: 16, padding: 16, borderRadius: 16, borderWidth: 1 },
  patientAvatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  patientInfo: { flex: 1 },
  patientName: { fontSize: 18, fontWeight: '700' },
  patientId: { fontSize: 13, marginTop: 2 },
  statusBadge: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  patientMeta: { alignItems: 'flex-end' },
  ageText: { fontSize: 16, fontWeight: '700' },
  generoText: { fontSize: 13 },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, gap: 8 },
  statBox: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1 },
  statLabel: { fontSize: 11, marginBottom: 4 },
  statValue: { fontSize: 15, fontWeight: '700' },
  tabsContainer: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabText: { fontSize: 13, fontWeight: '500' },
  notesSection: { paddingHorizontal: 16 },
  notesCard: { borderWidth: 1, borderRadius: 14, padding: 16, minHeight: 220 },
  notesTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  notesInput: { flex: 1, fontSize: 14, minHeight: 160 },
  buttonsContainer: { paddingHorizontal: 16, marginTop: 20, gap: 10 },
  saveBtn: { height: 52, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryRow: { flexDirection: 'row', gap: 10 },
  draftBtn: { flex: 1, height: 48, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  draftText: { fontSize: 14, fontWeight: '600' },
  shareBtn: { flex: 1, height: 48, backgroundColor: '#10B981', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  shareText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});