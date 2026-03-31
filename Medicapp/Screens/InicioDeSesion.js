import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar,
  ActivityIndicator, Alert, Modal, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { login, recuperarPassword, validarEmail } from '../controllers/UsuarioController';
import { sessionStore } from '../store/sessionStore';

export default function InicioDeSesion({ navigation }) {
  const [email, setEmail] = useState('demo@clinica.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal recuperar contraseña
  const [modalVisible, setModalVisible] = useState(false);
  const [recEmail, setRecEmail] = useState('');
  const [recPassword, setRecPassword] = useState('');
  const [recPasswordConfirm, setRecPasswordConfirm] = useState('');
  const [recShowPass, setRecShowPass] = useState(false);
  const [recLoading, setRecLoading] = useState(false);
  const [recStep, setRecStep] = useState(1); // 1=email, 2=nueva contraseña

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }
    if (!validarEmail(email.trim())) {
      Alert.alert('Error', 'Ingresa un correo electrónico válido');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      // Guardar sesión para no pedir login la próxima vez
      await sessionStore.guardar(result.usuario);
      navigation.replace('Main', { usuario: result.usuario });
    } else {
      Alert.alert('Error', result.mensaje);
    }
  };

  const handleVerificarEmail = async () => {
    if (!recEmail.trim()) {
      Alert.alert('Error', 'Ingresa tu correo'); return;
    }
    if (!validarEmail(recEmail.trim())) {
      Alert.alert('Error', 'Ingresa un correo válido'); return;
    }
    setRecLoading(true);
    // Verificar si existe el email en la BD
    const { getDB } = require('../database/Database');
    const db = await getDB();
    const user = await db.getFirstAsync(
      'SELECT id FROM usuarios WHERE email = ?', [recEmail.trim().toLowerCase()]
    );
    setRecLoading(false);
    if (!user) {
      Alert.alert('Error', 'No existe una cuenta con ese correo');
    } else {
      setRecStep(2);
    }
  };

  const handleRecuperar = async () => {
    if (!recPassword.trim() || recPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres'); return;
    }
    if (recPassword !== recPasswordConfirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden'); return;
    }
    setRecLoading(true);
    const result = await recuperarPassword(recEmail, recPassword);
    setRecLoading(false);
    if (result.success) {
      Alert.alert('✅ Listo', 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.', [
        { text: 'OK', onPress: () => {
          setModalVisible(false);
          setRecEmail('');
          setRecPassword('');
          setRecPasswordConfirm('');
          setRecStep(1);
          setEmail(recEmail);
          setPassword('');
        }},
      ]);
    } else {
      Alert.alert('Error', result.mensaje);
    }
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setRecEmail('');
    setRecPassword('');
    setRecPasswordConfirm('');
    setRecStep(1);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Ionicons name="heart" size={40} color="#fff" />
          </View>
          <Text style={styles.appName}>Gestión Médica</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>Ingresa tus credenciales para continuar</Text>

          <Text style={styles.label}>Correo Electrónico</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input} placeholder="correo@ejemplo.com"
              placeholderTextColor="#9CA3AF" value={email} onChangeText={setEmail}
              keyboardType="email-address" autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input} placeholder="••••••••"
              placeholderTextColor="#9CA3AF" value={password} onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotContainer} onPress={() => setModalVisible(true)}>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.loginButtonText}>Iniciar Sesión  →</Text>
            }
          </TouchableOpacity>

          <Text style={styles.hint}>Demo: demo@clinica.com / 123456</Text>
        </View>
      </ScrollView>

      {/* Modal recuperar contraseña */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={cerrarModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header modal */}
            <View style={styles.modalHeader}>
              <View style={styles.modalIconBox}>
                <Ionicons name="lock-open-outline" size={24} color="#2563EB" />
              </View>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={cerrarModal}>
                <Ionicons name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>
              {recStep === 1 ? 'Recuperar Contraseña' : 'Nueva Contraseña'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {recStep === 1
                ? 'Ingresa el correo de tu cuenta'
                : `Crea una nueva contraseña para ${recEmail}`
              }
            </Text>

            {/* PASO 1: Email */}
            {recStep === 1 && (
              <>
                <Text style={styles.modalLabel}>Correo Electrónico</Text>
                <View style={styles.modalInput}>
                  <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.modalInputText}
                    placeholder="correo@ejemplo.com"
                    placeholderTextColor="#9CA3AF"
                    value={recEmail}
                    onChangeText={setRecEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <TouchableOpacity
                  style={styles.modalBtn}
                  onPress={handleVerificarEmail}
                  disabled={recLoading}
                >
                  {recLoading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.modalBtnText}>Verificar Correo →</Text>
                  }
                </TouchableOpacity>
              </>
            )}

            {/* PASO 2: Nueva contraseña */}
            {recStep === 2 && (
              <>
                <Text style={styles.modalLabel}>Nueva Contraseña</Text>
                <View style={styles.modalInput}>
                  <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.modalInputText}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor="#9CA3AF"
                    value={recPassword}
                    onChangeText={setRecPassword}
                    secureTextEntry={!recShowPass}
                  />
                  <TouchableOpacity onPress={() => setRecShowPass(!recShowPass)}>
                    <Ionicons name={recShowPass ? 'eye-outline' : 'eye-off-outline'} size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalLabel}>Confirmar Contraseña</Text>
                <View style={styles.modalInput}>
                  <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.modalInputText}
                    placeholder="Repite la contraseña"
                    placeholderTextColor="#9CA3AF"
                    value={recPasswordConfirm}
                    onChangeText={setRecPasswordConfirm}
                    secureTextEntry={!recShowPass}
                  />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalBtnSecondary} onPress={() => setRecStep(1)}>
                    <Text style={styles.modalBtnSecondaryText}>← Atrás</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalBtn, { flex: 2 }]} onPress={handleRecuperar} disabled={recLoading}>
                    {recLoading
                      ? <ActivityIndicator color="#fff" />
                      : <Text style={styles.modalBtnText}>Guardar</Text>
                    }
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoBox: {
    width: 80, height: 80, borderRadius: 20, backgroundColor: '#2563EB',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    shadowColor: '#2563EB', shadowOpacity: 0.4, shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
  appName: { fontSize: 26, fontWeight: '700', color: '#111827' },
  formContainer: { width: '100%' },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 28 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6',
    borderRadius: 12, paddingHorizontal: 14, marginBottom: 16, height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#111827' },
  eyeIcon: { padding: 4 },
  forgotContainer: { alignItems: 'flex-end', marginBottom: 24 },
  forgotText: { color: '#2563EB', fontSize: 14, fontWeight: '500' },
  loginButton: {
    backgroundColor: '#2563EB', borderRadius: 14, height: 52,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#2563EB', shadowOpacity: 0.35, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  hint: { textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginTop: 16 },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  modalContainer: {
    width: '100%', backgroundColor: '#fff', borderRadius: 20,
    padding: 24, shadowColor: '#000', shadowOpacity: 0.2,
    shadowRadius: 20, elevation: 10,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalIconBox: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center',
  },
  modalCloseBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 6 },
  modalSubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 20, lineHeight: 18 },
  modalLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 4 },
  modalInput: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6',
    borderRadius: 12, paddingHorizontal: 14, height: 50, marginBottom: 12,
  },
  modalInputText: { flex: 1, fontSize: 14, color: '#111827' },
  modalBtn: {
    backgroundColor: '#2563EB', borderRadius: 12, height: 50,
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
  },
  modalBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  modalButtons: { flexDirection: 'row', gap: 10, marginTop: 8 },
  modalBtnSecondary: {
    flex: 1, height: 50, borderRadius: 12, borderWidth: 1,
    borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center',
  },
  modalBtnSecondaryText: { color: '#374151', fontSize: 14, fontWeight: '600' },
});