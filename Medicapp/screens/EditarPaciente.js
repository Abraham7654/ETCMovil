import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/useTheme';
import { actualizarPaciente } from '../controllers/PacienteController';

const GENEROS = ['Masculino', 'Femenino', 'Otro'];
const SANGRE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const ESTADOS = ['Activo', 'Pendiente', 'Urgente'];

export default function EditarPaciente({ navigation, route }) {
  const { t } = useTheme();
  const paciente = route?.params?.paciente;

  // Estados locales precargados con los datos del paciente
  const [nombre, setNombre] = useState(paciente?.nombre || '');
  const [edad, setEdad] = useState(paciente?.edad?.toString() || '');
  const [genero, setGenero] = useState(paciente?.genero || '');
  const [telefono, setTelefono] = useState(paciente?.telefono || '');
  const [emergencia, setEmergencia] = useState(paciente?.contacto_emergencia || '');
  const [sangre, setSangre] = useState(paciente?.tipo_sangre || '');
  const [alergias, setAlergias] = useState(paciente?.alergias || '');
  const [notas, setNotas] = useState(paciente?.notas_medicas || '');
  const [estado, setEstado] = useState(paciente?.estado || 'Activo');
  
  const [showGenero, setShowGenero] = useState(false);
  const [showSangre, setShowSangre] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!paciente) return null;

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre del paciente es obligatorio');
      return;
    }

    // Validación de cambios para evitar peticiones innecesarias
    const sinCambios =
      nombre.trim() === paciente.nombre &&
      edad === paciente.edad?.toString() &&
      genero === paciente.genero &&
      telefono === paciente.telefono &&
      emergencia === paciente.contacto_emergencia &&
      sangre === paciente.tipo_sangre &&
      alergias === paciente.alergias &&
      notas === paciente.notas_medicas &&
      estado === paciente.estado;

    if (sinCambios) {
      Alert.alert('Sin cambios', 'No realizaste ningún cambio en los datos.');
      return;
    }

    setLoading(true);
    const result = await actualizarPaciente(paciente.id, {
      nombre: nombre.trim(),
      edad,
      genero,
      telefono,
      contacto_emergencia: emergencia,
      tipo_sangre: sangre,
      alergias,
      notas_medicas: notas,
      estado,
    });
    setLoading(false);

    if (result.success) {
      Alert.alert('✅ Actualizado', 'Datos del paciente actualizados correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', result.mensaje || 'No se pudo actualizar el paciente');
    }
  };

  // Función para generar iniciales del avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />

      {/* Header con botón de guardado rápido */}
      <View style={[styles.header, { borderBottomColor: t.separator }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={t.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.text }]}>Editar Paciente</Text>
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
        {/* Badge de Identificación */}
        <View style={styles.idBadgeContainer}>
          <View style={[styles.idBadge, { backgroundColor: t.bg3, borderColor: t.cardBorder }]}>
            <Ionicons name="finger-print-outline" size={14} color={t.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.idBadgeText, { color: t.textSub }]}>
              ID Paciente: <Text style={{ color: t.primary, fontWeight: '700' }}>{paciente.id}</Text>
            </Text>
          </View>
        </View>

        {/* Avatar Visual */}
        <View style={styles.avatarContainer}>
          <View style={[styles.avatarCircle, { backgroundColor: t.bg3, borderColor: t.primary }]}>
            <Text style={[styles.avatarInitials, { color: t.primary }]}>
              {getInitials(nombre || 'P')}
            </Text>
          </View>
          <TouchableOpacity style={[styles.addAvatarBtn, { backgroundColor: t.primary }]}>
            <Ionicons name="camera" size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Formulario */}
        <Text style={[styles.label, { color: t.textSub }]}>Nombre Completo *</Text>
        <View style={[styles.inputContainer, { backgroundColor: t.inputBg, borderColor: t.inputBorder }]}>
          <TextInput
            style={[styles.input, { color: t.text }]}
            placeholder="Nombre del paciente"
            placeholderTextColor={t.textMuted}
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={[styles.label, { color: t.textSub }]}>Edad</Text>
            <View style={[styles.inputContainer, { backgroundColor: t.inputBg, borderColor: t.inputBorder }]}>
              <TextInput
                style={[styles.input, { color: t.text }]}
                placeholder="0"
                placeholderTextColor={t.textMuted}
                value={edad}
                onChangeText={setEdad}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={[styles.flex1, { marginLeft: 16 }]}>
            <Text style={[styles.label, { color: t.textSub }]}>Género</Text>
            <TouchableOpacity
              style={[styles.dropdown, { backgroundColor: t.inputBg, borderColor: t.inputBorder }]}
              onPress={() => setShowGenero(!showGenero)}
            >
              <Text style={[styles.dropdownText, { color: genero ? t.text : t.textMuted }]}>
                {genero || 'Seleccionar'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={t.textSub} />
            </TouchableOpacity>
          </View>
        </View>

        {showGenero && (
          <View style={[styles.dropdownMenu, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
            {GENEROS.map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.dropdownItem, { borderBottomColor: t.separator }]}
                onPress={() => { setGenero(g); setShowGenero(false); }}
              >
                <Text style={[styles.dropdownItemText, { color: t.text }]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={[styles.label, { color: t.textSub, marginTop: 12 }]}>Estado de Prioridad</Text>
        <View style={styles.chipRow}>
          {ESTADOS.map(e => (
            <TouchableOpacity
              key={e}
              style={[
                styles.chip,
                {
                  borderColor: estado === e ? t.primary : t.cardBorder,
                  backgroundColor: estado === e ? t.primary : t.bg3,
                },
              ]}
              onPress={() => setEstado(e)}
            >
              <Text style={[styles.chipText, { color: estado === e ? '#fff' : t.text }]}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: t.textSub, marginTop: 12 }]}>Teléfono</Text>
        <View style={[styles.inputContainer, { backgroundColor: t.inputBg, borderColor: t.inputBorder }]}>
          <Ionicons name="call-outline" size={18} color={t.textMuted} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: t.text }]}
            placeholder="Teléfono"
            placeholderTextColor={t.textMuted}
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />
        </View>

        <Text style={[styles.label, { color: t.textSub }]}>Tipo de Sangre</Text>
        <TouchableOpacity
          style={[styles.dropdown, { backgroundColor: t.inputBg, borderColor: t.inputBorder }]}
          onPress={() => setShowSangre(!showSangre)}
        >
          <Text style={[styles.dropdownText, { color: sangre ? t.text : t.textMuted }]}>
            {sangre || 'Seleccionar tipo'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={t.textSub} />
        </TouchableOpacity>

        {showSangre && (
          <View style={[styles.dropdownMenu, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
            {SANGRE.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.dropdownItem, { borderBottomColor: t.separator }]}
                onPress={() => { setSangre(s); setShowSangre(false); }}
              >
                <Text style={[styles.dropdownItemText, { color: t.text }]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={[styles.label, { color: t.textSub, marginTop: 16 }]}>Alergias</Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text }]}
          placeholder="Ninguna"
          placeholderTextColor={t.textMuted}
          value={alergias}
          onChangeText={setAlergias}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <Text style={[styles.label, { color: t.textSub, marginTop: 16 }]}>Notas Médicas</Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text }]}
          placeholder="Notas adicionales..."
          placeholderTextColor={t.textMuted}
          value={notas}
          onChangeText={setNotas}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Botones de acción inferior */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.cancelBtn, { borderColor: t.cardBorder }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.cancelText, { color: t.text }]}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: t.primary }]}
            onPress={handleGuardar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-done" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveText}>Guardar Cambios</Text>
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
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  idBadgeContainer: { alignItems: 'center', marginBottom: 16 },
  idBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  idBadgeText: { fontSize: 12, fontWeight: '500' },
  avatarContainer: { alignItems: 'center', marginBottom: 24 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { fontSize: 30, fontWeight: '800' },
  addAvatarBtn: { position: 'absolute', bottom: 0, right: '36%', width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  row: { flexDirection: 'row' },
  flex1: { flex: 1 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, height: 48, marginBottom: 8 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '600' },
  dropdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, height: 48, marginBottom: 4 },
  dropdownText: { fontSize: 14 },
  dropdownMenu: { borderWidth: 1, borderRadius: 10, marginBottom: 12, overflow: 'hidden' },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  dropdownItemText: { fontSize: 14 },
  textArea: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 14, minHeight: 90, marginBottom: 4 },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: { flex: 1, height: 50, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 15, fontWeight: '600' },
  saveBtn: { flex: 2, height: 50, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  saveText: { fontSize: 15, color: '#fff', fontWeight: '700' },
});