import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, Alert, ActivityIndicator,
  Modal, Animated, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/useTheme';
import { getNotas, guardarNotas } from '../controllers/NotasController';
import { eliminarPaciente } from '../controllers/PacienteController';

const { width } = Dimensions.get('window');

const MENU_OPCIONES = [
  { id: 'editar',   label: 'Editar Perfil',    icon: 'person-outline',       color: '#2563EB' },
  { id: 'cita',     label: 'Agendar Cita',     icon: 'calendar-outline',     color: '#10B981' },
  { id: 'signos',   label: 'Signos Vitales',   icon: 'pulse-outline',        color: '#F59E0B' },
  { id: 'eliminar', label: 'Eliminar Paciente', icon: 'trash-outline',         color: '#EF4444' },
];

export default function NotasPaciente({ navigation, route }) {
  const { darkMode, t } = useTheme();
  const paciente = route?.params?.paciente;
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const TABS = ['Historial', 'Citas', 'Fotos', 'Notas'];

  useEffect(() => {
    if (paciente?.id) cargarNotas();
  }, [paciente?.id]);

  const cargarNotas = async () => {
    setLoading(true);
    const result = await getNotas(paciente.id);
    if (result.success && result.nota) setNotas(result.nota.contenido || '');
    setLoading(false);
  };

  const handleGuardar = async () => {
    if (!paciente?.id) return;
    setSaving(true);
    const result = await guardarNotas(paciente.id, notas);
    setSaving(false);
    if (result.success) {
      Alert.alert('✅ Éxito', 'Las observaciones han sido actualizadas.');
    } else {
      Alert.alert('Error', result.mensaje || 'Error al guardar');
    }
  };

  const abrirMenu = () => {
    setMenuVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start();
  };

  const cerrarMenu = (callback) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setMenuVisible(false);
      if (typeof callback === 'function') callback();
    });
  };

  const handleOpcion = (id) => {
    cerrarMenu(() => {
      switch (id) {
        case 'editar': navigation.navigate('EditarPaciente', { paciente }); break;
        case 'cita': navigation.navigate('CrearCita', { pacientePreseleccionado: paciente }); break;
        case 'signos': navigation.navigate('SignosVitales', { paciente }); break;
        case 'eliminar': confirmarEliminar(); break;
      }
    });
  };

  const confirmarEliminar = () => {
    Alert.alert(
      '⚠️ Confirmar eliminación',
      `¿Deseas eliminar definitivamente a ${paciente.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: ejecutarEliminacion },
      ]
    );
  };

  const ejecutarEliminacion = async () => {
    const result = await eliminarPaciente(paciente.id);
    if (result.success) {
      navigation.navigate('ListaDePacientes');
    } else {
      Alert.alert('Error', result.mensaje);
    }
  };

  if (!paciente) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />

      {/* Header Fijo */}
      <View style={[styles.header, { borderBottomColor: t.separator }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={t.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.text }]}>Expediente Clínico</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={abrirMenu}>
          <Ionicons name="ellipsis-horizontal-circle" size={26} color={t.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Banner del Paciente */}
        <View style={[styles.patientHero, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={[styles.heroAvatar, { backgroundColor: t.primary + '15' }]}>
            <Text style={[styles.heroAvatarText, { color: t.primary }]}>
              {paciente.nombre.charAt(0)}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.heroName, { color: t.text }]} numberOfLines={1}>{paciente.nombre}</Text>
            <View style={styles.heroRow}>
              <Text style={[styles.heroSub, { color: t.textSub }]}>{paciente.edad} años • {paciente.genero}</Text>
              <View style={[styles.statusBadge, { backgroundColor: '#10B98120' }]}>
                <Text style={styles.statusText}>ACTIVO</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={[styles.tabBar, { backgroundColor: t.bg3 }]}>
          {TABS.map(tab => (
            <TouchableOpacity 
              key={tab}
              activeOpacity={0.8}
              style={[styles.tabItem, tab === 'Notas' && { backgroundColor: t.card, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }]}
              onPress={() => tab !== 'Notas' && navigation.goBack()}
            >
              <Text style={[styles.tabItemText, { color: tab === 'Notas' ? t.primary : t.textMuted, fontWeight: tab === 'Notas' ? '800' : '500' }]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sección de Notas */}
        <View style={styles.contentSection}>
          <View style={[styles.notesContainer, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
            <View style={styles.notesHeader}>
              <Ionicons name="document-text" size={18} color={t.primary} />
              <Text style={[styles.notesTitle, { color: t.text }]}>Notas de Evolución</Text>
            </View>
            
            {loading ? (
              <View style={styles.centerLoading}>
                <ActivityIndicator color={t.primary} />
                <Text style={{ color: t.textMuted, marginTop: 10 }}>Cargando expediente...</Text>
              </View>
            ) : (
              <TextInput
                style={[styles.input, { color: t.text }]}
                placeholder="Escribe aquí el motivo de consulta, diagnóstico o plan terapéutico..."
                placeholderTextColor={t.textMuted}
                value={notas}
                onChangeText={setNotas}
                multiline
                scrollEnabled={false}
              />
            )}
          </View>
          
          <Text style={styles.helperText}>
            <Ionicons name="information-circle-outline" size={12} /> Las notas se guardan de forma segura en el expediente del paciente.
          </Text>
        </View>

        {/* Botonera Inferior */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.mainBtn, { backgroundColor: t.primary }]} 
            onPress={handleGuardar} 
            disabled={saving}
          >
            {saving ? <ActivityIndicator color="#fff" /> : (
              <>
                <Ionicons name="cloud-upload-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.mainBtnText}>Actualizar Expediente</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.row}>
            <TouchableOpacity style={[styles.secBtn, { backgroundColor: t.bg3 }]}>
              <Ionicons name="print-outline" size={18} color={t.text} />
              <Text style={[styles.secBtnText, { color: t.text }]}>Imprimir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secBtn, { backgroundColor: '#10B981' }]}>
              <Ionicons name="logo-whatsapp" size={18} color="#fff" />
              <Text style={[styles.secBtnText, { color: '#fff' }]}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* Modal Menú Acciones */}
      <Modal transparent visible={menuVisible} animationType="none">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => cerrarMenu()}>
          <Animated.View style={[
            styles.popover, 
            { backgroundColor: t.card, borderColor: t.cardBorder, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}>
            <Text style={[styles.popoverTitle, { color: t.textMuted }]}>ACCIONES RÁPIDAS</Text>
            {MENU_OPCIONES.map((op, index) => (
              <TouchableOpacity 
                key={op.id} 
                style={[styles.popoverItem, index === MENU_OPCIONES.length - 1 && { borderBottomWidth: 0 }]} 
                onPress={() => handleOpcion(op.id)}
              >
                <View style={[styles.popoverIcon, { backgroundColor: op.color + '15' }]}>
                  <Ionicons name={op.icon} size={20} color={op.color} />
                </View>
                <Text style={[styles.popoverLabel, { color: op.id === 'eliminar' ? '#EF4444' : t.text }]}>{op.label}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 12, 
    paddingVertical: 10, 
    borderBottomWidth: 1 
  },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700' },

  patientHero: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    margin: 20, 
    padding: 16, 
    borderRadius: 24, 
    borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
  },
  heroAvatar: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  heroAvatarText: { fontSize: 24, fontWeight: '800' },
  heroName: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  heroSub: { fontSize: 14, fontWeight: '500' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { color: '#10B981', fontSize: 10, fontWeight: '800' },

  tabBar: { flexDirection: 'row', marginHorizontal: 20, padding: 5, borderRadius: 15, marginBottom: 20 },
  tabItem: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  tabItemText: { fontSize: 13 },

  contentSection: { paddingHorizontal: 20 },
  notesContainer: { borderRadius: 20, borderWidth: 1, padding: 18, minHeight: 280 },
  notesHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
  notesTitle: { fontSize: 16, fontWeight: '700' },
  input: { fontSize: 15, lineHeight: 22, textAlignVertical: 'top', minHeight: 200 },
  centerLoading: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  helperText: { fontSize: 11, color: '#9CA3AF', marginTop: 10, textAlign: 'center', paddingHorizontal: 20 },

  footer: { padding: 20, gap: 12 },
  mainBtn: { height: 56, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  mainBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 12 },
  secBtn: { flex: 1, height: 50, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  secBtnText: { fontSize: 14, fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  popover: { 
    position: 'absolute', top: 60, right: 20, width: 220, 
    borderRadius: 20, borderWidth: 1, padding: 10,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 15, elevation: 10 
  },
  popoverTitle: { fontSize: 10, fontWeight: '800', textAlign: 'center', marginVertical: 8, letterSpacing: 1 },
  popoverItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 0.5, borderBottomColor: '#E5E7EB' },
  popoverIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  popoverLabel: { fontSize: 14, fontWeight: '600' },
});