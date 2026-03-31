import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/useTheme';
import { guardarSignosVitales } from '../controllers/SignosVitalesController';

export default function SignosVitales({ navigation, route }) {
  const { t, darkMode } = useTheme();
  const paciente = route?.params?.paciente;
  
  // Estados para los signos vitales
  const [peso, setPeso] = useState('');
  const [presion, setPresion] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [oxigenacion, setOxigenacion] = useState(''); // Campo extra común
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    if (!paciente?.id) { Alert.alert('Error', 'No se identificó al paciente'); return; }
    if (!peso && !presion && !frecuencia && !temperatura) {
      Alert.alert('Atención', 'Por favor, ingresa al menos un signo vital para el registro.'); 
      return;
    }

    setLoading(true);
    const result = await guardarSignosVitales({
      paciente_id: paciente.id,
      fecha: new Date().toISOString(),
      peso, 
      presion, 
      frecuencia_cardiaca: frecuencia,
      temperatura, 
      oxigenacion,
      notas,
    });
    setLoading(false);

    if (result.success) {
      Alert.alert('✅ Registrado', 'Los signos vitales se guardaron en el expediente.', [
        { text: 'Finalizar', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', result.mensaje || 'Hubo un problema al guardar los datos.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />
      
      {/* Header Personalizado */}
      <View style={[styles.header, { borderBottomColor: t.separator }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.headerIconBtn, { backgroundColor: t.bg3 }]}>
          <Ionicons name="chevron-back" size={22} color={t.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.text }]}>Nuevo Registro</Text>
        <View style={{ width: 40 }} />
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
          {/* Header del Paciente */}
          {paciente && (
            <View style={[styles.pacienteCard, { backgroundColor: t.primary }]}>
              <View style={styles.pacienteInfo}>
                <Text style={styles.pacienteLabel}>PACIENTE SELECCIONADO</Text>
                <Text style={styles.pacienteNameText}>{paciente.nombre}</Text>
                <Text style={styles.pacienteMetaText}>ID: {paciente.id} • {paciente.edad} años</Text>
              </View>
              <Ionicons name="medical" size={40} color="rgba(255,255,255,0.2)" />
            </View>
          )}

          <Text style={[styles.sectionTitle, { color: t.textSub }]}>SIGNOS VITALES</Text>

          {/* Grid de Signos Vitales */}
          <View style={styles.vitalsGrid}>
            <VitalInputCard 
              label="Peso" unit="kg" value={peso} onChangeText={setPeso} 
              icon="scale-outline" color="#10B981" placeholder="0.0" t={t} 
            />
            <VitalInputCard 
              label="Temperatura" unit="°C" value={temperatura} onChangeText={setTemperatura} 
              icon="thermometer-outline" color="#F59E0B" placeholder="36.5" t={t} 
            />
            <VitalInputCard 
              label="P. Arterial" unit="mmHg" value={presion} onChangeText={setPresion} 
              icon="heart-outline" color="#EF4444" placeholder="120/80" t={t} 
            />
            <VitalInputCard 
              label="F. Cardíaca" unit="bpm" value={frecuencia} onChangeText={setFrecuencia} 
              icon="pulse-outline" color="#2563EB" placeholder="72" t={t} 
            />
            <VitalInputCard 
              label="Saturación" unit="SpO2" value={oxigenacion} onChangeText={setOxigenacion} 
              icon="water-outline" color="#06B6D4" placeholder="98%" t={t} 
            />
          </View>

          {/* Sección de Notas */}
          <View style={styles.notesSection}>
            <Text style={[styles.sectionTitle, { color: t.textSub }]}>OBSERVACIONES ADICIONALES</Text>
            <TextInput
              style={[styles.notesInput, { 
                backgroundColor: t.card, 
                borderColor: t.cardBorder, 
                color: t.text 
              }]}
              placeholder="Escribe hallazgos clínicos relevantes..." 
              placeholderTextColor={t.textMuted}
              value={notas} 
              onChangeText={setNotas} 
              multiline 
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Botones de Acción */}
      <View style={[styles.footer, { 
        backgroundColor: t.card, 
        borderTopColor: t.cardBorder,
        paddingBottom: Platform.OS === 'ios' ? 34 : 16 
      }]}>
        <TouchableOpacity 
          style={[styles.btnSec, { borderColor: t.cardBorder }]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.btnSecText, { color: t.text }]}>Descartar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.btnPri, { backgroundColor: t.primary }]} 
          onPress={handleGuardar} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="save-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.btnPriText}>Guardar Datos</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/**
 * Componente interno para las tarjetas de entrada
 */
function VitalInputCard({ label, unit, value, onChangeText, icon, color, placeholder, t }) {
  return (
    <View style={[styles.vCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
      <View style={styles.vCardHeader}>
        <View style={[styles.vIconBox, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <Text style={[styles.vUnit, { color: t.textSub }]}>{unit}</Text>
      </View>
      <Text style={[styles.vLabel, { color: t.text }]}>{label}</Text>
      <TextInput 
        style={[styles.vInput, { color: t.text }]} 
        placeholder={placeholder} 
        placeholderTextColor={t.textMuted} 
        value={value} 
        onChangeText={onChangeText} 
        keyboardType={label === 'P. Arterial' ? 'default' : 'decimal-pad'} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 12 
  },
  headerIconBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  
  scroll: { padding: 20, paddingBottom: 120 },
  
  pacienteCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    borderRadius: 24, 
    marginBottom: 25,
    justifyContent: 'space-between'
  },
  pacienteLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  pacienteNameText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  pacienteMetaText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '500' },

  sectionTitle: { fontSize: 12, fontWeight: '800', marginBottom: 15, letterSpacing: 1 },

  vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  
  // Estilos Vital Card
  vCard: { 
    width: '48%', 
    borderRadius: 20, 
    borderWidth: 1, 
    padding: 15, 
    marginBottom: 15 
  },
  vCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  vIconBox: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  vUnit: { fontSize: 11, fontWeight: '700' },
  vLabel: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  vInput: { fontSize: 22, fontWeight: '800', padding: 0 },

  notesSection: { marginTop: 10 },
  notesInput: { 
    fontSize: 15, 
    borderRadius: 20, 
    padding: 16, 
    minHeight: 120, 
    borderWidth: 1,
    lineHeight: 22
  },

  footer: { 
    position: 'absolute', 
    bottom: 0, left: 0, right: 0, 
    flexDirection: 'row', 
    padding: 20, 
    gap: 12, 
    borderTopWidth: 1 
  },
  btnSec: { flex: 1, height: 56, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  btnSecText: { fontWeight: '700', fontSize: 15 },
  btnPri: { flex: 2, height: 56, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnPriText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});