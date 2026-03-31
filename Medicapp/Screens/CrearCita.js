import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/useTheme';
import { crearCita } from '../controllers/CitaController';
import { getPacientes } from '../controllers/PacienteController';

const HORAS = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

export default function CrearCita({ navigation }) {
  const { t } = useTheme();
  
  const [pacienteId, setPacienteId] = useState(null);
  const [pacienteNombre, setPacienteNombre] = useState('');
  const [doctor, setDoctor] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [notas, setNotas] = useState('');
  const [recordatorio, setRecordatorio] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [showPacientes, setShowPacientes] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const r = await getPacientes();
      if (r.success) setPacientes(r.pacientes);
      
      const hoy = new Date().toISOString().split('T')[0];
      setFecha(hoy);
    };
    fetchData();
  }, []);

  const handleGuardar = async () => {
    if (!pacienteId) { Alert.alert('Error', 'Selecciona un paciente'); return; }
    if (!doctor.trim()) { Alert.alert('Error', 'Ingresa el nombre del doctor'); return; }
    if (!fecha) { Alert.alert('Error', 'Selecciona una fecha'); return; }
    if (!hora) { Alert.alert('Error', 'Selecciona una hora'); return; }
    if (!motivo.trim()) { Alert.alert('Error', 'Ingresa el motivo de la consulta'); return; }

    setLoading(true);
    const result = await crearCita({ 
      paciente_id: pacienteId, 
      doctor, 
      fecha, 
      hora, 
      motivo, 
      notas, 
      recordatorio 
    });
    setLoading(false);

    if (result.success) {
      Alert.alert('✅ Éxito', 'Cita creada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', result.mensaje || 'No se pudo crear la cita');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />
      
      <View style={[styles.header, { borderBottomColor: t.separator }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={t.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.text }]}>Nueva Cita</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={[styles.label, { color: t.textSub }]}>
          Paciente <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity 
          style={[styles.selectRow, { backgroundColor: t.inputBg, borderColor: t.inputBorder }]}
          onPress={() => setShowPacientes(!showPacientes)}
        >
          <Text style={[styles.selectText, { color: pacienteNombre ? t.text : t.textMuted }]}>
            {pacienteNombre || 'Seleccionar paciente'}
          </Text>
          <Ionicons name={showPacientes ? 'chevron-up' : 'chevron-down'} size={18} color={t.textMuted} />
        </TouchableOpacity>

        {showPacientes && (
          <View style={[styles.dropdownMenu, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
            {pacientes.map(p => (
              <TouchableOpacity 
                key={p.id} 
                style={[styles.dropdownItem, { borderBottomColor: t.separator }]}
                onPress={() => { 
                  setPacienteId(p.id); 
                  setPacienteNombre(p.nombre); 
                  setShowPacientes(false); 
                }}
              >
                <Text style={[styles.dropdownItemText, { color: t.text }]}>{p.nombre}</Text>
                <Text style={[styles.dropdownItemSub, { color: t.textMuted }]}>{p.edad} años · {p.estado}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={[styles.label, { color: t.textSub }]}>
          Doctor <Text style={styles.required}>*</Text>
        </Text>
        <View style={[styles.inputContainer, { backgroundColor: t.inputBg, borderColor: t.inputBorder }]}>
          <TextInput 
            style={[styles.input, { color: t.text }]} 
            placeholder="Nombre del doctor"
            placeholderTextColor={t.textMuted} 
            value={doctor} 
            onChangeText={setDoctor} 
          />
          <Ionicons name="person-circle-outline" size={20} color={t.textMuted} />
        </View>

        <Text style={[styles.label, { color: t.textSub }]}>
          Fecha <Text style={styles.required}>*</Text>
        </Text>
        <View style={[styles.inputContainer, { backgroundColor: t.inputBg, borderColor: t.inputBorder }]}>
          <TextInput 
            style={[styles.input, { color: t.text }]} 
            placeholder="YYYY-MM-DD"
            placeholderTextColor={t.textMuted} 
            value={fecha} 
            onChangeText={setFecha} 
          />
          <Ionicons name="calendar-outline" size={20} color={t.textMuted} />
        </View>

        <Text style={[styles.label, { color: t.textSub }]}>
          Hora <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.horasGrid}>
          {HORAS.map(h => (
            <TouchableOpacity 
              key={h}
              style={[
                styles.horaChip, 
                hora === h 
                  ? { backgroundColor: t.primary, borderColor: t.primary } 
                  : { backgroundColor: t.inputBg, borderColor: t.inputBorder }
              ]}
              onPress={() => setHora(h)}
            >
              <Text style={[styles.horaText, { color: hora === h ? '#fff' : t.text }]}>{h}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: t.textSub }]}>
          Motivo de consulta <Text style={styles.required}>*</Text>
        </Text>
        <TextInput 
          style={[styles.textArea, { backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text }]}
          placeholder="Describa el motivo de la consulta..." 
          placeholderTextColor={t.textMuted}
          value={motivo} 
          onChangeText={setMotivo} 
          multiline 
          numberOfLines={4} 
          textAlignVertical="top" 
        />

        <Text style={[styles.label, { color: t.textSub }]}>Notas adicionales</Text>
        <TextInput 
          style={[styles.textArea, { backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text }]}
          placeholder="Información adicional (opcional)" 
          placeholderTextColor={t.textMuted}
          value={notas} 
          onChangeText={setNotas} 
          multiline 
          numberOfLines={3} 
          textAlignVertical="top" 
        />

        <TouchableOpacity 
          style={[styles.recordatorioRow, { backgroundColor: t.bg3 }]}
          onPress={() => setRecordatorio(!recordatorio)}
        >
          <View style={[
            styles.checkbox, 
            recordatorio ? { backgroundColor: t.primary, borderColor: t.primary } : { borderColor: t.textMuted }
          ]}>
            {recordatorio && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <View style={styles.recordatorioText}>
            <Text style={[styles.recordatorioLabel, { color: t.text }]}>Enviar recordatorio</Text>
            <Text style={[styles.recordatorioSub, { color: t.textMuted }]}>
              Notificación 24 horas antes de la cita
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.buttons}>
          <TouchableOpacity 
            style={[styles.cancelBtn, { borderColor: t.cardBorder }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.cancelText, { color: t.text }]}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.confirmBtn, { backgroundColor: t.primary }]}
            onPress={handleGuardar} 
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Ionicons name="checkmark" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.confirmText}>Confirmar Cita</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderBottomWidth: 1 
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scroll: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 4 },
  required: { color: '#EF4444' },
  selectRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    borderWidth: 1, 
    borderRadius: 10, 
    paddingHorizontal: 14, 
    height: 48, 
    marginBottom: 4 
  },
  selectText: { fontSize: 14 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderRadius: 10, 
    paddingHorizontal: 14, 
    height: 48, 
    marginBottom: 12 
  },
  input: { flex: 1, fontSize: 14 },
  dropdownMenu: { borderWidth: 1, borderRadius: 10, marginBottom: 8, maxHeight: 200, overflow: 'hidden' },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1 },
  dropdownItemText: { fontSize: 14, fontWeight: '600' },
  dropdownItemSub: { fontSize: 12, marginTop: 2 },
  horasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  horaChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  horaText: { fontSize: 14, fontWeight: '500' },
  textArea: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 14, minHeight: 90, marginBottom: 12 },
  recordatorioRow: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: 12, padding: 14, marginBottom: 20 },
  recordatorioText: { flex: 1, marginLeft: 12 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  recordatorioLabel: { fontSize: 14, fontWeight: '600' },
  recordatorioSub: { fontSize: 12, marginTop: 2 },
  buttons: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, height: 50, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 15, fontWeight: '600' },
  confirmBtn: { flex: 2, height: 50, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  confirmText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});