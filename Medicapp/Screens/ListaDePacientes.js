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
  Activo:   { color: '#10B981', icon: 'checkmark-circle' },
  Pendiente: { color: '#F59E0B', icon: 'time' },
  Urgente:   { color: '#EF4444', icon: 'flash' },
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
      'Eliminar Registro',
      `¿Estás seguro de eliminar a ${nombre}? Se perderá todo su historial médico.`,
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
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: t.text }]}>Pacientes</Text>
          <Text style={[styles.subtitle, { color: t.textSub }]}>Base de datos clínica</Text>
        </View>
        <TouchableOpacity 
          style={[styles.addIconBtn, { backgroundColor: t.primary + '15' }]} 
          onPress={() => navigation.navigate('CrearPaciente')}>
          <Ionicons name="person-add" size={20} color={t.primary} />
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <View style={[styles.searchWrapper, { backgroundColor: t.bg3, borderColor: t.cardBorder }]}>
        <Ionicons name="search" size={18} color={t.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: t.text }]}
          placeholder="Nombre, DNI o diagnóstico..."
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

      {/* Filtros rápidos */}
      <View style={styles.toolRow}>
        <View style={[styles.countBadge, { backgroundColor: t.bg3 }]}>
          <Text style={[styles.countText, { color: t.textSub }]}>{filtered.length} registros</Text>
        </View>
        <TouchableOpacity style={[styles.filterBtn, { borderColor: t.primary }]} onPress={cambiarFiltro}>
          <Ionicons name="options-outline" size={16} color={t.primary} />
          <Text style={[styles.filterText, { color: t.primary }]}>
            {filtroEstado === 'Todos' ? 'Filtrar' : filtroEstado}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={t.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconBox, { backgroundColor: t.bg3 }]}>
                <Ionicons name="people-outline" size={40} color={t.textMuted} />
              </View>
              <Text style={[styles.emptyText, { color: t.text }]}>No hay pacientes</Text>
              <Text style={[styles.emptySub, { color: t.textMuted }]}>No se encontraron registros con los criterios actuales.</Text>
            </View>
          )}
          renderItem={({ item }) => {
            const config = estadoConfig[item.estado] || estadoConfig['Activo'];
            return (
              <TouchableOpacity
                style={[styles.card, { backgroundColor: t.card, borderColor: t.cardBorder }]}
                onPress={() => navigation.navigate('HistorialPaciente', { paciente: item })}
                onLongPress={() => confirmarEliminar(item.id, item.nombre)}
              >
                <View style={[styles.avatar, { backgroundColor: t.primary }]}>
                  <Text style={styles.avatarText}>{getInitials(item.nombre)}</Text>
                </View>
                
                <View style={styles.info}>
                  <Text style={[styles.nombre, { color: t.text }]} numberOfLines={1}>{item.nombre}</Text>
                  <Text style={[styles.detalles, { color: t.textSub }]}>
                    {item.genero || 'Gén.'} • {item.edad} años
                  </Text>
                  
                  <View style={[styles.estadoRow]}>
                    <Ionicons name={config.icon} size={12} color={config.color} />
                    <Text style={[styles.estadoText, { color: config.color }]}>{item.estado}</Text>
                  </View>
                </View>

                <View style={styles.cardRight}>
                  <Ionicons name="chevron-forward" size={18} color={t.textMuted} />
                </View>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}

      {/* Botón Flotante con Sombra */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: t.primary, shadowColor: t.primary }]}
        onPress={() => navigation.navigate('CrearPaciente')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 18 
  },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, fontWeight: '500', marginTop: -2 },
  addIconBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  
  searchWrapper: {
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 16,
    marginHorizontal: 20, 
    paddingHorizontal: 16, 
    height: 52, 
    marginBottom: 16,
    borderWidth: 1,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, fontWeight: '500' },
  
  toolRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    paddingHorizontal: 20, 
    marginBottom: 15,
  },
  countBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  countText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  filterBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    borderWidth: 1, 
    paddingHorizontal: 12, 
    paddingVertical: 5, 
    borderRadius: 10 
  },
  filterText: { fontSize: 13, fontWeight: '700' },

  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 14, 
    borderRadius: 20, 
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8
  },
  avatar: { 
    width: 54, 
    height: 54, 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 15 
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 17 },
  info: { flex: 1 },
  nombre: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  detalles: { fontSize: 13, marginBottom: 6, fontWeight: '500' },
  estadoRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  estadoText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  cardRight: { paddingLeft: 10 },
  
  loadingContainer: { flex: 1, justifyContent: 'center' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyIconBox: { width: 70, height: 70, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  emptyText: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptySub: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  
  fab: {
    position: 'absolute', bottom: 30, right: 25,
    width: 64, height: 64, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', 
    elevation: 8,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
});