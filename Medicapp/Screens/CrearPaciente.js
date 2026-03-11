import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GENEROS = ['Masculino', 'Femenino', 'Otro'];
const SANGRE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function CrearPaciente({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [genero, setGenero] = useState('');
  const [telefono, setTelefono] = useState('');
  const [emergencia, setEmergencia] = useState('');
  const [sangre, setSangre] = useState('');
  const [alergias, setAlergias] = useState('');
  const [notas, setNotas] = useState('');
  const [showGenero, setShowGenero] = useState(false);
  const [showSangre, setShowSangre] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nuevo Paciente</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Ionicons name="camera-outline" size={32} color="#9CA3AF" />
          </View>
          <TouchableOpacity style={styles.addAvatarBtn}>
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <Field label="Nombre Completo" value={nombre} onChangeText={setNombre} placeholder="Ingrese el nombre completo" />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Field label="Edad" value={edad} onChangeText={setEdad} placeholder="Edad" keyboardType="numeric" />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.label}>Género</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowGenero(!showGenero)}>
              <Text style={[styles.dropdownText, !genero && { color: '#9CA3AF' }]}>
                {genero || 'Seleccionar'}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#374151" />
            </TouchableOpacity>
            {showGenero && (
              <View style={styles.dropdownMenu}>
                {GENEROS.map(g => (
                  <TouchableOpacity key={g} style={styles.dropdownItem}
                    onPress={() => { setGenero(g); setShowGenero(false); }}>
                    <Text style={styles.dropdownItemText}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <Text style={styles.label}>Teléfono</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput style={styles.input} placeholder="+52 123 456 7890"
            placeholderTextColor="#9CA3AF" value={telefono} onChangeText={setTelefono}
            keyboardType="phone-pad" />
        </View>

        <Text style={styles.label}>Contacto de Emergencia</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="people-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput style={styles.input} placeholder="Teléfono de emergencia"
            placeholderTextColor="#9CA3AF" value={emergencia} onChangeText={setEmergencia}
            keyboardType="phone-pad" />
        </View>

        <Text style={styles.label}>Tipo de Sangre</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowSangre(!showSangre)}>
          <Text style={[styles.dropdownText, !sangre && { color: '#9CA3AF' }]}>
            {sangre || 'Seleccionar tipo'}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#374151" />
        </TouchableOpacity>
        {showSangre && (
          <View style={styles.dropdownMenu}>
            {SANGRE.map(s => (
              <TouchableOpacity key={s} style={styles.dropdownItem}
                onPress={() => { setSangre(s); setShowSangre(false); }}>
                <Text style={styles.dropdownItemText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={[styles.label, { marginTop: 16 }]}>Alergias</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describa alergias conocidas..."
          placeholderTextColor="#9CA3AF"
          value={alergias}
          onChangeText={setAlergias}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <Text style={[styles.label, { marginTop: 16 }]}>Notas Médicas</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Antecedentes médicos, medicamentos actuales, condiciones especiales..."
          placeholderTextColor="#9CA3AF"
          value={notas}
          onChangeText={setNotas}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="checkmark" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.saveText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboardType }) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || 'default'}
        />
      </View>
    </>
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
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  avatarContainer: { alignItems: 'center', marginBottom: 24 },
  avatarCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: '#F3F4F6', borderWidth: 2, borderColor: '#E5E7EB',
    borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center',
  },
  addAvatarBtn: {
    position: 'absolute', bottom: 0, right: '35%',
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center',
  },
  row: { flexDirection: 'row' },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 4 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10,
    paddingHorizontal: 14, height: 48, marginBottom: 4, backgroundColor: '#FAFAFA',
  },
  input: { flex: 1, fontSize: 14, color: '#111827' },
  dropdown: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10,
    paddingHorizontal: 14, height: 48, backgroundColor: '#FAFAFA', marginBottom: 4,
  },
  dropdownText: { fontSize: 14, color: '#111827' },
  dropdownMenu: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10,
    backgroundColor: '#fff', marginBottom: 8,
  },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  dropdownItemText: { fontSize: 14, color: '#374151' },
  textArea: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10,
    padding: 12, fontSize: 14, color: '#111827',
    backgroundColor: '#FAFAFA', minHeight: 90, marginBottom: 4,
  },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: {
    flex: 1, height: 50, borderRadius: 12,
    borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center',
  },
  cancelText: { fontSize: 15, color: '#374151', fontWeight: '600' },
  saveBtn: {
    flex: 2, height: 50, borderRadius: 12,
    backgroundColor: '#2563EB', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
  },
  saveText: { fontSize: 15, color: '#fff', fontWeight: '700' },
});