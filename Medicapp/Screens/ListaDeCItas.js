import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/useTheme';

const FILTROS = ['Hoy', 'Mañana', 'Esta Semana'];
const CITAS = [
  { id: '1', paciente: 'María González', tipo: 'Consulta General', inicio: '09:00', fin: '09:30', doctor: 'Dr. Martínez', estado: 'Confirmada' },
  { id: '2', paciente: 'Carlos Rodríguez', tipo: 'Cardiología', inicio: '10:30', fin: '11:00', doctor: 'Dr. López', estado: 'Pendiente' },
  { id: '3', paciente: 'Ana Fernández', tipo: 'Pediatría', inicio: '11:15', fin: '11:45', doctor: 'Dr. García', estado: 'Confirmada' },
  { id: '4', paciente: 'Luis Morales', tipo: 'Dermatología', inicio: '14:00', fin: '14:30', doctor: 'Dr. Ruiz', estado: 'Confirmada' },
  { id: '5', paciente: 'Patricia Silva', tipo: 'Ginecología', inicio: '15:30', fin: '16:00', doctor: 'Dr. Herrera', estado: 'Pendiente' },
  { id: '6', paciente: 'Roberto Vega', tipo: 'Traumatología', inicio: '16:45', fin: '17:15', doctor: 'Dr. Castro', estado: 'Confirmada' },
];

export default function ListaDeCitas({ navigation, route }) {
  const { darkMode, t } = useTheme();
  const [filtro, setFiltro] = useState('Hoy');
  const [busqueda, setBusqueda] = useState('');
  const [mostrandoBuscador, setMostrandoBuscador] = useState(false);

  const citasFiltradas = CITAS.filter(c =>
    c.paciente.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.tipo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const confirmadas = citasFiltradas.filter(c => c.estado === 'Confirmada').length;
  const pendientes = citasFiltradas.filter(c => c.estado === 'Pendiente').length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />
      <View style={styles.header}>
        <View style={styles.menuBtn} />
        {mostrandoBuscador ? (
          <TextInput style={[styles.headerSearchInput, { backgroundColor: t.input, color: t.text }]}
            placeholder="Buscar paciente o cita..." placeholderTextColor={t.textMuted}
            value={busqueda} onChangeText={setBusqueda} autoFocus />
        ) : (
          <Text style={[styles.title, { color: t.text }]}>Citas</Text>
        )}
        <TouchableOpacity style={styles.searchBtn} onPress={() => { setMostrandoBuscador(!mostrandoBuscador); if (mostrandoBuscador) setBusqueda(''); }}>
          <Ionicons name={mostrandoBuscador ? "close" : "search"} size={22} color={t.text} />
        </TouchableOpacity>
      </View>

      <View style={{ height: 50 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
          {FILTROS.map(f => (
            <TouchableOpacity key={f}
              style={[styles.filterChip, filtro === f ? { backgroundColor: t.primary, borderColor: t.primary } : { backgroundColor: t.bg3, borderColor: t.cardBorder }]}
              onPress={() => setFiltro(f)}>
              <Text style={[styles.filterChipText, { color: filtro === f ? '#fff' : t.text }]}>{f}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.filterChipIcon, { backgroundColor: t.bg3, borderColor: t.cardBorder }]}>
            <Ionicons name="calendar-outline" size={16} color={t.text} />
            <Text style={[styles.filterChipText, { marginLeft: 6, color: t.text }]}>Fecha</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <Text style={[styles.statNum, { color: t.text }]}>{citasFiltradas.length}</Text>
          <Text style={[styles.statLabel, { color: t.textMuted }]}>Total</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: darkMode ? '#064E3B' : '#F0FDF4', borderColor: t.cardBorder }]}>
          <Text style={[styles.statNum, { color: '#10B981' }]}>{confirmadas}</Text>
          <Text style={[styles.statLabel, { color: t.textMuted }]}>Confirmadas</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: darkMode ? '#78350F' : '#FFFBEB', borderColor: t.cardBorder }]}>
          <Text style={[styles.statNum, { color: '#F59E0B' }]}>{pendientes}</Text>
          <Text style={[styles.statLabel, { color: t.textMuted }]}>Pendientes</Text>
        </View>
      </View>

      <FlatList
        data={citasFiltradas} keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.citaCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}
            onPress={() => navigation.navigate('RecordatorioDeCita')}>
            <View style={styles.citaTop}>
              <Text style={[styles.citaNombre, { color: t.text }]}>{item.paciente}</Text>
              <Text style={[styles.citaEstado, { color: item.estado === 'Confirmada' ? '#10B981' : '#F59E0B' }]}>{item.estado}</Text>
            </View>
            <Text style={[styles.citaTipo, { color: t.textSub }]}>{item.tipo}</Text>
            <View style={styles.citaBottom}>
              <View style={styles.citaMeta}><Ionicons name="time-outline" size={14} color={t.textMuted} /><Text style={[styles.citaMetaText, { color: t.textSub }]}>{item.inicio} - {item.fin}</Text></View>
              <View style={styles.citaMeta}><Ionicons name="person-circle-outline" size={14} color={t.textMuted} /><Text style={[styles.citaMetaText, { color: t.textSub }]}>{item.doctor}</Text></View>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={[styles.fab, { backgroundColor: t.primary }]}
        onPress={() => navigation.navigate('CrearCita')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  menuBtn: { width: 40, height: 40 },
  title: { fontSize: 24, fontWeight: '700' },
  searchBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerSearchInput: { flex: 1, height: 40, borderRadius: 10, paddingHorizontal: 12, marginHorizontal: 8, fontSize: 15 },
  filtersRow: { paddingLeft: 16, paddingRight: 32, gap: 8, alignItems: 'center' },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  filterChipText: { fontSize: 13, fontWeight: '600' },
  filterChipIcon: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 12, marginTop: 8, gap: 8 },
  statBox: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1 },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 2 },
  citaCard: { padding: 14, borderRadius: 14, borderWidth: 1 },
  citaTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  citaNombre: { fontSize: 15, fontWeight: '700' },
  citaEstado: { fontSize: 13, fontWeight: '600' },
  citaTipo: { fontSize: 13, marginBottom: 8 },
  citaBottom: { flexDirection: 'row', gap: 16 },
  citaMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  citaMetaText: { fontSize: 12 },
  fab: { position: 'absolute', bottom: 30, right: 20, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 8 },
});