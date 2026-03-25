import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/useTheme';

export default function SignosVitales({ navigation, route }) {
  const { darkMode, t } = useTheme();
  const [peso, setPeso] = useState('');
  const [presion, setPresion] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [notas, setNotas] = useState('');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />
      <View style={[styles.header, { borderBottomColor: t.separator }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={t.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.text }]}>Signos Vitales</Text>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color={t.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={[styles.patientRow, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
            <View style={[styles.patientAvatar, { backgroundColor: t.bg3 }]}>
              <Ionicons name="person" size={20} color={t.textMuted} />
            </View>
            <View>
              <Text style={[styles.patientName, { color: t.text }]}>María González</Text>
              <Text style={[styles.patientMeta, { color: t.textSub }]}>ID: 001234 • 45 años</Text>
            </View>
          </View>

          <View style={[styles.dateCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
            <View style={styles.dateLeft}>
              <View style={[styles.calendarIconBox, { backgroundColor: darkMode ? '#1E3A5F' : '#EFF6FF' }]}>
                <Ionicons name="calendar-outline" size={18} color={t.primary} />
              </View>
              <View>
                <Text style={[styles.dateLabel, { color: t.textMuted }]}>Fecha del registro</Text>
                <Text style={[styles.dateValue, { color: t.text }]}>15 Feb 2024, 10:30 AM</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={[styles.changeText, { color: t.primary }]}>Cambiar</Text>
            </TouchableOpacity>
          </View>

          <VitalCard label="Peso" unit="kg" value={peso} onChangeText={setPeso} iconBg="#D1FAE5" iconColor="#10B981" icon="scale-outline" placeholder="00.0" t={t} />
          <VitalCard label="Presión Arterial" unit="mmHg" value={presion} onChangeText={setPresion} iconBg="#FEE2E2" iconColor="#EF4444" icon="heart-outline" placeholder="120/80" t={t} />
          <VitalCard label="Frecuencia Cardíaca" unit="bpm" value={frecuencia} onChangeText={setFrecuencia} iconBg="#DBEAFE" iconColor="#2563EB" icon="pulse-outline" placeholder="72" t={t} />
          <VitalCard label="Temperatura" unit="°C" value={temperatura} onChangeText={setTemperatura} iconBg="#FEF3C7" iconColor="#F59E0B" icon="thermometer-outline" placeholder="36.5" t={t} />

          <View style={styles.notesSection}>
            <View style={styles.notesHeader}>
              <Ionicons name="document-text-outline" size={18} color={t.textSub} style={{ marginRight: 8 }} />
              <Text style={[styles.notesTitle, { color: t.text }]}>Observaciones</Text>
            </View>
            <TextInput style={[styles.notesInput, { backgroundColor: t.card, borderColor: t.cardBorder, color: t.text }]}
              placeholder="Escribe aquí cualquier observación relevante..." placeholderTextColor={t.textMuted}
              value={notas} onChangeText={setNotas} multiline textAlignVertical="top" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { backgroundColor: t.card, borderTopColor: t.cardBorder, paddingBottom: Platform.OS === 'ios' ? 34 : 16 }]}>
        <TouchableOpacity style={[styles.draftBtn, { backgroundColor: t.bg3, borderColor: t.cardBorder }]} onPress={() => navigation.goBack()}>
          <Text style={[styles.draftText, { color: t.text }]}>Borrador</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: t.primary }]} onPress={() => navigation.goBack()}>
          <Text style={styles.saveText}>Guardar Registro</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function VitalCard({ label, unit, value, onChangeText, iconBg, iconColor, icon, placeholder, t }) {
  return (
    <View style={[styles.vitalCard, { borderBottomColor: t.separator }]}>
      <View style={styles.vitalInfo}>
        <View style={[styles.vitalIcon, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View>
          <Text style={[styles.vitalLabel, { color: t.text }]}>{label}</Text>
          <Text style={[styles.vitalUnitLabel, { color: t.textSub }]}>{unit}</Text>
        </View>
      </View>
      <View style={[styles.inputContainer, { backgroundColor: t.bg3 }]}>
        <TextInput style={[styles.vitalInput, { color: t.text }]} placeholder={placeholder} placeholderTextColor={t.textMuted} value={value} onChangeText={onChangeText} keyboardType="decimal-pad" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  moreBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 16, paddingBottom: 120 },
  patientRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 12 },
  patientAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  patientName: { fontSize: 16, fontWeight: '700' },
  patientMeta: { fontSize: 13 },
  dateCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderWidth: 1, borderRadius: 14, marginBottom: 20 },
  dateLeft: { flexDirection: 'row', alignItems: 'center' },
  calendarIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  dateLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  dateValue: { fontSize: 14, fontWeight: '600' },
  changeText: { fontSize: 13, fontWeight: '700' },
  vitalCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, marginBottom: 8 },
  vitalInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  vitalIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  vitalLabel: { fontSize: 15, fontWeight: '700' },
  vitalUnitLabel: { fontSize: 12 },
  inputContainer: { width: 100, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  vitalInput: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  notesSection: { marginTop: 20 },
  notesHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  notesTitle: { fontSize: 14, fontWeight: '700' },
  notesInput: { fontSize: 14, borderRadius: 12, padding: 16, minHeight: 100, borderWidth: 1 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 16, gap: 12, borderTopWidth: 1 },
  draftBtn: { flex: 1, height: 54, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  draftText: { fontWeight: '600', fontSize: 15 },
  saveBtn: { flex: 2, height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});