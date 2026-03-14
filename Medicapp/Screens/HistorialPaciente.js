import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TABS = ['Historial', 'Citas', 'Fotos', 'Notas', 'Signos Vitales'];

const historial = [
  {
    id: '1',
    tipo: 'Consulta General',
    fecha: '15 Ene 2024',
    descripcion: 'Dolor de cabeza persistente. Prescripción de analgésicos.',
    doctor: 'Dr. Rodríguez',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    icon: 'medical',
  },
  {
    id: '2',
    tipo: 'Chequeo Anual',
    fecha: '10 Dic 2023',
    descripcion: 'Examen físico completo. Resultados normales.',
    doctor: 'Dr. López',
    iconBg: '#D1FAE5',
    iconColor: '#10B981',
    icon: 'heart',
  },
];

export default function HistorialPaciente({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('Historial');
  const paciente = route?.params?.paciente || {
    id: 1,
    nombre: 'María González',
    edad: 42,
    sexo: 'Femenino',
    estado: 'Activo',
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ficha del Paciente</Text>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.patientCard}>
          <View style={styles.patientAvatar}>
            <Ionicons name="person" size={28} color="#9CA3AF" />
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{paciente.nombre}</Text>
            <Text style={styles.patientId}>ID: {paciente.id}</Text>
            <Text style={styles.statusBadge}>{paciente.estado || 'Activo'}</Text>
          </View>
          <View style={styles.patientMeta}>
            <Text style={styles.ageText}>{paciente.edad} años</Text>
            <Text style={styles.generoText}>{paciente.sexo || paciente.genero || 'Femenino'}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Última Cita</Text>
            <Text style={styles.statValue}>15 Ene</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Próxima</Text>
            <Text style={[styles.statValue, { color: '#2563EB' }]}>22 Ene</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Citas</Text>
            <Text style={styles.statValue}>24</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal: 16 }}>
          {activeTab === 'Historial' &&
            historial.map((item) => (
              <View key={item.id} style={styles.historialCard}>
                <View style={[styles.historialIcon, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={18} color={item.iconColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.historialHeader}>
                    <Text style={styles.historialTipo}>{item.tipo}</Text>
                    <Text style={styles.historialFecha}>{item.fecha}</Text>
                  </View>
                  <Text style={styles.historialDesc}>{item.descripcion}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                    <Ionicons name="person-circle-outline" size={14} color="#9CA3AF" />
                    <Text style={styles.historialDoctor}>{item.doctor}</Text>
                  </View>
                </View>
              </View>
            ))}

          {activeTab === 'Citas' && (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={40} color="#D1D5DB" />
              <Text style={styles.emptyText}>Sin citas registradas</Text>
            </View>
          )}

          {activeTab === 'Fotos' && (
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={40} color="#D1D5DB" />
              <Text style={styles.emptyText}>Sin contenido aún</Text>
            </View>
          )}

          {activeTab === 'Notas' && (
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('NotasPaciente', { paciente })}
            >
              <View style={styles.actionIconBox}>
                <Ionicons name="document-text-outline" size={24} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionTitle}>Ver y editar notas</Text>
                <Text style={styles.actionSub}>Observaciones médicas del paciente</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </TouchableOpacity>
          )}

          {activeTab === 'Signos Vitales' && (
            <>
              <TouchableOpacity
                style={styles.newSignosBtn}
                onPress={() => navigation.navigate('SignosVitales', { paciente })}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.newSignosBtnText}>Registrar Signos Vitales</Text>
              </TouchableOpacity>

              <View style={styles.signosGrid}>
                <SignoCard
                  label="Peso"
                  valor="68 kg"
                  iconBg="#D1FAE5"
                  iconColor="#10B981"
                  icon="scale-outline"
                />
                <SignoCard
                  label="Presión"
                  valor="120/80"
                  iconBg="#FEE2E2"
                  iconColor="#EF4444"
                  icon="heart"
                />
                <SignoCard
                  label="Frecuencia"
                  valor="72 lpm"
                  iconBg="#DBEAFE"
                  iconColor="#2563EB"
                  icon="heart-circle-outline"
                />
                <SignoCard
                  label="Temperatura"
                  valor="36.5°C"
                  iconBg="#FEF3C7"
                  iconColor="#F59E0B"
                  icon="thermometer-outline"
                />
              </View>

              <Text style={styles.signosHistTitle}>Último registro</Text>
              <View style={styles.historialCard}>
                <View style={[styles.historialIcon, { backgroundColor: '#DBEAFE' }]}>
                  <Ionicons name="pulse" size={18} color="#2563EB" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.historialHeader}>
                    <Text style={styles.historialTipo}>Signos Vitales</Text>
                    <Text style={styles.historialFecha}>15 Ene 2024</Text>
                  </View>
                  <Text style={styles.historialDesc}>
                    Peso: 68kg · PA: 120/80 · FC: 72 lpm · Temp: 36.5°C
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                    <Ionicons name="person-circle-outline" size={14} color="#9CA3AF" />
                    <Text style={styles.historialDoctor}>Dr. Rodríguez</Text>
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

function SignoCard({ label, valor, iconBg, iconColor, icon }) {
  return (
    <View style={styles.signoCard}>
      <View style={[styles.signoIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text style={styles.signoValor}>{valor}</Text>
      <Text style={styles.signoLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: { 
    width: 40, 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#111827' 
  },
  moreBtn: { 
    width: 40, 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  patientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  patientInfo: { 
    flex: 1 
  },
  patientName: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#111827' 
  },
  patientId: { 
    fontSize: 13, 
    color: '#6B7280', 
    marginTop: 2 
  },
  statusBadge: { 
    color: '#10B981', 
    fontSize: 13, 
    fontWeight: '600', 
    marginTop: 4 
  },
  patientMeta: { 
    alignItems: 'flex-end' 
  },
  ageText: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#111827' 
  },
  generoText: { 
    fontSize: 13, 
    color: '#6B7280' 
  },
  statsRow: { 
    flexDirection: 'row', 
    marginHorizontal: 16, 
    marginBottom: 16, 
    gap: 8 
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statLabel: { 
    fontSize: 11, 
    color: '#9CA3AF', 
    marginBottom: 4 
  },
  statValue: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#111827' 
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  tabActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  tabText: { 
    fontSize: 13, 
    color: '#6B7280', 
    fontWeight: '500' 
  },
  tabTextActive: { 
    color: '#FFFFFF', 
    fontWeight: '700' 
  },
  historialCard: {
    flexDirection: 'row',
    padding: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  historialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historialHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  historialTipo: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#111827' 
  },
  historialFecha: { 
    fontSize: 12, 
    color: '#9CA3AF' 
  },
  historialDesc: { 
    fontSize: 13, 
    color: '#6B7280', 
    marginTop: 4 
  },
  historialDoctor: { 
    fontSize: 12, 
    color: '#9CA3AF', 
    marginLeft: 4 
  },
  emptyState: { 
    alignItems: 'center', 
    padding: 40 
  },
  emptyText: { 
    color: '#9CA3AF', 
    marginTop: 8, 
    fontSize: 14 
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionTitle: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#111827' 
  },
  actionSub: { 
    fontSize: 12, 
    color: '#6B7280', 
    marginTop: 2 
  },
  newSignosBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  newSignosBtnText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 15 
  },
  signosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  signoCard: {
    width: '47%',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    alignItems: 'center',
  },
  signoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  signoValor: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#111827' 
  },
  signoLabel: { 
    fontSize: 12, 
    color: '#6B7280', 
    marginTop: 2 
  },
  signosHistTitle: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#374151', 
    marginBottom: 10 
  },
});