import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FILTROS = ['Hoy', 'Mañana', 'Esta Semana'];

const CITAS = [
  { id: '1', paciente: 'María González', tipo: 'Consulta General', inicio: '09:00', fin: '09:30', doctor: 'Dr. Martínez', estado: 'Confirmada' },
  { id: '2', paciente: 'Carlos Rodríguez', tipo: 'Cardiología', inicio: '10:30', fin: '11:00', doctor: 'Dr. López', estado: 'Pendiente' },
  { id: '3', paciente: 'Ana Fernández', tipo: 'Pediatría', inicio: '11:15', fin: '11:45', doctor: 'Dr. García', estado: 'Confirmada' },
  { id: '4', paciente: 'Luis Morales', tipo: 'Dermatología', inicio: '14:00', fin: '14:30', doctor: 'Dr. Ruiz', estado: 'Confirmada' },
  { id: '5', paciente: 'Patricia Silva', tipo: 'Ginecología', inicio: '15:30', fin: '16:00', doctor: 'Dr. Herrera', estado: 'Pendiente' },
  { id: '6', paciente: 'Roberto Vega', tipo: 'Traumatología', inicio: '16:45', fin: '17:15', doctor: 'Dr. Castro', estado: 'Confirmada' },
];

export default function ListaDeCitas({ navigation }) {
  const [filtro, setFiltro] = useState('Hoy');
  const confirmadas = CITAS.filter(c => c.estado === 'Confirmada').length;
  const pendientes = CITAS.filter(c => c.estado === 'Pendiente').length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn}>
          <Ionicons name="menu" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>Citas</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Ionicons name="search" size={22} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}>
        {FILTROS.map(f => (
          <TouchableOpacity
            key={f} style={[styles.filterChip, filtro === f && styles.filterChipActive]}
            onPress={() => setFiltro(f)}
          >
            <Text style={[styles.filterChipText, filtro === f && styles.filterChipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.filterChipIcon}>
          <Ionicons name="calendar-outline" size={16} color="#374151" />
          <Text style={styles.filterChipText}> Fe...</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{CITAS.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#F0FDF4' }]}>
          <Text style={[styles.statNum, { color: '#10B981' }]}>{confirmadas}</Text>
          <Text style={styles.statLabel}>Confirmadas</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#FFFBEB' }]}>
          <Text style={[styles.statNum, { color: '#F59E0B' }]}>{pendientes}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
      </View>

      <FlatList
        data={CITAS}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.citaCard}
            onPress={() => navigation.navigate('RecordatorioDeCita', { cita: item })}
          >
            <View style={styles.citaTop}>
              <Text style={styles.citaNombre}>{item.paciente}</Text>
              <Text style={[styles.citaEstado,
                item.estado === 'Confirmada' ? { color: '#10B981' } : { color: '#F59E0B' }
              ]}>{item.estado}</Text>
            </View>
            <Text style={styles.citaTipo}>{item.tipo}</Text>
            <View style={styles.citaBottom}>
              <View style={styles.citaMeta}>
                <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                <Text style={styles.citaMetaText}>{item.inicio} - {item.fin}</Text>
              </View>
              <View style={styles.citaMeta}>
                <Ionicons name="person-circle-outline" size={14} color="#9CA3AF" />
                <Text style={styles.citaMetaText}>{item.doctor}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CrearCita')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8,
  },
  menuBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#111827' },
  searchBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  filtersRow: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB',
  },
  filterChipActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  filterChipText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  filterChipTextActive: { color: '#FFFFFF' },
  filterChipIcon: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB',
  },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 12, gap: 8 },
  statBox: {
    flex: 1, backgroundColor: '#F9FAFB', borderRadius: 12,
    padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB',
  },
  statNum: { fontSize: 22, fontWeight: '800', color: '#111827' },
  statLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  citaCard: {
    padding: 14, backgroundColor: '#fff',
    borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB',
  },
  citaTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  citaNombre: { fontSize: 15, fontWeight: '700', color: '#111827' },
  citaEstado: { fontSize: 13, fontWeight: '600' },
  citaTipo: { fontSize: 13, color: '#6B7280', marginBottom: 8 },
  citaBottom: { flexDirection: 'row', gap: 16 },
  citaMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  citaMetaText: { fontSize: 12, color: '#6B7280' },
  fab: {
    position: 'absolute', bottom: 80, right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#2563EB', shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});