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

  // Modal recuperar contraseña
  const [modalVisible, setModalVisible] = useState(false);
  const [recEmail, setRecEmail] = useState('');
  const [recClaveTemporal, setRecClaveTemporal] = useState(''); // <--- Nueva
  const [recPassword, setRecPassword] = useState('');
  const [recPasswordConfirm, setRecPasswordConfirm] = useState('');
  const [recShowPass, setRecShowPass] = useState(false);
  const [recLoading, setRecLoading] = useState(false);
  const [recStep, setRecStep] = useState(1); 

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña'); return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      await sessionStore.guardar(result.usuario);
      navigation.replace('Main', { usuario: result.usuario });
    } else {
      Alert.alert('Error', result.mensaje);
    }
  };

  const handleVerificarEmail = async () => {
    if (!validarEmail(recEmail)) {
      Alert.alert('Error', 'Ingresa un correo válido'); return;
    }
    setRecLoading(true);
    const result = await generarClaveTemporal(recEmail);
    setRecLoading(false);

    if (result.success) {
      // Simulación de envío de correo
      Alert.alert(
        '📧 Correo Enviado',
        `Se ha enviado una clave temporal a tu correo.\n\nCLAVE: ${result.claveTemporal}`,
        [{ text: 'Ingresar Clave', onPress: () => setRecStep(2) }]
      );
    } else {
      Alert.alert('Error', result.mensaje);
    }
  };

  const handleFinalizarRecuperacion = async () => {
    if (!recClaveTemporal) {
      Alert.alert('Error', 'Ingresa la clave temporal'); return;
    }
    if (recPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener 6+ caracteres'); return;
    }
    if (recPassword !== recPasswordConfirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden'); return;
    }

    setRecLoading(true);
    const result = await completarRecuperacion(recEmail, recClaveTemporal, recPassword);
    setRecLoading(false);

    if (result.success) {
      Alert.alert('✅ Éxito', 'Contraseña actualizada. Ya puedes entrar.', [
        { text: 'OK', onPress: () => {
          cerrarModal();
          setEmail(recEmail);
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
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}><Ionicons name="heart" size={40} color="#fff" /></View>
          <Text style={styles.appName}>Gestión Médica</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>Ingresa tus credenciales para continuar</Text>

          <Text style={styles.label}>Correo Electrónico</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
          </View>

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}><Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#9CA3AF" /></TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotContainer} onPress={() => setModalVisible(true)}>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Iniciar Sesión  →</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL DE RECUPERACIÓN */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconBox}><Ionicons name="lock-open-outline" size={24} color="#2563EB" /></View>
              <TouchableOpacity onPress={cerrarModal}><Ionicons name="close" size={22} color="#6B7280" /></TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>{recStep === 1 ? 'Recuperar Contraseña' : 'Nueva Contraseña'}</Text>
            <Text style={styles.modalSubtitle}>{recStep === 1 ? 'Ingresa el correo de tu cuenta' : `Configura tu acceso para ${recEmail}`}</Text>

            {recStep === 1 ? (
              <>
                <Text style={styles.modalLabel}>Correo Electrónico</Text>
                <View style={styles.modalInput}>
                  <TextInput style={styles.modalInputText} placeholder="correo@ejemplo.com" value={recEmail} onChangeText={setRecEmail} autoCapitalize="none" />
                </View>
                <TouchableOpacity style={styles.modalBtn} onPress={handleVerificarEmail} disabled={recLoading}>
                  {recLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalBtnText}>Verificar Correo →</Text>}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalLabel}>Clave Temporal (Enviada)</Text>
                <View style={styles.modalInput}>
                  <TextInput style={styles.modalInputText} placeholder="Ej: 123456" value={recClaveTemporal} onChangeText={setRecClaveTemporal} keyboardType="numeric" />
                </View>

                <Text style={styles.modalLabel}>Nueva Contraseña</Text>
                <View style={styles.modalInput}>
                  <TextInput style={styles.modalInputText} placeholder="Mínimo 6 caracteres" value={recPassword} onChangeText={setRecPassword} secureTextEntry={!recShowPass} />
                </View>

                <Text style={styles.modalLabel}>Confirmar Contraseña</Text>
                <View style={styles.modalInput}>
                  <TextInput style={styles.modalInputText} placeholder="Repite la contraseña" value={recPasswordConfirm} onChangeText={setRecPasswordConfirm} secureTextEntry={!recShowPass} />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalBtnSecondary} onPress={() => setRecStep(1)}><Text>Atrás</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.modalBtn, {flex: 2}]} onPress={handleFinalizarRecuperacion} disabled={recLoading}>
                    {recLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalBtnText}>Guardar</Text>}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// ... (Los estilos se mantienen igual a los que ya tienes) ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoBox: { width: 80, height: 80, borderRadius: 20, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  appName: { fontSize: 26, fontWeight: '700', color: '#111827' },
  formContainer: { width: '100%' },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 28 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 14, marginBottom: 16, height: 52 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#111827' },
  forgotContainer: { alignItems: 'flex-end', marginBottom: 24 },
  forgotText: { color: '#2563EB', fontSize: 14, fontWeight: '500' },
  loginButton: { backgroundColor: '#2563EB', borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center' },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContainer: { width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalIconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 6 },
  modalSubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 20 },
  modalLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  modalInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 14, height: 50, marginBottom: 12 },
  modalInputText: { flex: 1, fontSize: 14, color: '#111827' },
  modalBtn: { backgroundColor: '#2563EB', borderRadius: 12, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  modalBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  modalButtons: { flexDirection: 'row', gap: 10, marginTop: 8 },
  modalBtnSecondary: { flex: 1, height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
});