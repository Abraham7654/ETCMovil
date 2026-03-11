import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotasPaciente({ navigation }) {
  const [notas, setNotas] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ficha del Paciente</Text>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Patient summary */}
        <View style={styles.patientCard}>
          <View style={styles.patientAvatar}>
            <Ionicons name="person" size={28} color="#9CA3AF" />
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>María González</Text>
            <Text style={styles.patientId}>ID: 001234</Text>
            <Text style={styles.statusBadge}>Activo</Text>
          </View>
          <View style={styles.patientMeta}>
            <Text style={styles.ageText}>42 años</Text>
            <Text style={styles.generoText}>Femenino</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[['Última Cita', '15 Ene', false], ['Próxima', '22 Ene', true], ['Total Citas', '24', false]].map(([label, val, blue]) => (
            <View key={label} style={styles.statBox}>
              <Text style={styles.statLabel}>{label}</Text>
              <Text style={[styles.statValue, blue && { color: '#2563EB' }]}>{val}</Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {['Historial', 'Citas', 'Fotos', 'Notas'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, tab === 'Notas' && styles.tabActive]}
              onPress={() => tab !== 'Notas' && navigation.goBack()}
            >
              <Text style={[styles.tabText, tab === 'Notas' && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes area */}
        <View style={styles.notesSection}>
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>Observaciones Médicas</Text>
            <TextInput
              style={styles.notesInput}
              placeholder={`Escriba las observaciones médicas del paciente... • Síntomas reportados • Examen físico • Diagnóstico • Plan de tratamiento • Recomendaciones`}
              placeholderTextColor="#D1D5DB"
              value={notas}
              onChangeText={setNotas}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.saveBtn}>
            <Ionicons name="save-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.saveBtnText}>Guardar Notas</Text>
          </TouchableOpacity>
          <View style={styles.secondaryRow}>
            <TouchableOpacity style={styles.draftBtn}>
              <Ionicons name="time-outline" size={16} color="#374151" style={{ marginRight: 6 }} />
              <Text style={styles.draftText}>Borrador</Text>
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  moreBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  patientCard: {
    flexDirection: 'row', alignItems: 'center',
    margin: 16, padding: 16, backgroundColor: '#F9FAFB',
    borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB',
  },
  patientAvatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#E5E7EB',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  patientInfo: { flex: 1 },
  patientName: { fontSize: 18, fontWeight: '700', color: '#111827' },
  patientId: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  statusBadge: { color: '#10B981', fontSize: 13, fontWeight: '600', marginTop: 4 },
  patientMeta: { alignItems: 'flex-end' },
  ageText: { fontSize: 16, fontWeight: '700', color: '#111827' },
  generoText: { fontSize: 13, color: '#6B7280' },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, gap: 8 },
  statBox: {
    flex: 1, backgroundColor: '#F9FAFB', borderRadius: 12,
    padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB',
  },
  statLabel: { fontSize: 11, color: '#9CA3AF', marginBottom: 4 },
  statValue: { fontSize: 15, fontWeight: '700', color: '#111827' },
  tabsContainer: {
    flexDirection: 'row', marginHorizontal: 16, marginBottom: 16,
    backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  tabTextActive: { color: '#2563EB', fontWeight: '700' },
  notesSection: { paddingHorizontal: 16 },
  notesCard: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14,
    padding: 16, backgroundColor: '#FAFAFA', minHeight: 220,
  },
  notesTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 },
  notesInput: { flex: 1, fontSize: 14, color: '#374151', minHeight: 160 },
  buttonsContainer: { paddingHorizontal: 16, marginTop: 20, gap: 10 },
  saveBtn: {
    height: 52, backgroundColor: '#2563EB', borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryRow: { flexDirection: 'row', gap: 10 },
  draftBtn: {
    flex: 1, height: 48, backgroundColor: '#F3F4F6', borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  draftText: { color: '#374151', fontSize: 14, fontWeight: '600' },
  shareBtn: {
    flex: 1, height: 48, backgroundColor: '#10B981', borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  shareText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});