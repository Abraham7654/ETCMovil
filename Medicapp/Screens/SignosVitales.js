import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SignosVitales({ navigation }) {
  const [peso, setPeso] = useState('');
  const [presion, setPresion] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [notas, setNotas] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Signos Vitales</Text>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Patient */}
        <View style={styles.patientRow}>
          <View style={styles.patientAvatar}>
            <Ionicons name="person" size={20} color="#9CA3AF" />
          </View>
          <View>
            <Text style={styles.patientName}>María González</Text>
            <Text style={styles.patientMeta}>ID: 001234 • 45 años</Text>
          </View>
        </View>

        {/* Date */}
        <View style={styles.dateCard}>
          <View style={styles.dateLeft}>
            <Ionicons name="calendar-outline" size={20} color="#2563EB" style={{ marginRight: 10 }} />
            <View>
              <Text style={styles.dateLabel}>Fecha y hora</Text>
              <Text style={styles.dateValue}>15 Feb 2024, 10:30 AM</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text style={styles.changeText}>Cambiar</Text>
          </TouchableOpacity>
        </View>

        {/* Vitals */}
        <VitalCard
          label="Peso" unit="Kilogramos" value={peso} onChangeText={setPeso}
          iconBg="#D1FAE5" iconColor="#10B981" icon="scale-outline" placeholder="0.0"
        />
        <VitalCard
          label="Presión Arterial" unit="mmHg" value={presion} onChangeText={setPresion}
          iconBg="#FEE2E2" iconColor="#EF4444" icon="heart" placeholder="120"
        />
        <VitalCard
          label="Frecuencia Cardíaca" unit="Latidos por minuto" value={frecuencia} onChangeText={setFrecuencia}
          iconBg="#DBEAFE" iconColor="#2563EB" icon="heart-circle-outline" placeholder="72"
        />
        <VitalCard
          label="Temperatura" unit="Grados Celsius" value={temperatura} onChangeText={setTemperatura}
          iconBg="#FEF3C7" iconColor="#F59E0B" icon="thermometer-outline" placeholder="36.5"
        />

        {/* Notes */}
        <View style={styles.vitalCard}>
          <View style={styles.vitalHeader}>
            <View style={[styles.vitalIcon, { backgroundColor: '#374151' }]}>
              <Ionicons name="document-text-outline" size={16} color="#fff" />
            </View>
            <View>
              <Text style={styles.vitalLabel}>Notas Adicionales</Text>
              <Text style={styles.vitalUnit}>Opcional</Text>
            </View>
          </View>
          <TextInput
            style={styles.notesInput}
            placeholder="Agregar observaciones..."
            placeholderTextColor="#9CA3AF"
            value={notas}
            onChangeText={setNotas}
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Bottom buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.draftBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.draftText}>Borrador</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.saveText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function VitalCard({ label, unit, value, onChangeText, iconBg, iconColor, icon, placeholder }) {
  return (
    <View style={styles.vitalCard}>
      <View style={styles.vitalHeader}>
        <View style={[styles.vitalIcon, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={16} color={iconColor} />
        </View>
        <View>
          <Text style={styles.vitalLabel}>{label}</Text>
          <Text style={styles.vitalUnit}>{unit}</Text>
        </View>
      </View>
      <TextInput
        style={styles.vitalInput}
        placeholder={placeholder}
        placeholderTextColor="#D1D5DB"
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
      />
    </View>
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
  scroll: { padding: 16, paddingBottom: 100 },
  patientRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14, backgroundColor: '#F9FAFB', borderRadius: 14,
    borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12,
  },
  patientAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  patientName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  patientMeta: { fontSize: 13, color: '#6B7280' },
  dateCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 14, borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 14, marginBottom: 12, backgroundColor: '#FAFAFA',
  },
  dateLeft: { flexDirection: 'row', alignItems: 'center' },
  dateLabel: { fontSize: 11, color: '#9CA3AF' },
  dateValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  changeText: { color: '#2563EB', fontSize: 14, fontWeight: '600' },
  vitalCard: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14,
    padding: 14, marginBottom: 12, backgroundColor: '#FAFAFA',
  },
  vitalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  vitalIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  vitalLabel: { fontSize: 14, fontWeight: '700', color: '#111827' },
  vitalUnit: { fontSize: 12, color: '#6B7280' },
  vitalInput: {
    fontSize: 28, fontWeight: '300', color: '#9CA3AF',
    backgroundColor: '#F3F4F6', borderRadius: 10, padding: 12,
  },
  notesInput: {
    fontSize: 14, color: '#374151', backgroundColor: '#F3F4F6',
    borderRadius: 10, padding: 12, minHeight: 80,
  },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', padding: 16, gap: 12,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB',
  },
  draftBtn: {
    flex: 1, height: 50, borderRadius: 12,
    borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center',
  },
  draftText: { color: '#374151', fontWeight: '600', fontSize: 15 },
  saveBtn: {
    flex: 2, height: 50, borderRadius: 12,
    backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center',
  },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});