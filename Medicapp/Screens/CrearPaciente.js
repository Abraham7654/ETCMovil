import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/useTheme';
import { crearPaciente } from '../controllers/PacienteController';

const GENEROS = ['Masculino', 'Femenino', 'Otro'];
const SANGRE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const ESTADOS = ['Activo', 'Pendiente', 'Urgente'];

export default function CrearPaciente({ navigation }) {
  const { darkMode, t } = useTheme();
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [genero, setGenero] = useState('');
  const [telefono, setTelefono] = useState('');
  const [emergencia, setEmergencia] = useState('');
  const [sangre, setSangre] = useState('');
  const [alergias, setAlergias] = useState('');
  const [notas, setNotas] = useState('');
  const [estado, setEstado] = useState('Activo');
  const [showGenero, setShowGenero] = useState(false);
  const [showSangre, setShowSangre] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre del paciente es obligatorio');
      return;
    }
    setLoading(true);
    const result = await crearPaciente({
      nombre, edad, genero, telefono,
      contacto_emergencia: emergencia,
      tipo_sangre: sangre, alergias,
      notas_medicas: notas, estado,
    });
    setLoading(false);
    if (result.success) {
      Alert.alert('✅ Éxito', 'Paciente guardado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', result.mensaje || 'No se pudo guardar el paciente');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />
      <View style={[styles.header, { borderBottomColor: t.separator }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={t.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.text }]}>Nuevo Paciente</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarContainer}>
          <View style={[styles.avatarCircle, { backgroundColor: t.bg3, borderColor: t.cardBorder }]}>
            <Ionicons name="camera-outline" size={32} color={t.textMuted} />
          </View>
          <TouchableOpacity style={styles.addAvatarBtn}>
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Nombre */}
        <Text style={[styles.label, { color: t.textSub }]}>Nombre Completo *</Text>
        <View style={[styles.inputContainer, { backgroundColor: t.inputBg, borderColor: t.inputBorder }]}>
          <TextInput style={[styles.input, { color: t.text }]} placeholder="Ingrese el nombre completo"
            placeholderTextColor={t.textMuted} value={nombre} onChangeText={setNombre} />
        </View>

        {/* Edad y Género */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={[styles.label, { color: t.textSub }]}>Edad</Text>
            <View style={[styles.inputContainer, { backgroundColor: t.inputBg, borderColor: t.inputBorder }]}>
              <TextInput style={[styles.input, { color: t.text }]} placeholder="Edad"
                placeholderTextColor={t.textMuted} value={edad} onChangeText={setEdad} keyboardType="numeric" />
            </View>
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={[styles.label, { color: t.textSub }]}>Género</Text>
            <TouchableOpacity style={[styles.dropdown, { backgroundColor: t.inputBg, borderColor: t.inputBorder }]}
              onPress={() => setShowGenero(!showGenero)}>
              <Text style={[styles.dropdownText, { color: genero ? t.text : t.textMuted }]}>
                {genero || 'Seleccionar'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={t.textSub} />
            </TouchableOpacity>
            {showGenero && (
              <View style={[styles.dropdownMenu, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
                {GENEROS.map(g => (
                  <TouchableOpacity key={g} style={[styles.dropdownItem, { borderBottomColor: t.separator }]}
                    onPress={() => { setGenero(g); setShowGenero(false); }}>
                    <Text style={[styles.dropdownItemText, { color: t.text }]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Estado */}
        <Text style={[styles.label, { color: t.textSub }]}>Estado</Text>
        <View style={styles.chipRow}>
          {ESTADOS.map(e => (
            <TouchableOpacity key={e}
              style={[styles.chip, { borderColor: t.cardBorder, backgroundColor: estado === e ? t.primary : t.bg3 }]}
              onPress={() => setEstado(e)}>
              <Text style={[styles.chipText, { color: estado === e ? '#fff' : t.text }]}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Teléfono */}
        <Text style={[styles.label, { color: t.textSub }]}>Teléfono</Text>
        <View style={[styles.inputContainer, { backgroundColor: t.inputBg, borderColor: t.inputBorder }]}>
          <Ionicons name="call-outline" size={18} color={t.textMuted} style={{ marginRight: 8 }} />
          <TextInput style={[styles.input, { color: t.text }]} placeholder="+52 123 456 7890"
            placeholderTextColor={t.textMuted} value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
        </View>

        {/* Emergencia */}
        <Text style={[styles.label, { color: t.textSub }]}>Contacto de Emergencia</Text>
        <View style={[styles.inputContainer, { backgroundColor: t.inputBg, borderColor: t.inputBorder }]}>
          <Ionicons name="people-outline" size={18} color={t.textMuted} style={{ marginRight: 8 }} />
          <TextInput style={[styles.input, { color: t.text }]} placeholder="Teléfono de emergencia"
            placeholderTextColor={t.textMuted} value={emergencia} onChangeText={setEmergencia} keyboardType="phone-pad" />
        </View>

        {/* Tipo de Sangre */}
        <Text style={[styles.label, { color: t.textSub }]}>Tipo de Sangre</Text>
        <TouchableOpacity style={[styles.dropdown, { backgroundColor: t.inputBg, borderColor: t.inputBorder }]}
          onPress={() => setShowSangre(!showSangre)}>
          <Text style={[styles.dropdownText, { color: sangre ? t.text : t.textMuted }]}>
            {sangre || 'Seleccionar tipo'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={t.textSub} />
        </TouchableOpacity>
        {showSangre && (
          <View style={[styles.dropdownMenu, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
            {SANGRE.map(s => (
              <TouchableOpacity key={s} style={[styles.dropdownItem, { borderBottomColor: t.separator }]}
                onPress={() => { setSangre(s); setShowSangre(false); }}>
                <Text style={[styles.dropdownItemText, { color: t.text }]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Alergias */}
        <Text style={[styles.label, { color: t.textSub, marginTop: 16 }]}>Alergias</Text>
        <TextInput style={[styles.textArea, { backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text }]}
          placeholder="Describa alergias conocidas..." placeholderTextColor={t.textMuted}
          value={alergias} onChangeText={setAlergias} multiline numberOfLines={3} textAlignVertical="top" />

        {/* Notas */}
        <Text style={[styles.label, { color: t.textSub, marginTop: 16 }]}>Notas Médicas</Text>
        <TextInput style={[styles.textArea, { backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.text }]}
          placeholder="Antecedentes médicos, medicamentos actuales..."
          placeholderTextColor={t.textMuted} value={notas} onChangeText={setNotas}
          multiline numberOfLines={4} textAlignVertical="top" />

        {/* Botones */}
        <View style={styles.buttons}>
          <TouchableOpacity style={[styles.cancelBtn, { borderColor: t.cardBorder }]} onPress={() => navigation.goBack()}>
            <Text style={[styles.cancelText, { color: t.text }]}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: t.primary }]}
            onPress={handleGuardar} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Ionicons name="checkmark" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.saveText}>Guardar</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  avatarContainer: { alignItems: 'center', marginBottom: 24 },
  avatarCircle: { width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  addAvatarBtn: { position: 'absolute', bottom: 0, right: '35%', width: 28, height: 28, borderRadius: 14, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row' },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, height: 48, marginBottom: 4 },
  input: { flex: 1, fontSize: 14 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '600' },
  dropdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, height: 48, marginBottom: 4 },
  dropdownText: { fontSize: 14 },
  dropdownMenu: { borderWidth: 1, borderRadius: 10, marginBottom: 8 },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  dropdownItemText: { fontSize: 14 },
  textArea: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 14, minHeight: 90, marginBottom: 4 },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: { flex: 1, height: 50, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 15, fontWeight: '600' },
  saveBtn: { flex: 2, height: 50, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  saveText: { fontSize: 15, color: '#fff', fontWeight: '700' },
});