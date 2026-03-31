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
      await sessionStore.guardar(result.usuario);
      setUsuario(result.usuario);
      setEditando(false);
      Alert.alert('✅ Perfil Actualizado', 'Tus datos se han guardado correctamente.');
    } else {
      Alert.alert('Error', result.mensaje);
    }
  };

  const handleCerrarSesion = async () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir', style: 'destructive',
        onPress: async () => {
          await sessionStore.eliminar();
          navigation.replace('InicioDeSesion');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={t.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.headerBtn, { backgroundColor: t.bg3 }]}>
          <Ionicons name="chevron-back" size={22} color={t.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.text }]}>Perfil Profesional</Text>
        <TouchableOpacity 
          style={[styles.headerBtn, { backgroundColor: editando ? t.primary + '20' : t.bg3 }]} 
          onPress={() => {
            if (editando) cargarPerfil(); // Reset si cancela
            setEditando(!editando);
          }}
        >
          <Ionicons name={editando ? 'close' : 'create-outline'} size={20} color={editando ? t.primary : t.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Avatar Section */}
        <View style={styles.profileHero}>
          <View style={[styles.avatarContainer, { backgroundColor: t.primary }]}>
            <Text style={styles.avatarInitial}>
              {nombre.charAt(0).toUpperCase()}
            </Text>
            <TouchableOpacity style={[styles.cameraBadge, { borderColor: t.bg }]}>
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.heroTextContainer}>
            {editando ? (
              <TextInput
                style={[styles.inputNombre, { color: t.text, borderBottomColor: t.primary }]}
                value={nombre}
                onChangeText={setNombre}
                autoFocus
              />
            ) : (
              <Text style={[styles.heroName, { color: t.text }]}>{usuario?.nombre}</Text>
            )}
            <Text style={[styles.heroSub, { color: t.textSub }]}>
              {usuario?.especialidad || 'Especialidad no definida'}
            </Text>
          </View>
        </View>

        {/* Formulario de Información */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: t.textSub }]}>DATOS DE CONTACTO</Text>
          <View style={[styles.card, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
            <InfoField icon="mail-outline" label="Correo Electrónico" value={usuario?.email} t={t} />
            <View style={[styles.divider, { backgroundColor: t.separator }]} />
            <InfoField 
              icon="call-outline" 
              label="Teléfono" 
              value={telefono} 
              editable={editando} 
              onChangeText={setTelefono} 
              t={t} 
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: t.textSub }]}>CREDENCIALES MÉDICAS</Text>
          <View style={[styles.card, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
            <InfoField 
              icon="ribbon-outline" 
              label="Especialidad" 
              value={especialidad} 
              editable={editando} 
              onChangeText={setEspecialidad} 
              t={t} 
            />
            <View style={[styles.divider, { backgroundColor: t.separator }]} />
            <InfoField 
              icon="card-outline" 
              label="Cédula/Colegio" 
              value={colegio} 
              editable={editando} 
              onChangeText={setColegio} 
              t={t} 
            />
            <View style={[styles.divider, { backgroundColor: t.separator }]} />
            <InfoField 
              icon="business-outline" 
              label="Centro Médico" 
              value={centroTrabajo} 
              editable={editando} 
              onChangeText={setCentroTrabajo} 
              t={t} 
            />
          </View>
        </View>

        {/* Configuración de Seguridad */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: t.textSub }]}>SEGURIDAD Y APP</Text>
          <View style={[styles.card, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
            <TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate('CambiarPassword', { usuario })}>
              <View style={[styles.rowIcon, { backgroundColor: '#F3F4F6' }]}>
                <Ionicons name="lock-closed" size={18} color="#4B5563" />
              </View>
              <Text style={[styles.rowText, { color: t.text }]}>Actualizar Contraseña</Text>
              <Ionicons name="chevron-forward" size={18} color={t.textMuted} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: t.separator }]} />
            
            <View style={styles.rowItem}>
              <View style={[styles.rowIcon, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="finger-print" size={18} color="#0284C7" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowText, { color: t.text }]}>Biometría / 2FA</Text>
                <Text style={{ fontSize: 11, color: t.textSub }}>Acceso seguro reforzado</Text>
              </View>
              <Switch value={twoFactor} onValueChange={setTwoFactor} trackColor={{ false: '#D1D5DB', true: t.primary }} />
            </View>
          </View>
        </View>

        {/* Botones de Acción */}
        {editando ? (
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: t.primary }]} onPress={handleGuardar} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Guardar Perfil</Text>}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.logoutBtn, { borderColor: '#EF4444' }]} onPress={handleCerrarSesion}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// Subcomponente para filas de información
const InfoField = ({ icon, label, value, editable, onChangeText, t }) => (
  <View style={styles.infoField}>
    <Ionicons name={icon} size={20} color={t.primary} style={styles.fieldIcon} />
    <View style={{ flex: 1 }}>
      <Text style={[styles.fieldLabel, { color: t.textMuted }]}>{label}</Text>
      {editable ? (
        <TextInput
          style={[styles.fieldInput, { color: t.text, borderBottomColor: t.primary + '40' }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={`Escribir ${label.toLowerCase()}`}
        />
      ) : (
        <Text style={[styles.fieldValue, { color: t.text }]}>{value || 'No especificado'}</Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  headerBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  
  profileHero: { alignItems: 'center', marginVertical: 25 },
  avatarContainer: { width: 100, height: 100, borderRadius: 35, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  avatarInitial: { fontSize: 42, fontWeight: '800', color: '#fff' },
  cameraBadge: { 
    position: 'absolute', bottom: -5, right: -5, 
    width: 32, height: 32, borderRadius: 12, 
    backgroundColor: '#374151', borderWidth: 3, 
    alignItems: 'center', justifyContent: 'center' 
  },
  heroTextContainer: { alignItems: 'center' },
  heroName: { fontSize: 22, fontWeight: '800' },
  heroSub: { fontSize: 14, fontWeight: '500', marginTop: 4 },
  inputNombre: { fontSize: 22, fontWeight: '800', textAlign: 'center', borderBottomWidth: 2, minWidth: 200 },

  section: { marginBottom: 25 },
  sectionLabel: { fontSize: 12, fontWeight: '800', marginBottom: 10, marginLeft: 5, letterSpacing: 1 },
  card: { borderRadius: 20, borderWidth: 1, padding: 5, overflow: 'hidden' },
  
  infoField: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  fieldIcon: { marginRight: 15 },
  fieldLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
  fieldValue: { fontSize: 15, fontWeight: '600' },
  fieldInput: { fontSize: 15, fontWeight: '600', paddingVertical: 2, borderBottomWidth: 1 },
  
  divider: { height: 1, marginHorizontal: 15 },

  rowItem: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  rowIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  rowText: { flex: 1, fontSize: 15, fontWeight: '600' },

  saveBtn: { height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginTop: 10, elevation: 4 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  
  logoutBtn: { 
    height: 56, borderRadius: 18, borderWidth: 2, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    marginTop: 10, gap: 10 
  },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '800' },
});