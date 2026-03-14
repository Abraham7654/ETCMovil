import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Signos Vitales</Text>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scroll} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Información del Paciente */}
          <View style={styles.patientRow}>
            <View style={styles.patientAvatar}>
              <Ionicons name="person" size={20} color="#9CA3AF" />
            </View>
            <View>
              <Text style={styles.patientName}>María González</Text>
              <Text style={styles.patientMeta}>ID: 001234 • 45 años</Text>
            </View>
          </View>

          {/* Fecha del Registro */}
          <View style={styles.dateCard}>
            <View style={styles.dateLeft}>
              <View style={styles.calendarIconBox}>
                <Ionicons name="calendar-outline" size={18} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.dateLabel}>Fecha del registro</Text>
                <Text style={styles.dateValue}>15 Feb 2024, 10:30 AM</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeText}>Cambiar</Text>
            </TouchableOpacity>
          </View>

          {/* Listado de Signos Vitales */}
          <VitalCard
            label="Peso" 
            unit="kg" 
            value={peso} 
            onChangeText={setPeso}
            iconBg="#D1FAE5" 
            iconColor="#10B981" 
            icon="scale-outline" 
            placeholder="00.0"
          />
          
          <VitalCard
            label="Presión Arterial" 
            unit="mmHg" 
            value={presion} 
            onChangeText={setPresion}
            iconBg="#FEE2E2" 
            iconColor="#EF4444" 
            icon="heart-outline" 
            placeholder="120/80"
          />
          
          <VitalCard
            label="Frecuencia Cardíaca" 
            unit="bpm" 
            value={frecuencia} 
            onChangeText={setFrecuencia}
            iconBg="#DBEAFE" 
            iconColor="#2563EB" 
            icon="pulse-outline" 
            placeholder="72"
          />
          
          <VitalCard
            label="Temperatura" 
            unit="°C" 
            value={temperatura} 
            onChangeText={setTemperatura}
            iconBg="#FEF3C7" 
            iconColor="#F59E0B" 
            icon="thermometer-outline" 
            placeholder="36.5"
          />

          {/* Notas Adicionales */}
          <View style={styles.notesSection}>
            <View style={styles.notesHeader}>
              <Ionicons name="document-text-outline" size={18} color="#6B7280" style={{ marginRight: 8 }} />
              <Text style={styles.notesTitle}>Observaciones</Text>
            </View>
            <TextInput
              style={styles.notesInput}
              placeholder="Escribe aquí cualquier observación relevante..."
              placeholderTextColor="#9CA3AF"
              value={notas}
              onChangeText={setNotas}
              multiline
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer con Botones */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.draftBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.draftText}>Borrador</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.saveText}>Guardar Registro</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- Componente de Fila para Signo Vital ---
function VitalCard({ label, unit, value, onChangeText, iconBg, iconColor, icon, placeholder }) {
  return (
    <View style={styles.vitalCard}>
      <View style={styles.vitalInfo}>
        <View style={[styles.vitalIcon, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View>
          <Text style={styles.vitalLabel}>{label}</Text>
          <Text style={styles.vitalUnitLabel}>{unit}</Text>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.vitalInput}
          placeholder={placeholder}
          placeholderTextColor="#D1D5DB"
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 16, 
    paddingVertical: 12,
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
  moreBtn: { 
    width: 40, 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  scroll: { 
    padding: 16, 
    paddingBottom: 120 
  },
  patientRow: {
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 14, 
    backgroundColor: '#F9FAFB', 
    borderRadius: 14,
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    marginBottom: 12,
  },
  patientAvatar: {
    width: 44, 
    height: 44, 
    borderRadius: 22,
    backgroundColor: '#E5E7EB', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12,
  },
  patientName: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#111827' 
  },
  patientMeta: { 
    fontSize: 13, 
    color: '#6B7280' 
  },
  dateCard: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 14, 
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    borderRadius: 14, 
    marginBottom: 20, 
    backgroundColor: '#fff',
  },
  dateLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  calendarIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dateLabel: { 
    fontSize: 11, 
    color: '#9CA3AF', 
    textTransform: 'uppercase', 
    letterSpacing: 0.5 
  },
  dateValue: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#111827' 
  },
  changeText: { 
    color: '#2563EB', 
    fontSize: 13, 
    fontWeight: '700' 
  },
  vitalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 8,
  },
  vitalInfo: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1 
  },
  vitalIcon: {
    width: 42, 
    height: 42, 
    borderRadius: 12,
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12,
  },
  vitalLabel: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#111827' 
  },
  vitalUnitLabel: { 
    fontSize: 12, 
    color: '#6B7280' 
  },
  inputContainer: {
    width: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  vitalInput: {
    fontSize: 18, 
    fontWeight: '600', 
    color: '#111827',
    textAlign: 'center',
  },
  notesSection: { 
    marginTop: 20 
  },
  notesHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  notesTitle: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#374151' 
  },
  notesInput: {
    fontSize: 14, 
    color: '#374151', 
    backgroundColor: '#F9FAFB',
    borderRadius: 12, 
    padding: 16, 
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  footer: {
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0,
    flexDirection: 'row', 
    padding: 16, 
    gap: 12,
    backgroundColor: '#fff', 
    borderTopWidth: 1, 
    borderTopColor: '#E5E7EB',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Espaciado para iPhone sin botón home
  },
  draftBtn: {
    flex: 1, 
    height: 54, 
    borderRadius: 14,
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  draftText: { 
    color: '#374151', 
    fontWeight: '600', 
    fontSize: 15 
  },
  saveBtn: {
    flex: 2, 
    height: 54, 
    borderRadius: 14,
    backgroundColor: '#2563EB', 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  saveText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 15 
  },
});