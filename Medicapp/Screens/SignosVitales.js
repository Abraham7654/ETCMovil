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

export default function VitalSignsScreen({ navigation }) {
  // Estados para cada signo vital
  const [bloodPressure, setBloodPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [respiratoryRate, setRespiratoryRate] = useState('');
  const [temperature, setTemperature] = useState('');
  const [oxygen, setOxygen] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [glucose, setGlucose] = useState('');

  const handleSave = () => {
    console.log("Guardando signos vitales...");
    navigation.goBack();
  };

  // Componente reutilizable para cada campo
  const renderInputRow = (label, value, setValue, unit, placeholder, keyboardType = 'numeric') => (
    <View style={styles.inputRow}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor="#D1D5DB"
          value={value}
          onChangeText={setValue}
          keyboardType={keyboardType}
        />
        <Text style={styles.unitText}>{unit}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Signos Vitales</Text>
        <TouchableOpacity onPress={handleSave} style={styles.headerIcon}>
          <Ionicons name="checkmark" size={24} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Tarjeta de Resumen del Paciente */}
          <View style={styles.patientSummaryCard}>
            <View style={styles.avatarMini}>
              <Text style={styles.avatarMiniText}>MG</Text>
            </View>
            <View style={styles.patientSummaryInfo}>
              <Text style={styles.patientSummaryName}>María González</Text>
              <Text style={styles.patientSummaryDesc}>Consulta General - Hoy, 09:30 AM</Text>
            </View>
          </View>

          <View style={styles.formContainer}>
            {renderInputRow('Presión Arterial', bloodPressure, setBloodPressure, 'mmHg', '120/80', 'numbers-and-punctuation')}
            <View style={styles.divider} />
            {renderInputRow('Frec. Cardíaca', heartRate, setHeartRate, 'lpm', '72')}
            <View style={styles.divider} />
            {renderInputRow('Frec. Respiratoria', respiratoryRate, setRespiratoryRate, 'rpm', '16')}
            <View style={styles.divider} />
            {renderInputRow('Temperatura', temperature, setTemperature, '°C', '36.5', 'decimal-pad')}
            <View style={styles.divider} />
            {renderInputRow('Saturación O2', oxygen, setOxygen, '%', '98')}
            <View style={styles.divider} />
            {renderInputRow('Peso', weight, setWeight, 'kg', '65', 'decimal-pad')}
            <View style={styles.divider} />
            {renderInputRow('Estatura', height, setHeight, 'm', '1.65', 'decimal-pad')}
            <View style={styles.divider} />
            {renderInputRow('Glucosa (Opcional)', glucose, setGlucose, 'mg/dL', '90')}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Fondo claro para contrastar la tarjeta blanca
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
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
    paddingBottom: 40,
  },
  patientSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatarMini: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarMiniText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  patientSummaryInfo: {
    flex: 1,
  },
  patientSummaryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  patientSummaryDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  inputLabel: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  textInput: {
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'right',
    paddingRight: 8,
    minWidth: 80, // Asegura que haya espacio para escribir
  },
  unitText: {
    fontSize: 15,
    color: '#9CA3AF',
    width: 45, // Ancho fijo para que las unidades se alineen
    textAlign: 'left',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
});