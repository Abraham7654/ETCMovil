import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/useTheme';

const TABS = ['Historial', 'Citas', 'Fotos', 'Notas', 'Signos Vitales'];
const historial = [
  { id: '1', tipo: 'Consulta General', fecha: '15 Ene 2024', descripcion: 'Dolor de cabeza persistente. Prescripción de analgésicos.', doctor: 'Dr. Rodríguez', iconBg: '#DBEAFE', iconColor: '#2563EB', icon: 'medical' },
  { id: '2', tipo: 'Chequeo Anual', fecha: '10 Dic 2023', descripcion: 'Examen físico completo. Resultados normales.', doctor: 'Dr. López', iconBg: '#D1FAE5', iconColor: '#10B981', icon: 'heart' },
];

export default function HistorialPaciente({ navigation, route }) {
  const { darkMode, t } = useTheme();
  const [activeTab, setActiveTab] = useState('Historial');
  const paciente = route?.params?.paciente || { id: 1, nombre: 'María González', edad: 42, sexo: 'Femenino', estado: 'Activo' };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />
      <View style={[styles.header, { borderBottomColor: t.separator }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={t.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.text }]}>Ficha del Paciente</Text>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color={t.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
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
            <Text style={[styles.generoText, { color: t.textSub }]}>{paciente.sexo || paciente.genero || 'Femenino'}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {[['Última Cita','15 Ene',false],['Próxima','22 Ene',true],['Total Citas','24',false]].map(([label,val,blue])=>(
            <View key={label} style={[styles.statBox, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
              <Text style={[styles.statLabel, { color: t.textMuted }]}>{label}</Text>
              <Text style={[styles.statValue, { color: blue ? t.primary : t.text }]}>{val}</Text>
            </View>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {TABS.map(tab => (
            <TouchableOpacity key={tab}
              style={[styles.tab, { borderColor: t.cardBorder, backgroundColor: activeTab === tab ? t.primary : t.bg3 }]}
              onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, { color: activeTab === tab ? '#fff' : t.textSub }]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal: 16 }}>
          {activeTab === 'Historial' && historial.map(item => (
            <View key={item.id} style={[styles.historialCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
              <View style={[styles.historialIcon, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon} size={18} color={item.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.historialHeader}>
                  <Text style={[styles.historialTipo, { color: t.text }]}>{item.tipo}</Text>
                  <Text style={[styles.historialFecha, { color: t.textMuted }]}>{item.fecha}</Text>
                </View>
                <Text style={[styles.historialDesc, { color: t.textSub }]}>{item.descripcion}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <Ionicons name="person-circle-outline" size={14} color={t.textMuted} />
                  <Text style={[styles.historialDoctor, { color: t.textMuted }]}>{item.doctor}</Text>
                </View>
              </View>
            </View>
          ))}

          {activeTab === 'Citas' && <EmptyState icon="calendar-outline" text="Sin citas registradas" t={t} />}
          {activeTab === 'Fotos' && <EmptyState icon="folder-open-outline" text="Sin contenido aún" t={t} />}

          {activeTab === 'Notas' && (
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}
              onPress={() => navigation.navigate('NotasPaciente')}>
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

          {activeTab === 'Signos Vitales' && (
            <>
              <TouchableOpacity style={[styles.newSignosBtn, { backgroundColor: t.primary }]}
                onPress={() => navigation.navigate('SignosVitales')}>
                <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.newSignosBtnText}>Registrar Signos Vitales</Text>
              </TouchableOpacity>
              <View style={styles.signosGrid}>
                {[
                  { label:'Peso', valor:'68 kg', iconBg:'#D1FAE5', iconColor:'#10B981', icon:'scale-outline' },
                  { label:'Presión', valor:'120/80', iconBg:'#FEE2E2', iconColor:'#EF4444', icon:'heart' },
                  { label:'Frecuencia', valor:'72 lpm', iconBg:'#DBEAFE', iconColor:'#2563EB', icon:'heart-circle-outline' },
                  { label:'Temperatura', valor:'36.5°C', iconBg:'#FEF3C7', iconColor:'#F59E0B', icon:'thermometer-outline' },
                ].map(s=>(
                  <View key={s.label} style={[styles.signoCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
                    <View style={[styles.signoIcon, { backgroundColor: s.iconBg }]}><Ionicons name={s.icon} size={18} color={s.iconColor} /></View>
                    <Text style={[styles.signoValor, { color: t.text }]}>{s.valor}</Text>
                    <Text style={[styles.signoLabel, { color: t.textSub }]}>{s.label}</Text>
                  </View>
                ))}
              </View>
              <Text style={[styles.signosHistTitle, { color: t.text }]}>Último registro</Text>
              <View style={[styles.historialCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
                <View style={[styles.historialIcon, { backgroundColor: '#DBEAFE' }]}><Ionicons name="pulse" size={18} color="#2563EB" /></View>
                <View style={{ flex: 1 }}>
                  <View style={styles.historialHeader}>
                    <Text style={[styles.historialTipo, { color: t.text }]}>Signos Vitales</Text>
                    <Text style={[styles.historialFecha, { color: t.textMuted }]}>15 Ene 2024</Text>
                  </View>
                  <Text style={[styles.historialDesc, { color: t.textSub }]}>Peso: 68kg · PA: 120/80 · FC: 72 lpm · Temp: 36.5°C</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                    <Ionicons name="person-circle-outline" size={14} color={t.textMuted} />
                    <Text style={[styles.historialDoctor, { color: t.textMuted }]}>Dr. Rodríguez</Text>
                  </View>
                </View>
              </View>
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
  statValue: { fontSize: 15, fontWeight: '700' },
  tabsContainer: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  tabText: { fontSize: 13, fontWeight: '600' },
  historialCard: { flexDirection: 'row', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1 },
  historialIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  historialHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historialTipo: { fontSize: 14, fontWeight: '700' },
  historialFecha: { fontSize: 12 },
  historialDesc: { fontSize: 13, marginTop: 4 },
  historialDoctor: { fontSize: 12, marginLeft: 4 },
  actionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 1 },
  actionIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  actionTitle: { fontSize: 15, fontWeight: '700' },
  actionSub: { fontSize: 12, marginTop: 2 },
  newSignosBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, padding: 14, marginBottom: 16 },
  newSignosBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  signosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  signoCard: { width: '47%', borderRadius: 14, borderWidth: 1, padding: 14, alignItems: 'center' },
  signoIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  signoValor: { fontSize: 18, fontWeight: '800' },
  signoLabel: { fontSize: 12, marginTop: 2 },
  signosHistTitle: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
});