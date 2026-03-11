import React, { useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  Activo: { color: '#10B981', bg: '#D1FAE5', icon: 'ellipse' },
  Pendiente: { color: '#F59E0B', bg: '#FEF3C7', icon: 'time-outline' },
  Urgente: { color: '#EF4444', bg: '#FEE2E2', icon: 'alert-circle' },
};

export default function ListaDePacientes({ navigation }) {
  const [search, setSearch] = useState('');
  const filtered = PACIENTES.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Pacientes</Text>
        <TouchableOpacity style={styles.bellBtn}>
          <Ionicons name="notifications" size={22} color="#374151" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar pacientes..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.statsText}>Total: {PACIENTES.length} pacientes</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="funnel" size={14} color="#2563EB" />
          <Text style={styles.filterText}>Filtros</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => {
          const config = estadoConfig[item.estado];
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('HistorialPaciente', { paciente: item })}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.initials}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.cita}>Última cita: {item.ultimaCita}</Text>
                <View style={[styles.estadoBadge, { backgroundColor: config.bg }]}>
                  <Ionicons name={config.icon} size={10} color={config.color} style={{ marginRight: 4 }} />
                  <Text style={[styles.estadoText, { color: config.color }]}>{item.estado}</Text>
                </View>
              </View>
              <View style={styles.rightSide}>
                <Text style={styles.edad}>{item.edad} años</Text>
                <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CrearPaciente')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16,
  },
  title: { fontSize: 26, fontWeight: '700', color: '#111827' },
  bellBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 12,
    marginHorizontal: 16, paddingHorizontal: 14, height: 46, marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#111827' },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, marginBottom: 8,
  },
  statsText: { fontSize: 13, color: '#6B7280' },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  filterText: { color: '#2563EB', fontSize: 13, fontWeight: '600' },
  separator: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 2 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  info: { flex: 1 },
  nombre: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 2 },
  cita: { fontSize: 12, color: '#6B7280', marginBottom: 6 },
  estadoBadge: {
    flexDirection: 'row', alignItems: 'center',
    alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
  },
  estadoText: { fontSize: 11, fontWeight: '600' },
  rightSide: { alignItems: 'flex-end', gap: 8 },
  edad: { fontSize: 13, color: '#6B7280' },
  fab: {
    position: 'absolute', bottom: 80, right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#2563EB', shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});