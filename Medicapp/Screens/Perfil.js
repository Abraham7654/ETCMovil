import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, Alert, ActivityIndicator, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/useTheme';
import { getPerfil, actualizarPerfil } from '../controllers/UsuarioController';
import { sessionStore } from '../store/sessionStore';

export default function Perfil({ navigation, route }) {
  const { darkMode, t } = useTheme();
  const usuarioParam = route?.params?.usuario;
  const [twoFactor, setTwoFactor] = useState(true);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [usuario, setUsuario] = useState(null);

  // Campos editables
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [colegio, setColegio] = useState('');
  const [centroTrabajo, setCentroTrabajo] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    setLoading(true);
    // Primero intentar desde params, luego desde sesión, luego desde BD
    const id = usuarioParam?.id || (await sessionStore.obtener())?.id;
    if (id) {
      const result = await getPerfil(id);
      if (result.success && result.usuario) {
        const u = result.usuario;
        setUsuario(u);
        setNombre(u.nombre || '');
        setEspecialidad(u.especialidad || '');
        setColegio(u.colegio || '');
        setCentroTrabajo(u.centro_trabajo || '');
        setTelefono(u.telefono || '');
      }
    }
    setLoading(false);
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) { Alert.alert('Error', 'El nombre es obligatorio'); return; }
    setSaving(true);
    const result = await actualizarPerfil(usuario.id, {
      nombre, especialidad, colegio, centro_trabajo: centroTrabajo, telefono,
    });
    setSaving(false);
    if (result.success) {
      // Actualizar sesión con nuevos datos
      await sessionStore.guardar(result.usuario);
      setUsuario(result.usuario);
      setEditando(false);
      Alert.alert('✅ Guardado', 'Perfil actualizado correctamente');
    } else {
      Alert.alert('Error', result.mensaje);
    }
  };

  const handleCerrarSesion = async () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar Sesión', style: 'destructive',
        onPress: async () => {
          await sessionStore.eliminar();
          navigation.replace('InicioDeSesion');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: t.bg2 }]}>
        <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg2 }]}>
      <StatusBar barStyle={t.statusBar} />
      <View style={[styles.header, { backgroundColor: t.card, borderBottomColor: t.separator }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={t.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.text }]}>Mi Perfil</Text>
        <TouchableOpacity style={styles.editBtn} onPress={() => {
          if (editando) {
            // Cancelar edición - restaurar datos originales
            setNombre(usuario?.nombre || '');
            setEspecialidad(usuario?.especialidad || '');
            setColegio(usuario?.colegio || '');
            setCentroTrabajo(usuario?.centro_trabajo || '');
            setTelefono(usuario?.telefono || '');
          }
          setEditando(!editando);
        }}>
          <Ionicons name={editando ? 'close' : 'pencil'} size={20} color={t.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarCircle, { backgroundColor: t.bg3 }]}>
            <Text style={[styles.avatarInitials, { color: t.primary }]}>
              {(usuario?.nombre || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </Text>
            <TouchableOpacity style={[styles.cameraBtn, { borderColor: t.bg2 }]}>
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          {editando ? (
            <TextInput
              style={[styles.nameInput, { color: t.text, borderBottomColor: t.primary }]}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre completo"
              placeholderTextColor={t.textMuted}
            />
          ) : (
            <Text style={[styles.doctorName, { color: t.text }]}>{usuario?.nombre || 'Sin nombre'}</Text>
          )}
          <Text style={[styles.doctorRole, { color: t.textSub }]}>{usuario?.especialidad || 'Médico General'}</Text>
          {editando && (
            <View style={[styles.editingBadge, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="pencil" size={12} color="#2563EB" style={{ marginRight: 4 }} />
              <Text style={styles.editingBadgeText}>Modo edición activo</Text>
            </View>
          )}
        </View>

        {/* Info Personal */}
        <View style={[styles.section, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={[styles.sectionHeader, { borderBottomColor: t.separator }]}>
            <View style={[styles.sectionIconBox, { backgroundColor: t.bg3 }]}>
              <Ionicons name="person-outline" size={18} color="#2563EB" />
            </View>
            <Text style={[styles.sectionTitle, { color: t.text }]}>Información Personal</Text>
          </View>
          <InfoRow label="Email" value={usuario?.email || ''} editable={false} t={t} />
          <View style={[styles.divider, { backgroundColor: t.separator }]} />
          <InfoRow label="Teléfono" value={telefono} editable={editando}
            onChangeText={setTelefono} t={t} last />
        </View>

        {/* Info Profesional */}
        <View style={[styles.section, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={[styles.sectionHeader, { borderBottomColor: t.separator }]}>
            <View style={[styles.sectionIconBox, { backgroundColor: t.bg3 }]}>
              <Ionicons name="medical-outline" size={18} color="#7C3AED" />
            </View>
            <Text style={[styles.sectionTitle, { color: t.text }]}>Información Profesional</Text>
          </View>
          <InfoRow label="Especialidad" value={especialidad} editable={editando}
            onChangeText={setEspecialidad} placeholder="Ej: Medicina General" t={t} />
          <View style={[styles.divider, { backgroundColor: t.separator }]} />
          <InfoRow label="Colegio Médico" value={colegio} editable={editando}
            onChangeText={setColegio} placeholder="Ej: CM-28-45678" t={t} />
          <View style={[styles.divider, { backgroundColor: t.separator }]} />
          <InfoRow label="Centro de Trabajo" value={centroTrabajo} editable={editando}
            onChangeText={setCentroTrabajo} placeholder="Ej: Clínica San Rafael" t={t} last />
        </View>

        {/* Botón guardar si está editando */}
        {editando && (
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: t.primary }]}
            onPress={handleGuardar}
            disabled={saving}
          >
            {saving ? <ActivityIndicator color="#fff" /> : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveBtnText}>Guardar Cambios</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Seguridad */}
        <View style={[styles.section, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={[styles.sectionHeader, { borderBottomColor: t.separator }]}>
            <View style={[styles.sectionIconBox, { backgroundColor: darkMode ? '#1E3A5F' : '#EFF6FF' }]}>
              <Ionicons name="shield-outline" size={18} color="#2563EB" />
            </View>
            <Text style={[styles.sectionTitle, { color: t.text }]}>Seguridad</Text>
          </View>
          <TouchableOpacity style={styles.row}
            onPress={() => navigation.navigate('CambiarPassword', { usuario })}>
            <Ionicons name="lock-closed-outline" size={18} color={t.textMuted} style={{ marginRight: 12 }} />
            <Text style={[styles.rowLabel, { color: t.text }]}>Cambiar Contraseña</Text>
            <Ionicons name="chevron-forward" size={16} color={t.textMuted} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: t.separator }]} />
          <View style={styles.row}>
            <Ionicons name="finger-print-outline" size={18} color={t.textMuted} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowLabel, { color: t.text }]}>Autenticación en Dos Pasos</Text>
              <Text style={[styles.rowSub, twoFactor && { color: t.success }]}>
                {twoFactor ? 'Activada' : 'Desactivada'}
              </Text>
            </View>
            <Switch value={twoFactor} onValueChange={setTwoFactor}
              trackColor={{ false: '#E5E7EB', true: t.success }} ios_backgroundColor="#E5E7EB" />
          </View>
        </View>

        {/* App */}
        <View style={[styles.section, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={[styles.sectionHeader, { borderBottomColor: t.separator }]}>
            <View style={[styles.sectionIconBox, { backgroundColor: t.bg3 }]}>
              <Ionicons name="settings-outline" size={18} color={t.textSub} />
            </View>
            <Text style={[styles.sectionTitle, { color: t.text }]}>Configuración de App</Text>
          </View>
          {['Notificaciones', 'Privacidad', 'Ayuda y Soporte'].map((item, i, arr) => (
            <React.Fragment key={item}>
              <TouchableOpacity style={styles.row}>
                <Text style={[styles.rowLabel, { color: t.text }]}>{item}</Text>
                <Ionicons name="chevron-forward" size={16} color={t.textMuted} />
              </TouchableOpacity>
              {i < arr.length - 1 && <View style={[styles.divider, { backgroundColor: t.separator }]} />}
            </React.Fragment>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleCerrarSesion}>
          <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value, editable, onChangeText, placeholder, last, t }) {
  return (
    <View>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.rowSublabel, { color: t.textMuted }]}>{label}</Text>
          {editable ? (
            <TextInput
              style={[styles.rowInput, { color: t.text, borderBottomColor: t.separator }]}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder || label}
              placeholderTextColor={t.textMuted}
            />
          ) : (
            <Text style={[styles.rowLabel, { color: t.text }]}>{value || 'No registrado'}</Text>
          )}
        </View>
        {!editable && <Ionicons name="chevron-forward" size={16} color={t.textMuted} />}
      </View>
      {!last && <View style={[{ height: 1, backgroundColor: t?.separator || '#F3F4F6', marginLeft: 14 }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  editBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 16, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', paddingVertical: 24 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarInitials: { fontSize: 32, fontWeight: '800' },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  nameInput: { fontSize: 20, fontWeight: '700', borderBottomWidth: 2, paddingBottom: 4, minWidth: 200, textAlign: 'center' },
  doctorName: { fontSize: 20, fontWeight: '700' },
  doctorRole: { fontSize: 14, marginTop: 2 },
  editingBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  editingBadgeText: { fontSize: 11, color: '#2563EB', fontWeight: '600' },
  section: { borderRadius: 14, marginBottom: 14, borderWidth: 1, overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  sectionIconBox: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 },
  rowSublabel: { fontSize: 11, marginBottom: 2 },
  rowLabel: { fontSize: 14, fontWeight: '600' },
  rowSub: { fontSize: 12, marginTop: 2 },
  rowInput: { fontSize: 14, fontWeight: '600', borderBottomWidth: 1, paddingBottom: 2 },
  divider: { height: 1, marginLeft: 14 },
  saveBtn: { height: 52, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  logoutBtn: { height: 52, backgroundColor: '#EF4444', borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  logoutText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});