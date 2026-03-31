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
import { cambiarPassword } from '../controllers/UsuarioController';
import { sessionStore } from '../store/sessionStore';

export default function CambiarPassword({ navigation, route }) {
  const { t } = useTheme();
  const usuario = route?.params?.usuario;

  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    if (!passwordActual.trim()) {
      Alert.alert('Error', 'Ingresa tu contraseña actual');
      return;
    }
    if (!passwordNueva.trim() || passwordNueva.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (passwordNueva !== passwordConfirm) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      return;
    }
    if (passwordActual === passwordNueva) {
      Alert.alert('Error', 'La nueva contraseña debe ser diferente a la actual');
      return;
    }

    setLoading(true);
    const result = await cambiarPassword(usuario?.id, passwordActual, passwordNueva);
    setLoading(false);

    if (result.success) {
      if (usuario) {
        await sessionStore.guardar({ ...usuario, password: passwordNueva });
      }
      Alert.alert('✅ Contraseña actualizada', 'Tu contraseña fue cambiada correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', result.mensaje);
    }
  };

  const renderStrengthBar = () => {
    if (passwordNueva.length === 0) return null;

    return (
      <View style={styles.strengthContainer}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              styles.strengthBar,
              {
                backgroundColor:
                  passwordNueva.length >= i * 3
                    ? passwordNueva.length >= 10
                      ? '#10B981'
                      : passwordNueva.length >= 6
                      ? '#F59E0B'
                      : '#EF4444'
                    : t.bg3,
              },
            ]}
          />
        ))}
        <Text style={[styles.strengthText, { color: t.textMuted }]}>
          {passwordNueva.length < 6 ? 'Débil' : passwordNueva.length < 10 ? 'Regular' : 'Fuerte'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />

      <View style={[styles.header, { borderBottomColor: t.separator }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={t.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.text }]}>Cambiar Contraseña</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.iconContainer}>
          <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="shield-checkmark-outline" size={40} color="#2563EB" />
          </View>
          <Text style={[styles.iconTitle, { color: t.text }]}>Seguridad de cuenta</Text>
          <Text style={[styles.iconSub, { color: t.textMuted }]}>
            Elige una contraseña segura de al menos 6 caracteres
          </Text>
        </View>

        <Text style={[styles.label, { color: t.textSub }]}>Contraseña Actual</Text>
        <View style={[styles.inputContainer, { backgroundColor: t.input, borderColor: t.inputBorder }]}>
          <Ionicons name="lock-closed-outline" size={18} color={t.textMuted} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: t.text }]}
            placeholder="Ingresa tu contraseña actual"
            placeholderTextColor={t.textMuted}
            value={passwordActual}
            onChangeText={setPasswordActual}
            secureTextEntry={!showActual}
          />
          <TouchableOpacity onPress={() => setShowActual(!showActual)}>
            <Ionicons name={showActual ? 'eye-outline' : 'eye-off-outline'} size={18} color={t.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={[styles.dividerLine, { backgroundColor: t.separator }]} />

        <Text style={[styles.label, { color: t.textSub }]}>Nueva Contraseña</Text>
        <View style={[styles.inputContainer, { backgroundColor: t.input, borderColor: t.inputBorder }]}>
          <Ionicons name="lock-open-outline" size={18} color={t.textMuted} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: t.text }]}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={t.textMuted}
            value={passwordNueva}
            onChangeText={setPasswordNueva}
            secureTextEntry={!showNueva}
          />
          <TouchableOpacity onPress={() => setShowNueva(!showNueva)}>
            <Ionicons name={showNueva ? 'eye-outline' : 'eye-off-outline'} size={18} color={t.textMuted} />
          </TouchableOpacity>
        </View>

        {renderStrengthBar()}

        <Text style={[styles.label, { color: t.textSub }]}>Confirmar Nueva Contraseña</Text>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: t.input,
              borderColor:
                passwordConfirm.length > 0
                  ? passwordNueva === passwordConfirm
                    ? '#10B981'
                    : '#EF4444'
                  : t.inputBorder,
            },
          ]}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={18}
            color={
              passwordConfirm.length > 0
                ? passwordNueva === passwordConfirm
                  ? '#10B981'
                  : '#EF4444'
                : t.textMuted
            }
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, { color: t.text }]}
            placeholder="Repite la nueva contraseña"
            placeholderTextColor={t.textMuted}
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            secureTextEntry={!showNueva}
          />
        </View>

        {passwordConfirm.length > 0 && passwordNueva !== passwordConfirm && (
          <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
        )}

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: t.primary, opacity: loading ? 0.8 : 1 }]}
          onPress={handleGuardar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.saveBtnText}>Actualizar Contraseña</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={[styles.cancelBtnText, { color: t.textMuted }]}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderBottomWidth: 1 
  },
  backBtn: { 
    width: 40, 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700' 
  },
  scroll: { 
    padding: 20, 
    paddingBottom: 40 
  },
  iconContainer: { 
    alignItems: 'center', 
    marginBottom: 32, 
    marginTop: 8 
  },
  iconBox: { 
    width: 80, 
    height: 80, 
    borderRadius: 24, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 12 
  },
  iconTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    marginBottom: 6 
  },
  iconSub: { 
    fontSize: 13, 
    textAlign: 'center', 
    lineHeight: 18 
  },
  label: { 
    fontSize: 13, 
    fontWeight: '600', 
    marginBottom: 8, 
    marginTop: 4 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1.5, 
    borderRadius: 12, 
    paddingHorizontal: 14, 
    height: 52, 
    marginBottom: 8 
  },
  inputIcon: { 
    marginRight: 10 
  },
  input: { 
    flex: 1, 
    fontSize: 15 
  },
  dividerLine: { 
    height: 1, 
    marginVertical: 16 
  },
  strengthContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    marginBottom: 12 
  },
  strengthBar: { 
    flex: 1, 
    height: 4, 
    borderRadius: 2 
  },
  strengthText: { 
    fontSize: 11, 
    marginLeft: 4, 
    width: 50 
  },
  errorText: { 
    color: '#EF4444', 
    fontSize: 12, 
    marginBottom: 8, 
    marginTop: -4 
  },
  saveBtn: {
    height: 54, 
    borderRadius: 14, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 24,
  },
  saveBtnText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  cancelBtn: { 
    height: 44, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 8 
  },
  cancelBtnText: { 
    fontSize: 14, 
    fontWeight: '500' 
  },
});