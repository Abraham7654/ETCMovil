import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, TextInput, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../store/useTheme';
import { getCitas, getResumenCitas } from '../controllers/CitaController';

const FILTROS = ['Hoy', 'Mañana', 'Esta Semana'];

export default function ListaDeCitas({ navigation }) {
  const { darkMode, t } = useTheme();
  const [filtro, setFiltro] = useState('Hoy');
  const [citas, setCitas] = useState([]);
  const [resumen, setResumen] = useState({ total: 0, confirmadas: 0, pendientes: 0 });
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [mostrandoBuscador, setMostrandoBuscador] = useState(false);

  const cargar = useCallback(async (f) => {
    setLoading(true);
    const [resCitas, resRes] = await Promise.all([getCitas(f), getResumenCitas()]);
    if (resCitas.success) setCitas(resCitas.citas);
    if (resRes.success) setResumen(resRes);
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { cargar(filtro); }, [filtro]));

  const citasFiltradas = citas.filter(c =>
    c.paciente_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.motivo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        {mostrandoBuscador ? (
          <TextInput
            style={[styles.headerSearchInput, { backgroundColor: t.input, color: t.text }]}
            placeholder="Buscar cita o paciente..." placeholderTextColor={t.textMuted}
            value={busqueda} onChangeText={setBusqueda} autoFocus
          />
        ) : (
          <Text style={[styles.title, { color: t.text }]}>Citas</Text>
        )}
        <TouchableOpacity style={styles.searchBtn}
          onPress={() => { setMostrandoBuscador(!mostrandoBuscador); if (mostrandoBuscador) setBusqueda(''); }}>
          <Ionicons name={mostrandoBuscador ? 'close' : 'search'} size={22} color={t.text} />
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={{ height: 50 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
          {FILTROS.map(f => (
            <TouchableOpacity key={f}
              style={[styles.filterChip, filtro === f
                ? { backgroundColor: t.primary, borderColor: t.primary }
                : { backgroundColor: t.bg3, borderColor: t.cardBorder }]}
              onPress={() => setFiltro(f)}>
              <Text style={[styles.filterChipText, { color: filtro === f ? '#fff' : t.text }]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Total', val: resumen.total, color: t.text, bg: t.card },
          { label: 'Confirmadas', val: resumen.confirmadas, color: '#10B981', bg: darkMode ? '#064E3B' : '#F0FDF4' },
          { label: 'Pendientes', val: resumen.pendientes, color: '#F59E0B', bg: darkMode ? '#78350F' : '#FFFBEB' },
        ].map(s => (
          <View key={s.label} style={[styles.statBox, { backgroundColor: s.bg, borderColor: t.cardBorder }]}>
            <Text style={[styles.statNum, { color: s.color }]}>{s.val}</Text>
            <Text style={[styles.statLabel, { color: t.textMuted }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={t.primary} />
          <Text style={[styles.loadingText, { color: t.textMuted }]}>Cargando citas...</Text>
        </View>
      ) : (
        <FlatList
          data={citasFiltradas}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color={t.textMuted} />
              <Text style={[styles.emptyText, { color: t.textMuted }]}>No hay citas para este período</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.citaCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}
              onPress={() => navigation.navigate('RecordatorioDeCita', { cita: item })}>
              <View style={styles.citaTop}>
                <Text style={[styles.citaNombre, { color: t.text }]}>{item.paciente_nombre}</Text>
                <Text style={[styles.citaEstado, {
                  color: item.estado === 'Confirmada' ? '#10B981'
                    : item.estado === 'Cancelada' ? '#EF4444' : '#F59E0B'
                }]}>{item.estado}</Text>
              </View>
              <Text style={[styles.citaTipo, { color: t.textSub }]}>{item.motivo || 'Sin motivo especificado'}</Text>
              <View style={styles.citaBottom}>
                <View style={styles.citaMeta}>
                  <Ionicons name="time-outline" size={14} color={t.textMuted} />
                  <Text style={[styles.citaMetaText, { color: t.textSub }]}>{item.hora}</Text>
                </View>
                <View style={styles.citaMeta}>
                  <Ionicons name="person-circle-outline" size={14} color={t.textMuted} />
                  <Text style={[styles.citaMetaText, { color: t.textSub }]}>{item.doctor}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

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
  title: { fontSize: 24, fontWeight: '700' },
  searchBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerSearchInput: { flex: 1, height: 40, borderRadius: 10, paddingHorizontal: 12, marginHorizontal: 8, fontSize: 15 },
  filtersRow: { paddingLeft: 16, paddingRight: 32, gap: 8, alignItems: 'center' },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  filterChipText: { fontSize: 13, fontWeight: '600' },
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
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 8 },
  emptyText: { fontSize: 15 },
  fab: { position: 'absolute', bottom: 30, right: 20, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 8 },
});