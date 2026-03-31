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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/useTheme';
import { actualizarCita } from '../controllers/CitaController';

const HORAS = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
const ESTADOS = ['Pendiente', 'Confirmada', 'Cancelada'];

export default function EditarCita({ navigation, route }) {
  const { t } = useTheme();
  const cita = route?.params?.cita;

  const [doctor, setDoctor] = useState(cita?.doctor || '');
  const [fecha, setFecha] = useState(cita?.fecha || '');
  const [hora, setHora] = useState(cita?.hora || '');
  const [motivo, setMotivo] = useState(cita?.motivo || '');
  const [notas, setNotas] = useState(cita?.notas || '');
  const [estado, setEstado] = useState(cita?.estado || 'Pendiente');
  const [loading, setLoading] = useState(false);

  if (!cita) return null;

  const handleGuardar = async () => {
    if (!doctor.trim()) { Alert.alert('Error', 'Ingresa el nombre del doctor'); return; }
    if (!fecha) { Alert.alert('Error', 'Ingresa la fecha'); return; }
    if (!hora) { Alert.alert('Error', 'Selecciona una hora'); return; }
    if (!motivo.trim()) { Alert.alert('Error', 'Ingresa el motivo de la consulta'); return; }

    const sinCambios =
      doctor.trim() === cita.doctor &&
      fecha === cita.fecha &&
      hora === cita.hora &&
      motivo.trim() === cita.motivo &&
      notas === cita.notas &&
      estado === cita.estado;

    if (sinCambios) {
      Alert.alert('Sin cambios', 'No realizaste ningún cambio en la cita.');
      return;
    }

    setLoading(true);
    const result = await actualizarCita(cita.id, { doctor, fecha, hora, motivo, notas, estado });
    setLoading(false);

    if (result.success) {
      Alert.alert('✅ Cita actualizada', 'Los datos de la cita fueron guardados correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', result.mensaje || 'No se pudo actualizar la cita');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />

      <View style={[styles.header, { borderBottomColor: t.separator }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={t.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.text }]}>Editar Cita</Text>
        <TouchableOpacity
          style={[styles.saveHeaderBtn, { backgroundColor: t.primary }]}
          onPress={handleGuardar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveHeaderText}>Guardar</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.idBadgeContainer}>
          <View style={[styles.idBadge, { backgroundColor: t.bg3, borderColor: t.cardBorder }]}>
            <Ionicons name="calendar-outline" size={16} color={t.primary} style={styles.badgeIcon} />
            <Text style={[styles.idBadgeText, { color: t.textSub }]}>
              ID: <Text style={{ color: t.primary, fontWeight: '700' }}>{cita.id}</Text>
              {'  ·  '}
              <Text style={{ color: t.textMuted }}>{cita.paciente_nombre}</Text>
            </Text>
          </View>
        </View>

        <Text style={[styles.label, { color: t.textSub }]}>Doctor <Text style={styles.required}>*</Text></Text>
        <View style={[styles.inputContainer, { backgroundColor: t.inputBg, borderColor: t.inputBorder }]}>
          <Ionicons name="person-circle-outline" size={20} color={t.textMuted} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: t.text }]}
            placeholder="Nombre del doctor"
            placeholderTextColor={t.textMuted}
            value={doctor}
            onChangeText={setDoctor}
          />
        </View>

        <Text style={[styles.label, { color: t.textSub }]}>Fecha <Text style={styles.required}>*</Text></Text>
        <View style={[styles.inputContainer, { backgroundColor: t.inputBg, borderColor: t.inputBorder }]}>
          <Ionicons name="calendar-outline" size={20} color={t.textMuted} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: t.text }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={t.textMuted}
            value={fecha}
            onChangeText={setFecha}
          />
        </View>

        <Text style={[styles.label, { color: t.textSub }]}>Hora <Text style={styles.required}>*</Text></Text>
        <View style={styles.horasGrid}>
          {HORAS.map((h) => (
            <TouchableOpacity
              key={h}
              style={[
                styles.horaChip,
                hora === h
                  ? { backgroundColor: t.primary, borderColor: t.primary }
                  : { backgroundColor: t.inputBg, borderColor: t.inputBorder },
              ]}
              onPress={() => setHora(h)}
            >
              <Text style={[styles.horaText, { color: hora === h ? '#fff' : t.text }]}>{h}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: t.textSub }]}>Estado</Text>
        <View style={styles.chipRow}>
          {ESTADOS.map((e) => {
            const colorActivo = e === 'Confirmada' ? '#10B981' : e === 'Cancelada' ? '#EF4444' : t.primary;
            const isSelected = estado === e;
            return (
              <TouchableOpacity
                key={e}
                style={[
                  styles.chip,
                  {
                    borderColor: isSelected ? colorActivo : t.cardBorder,
                    backgroundColor: isSelected ? colorActivo : t.bg3,
                  },
                ]}
                onPress={() => setEstado(e)}
              >
                <Text style={[styles.chipText, { color: isSelected ? '#fff' : t.text }]}>{e}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { color: t.textSub }]}>Motivo de consulta <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text }]}
          placeholder="Motivo..."
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
          placeholder="Opcional..."
          placeholderTextColor={t.textMuted}
          value={notas}
          onChangeText={setNotas}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <View style={styles.buttons}>
          <TouchableOpacity style={[styles.cancelBtn, { borderColor: t.cardBorder }]} onPress={() => navigation.goBack()}>
            <Text style={[styles.cancelText, { color: t.text }]}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: t.primary }]} onPress={handleGuardar} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.confirmText}>Guardar Cambios</Text>
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
    borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  saveHeaderBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, minWidth: 75, alignItems: 'center' },
  saveHeaderText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  scroll: { padding: 20, paddingBottom: 40 },
  idBadgeContainer: { alignItems: 'center', marginBottom: 20 },
  idBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  badgeIcon: { marginRight: 6 },
  idBadgeText: { fontSize: 13 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 4 },
  required: { color: '#EF4444' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, height: 48, marginBottom: 12 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 14 },
  horasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  horaChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  horaText: { fontSize: 14, fontWeight: '500' },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '600' },
  textArea: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 14, minHeight: 90, marginBottom: 12 },
  buttons: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancelBtn: { flex: 1, height: 50, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 15, fontWeight: '600' },
  confirmBtn: { flex: 2, height: 50, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  confirmText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});