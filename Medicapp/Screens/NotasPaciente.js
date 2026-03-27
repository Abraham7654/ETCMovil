import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, Alert, ActivityIndicator,
  Modal, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/useTheme';
import { getNotas, guardarNotas } from '../controllers/NotasController';
import { eliminarPaciente } from '../controllers/PacienteController';

const MENU_OPCIONES = [
  { id: 'editar',    label: 'Editar Paciente',  icon: 'create-outline',        color: '#2563EB' },
  { id: 'cita',     label: 'Nueva Cita',        icon: 'calendar-outline',      color: '#10B981' },
  { id: 'signos',   label: 'Signos Vitales',    icon: 'pulse-outline',         color: '#F59E0B' },
  { id: 'eliminar', label: 'Eliminar Paciente', icon: 'trash-outline',         color: '#EF4444' },
];

export default function NotasPaciente({ navigation, route }) {
  const { t } = useTheme();
  const paciente = route?.params?.paciente;
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

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
      Alert.alert('✅ Guardado', 'Notas guardadas correctamente');
    } else {
      Alert.alert('Error', result.mensaje || 'No se pudieron guardar las notas');
    }
  };

  const abrirMenu = () => {
    setMenuVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start();
  };

  const cerrarMenu = (cb) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 140, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 140, useNativeDriver: true }),
    ]).start(() => {
      setMenuVisible(false);
      if (cb) cb();
    });
  };

  const handleOpcion = (id) => {
    cerrarMenu(() => {
      switch (id) {
        case 'editar':
          navigation.navigate('EditarPaciente', { paciente });
          break;
        case 'cita':
          navigation.navigate('CrearCita', { pacientePreseleccionado: paciente });
          break;
        case 'signos':
          navigation.navigate('SignosVitales', { paciente });
          break;
        case 'eliminar':
          confirmarEliminar();
          break;
      }
    });
  };

  const confirmarEliminar = () => {
    Alert.alert(
      '🗑 Eliminar Paciente',
      `¿Estás seguro de eliminar a ${paciente.nombre}?\n\nEsta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive',
          onPress: async () => {
            const result = await eliminarPaciente(paciente.id);
            if (result.success) {
              Alert.alert('✅ Eliminado', 'Paciente eliminado', [
                { text: 'OK', onPress: () => navigation.navigate('ListaDePacientes') },
              ]);
            } else {
              Alert.alert('Error', result.mensaje || 'No se pudo eliminar');
            }
          },
        },
      ]
    );
  };

  if (!paciente) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: t.separator }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={t.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.text }]}>Ficha del Paciente</Text>
        <TouchableOpacity style={styles.moreBtn} onPress={abrirMenu}>
          <Ionicons name="ellipsis-vertical" size={20} color={t.text} />
        </TouchableOpacity>
      </View>

      {/* Menú desplegable */}
      <Modal transparent visible={menuVisible} animationType="none" onRequestClose={() => cerrarMenu()}>
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => cerrarMenu()}>
          <Animated.View style={[
            styles.menuContainer,
            { backgroundColor: t.card, borderColor: t.cardBorder, opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}>
            <View style={[styles.menuHeader, { borderBottomColor: t.separator }]}>
              <View style={[styles.menuAvatar, { backgroundColor: t.bg3 }]}>
                <Ionicons name="person" size={16} color={t.textMuted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuPatientName, { color: t.text }]} numberOfLines={1}>
                  {paciente.nombre}
                </Text>
                <Text style={[styles.menuPatientSub, { color: t.textMuted }]}>
                  ID: {paciente.id} · {paciente.edad} años
                </Text>
              </View>
            </View>

            {MENU_OPCIONES.map((op) => (
              <React.Fragment key={op.id}>
                {op.id === 'eliminar' && (
                  <View style={[styles.menuDivider, { backgroundColor: t.separator }]} />
                )}
                <TouchableOpacity style={styles.menuItem} onPress={() => handleOpcion(op.id)} activeOpacity={0.7}>
                  <View style={[styles.menuItemIcon, { backgroundColor: op.color + '20' }]}>
                    <Ionicons name={op.icon} size={18} color={op.color} />
                  </View>
                  <Text style={[styles.menuItemText, { color: op.id === 'eliminar' ? '#EF4444' : t.text }]}>
                    {op.label}
                  </Text>
                  {op.id !== 'eliminar' && (
                    <Ionicons name="chevron-forward" size={16} color={t.textMuted} />
                  )}
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Tarjeta paciente */}
        <View style={[styles.patientCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={[styles.patientAvatar, { backgroundColor: t.bg3 }]}>
            <Ionicons name="person" size={28} color={t.textMuted} />
          </View>
          <View style={styles.patientInfo}>
            <Text style={[styles.patientName, { color: t.text }]}>{paciente.nombre}</Text>
            <Text style={[styles.patientId, { color: t.textSub }]}>ID: {paciente.id}</Text>
            <Text style={[styles.statusBadge, { color: t.success }]}>{paciente.estado || 'Activo'}</Text>
          </View>
          <View style={styles.patientMeta}>
            <Text style={[styles.ageText, { color: t.text }]}>{paciente.edad} años</Text>
            <Text style={[styles.generoText, { color: t.textSub }]}>{paciente.genero || 'N/D'}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { backgroundColor: t.bg3 }]}>
          {TABS.map(tab => (
            <TouchableOpacity key={tab}
              style={[styles.tab, tab === 'Notas' && { backgroundColor: t.card, elevation: 2 }]}
              onPress={() => tab !== 'Notas' && navigation.goBack()}>
              <Text style={[
                styles.tabText,
                { color: tab === 'Notas' ? t.primary : t.textMuted },
                tab === 'Notas' && { fontWeight: '700' },
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Área de notas */}
        <View style={styles.notesSection}>
          <View style={[styles.notesCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
            <Text style={[styles.notesTitle, { color: t.text }]}>Observaciones Médicas</Text>
            {loading ? (
              <ActivityIndicator color={t.primary} style={{ marginTop: 20 }} />
            ) : (
              <TextInput
                style={[styles.notesInput, { color: t.text }]}
                placeholder="Síntomas reportados • Examen físico • Diagnóstico • Plan de tratamiento • Recomendaciones"
                placeholderTextColor={t.textMuted}
                value={notas}
                onChangeText={setNotas}
                multiline
                textAlignVertical="top"
              />
            )}
          </View>
        </View>

        {/* Botones */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: t.primary }]}
            onPress={handleGuardar} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : (
              <>
                <Ionicons name="save-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveBtnText}>Guardar Notas</Text>
              </>
            )}
          </TouchableOpacity>
          <View style={styles.secondaryRow}>
            <TouchableOpacity style={[styles.draftBtn, { backgroundColor: t.bg3 }]}>
              <Ionicons name="time-outline" size={16} color={t.text} style={{ marginRight: 6 }} />
              <Text style={[styles.draftText, { color: t.text }]}>Borrador</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <Ionicons name="share-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.shareText}>Compartir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  moreBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

  // Menú
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  menuContainer: {
    position: 'absolute', top: 56, right: 12,
    width: 220, borderRadius: 16, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 }, elevation: 12,
    overflow: 'hidden',
  },
  menuHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  menuAvatar: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  menuPatientName: { fontSize: 13, fontWeight: '700' },
  menuPatientSub: { fontSize: 11, marginTop: 1 },
  menuDivider: { height: 1, marginHorizontal: 14, marginVertical: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13 },
  menuItemIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuItemText: { flex: 1, fontSize: 14, fontWeight: '600' },

  // Paciente
  patientCard: { flexDirection: 'row', alignItems: 'center', margin: 16, padding: 16, borderRadius: 16, borderWidth: 1 },
  patientAvatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  patientInfo: { flex: 1 },
  patientName: { fontSize: 18, fontWeight: '700' },
  patientId: { fontSize: 13, marginTop: 2 },
  statusBadge: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  patientMeta: { alignItems: 'flex-end' },
  ageText: { fontSize: 16, fontWeight: '700' },
  generoText: { fontSize: 13 },

  // Tabs
  tabsContainer: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabText: { fontSize: 13, fontWeight: '500' },

  // Notas
  notesSection: { paddingHorizontal: 16 },
  notesCard: { borderWidth: 1, borderRadius: 14, padding: 16, minHeight: 220 },
  notesTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  notesInput: { flex: 1, fontSize: 14, minHeight: 160 },
  buttonsContainer: { paddingHorizontal: 16, marginTop: 20, gap: 10 },
  saveBtn: { height: 52, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryRow: { flexDirection: 'row', gap: 10 },
  draftBtn: { flex: 1, height: 48, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  draftText: { fontSize: 14, fontWeight: '600' },
  shareBtn: { flex: 1, height: 48, backgroundColor: '#10B981', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  shareText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});