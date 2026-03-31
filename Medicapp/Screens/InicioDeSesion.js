import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar,
  ActivityIndicator, Alert, Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { login, generarClaveTemporal, completarRecuperacion, validarEmail } from '../controllers/UsuarioController';
import { sessionStore } from '../store/sessionStore';

export default function InicioDeSesion({ navigation }) {
  const [email, setEmail] = useState('demo@clinica.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados Recuperación
  const [modalVisible, setModalVisible] = useState(false);
  const [recEmail, setRecEmail] = useState('');
  const [recClaveTemporal, setRecClaveTemporal] = useState('');
  const [recPassword, setRecPassword] = useState('');
  const [recPasswordConfirm, setRecPasswordConfirm] = useState('');
  const [recShowPass, setRecShowPass] = useState(false);
  const [recLoading, setRecLoading] = useState(false);
  const [recStep, setRecStep] = useState(1); 

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atención', 'Por favor ingresa tu correo y contraseña'); return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      await sessionStore.guardar(result.usuario);
      navigation.replace('Main', { usuario: result.usuario });
    } else {
      Alert.alert('Error de Acceso', result.mensaje);
    }
  };

  const handleVerificarEmail = async () => {
    if (!validarEmail(recEmail)) {
      Alert.alert('Correo Inválido', 'Por favor, ingresa un formato de correo electrónico correcto.'); return;
    }
    setRecLoading(true);
    const result = await generarClaveTemporal(recEmail);
    setRecLoading(false);

    if (result.success) {
      Alert.alert(
        '📧 Clave Generada',
        `Para fines de esta demo, tu clave es: ${result.claveTemporal}\n\nEn un entorno real, esta llegaría a tu bandeja de entrada.`,
        [{ text: 'Ingresar Clave', onPress: () => setRecStep(2) }]
      );
    } else {
      Alert.alert('Error', result.mensaje);
    }
  };

  const handleFinalizarRecuperacion = async () => {
    if (!recClaveTemporal) {
      Alert.alert('Campo Requerido', 'Ingresa la clave temporal enviada.'); return;
    }
    if (recPassword.length < 6) {
      Alert.alert('Seguridad', 'La nueva contraseña debe tener al menos 6 caracteres.'); return;
    }
    if (recPassword !== recPasswordConfirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden.'); return;
    }

    setRecLoading(true);
    const result = await completarRecuperacion(recEmail, recClaveTemporal, recPassword);
    setRecLoading(false);

    if (result.success) {
      Alert.alert('✅ Actualizado', 'Tu contraseña ha sido cambiada exitosamente.', [
        { text: 'Ir al Inicio', onPress: () => {
          cerrarModal();
          setEmail(recEmail);
          setPassword('');
        }}
      ]);
    } else {
      Alert.alert('Error', result.mensaje);
    }
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setRecEmail('');
    setRecClaveTemporal('');
    setRecPassword('');
    setRecPasswordConfirm('');
    setRecStep(1);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Branding */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Ionicons name="medical" size={42} color="#fff" />
          </View>
          <Text style={styles.appName}>MediControl</Text>
          <Text style={styles.appTagline}>Gestión Médica Profesional</Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión para gestionar tus pacientes</Text>

          <Text style={styles.label}>Correo Electrónico</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              value={email} 
              onChangeText={setEmail} 
              autoCapitalize="none" 
              placeholder="ejemplo@correo.com"
            />
          </View>

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry={!showPassword} 
              placeholder="••••••••"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotContainer} onPress={() => setModalVisible(true)}>
            <Text style={styles.forgotText}>¿Problemas para entrar?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Entrar al Sistema</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL RECUPERACIÓN */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconBox}><Ionicons name="shield-checkmark-outline" size={24} color="#2563EB" /></View>
              <TouchableOpacity onPress={cerrarModal} style={styles.closeBtn}><Ionicons name="close" size={24} color="#6B7280" /></TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>{recStep === 1 ? 'Recuperar Cuenta' : 'Restablecer Contraseña'}</Text>
            <Text style={styles.modalSubtitle}>
              {recStep === 1 
                ? 'Te enviaremos una clave de acceso temporal a tu correo registrado.' 
                : `Ingresa la clave enviada a ${recEmail}`}
            </Text>

            {recStep === 1 ? (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.modalLabel}>Correo de recuperación</Text>
                <View style={styles.modalInput}>
                  <TextInput style={styles.modalInputText} placeholder="correo@clinica.com" value={recEmail} onChangeText={setRecEmail} autoCapitalize="none" />
                </View>
                <TouchableOpacity style={styles.modalBtn} onPress={handleVerificarEmail} disabled={recLoading}>
                  {recLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalBtnText}>Enviar Clave →</Text>}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.modalLabel}>Clave Temporal</Text>
                <View style={styles.modalInput}>
                  <TextInput style={styles.modalInputText} placeholder="6 dígitos" value={recClaveTemporal} onChangeText={setRecClaveTemporal} keyboardType="numeric" />
                </View>

                <Text style={styles.modalLabel}>Nueva Contraseña</Text>
                <View style={styles.modalInput}>
                  <TextInput style={styles.modalInputText} placeholder="Mín. 6 caracteres" value={recPassword} onChangeText={setRecPassword} secureTextEntry={!recShowPass} />
                  <TouchableOpacity onPress={() => setRecShowPass(!recShowPass)}><Ionicons name={recShowPass ? "eye-off" : "eye"} size={18} color="#9CA3AF" /></TouchableOpacity>
                </View>

                <Text style={styles.modalLabel}>Confirmar Contraseña</Text>
                <View style={styles.modalInput}>
                  <TextInput style={styles.modalInputText} placeholder="Repite la contraseña" value={recPasswordConfirm} onChangeText={setRecPasswordConfirm} secureTextEntry={!recShowPass} />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalBtnSecondary} onPress={() => setRecStep(1)}><Text style={{fontWeight:'600'}}>Atrás</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.modalBtn, {flex: 2, marginTop: 0}]} onPress={handleFinalizarRecuperacion} disabled={recLoading}>
                    {recLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalBtnText}>Cambiar y Salir</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 40 },
  logoContainer: { alignItems: 'center', marginBottom: 50 },
  logoBox: { width: 85, height: 85, borderRadius: 24, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center', marginBottom: 18, shadowColor: '#2563EB', shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 },
  appName: { fontSize: 28, fontWeight: '800', color: '#111827', letterSpacing: -0.5 },
  appTagline: { fontSize: 14, color: '#6B7280', marginTop: 4, fontWeight: '500' },
  formContainer: { width: '100%' },
  title: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#6B7280', marginBottom: 32 },
  label: { fontSize: 13, fontWeight: '700', color: '#4B5563', marginBottom: 8, marginLeft: 4, textTransform: 'uppercase' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 16, marginBottom: 20, height: 56, borderWidth: 1, borderColor: '#E5E7EB' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#111827', fontWeight: '500' },
  forgotContainer: { alignItems: 'flex-end', marginBottom: 28 },
  forgotText: { color: '#2563EB', fontSize: 14, fontWeight: '600' },
  loginButton: { backgroundColor: '#2563EB', borderRadius: 18, height: 58, alignItems: 'center', justifyContent: 'center', shadowColor: '#2563EB', shadowOpacity: 0.2, shadowRadius: 10, elevation: 4 },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContainer: { width: '100%', backgroundColor: '#fff', borderRadius: 28, padding: 24, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalIconBox: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  closeBtn: { padding: 4 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 8 },
  modalSubtitle: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 20 },
  modalLabel: { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 8, textTransform: 'uppercase' },
  modalInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 14, paddingHorizontal: 16, height: 54, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  modalInputText: { flex: 1, fontSize: 15, color: '#111827', fontWeight: '500' },
  modalBtn: { backgroundColor: '#2563EB', borderRadius: 14, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  modalBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 10 },
  modalBtnSecondary: { flex: 1, height: 54, borderRadius: 14, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' },
});