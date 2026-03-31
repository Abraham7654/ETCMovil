import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  SafeAreaView, StatusBar, ActivityIndicator, Alert,
  Modal, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../store/useTheme';
import { getCitasPaciente } from '../controllers/CitaController';
import { getUltimosSignos } from '../controllers/SignosVitalesController';
import { eliminarPaciente } from '../controllers/PacienteController';

const TABS = ['Historial', 'Citas', 'Fotos', 'Notas', 'Signos Vitales'];

const MENU_OPCIONES = [
  { id: 'editar',    label: 'Editar Paciente',    icon: 'create-outline',        color: '#2563EB' },
  { id: 'cita',     label: 'Nueva Cita',          icon: 'calendar-outline',      color: '#10B981' },
  { id: 'signos',   label: 'Registrar Signos',    icon: 'pulse-outline',         color: '#F59E0B' },
  { id: 'notas',    label: 'Ver Notas',            icon: 'document-text-outline', color: '#7C3AED' },
  { id: 'eliminar', label: 'Eliminar Paciente',   icon: 'trash-outline',         color: '#EF4444' },
];

export default function HistorialPaciente({ navigation, route }) {
  const { darkMode, t } = useTheme();
  const paciente = route?.params?.paciente;
  const [activeTab, setActiveTab] = useState('Historial');
  const [citas, setCitas] = useState([]);
  const [signosUltimos, setSignosUltimos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useFocusEffect(useCallback(() => {
    if (paciente?.id) cargarDatos();
  }, [paciente?.id]));

  const cargarDatos = async () => {
    setLoading(true);
    const [resCitas, resSignos] = await Promise.all([
      getCitasPaciente(paciente.id),
      getUltimosSignos(paciente.id),
    ]);
    if (resCitas.success) setCitas(resCitas.citas);
    if (resSignos.success) setSignosUltimos(resSignos.signos);
    setLoading(false);
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
      if (cb && typeof cb === 'function') cb();
    });
  };

  const handleOpcion = (id) => {
    cerrarMenu(() => {
      switch (id) {
        case 'editar':   navigation.navigate('EditarPaciente', { paciente }); break;
        case 'cita':     navigation.navigate('CrearCita', { pacientePreseleccionado: paciente }); break;
        case 'signos':   navigation.navigate('SignosVitales', { paciente }); break;
        case 'notas':    navigation.navigate('NotasPaciente', { paciente }); break;
        case 'eliminar': confirmarEliminar(); break;
      }
    });
  };

  const confirmarEliminar = () => {
    Alert.alert(
      '🗑 Eliminar Paciente',
      `¿Estás seguro de eliminar a ${paciente.nombre}?\n\nEsta acción eliminará también todas sus citas y registros médicos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive',
          onPress: async () => {
            const result = await eliminarPaciente(paciente.id);
            if (result.success) {
              Alert.alert('✅ Eliminado', 'Paciente eliminado correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
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

      {/* Modal Menú de Acciones */}
      <Modal transparent visible={menuVisible} animationType="none" onRequestClose={() => cerrarMenu()}>
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => cerrarMenu()}>
          <Animated.View style={[
            styles.menuContainer,
            { backgroundColor: t.card, borderColor: t.cardBorder, opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}>
            <View style={[styles.menuHeader, { borderBottomColor: t.separator }]}>
              <View style={[styles.menuAvatar, { backgroundColor: t.bg3 }]}>
                <Ionicons name="person" size={16} color={t.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuPatientName, { color: t.text }]} numberOfLines={1}>{paciente.nombre}</Text>
                <Text style={[styles.menuPatientSub, { color: t.textMuted }]}>ID: {paciente.id}</Text>
              </View>
            </View>
            {MENU_OPCIONES.map((op, index) => (
              <React.Fragment key={op.id}>
                {op.id === 'eliminar' && <View style={[styles.menuDivider, { backgroundColor: t.separator }]} />}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleOpcion(op.id)}
                >
                  <View style={[styles.menuItemIcon, { backgroundColor: op.color + '15' }]}>
                    <Ionicons name={op.icon} size={18} color={op.color} />
                  </View>
                  <Text style={[styles.menuItemText, { color: op.id === 'eliminar' ? '#EF4444' : t.text }]}>
                    {op.label}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Tarjeta Principal */}
        <View style={[styles.patientCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={[styles.patientAvatar, { backgroundColor: t.bg3, borderColor: t.primary }]}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: t.primary }}>
              {paciente.nombre.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.patientInfo}>
            <Text style={[styles.patientName, { color: t.text }]}>{paciente.nombre}</Text>
            <Text style={[styles.patientId, { color: t.textSub }]}>Folio: #{paciente.id}</Text>
            <View style={styles.badgeRow}>
               <View style={[styles.statusBadge, { backgroundColor: t.primary + '20' }]}>
                  <Text style={{ color: t.primary, fontSize: 11, fontWeight: '700' }}>{paciente.estado || 'Activo'}</Text>
               </View>
            </View>
          </View>
          <View style={styles.patientMeta}>
            <Text style={[styles.ageText, { color: t.text }]}>{paciente.edad} años</Text>
            <Text style={[styles.generoText, { color: t.textSub }]}>{paciente.genero}</Text>
          </View>
        </View>

        {/* Mini Stats */}
        <View style={styles.statsRow}>
          <StatBox label="Citas" val={citas.length} t={t} />
          <StatBox label="Sangre" val={paciente.tipo_sangre || 'N/D'} t={t} />
          <StatBox label="Prioridad" val={paciente.estado || 'Normal'} t={t} highlight />
        </View>

        {/* Tabs de Navegación */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {TABS.map(tab => (
            <TouchableOpacity key={tab}
              style={[styles.tab, { borderColor: t.cardBorder, backgroundColor: activeTab === tab ? t.primary : t.card }]}
              onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, { color: activeTab === tab ? '#fff' : t.textSub }]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading && <ActivityIndicator color={t.primary} style={{ marginTop: 20 }} />}

        <View style={{ paddingHorizontal: 16 }}>
          {/* VISTA: HISTORIAL & CITAS */}
          {(activeTab === 'Historial' || activeTab === 'Citas') && (
            citas.length === 0 ? (
              <EmptyState icon="calendar-outline" text="No hay registros disponibles" t={t} />
            ) : (
              citas.map(item => (
                <TouchableOpacity key={item.id}
                  style={[styles.historialCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}
                  onPress={() => navigation.navigate('RecordatorioDeCita', { cita: item })}>
                  <View style={[styles.historialIcon, { backgroundColor: item.estado === 'Cancelada' ? '#FEE2E2' : '#DBEAFE' }]}>
                    <Ionicons name="medical" size={18} color={item.estado === 'Cancelada' ? '#EF4444' : '#2563EB'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.historialHeader}>
                      <Text style={[styles.historialTipo, { color: t.text }]} numberOfLines={1}>{item.motivo || 'Consulta General'}</Text>
                      <Text style={[styles.historialFecha, { color: t.textMuted }]}>{item.fecha}</Text>
                    </View>
                    <Text style={[styles.historialDesc, { color: t.textSub }]}>{item.hora} · {item.doctor}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.editCitaBtn}
                    onPress={() => navigation.navigate('EditarCita', { cita: item })}
                  >
                    <Ionicons name="pencil" size={16} color={t.primary} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            )
          )}

          {/* VISTA: SIGNOS VITALES */}
          {activeTab === 'Signos Vitales' && (
            <>
              <TouchableOpacity style={[styles.newSignosBtn, { backgroundColor: t.primary }]}
                onPress={() => navigation.navigate('SignosVitales', { paciente })}>
                <Ionicons name="add-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.newSignosBtnText}>Registrar Signos Vitales</Text>
              </TouchableOpacity>
              
              {signosUltimos ? (
                <View style={styles.signosGrid}>
                   <SignoCard label="Peso" valor={`${signosUltimos.peso} kg`} icon="scale-outline" color="#10B981" t={t} />
                   <SignoCard label="Presión" valor={signosUltimos.presion || 'N/A'} icon="heart-outline" color="#EF4444" t={t} />
                   <SignoCard label="Ritmo" valor={`${signosUltimos.frecuencia_cardiaca} lpm`} icon="pulse" color="#2563EB" t={t} />
                   <SignoCard label="Temp" valor={`${signosUltimos.temperatura}°C`} icon="thermometer-outline" color="#F59E0B" t={t} />
                </View>
              ) : (
                <EmptyState icon="pulse-outline" text="Sin signos registrados" t={t} />
              )}
            </>
          )}

          {/* VISTA: NOTAS */}
          {activeTab === 'Notas' && (
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}
              onPress={() => navigation.navigate('NotasPaciente', { paciente })}>
              <View style={[styles.actionIconBox, { backgroundColor: t.primary + '15' }]}>
                <Ionicons name="document-text" size={24} color={t.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.actionTitle, { color: t.text }]}>Expediente de Notas</Text>
                <Text style={[styles.actionSub, { color: t.textSub }]}>Toca para ver o añadir observaciones</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={t.textMuted} />
            </TouchableOpacity>
          )}

          {/* VISTA: FOTOS */}
          {activeTab === 'Fotos' && <EmptyState icon="images-outline" text="Galería clínica vacía" t={t} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Componentes Pequeños para Limpieza
const StatBox = ({ label, val, t, highlight }) => (
  <View style={[styles.statBox, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
    <Text style={[styles.statLabel, { color: t.textMuted }]}>{label}</Text>
    <Text style={[styles.statValue, { color: highlight ? t.primary : t.text }]}>{val}</Text>
  </View>
);

const SignoCard = ({ label, valor, icon, color, t }) => (
  <View style={[styles.signoCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
    <View style={[styles.signoIcon, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <Text style={[styles.signoValor, { color: t.text }]}>{valor}</Text>
    <Text style={[styles.signoLabel, { color: t.textSub }]}>{label}</Text>
  </View>
);

const EmptyState = ({ icon, text, t }) => (
  <View style={{ alignItems: 'center', padding: 40, opacity: 0.6 }}>
    <Ionicons name={icon} size={48} color={t.textMuted} />
    <Text style={{ color: t.textMuted, marginTop: 12, fontSize: 14, fontWeight: '500' }}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  moreBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  menuContainer: { position: 'absolute', top: 60, right: 16, width: 220, borderRadius: 16, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, elevation: 5 },
  menuHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1 },
  menuAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  menuPatientName: { fontSize: 13, fontWeight: '700' },
  menuPatientSub: { fontSize: 11 },
  menuDivider: { height: 1, marginVertical: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 },
  menuItemIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuItemText: { fontSize: 14, fontWeight: '600' },
  patientCard: { flexDirection: 'row', alignItems: 'center', margin: 16, padding: 16, borderRadius: 16, borderWidth: 1 },
  patientAvatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginRight: 14, borderWidth: 2 },
  patientInfo: { flex: 1 },
  patientName: { fontSize: 19, fontWeight: '800' },
  patientId: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  badgeRow: { flexDirection: 'row', marginTop: 6 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  patientMeta: { alignItems: 'flex-end' },
  ageText: { fontSize: 16, fontWeight: '700' },
  generoText: { fontSize: 12, marginTop: 2 },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, gap: 10 },
  statBox: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1 },
  statLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: '700' },
  tabsContainer: { paddingHorizontal: 16, paddingBottom: 16, gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  tabText: { fontSize: 13, fontWeight: '700' },
  historialCard: { flexDirection: 'row', padding: 12, borderRadius: 14, marginBottom: 12, borderWidth: 1, alignItems: 'center' },
  historialIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  historialHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historialTipo: { fontSize: 14, fontWeight: '700', flex: 1 },
  historialFecha: { fontSize: 11, fontWeight: '500' },
  historialDesc: { fontSize: 12, marginTop: 3 },
  editCitaBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 8, marginLeft: 8 },
  actionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1 },
  actionIconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  actionTitle: { fontSize: 15, fontWeight: '700' },
  actionSub: { fontSize: 12, marginTop: 2 },
  newSignosBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, padding: 14, marginBottom: 16 },
  newSignosBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  signosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  signoCard: { width: '48%', borderRadius: 16, borderWidth: 1, padding: 16, alignItems: 'center' },
  signoIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  signoValor: { fontSize: 16, fontWeight: '800' },
  signoLabel: { fontSize: 11, marginTop: 2, fontWeight: '600' },
});