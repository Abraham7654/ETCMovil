import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Fechas para el selector
const dates = [
  { day: 'Lun', date: '14' },
  { day: 'Mar', date: '15', active: true },
  { day: 'Mié', date: '16' },
  { day: 'Jue', date: '17' },
  { day: 'Vie', date: '18' },
];

export default function NotesScreen({ navigation }) {
  // Estados para los campos de la nota
  const [reason, setReason] = useState('');
  const [temperature, setTemperature] = useState('');
  const [pressure, setPressure] = useState('');
  const [weight, setWeight] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');

  const handleSave = () => {
    console.log("Guardando nota...");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notas</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="checkmark" size={24} color="#2563EB" onPress={handleSave} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Tarjeta del Paciente Resumida */}
          <View style={styles.patientSummaryCard}>
            <View style={styles.avatarMini}>
              <Text style={styles.avatarMiniText}>MG</Text>
            </View>
            <View style={styles.patientSummaryInfo}>
              <Text style={styles.patientSummaryName}>María González</Text>
              <Text style={styles.patientSummaryDesc}>Consulta General - 09:30 AM</Text>
            </View>
          </View>

          {/* Selector de Fechas */}
          <View style={styles.dateSelectorContainer}>
            {dates.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.dateBox, item.active && styles.dateBoxActive]}
              >
                <Text style={[styles.dateDay, item.active && styles.dateTextActive]}>{item.day}</Text>
                <Text style={[styles.dateNumber, item.active && styles.dateTextActive]}>{item.date}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sección: Motivo de Consulta */}
          <Text style={styles.sectionTitle}>Motivo de Consulta</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describa los síntomas del paciente..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={reason}
            onChangeText={setReason}
          />

          {/* Sección: Signos Vitales */}
          <Text style={styles.sectionTitle}>Signos Vitales</Text>
          <View style={styles.vitalSignsRow}>
            
            <View style={styles.vitalSignBox}>
              <View style={styles.vitalSignHeader}>
                <Ionicons name="thermometer-outline" size={16} color="#EF4444" />
                <Text style={styles.vitalSignLabel}>Temp.</Text>
              </View>
              <View style={styles.vitalSignInputContainer}>
                <TextInput
                  style={styles.vitalSignInput}
                  placeholder="36.5"
                  keyboardType="numeric"
                  value={temperature}
                  onChangeText={setTemperature}
                />
                <Text style={styles.vitalSignUnit}>°C</Text>
              </View>
            </View>

            <View style={styles.vitalSignBox}>
              <View style={styles.vitalSignHeader}>
                <Ionicons name="heart-outline" size={16} color="#EF4444" />
                <Text style={styles.vitalSignLabel}>Presión</Text>
              </View>
              <View style={styles.vitalSignInputContainer}>
                <TextInput
                  style={styles.vitalSignInput}
                  placeholder="120/80"
                  keyboardType="numbers-and-punctuation"
                  value={pressure}
                  onChangeText={setPressure}
                />
              </View>
            </View>

            <View style={styles.vitalSignBox}>
              <View style={styles.vitalSignHeader}>
                <Ionicons name="scale-outline" size={16} color="#3B82F6" />
                <Text style={styles.vitalSignLabel}>Peso</Text>
              </View>
              <View style={styles.vitalSignInputContainer}>
                <TextInput
                  style={styles.vitalSignInput}
                  placeholder="70"
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                />
                <Text style={styles.vitalSignUnit}>kg</Text>
              </View>
            </View>

          </View>

          {/* Sección: Diagnóstico */}
          <Text style={styles.sectionTitle}>Diagnóstico</Text>
          <TextInput
            style={styles.inputSingleLine}
            placeholder="Diagnóstico principal..."
            placeholderTextColor="#9CA3AF"
            value={diagnosis}
            onChangeText={setDiagnosis}
          />

          {/* Sección: Tratamiento */}
          <Text style={styles.sectionTitle}>Tratamiento / Receta</Text>
          <TextInput
            style={[styles.textArea, { marginBottom: 30 }]}
            placeholder="Medicamentos, dosis y recomendaciones..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={treatment}
            onChangeText={setTreatment}
          />

        </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerIcon: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  patientSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  avatarMini: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarMiniText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  patientSummaryInfo: {
    flex: 1,
  },
  patientSummaryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  patientSummaryDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  dateSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  dateBox: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  dateBoxActive: {
    backgroundColor: '#2563EB',
  },
  dateDay: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  dateTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
    marginTop: 5,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 15,
    height: 100,
    fontSize: 15,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  inputSingleLine: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 15,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  vitalSignsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  vitalSignBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
  },
  vitalSignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vitalSignLabel: {
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 4,
  },
  vitalSignInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vitalSignInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    padding: 0, // Remover padding por defecto en Android
  },
  vitalSignUnit: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
});