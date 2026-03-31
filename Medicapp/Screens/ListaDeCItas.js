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

  useFocusEffect(useCallback(() => { cargar(filtro); }, [filtro, cargar]));

  const citasFiltradas = citas.filter(c =>
    c.paciente_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.motivo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />
      
      {/* Header Dinámico */}
      <View style={[styles.header, { borderBottomColor: t.separator }]}>
        {mostrandoBuscador ? (
          <View style={styles.searchContainer}>
            <TouchableOpacity onPress={() => { setMostrandoBuscador(false); setBusqueda(''); }}>
              <Ionicons name="arrow-back" size={22} color={t.text} />
            </TouchableOpacity>
            <TextInput
              style={[styles.headerSearchInput, { backgroundColor: t.bg3, color: t.text }]}
              placeholder="Buscar paciente o motivo..."
              placeholderTextColor={t.textMuted}
              value={busqueda}
              onChangeText={setBusqueda}
              autoFocus
            />
          </View>
        ) : (
          <>
            <Text style={[styles.title, { color: t.text }]}>Agenda</Text>
            <TouchableOpacity 
              style={[styles.searchBtn, { backgroundColor: t.bg3 }]} 
              onPress={() => setMostrandoBuscador(true)}>
              <Ionicons name="search" size={20} color={t.text} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Chips de Filtro */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
          {FILTROS.map(f => (
            <TouchableOpacity key={f}
              style={[styles.filterChip, filtro === f 
                ? { backgroundColor: t.primary, borderColor: t.primary } 
                : { backgroundColor: t.card, borderColor: t.cardBorder }]}
              onPress={() => setFiltro(f)}>
              <Text style={[styles.filterChipText, { color: filtro === f ? '#fff' : t.textSub }]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Resumen de Citas (Stats) */}
      <View style={styles.statsRow}>
        <StatItem label="Total" val={resumen.total} color={t.primary} bg={t.card} t={t} />
        <StatItem label="OK" val={resumen.confirmadas} color="#10B981" bg={darkMode ? '#064E3B40' : '#D1FAE5'} t={t} />
        <StatItem label="Pend." val={resumen.pendientes} color="#F59E0B" bg={darkMode ? '#78350F40' : '#FEF3C7'} t={t} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={t.primary} />
          <Text style={[styles.loadingText, { color: t.textMuted }]}>Actualizando agenda...</Text>
        </View>
      ) : (
        <FlatList
          data={citasFiltradas}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, paddingTop: 8 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconBox, { backgroundColor: t.bg3 }]}>
                <Ionicons name="calendar-clear-outline" size={40} color={t.textMuted} />
              </View>
              <Text style={[styles.emptyText, { color: t.text }]}>No hay citas programadas</Text>
              <Text style={{ color: t.textMuted, fontSize: 13 }}>{filtro === 'Hoy' ? 'Tómate un café, tu agenda está limpia.' : 'No se encontraron resultados.'}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.citaCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}
              onPress={() => navigation.navigate('RecordatorioDeCita', { cita: item })}>
              
              <View style={styles.citaSideIndicator(item.estado)} />
              
              <View style={styles.citaContent}>
                <View style={styles.citaTop}>
                  <Text style={[styles.citaNombre, { color: t.text }]} numberOfLines={1}>{item.paciente_nombre}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estado) + '15' }]}>
                    <Text style={[styles.citaEstado, { color: getStatusColor(item.estado) }]}>{item.estado}</Text>
                  </View>
                </View>

                <Text style={[styles.citaTipo, { color: t.textSub }]} numberOfLines={1}>
                  {item.motivo || 'Consulta Médica'}
                </Text>

                <View style={[styles.divider, { backgroundColor: t.separator }]} />

                <View style={styles.citaBottom}>
                  <View style={styles.citaMeta}>
                    <Ionicons name="time" size={14} color={t.primary} />
                    <Text style={[styles.citaMetaText, { color: t.text, fontWeight: '700' }]}>{item.hora}</Text>
                  </View>
                  <View style={styles.citaMeta}>
                    <Ionicons name="person" size={14} color={t.textMuted} />
                    <Text style={[styles.citaMetaText, { color: t.textSub }]}>{item.doctor}</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={t.textMuted} style={{ alignSelf: 'center', marginLeft: 8 }} />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Botón Flotante */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: t.primary, shadowColor: t.primary }]}
        onPress={() => navigation.navigate('CrearCita')}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Sub-componentes
const StatItem = ({ label, val, color, bg, t }) => (
  <View style={[styles.statBox, { backgroundColor: bg, borderColor: t.cardBorder }]}>
    <Text style={[styles.statNum, { color }]}>{val}</Text>
    <Text style={[styles.statLabel, { color: t.textSub }]}>{label}</Text>
  </View>
);

const getStatusColor = (estado) => {
  switch (estado) {
    case 'Confirmada': return '#10B981';
    case 'Cancelada': return '#EF4444';
    case 'Pendiente': return '#F59E0B';
    default: return '#6B7280';
  }
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  headerSearchInput: { flex: 1, height: 42, borderRadius: 12, paddingHorizontal: 15, marginLeft: 12, fontSize: 15, fontWeight: '500' },
  searchBtn: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  filterWrapper: { marginBottom: 12 },
  filtersRow: { paddingHorizontal: 20, gap: 10 },
  filterChip: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 14, borderWidth: 1 },
  filterChipText: { fontSize: 14, fontWeight: '700' },
  statsRow: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 15, gap: 10 },
  statBox: { flex: 1, borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1 },
  statNum: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600', marginTop: 2, textTransform: 'uppercase' },
  
  citaCard: { 
    flexDirection: 'row', 
    borderRadius: 18, 
    borderWidth: 1, 
    overflow: 'hidden', 
    paddingRight: 12 
  },
  citaSideIndicator: (estado) => ({
    width: 6,
    backgroundColor: getStatusColor(estado),
  }),
  citaContent: { flex: 1, padding: 14 },
  citaTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  citaNombre: { fontSize: 16, fontWeight: '700', flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  citaEstado: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  citaTipo: { fontSize: 13, marginBottom: 10, fontWeight: '500' },
  divider: { height: 1, marginBottom: 10, opacity: 0.5 },
  citaBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  citaMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  citaMetaText: { fontSize: 13 },
  
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 14, marginTop: 12, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyIconBox: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyText: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  fab: { 
    position: 'absolute', 
    bottom: 30, 
    right: 25, 
    width: 60, 
    height: 60, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 6,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6
  },
});