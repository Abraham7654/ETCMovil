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
      if (cb) cb();
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
      `¿Estás seguro de eliminar a ${paciente.nombre}?\n\nEsta acción eliminará también todas sus citas, signos vitales y notas. No se puede deshacer.`,
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
                <Text style={[styles.menuPatientName, { color: t.text }]} numberOfLines={1}>{paciente.nombre}</Text>
                <Text style={[styles.menuPatientSub, { color: t.textMuted }]}>ID: {paciente.id} · {paciente.edad} años</Text>
              </View>
            </View>
            {MENU_OPCIONES.map((op, index) => (
              <React.Fragment key={op.id}>
                {op.id === 'eliminar' && <View style={[styles.menuDivider, { backgroundColor: t.separator }]} />}
                <TouchableOpacity
                  style={[styles.menuItem, index === MENU_OPCIONES.length - 1 && { borderBottomWidth: 0 }]}
                  onPress={() => handleOpcion(op.id)} activeOpacity={0.7}
                >
                  <View style={[styles.menuItemIcon, { backgroundColor: op.color + '20' }]}>
                    <Ionicons name={op.icon} size={18} color={op.color} />
                  </View>
                  <Text style={[styles.menuItemText, { color: op.id === 'eliminar' ? '#EF4444' : t.text }]}>
                    {op.label}
                  </Text>
                  {op.id !== 'eliminar' && <Ionicons name="chevron-forward" size={16} color={t.textMuted} />}
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

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            ['Citas', citas.length.toString(), false],
            ['Tipo Sangre', paciente.tipo_sangre || 'N/D', false],
            ['Estado', paciente.estado || 'Activo', true],
          ].map(([label, val, blue]) => (
            <View key={label} style={[styles.statBox, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
              <Text style={[styles.statLabel, { color: t.textMuted }]}>{label}</Text>
              <Text style={[styles.statValue, { color: blue ? t.primary : t.text }]}>{val}</Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {TABS.map(tab => (
            <TouchableOpacity key={tab}
              style={[styles.tab, { borderColor: t.cardBorder, backgroundColor: activeTab === tab ? t.primary : t.bg3 }]}
              onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, { color: activeTab === tab ? '#fff' : t.textSub }]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading && <ActivityIndicator color={t.primary} style={{ marginTop: 20 }} />}

        <View style={{ paddingHorizontal: 16 }}>

          {/* HISTORIAL — FIX: quitado .slice(0,5) para mostrar todas las citas */}
          {activeTab === 'Historial' && (
            citas.length === 0 ? (
              <EmptyState icon="document-text-outline" text="Sin historial médico aún" t={t} />
            ) : (
              citas.map(item => (
                <View key={item.id} style={[styles.historialCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
                  <View style={[styles.historialIcon, { backgroundColor: '#DBEAFE' }]}>
                    <Ionicons name="medical" size={18} color="#2563EB" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.historialHeader}>
                      <Text style={[styles.historialTipo, { color: t.text }]}>{item.motivo || 'Consulta'}</Text>
                      <Text style={[styles.historialFecha, { color: t.textMuted }]}>{item.fecha}</Text>
                    </View>
                    <Text style={[styles.historialDesc, { color: t.textSub }]}>{item.estado} · {item.hora}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <Ionicons name="person-circle-outline" size={14} color={t.textMuted} />
                      <Text style={[styles.historialDoctor, { color: t.textMuted }]}>{item.doctor}</Text>
                    </View>
                  </View>
                </View>
              ))
            )
          )}

          {/* CITAS — con botón de editar en cada card */}
          {activeTab === 'Citas' && (
            citas.length === 0 ? (
              <EmptyState icon="calendar-outline" text="Sin citas registradas" t={t} />
            ) : (
              citas.map(item => (
                <TouchableOpacity key={item.id}
                  style={[styles.historialCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}
                  onPress={() => navigation.navigate('RecordatorioDeCita', { cita: item })}>
                  <View style={[styles.historialIcon, { backgroundColor: '#D1FAE5' }]}>
                    <Ionicons name="calendar" size={18} color="#10B981" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.historialHeader}>
                      <Text style={[styles.historialTipo, { color: t.text }]}>{item.motivo || 'Cita médica'}</Text>
                      <Text style={[styles.historialFecha, { color: t.textMuted }]}>{item.fecha}</Text>
                    </View>
                    <Text style={[styles.historialDesc, { color: t.textSub }]}>{item.hora} · {item.doctor}</Text>
                    <Text style={[{ fontSize: 11, fontWeight: '600', marginTop: 4 },
                      { color: item.estado === 'Confirmada' ? '#10B981' : item.estado === 'Cancelada' ? '#EF4444' : '#F59E0B' }]}>
                      {item.estado}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.editCitaBtn}
                    onPress={() => navigation.navigate('EditarCita', { cita: item })}
                  >
                    <Ionicons name="create-outline" size={18} color={t.primary} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            )
          )}

          {/* FOTOS */}
          {activeTab === 'Fotos' && <EmptyState icon="folder-open-outline" text="Sin fotos registradas" t={t} />}

          {/* NOTAS */}
          {activeTab === 'Notas' && (
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}
              onPress={() => navigation.navigate('NotasPaciente', { paciente })}>
              <View style={[styles.actionIconBox, { backgroundColor: darkMode ? '#1E3A5F' : '#EFF6FF' }]}>
                <Ionicons name="document-text-outline" size={24} color={t.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.actionTitle, { color: t.text }]}>Ver y editar notas</Text>
                <Text style={[styles.actionSub, { color: t.textSub }]}>Observaciones médicas del paciente</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={t.textMuted} />
            </TouchableOpacity>
          )}

          {/* SIGNOS VITALES */}
          {activeTab === 'Signos Vitales' && (
            <>
              <TouchableOpacity style={[styles.newSignosBtn, { backgroundColor: t.primary }]}
                onPress={() => navigation.navigate('SignosVitales', { paciente })}>
                <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.newSignosBtnText}>Registrar Signos Vitales</Text>
              </TouchableOpacity>
              {signosUltimos ? (
                <>
                  <Text style={[styles.signosHistTitle, { color: t.text }]}>Último registro</Text>
                  <View style={styles.signosGrid}>
                    {[
                      { label: 'Peso', valor: `${signosUltimos.peso} kg`, iconBg: '#D1FAE5', iconColor: '#10B981', icon: 'scale-outline' },
                      { label: 'Presión', valor: signosUltimos.presion || 'N/D', iconBg: '#FEE2E2', iconColor: '#EF4444', icon: 'heart' },
                      { label: 'Frecuencia', valor: `${signosUltimos.frecuencia_cardiaca} lpm`, iconBg: '#DBEAFE', iconColor: '#2563EB', icon: 'heart-circle-outline' },
                      { label: 'Temperatura', valor: `${signosUltimos.temperatura}°C`, iconBg: '#FEF3C7', iconColor: '#F59E0B', icon: 'thermometer-outline' },
                    ].map(s => (
                      <View key={s.label} style={[styles.signoCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
                        <View style={[styles.signoIcon, { backgroundColor: s.iconBg }]}>
                          <Ionicons name={s.icon} size={18} color={s.iconColor} />
                        </View>
                        <Text style={[styles.signoValor, { color: t.text }]}>{s.valor}</Text>
                        <Text style={[styles.signoLabel, { color: t.textSub }]}>{s.label}</Text>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <EmptyState icon="pulse-outline" text="Sin signos vitales registrados" t={t} />
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function EmptyState({ icon, text, t }) {
  return (
    <View style={{ alignItems: 'center', padding: 40 }}>
      <Ionicons name={icon} size={40} color={t.textMuted} />
      <Text style={{ color: t.textMuted, marginTop: 8, fontSize: 14 }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  moreBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  menuContainer: { position: 'absolute', top: 56, right: 12, width: 230, borderRadius: 16, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 12, overflow: 'hidden' },
  menuHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  menuAvatar: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  menuPatientName: { fontSize: 13, fontWeight: '700' },
  menuPatientSub: { fontSize: 11, marginTop: 1 },
  menuDivider: { height: 1, marginHorizontal: 14, marginVertical: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13 },
  menuItemIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuItemText: { flex: 1, fontSize: 14, fontWeight: '600' },
  patientCard: { flexDirection: 'row', alignItems: 'center', margin: 16, padding: 16, borderRadius: 16, borderWidth: 1 },
  patientAvatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  patientInfo: { flex: 1 },
  patientName: { fontSize: 18, fontWeight: '700' },
  patientId: { fontSize: 13, marginTop: 2 },
  statusBadge: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  patientMeta: { alignItems: 'flex-end' },
  ageText: { fontSize: 16, fontWeight: '700' },
  generoText: { fontSize: 13 },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, gap: 8 },
  statBox: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1 },
  statLabel: { fontSize: 11, marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: '700' },
  tabsContainer: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  tabText: { fontSize: 13, fontWeight: '600' },
  historialCard: { flexDirection: 'row', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, alignItems: 'center' },
  historialIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  historialHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historialTipo: { fontSize: 14, fontWeight: '700', flex: 1 },
  historialFecha: { fontSize: 12 },
  historialDesc: { fontSize: 13, marginTop: 4 },
  historialDoctor: { fontSize: 12, marginLeft: 4 },
  editCitaBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
  actionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 1 },
  actionIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  actionTitle: { fontSize: 15, fontWeight: '700' },
  actionSub: { fontSize: 12, marginTop: 2 },
  newSignosBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, padding: 14, marginBottom: 16 },
  newSignosBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  signosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  signoCard: { width: '47%', borderRadius: 14, borderWidth: 1, padding: 14, alignItems: 'center' },
  signoIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  signoValor: { fontSize: 16, fontWeight: '800' },
  signoLabel: { fontSize: 12, marginTop: 2 },
  signosHistTitle: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
});