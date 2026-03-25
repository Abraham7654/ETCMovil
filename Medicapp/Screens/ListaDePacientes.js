import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../store/useTheme';
import { getPacientes, buscarPacientes, eliminarPaciente } from '../controllers/PacienteController';
import { getInitials } from '../models/Paciente';

const estadoConfig = {
  Activo:   { color: '#10B981', bgLight: '#D1FAE5', bgDark: '#064E3B', icon: 'ellipse' },
  Pendiente:{ color: '#F59E0B', bgLight: '#FEF3C7', bgDark: '#78350F', icon: 'time-outline' },
  Urgente:  { color: '#EF4444', bgLight: '#FEE2E2', bgDark: '#7F1D1D', icon: 'alert-circle' },
};

export default function ListaDePacientes({ navigation }) {
  const { darkMode, t } = useTheme();
  const [search, setSearch] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  const cargarPacientes = async () => {
    setLoading(true);
    const result = await getPacientes();
    if (result.success) setPacientes(result.pacientes);
    setLoading(false);
  };

  useFocusEffect(useCallback(() => { cargarPacientes(); }, []));

  const handleSearch = async (texto) => {
    setSearch(texto);
    if (texto.length > 1) {
      const result = await buscarPacientes(texto);
      if (result.success) setPacientes(result.pacientes);
    } else if (texto.length === 0) {
      cargarPacientes();
    }
  };

  const cambiarFiltro = () => {
    const opciones = ['Todos', 'Activo', 'Pendiente', 'Urgente'];
    const idx = opciones.indexOf(filtroEstado);
    setFiltroEstado(opciones[(idx + 1) % opciones.length]);
  };

  const confirmarEliminar = (id, nombre) => {
    Alert.alert(
      'Eliminar Paciente',
      `¿Deseas eliminar a ${nombre}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive',
          onPress: async () => {
            const result = await eliminarPaciente(id);
            if (result.success) cargarPacientes();
            else Alert.alert('Error', result.mensaje);
          },
        },
      ]
    );
  };

  const filtered = pacientes.filter(p =>
    filtroEstado === 'Todos' ? true : p.estado === filtroEstado
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />
      <View style={[styles.header, { backgroundColor: t.bg }]}>
        <Text style={[styles.title, { color: t.text }]}>Pacientes</Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: t.input }]}>
        <Ionicons name="search-outline" size={18} color={t.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.searchInput, { color: t.text }]}
          placeholder="Buscar pacientes..."
          placeholderTextColor={t.textMuted}
          value={search}
          onChangeText={handleSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={18} color={t.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statsRow}>
        <Text style={[styles.statsText, { color: t.textSub }]}>
          Mostrando: {filtered.length} pacientes
        </Text>
        <TouchableOpacity style={styles.filterBtn} onPress={cambiarFiltro}>
          <Ionicons name="funnel" size={14} color={t.primary} />
          <Text style={[styles.filterText, { color: t.primary }]}>
            {filtroEstado !== 'Todos' ? `(${filtroEstado})` : 'Filtros'}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={t.primary} />
          <Text style={[styles.loadingText, { color: t.textMuted }]}>Cargando pacientes...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: t.separator }]} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color={t.textMuted} />
              <Text style={[styles.emptyText, { color: t.textMuted }]}>
                No se encontraron pacientes
              </Text>
              <TouchableOpacity
                style={[styles.emptyBtn, { backgroundColor: t.primary }]}
                onPress={() => navigation.navigate('CrearPaciente')}
              >
                <Text style={styles.emptyBtnText}>Agregar primer paciente</Text>
              </TouchableOpacity>
            </View>
          )}
          renderItem={({ item }) => {
            const config = estadoConfig[item.estado] || estadoConfig['Activo'];
            const bgBadge = darkMode ? config.bgDark : config.bgLight;
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('HistorialPaciente', { paciente: item })}
                onLongPress={() => confirmarEliminar(item.id, item.nombre)}
              >
                <View style={[styles.avatar, { backgroundColor: t.primary }]}>
                  <Text style={styles.avatarText}>{getInitials(item.nombre)}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={[styles.nombre, { color: t.text }]}>{item.nombre}</Text>
                  <Text style={[styles.cita, { color: t.textSub }]}>
                    {item.edad} años · {item.genero || 'N/D'}
                  </Text>
                  <View style={[styles.estadoBadge, { backgroundColor: bgBadge }]}>
                    <Ionicons name={config.icon} size={10} color={config.color} style={{ marginRight: 4 }} />
                    <Text style={[styles.estadoText, { color: config.color }]}>{item.estado}</Text>
                  </View>
                </View>
                <View style={styles.rightSide}>
                  <Ionicons name="chevron-forward" size={18} color={t.textMuted} />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: t.primary }]}
        onPress={() => navigation.navigate('CrearPaciente')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  title: { fontSize: 26, fontWeight: '700' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12,
    marginHorizontal: 16, paddingHorizontal: 14, height: 46, marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14 },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, marginBottom: 8,
  },
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
  rightSide: { alignItems: 'flex-end' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontWeight: '500' },
  emptyBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, marginTop: 8 },
  emptyBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  fab: {
    position: 'absolute', bottom: 30, right: 20,
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center', elevation: 8,
  },
});