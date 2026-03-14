import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, darkTheme } from '../theme/theme';

const PACIENTES = [
  { id: '1', nombre: 'María González', edad: 45, ultimaCita: '15 Ene 2024', estado: 'Activo', initials: 'MG' },
  { id: '2', nombre: 'Juan López', edad: 62, ultimaCita: '12 Ene 2024', estado: 'Pendiente', initials: 'JL' },
  { id: '3', nombre: 'Ana Rodríguez', edad: 28, ultimaCita: '10 Ene 2024', estado: 'Activo', initials: 'AR' },
  { id: '4', nombre: 'Carlos Martínez', edad: 35, ultimaCita: '8 Ene 2024', estado: 'Activo', initials: 'CM' },
  { id: '5', nombre: 'Laura Silva', edad: 52, ultimaCita: '5 Ene 2024', estado: 'Urgente', initials: 'LS' },
  { id: '6', nombre: 'Diego Fernández', edad: 41, ultimaCita: '3 Ene 2024', estado: 'Activo', initials: 'DF' },
  { id: '7', nombre: 'Sofía Pérez', edad: 29, ultimaCita: '1 Ene 2024', estado: 'Pendiente', initials: 'SP' },
];

const estadoConfig = {
  Activo:   { color: '#10B981', bg: '#D1FAE5', bgDark: '#064E3B', icon: 'ellipse' },
  Pendiente:{ color: '#F59E0B', bg: '#FEF3C7', bgDark: '#78350F', icon: 'time-outline' },
  Urgente:  { color: '#EF4444', bg: '#FEE2E2', bgDark: '#7F1D1D', icon: 'alert-circle' },
};

export default function ListaDePacientes({ navigation, route }) {
  const { darkMode } = route?.params || {};
  const t = darkMode ? darkTheme : lightTheme;
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  const cambiarFiltro = () => {
    const opciones = ['Todos', 'Activo', 'Pendiente', 'Urgente'];
    const idx = opciones.indexOf(filtroEstado);
    setFiltroEstado(opciones[(idx + 1) % opciones.length]);
  };

  const filtered = PACIENTES.filter(p => {
    const coincideTexto = p.nombre.toLowerCase().includes(search.toLowerCase());
    const coincideFiltro = filtroEstado === 'Todos' ? true : p.estado === filtroEstado;
    return coincideTexto && coincideFiltro;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />
      <View style={[styles.header, { backgroundColor: t.bg }]}>
        <Text style={[styles.title, { color: t.text }]}>Pacientes</Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: t.input }]}>
        <Ionicons name="search-outline" size={18} color={t.textMuted} style={{ marginRight: 8 }} />
        <TextInput style={[styles.searchInput, { color: t.text }]}
          placeholder="Buscar pacientes..." placeholderTextColor={t.textMuted}
          value={search} onChangeText={setSearch} />
      </View>

      <View style={styles.statsRow}>
        <Text style={[styles.statsText, { color: t.textSub }]}>Mostrando: {filtered.length} pacientes</Text>
        <TouchableOpacity style={styles.filterBtn} onPress={cambiarFiltro}>
          <Ionicons name="funnel" size={14} color={t.primary} />
          <Text style={[styles.filterText, { color: t.primary }]}>
            Filtros {filtroEstado !== 'Todos' ? `(${filtroEstado})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: t.separator }]} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={t.textMuted} />
            <Text style={[styles.emptyText, { color: t.textMuted }]}>No se encontraron pacientes</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const config = estadoConfig[item.estado];
          return (
            <TouchableOpacity style={styles.card}
              onPress={() => navigation.navigate('HistorialPaciente', { paciente: item, darkMode })}>
              <View style={[styles.avatar, { backgroundColor: t.primary }]}>
                <Text style={styles.avatarText}>{item.initials}</Text>
              </View>
              <View style={styles.info}>
                <Text style={[styles.nombre, { color: t.text }]}>{item.nombre}</Text>
                <Text style={[styles.cita, { color: t.textSub }]}>Última cita: {item.ultimaCita}</Text>
                <View style={[styles.estadoBadge, { backgroundColor: darkMode ? config.bgDark : config.bg }]}>
                  <Ionicons name={config.icon} size={10} color={config.color} style={{ marginRight: 4 }} />
                  <Text style={[styles.estadoText, { color: config.color }]}>{item.estado}</Text>
                </View>
              </View>
              <View style={styles.rightSide}>
                <Text style={[styles.edad, { color: t.textSub }]}>{item.edad} años</Text>
                <Ionicons name="chevron-forward" size={18} color={t.textMuted} />
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity style={[styles.fab, { backgroundColor: t.primary }]}
        onPress={() => navigation.navigate('CrearPaciente', { darkMode })}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  title: { fontSize: 26, fontWeight: '700' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, marginHorizontal: 16, paddingHorizontal: 14, height: 46, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 8 },
  statsText: { fontSize: 13 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  filterText: { fontSize: 13, fontWeight: '600' },
  separator: { height: 1, marginVertical: 2 },
  card: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  info: { flex: 1 },
  nombre: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  cita: { fontSize: 12, marginBottom: 6 },
  estadoBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  estadoText: { fontSize: 11, fontWeight: '600' },
  rightSide: { alignItems: 'flex-end', gap: 8 },
  edad: { fontSize: 13 },
  fab: { position: 'absolute', bottom: 30, right: 20, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 8 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { marginTop: 12, fontSize: 15, fontWeight: '500' },
});