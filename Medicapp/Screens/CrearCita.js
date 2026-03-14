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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HORAS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

export default function CrearCita({ navigation }) {
  const [paciente, setPaciente] = useState('');
  const [doctor, setDoctor] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [notas, setNotas] = useState('');
  const [recordatorio, setRecordatorio] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Cita</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>
          Paciente <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity style={styles.selectRow}>
          <Text style={styles.selectPlaceholder}>Seleccionar paciente</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <Text style={styles.label}>
          Doctor <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre del doctor"
            placeholderTextColor="#9CA3AF"
            value={doctor}
            onChangeText={setDoctor}
          />
          <Ionicons name="person-circle-outline" size={20} color="#9CA3AF" />
        </View>

        <Text style={styles.label}>
          Fecha <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Seleccionar fecha"
            placeholderTextColor="#9CA3AF"
            value={fecha}
            onChangeText={setFecha}
          />
          <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
        </View>

        <Text style={styles.label}>
          Hora <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.horasGrid}>
          {HORAS.map((h) => (
            <TouchableOpacity
              key={h}
              style={[styles.horaChip, hora === h && styles.horaChipActive]}
              onPress={() => setHora(h)}
            >
              <Text style={[styles.horaText, hora === h && styles.horaTextActive]}>
                {h}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>
          Motivo de consulta <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describa el motivo de la consulta..."
          placeholderTextColor="#9CA3AF"
          value={motivo}
          onChangeText={setMotivo}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Notas adicionales</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Información adicional (opcional)"
          placeholderTextColor="#9CA3AF"
          value={notas}
          onChangeText={setNotas}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={styles.recordatorioRow}
          onPress={() => setRecordatorio(!recordatorio)}
        >
          <View style={[styles.checkbox, recordatorio && styles.checkboxActive]}>
            {recordatorio && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.recordatorioLabel}>Enviar recordatorio</Text>
            <Text style={styles.recordatorioSub}>
              El paciente recibirá una notificación 24 horas antes
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="checkmark" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.confirmText}>Confirmar Cita</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  scroll: { 
    padding: 20, 
    paddingBottom: 40 
  },
  label: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#374151', 
    marginBottom: 8, 
    marginTop: 4 
  },
  required: { 
    color: '#EF4444' 
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  selectPlaceholder: { 
    color: '#9CA3AF', 
    fontSize: 14 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  input: { 
    flex: 1, 
    fontSize: 14, 
    color: '#111827' 
  },
  horasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  horaChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
  },
  horaChipActive: { 
    backgroundColor: '#2563EB', 
    borderColor: '#2563EB' 
  },
  horaText: { 
    fontSize: 14, 
    color: '#374151', 
    fontWeight: '500' 
  },
  horaTextActive: { 
    color: '#fff', 
    fontWeight: '700' 
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FAFAFA',
    minHeight: 90,
    marginBottom: 12,
  },
  recordatorioRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { 
    backgroundColor: '#2563EB', 
    borderColor: '#2563EB' 
  },
  recordatorioLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#374151' 
  },
  recordatorioSub: { 
    fontSize: 12, 
    color: '#9CA3AF', 
    marginTop: 2 
  },
  buttons: { 
    flexDirection: 'row', 
    gap: 10 
  },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { 
    color: '#374151', 
    fontSize: 15, 
    fontWeight: '600' 
  },
  confirmBtn: {
    flex: 2,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: { 
    color: '#fff', 
    fontSize: 15, 
    fontWeight: '700' 
  },
});