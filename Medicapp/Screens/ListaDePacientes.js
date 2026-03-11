import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  FlatList,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Datos de prueba (mock) basados exactamente en tu diseño
const mockPatients = [
  { id: '1', name: 'María González', age: '45 años', lastAppt: '15 Ene 2024', status: 'Activo', initials: 'MG' },
  { id: '2', name: 'Juan López', age: '62 años', lastAppt: '12 Ene 2024', status: 'Pendiente', initials: 'JL' },
  { id: '3', name: 'Ana Rodríguez', age: '28 años', lastAppt: '10 Ene 2024', status: 'Activo', initials: 'AR' },
  { id: '4', name: 'Carlos Martínez', age: '35 años', lastAppt: '8 Ene 2024', status: 'Activo', initials: 'CM' },
  { id: '5', name: 'Laura Silva', age: '52 años', lastAppt: '5 Ene 2024', status: 'Urgente', initials: 'LS' },
  { id: '6', name: 'Diego Fernández', age: '41 años', lastAppt: '3 Ene 2024', status: 'Activo', initials: 'DF' },
  { id: '7', name: 'Sofía Pérez', age: '29 años', lastAppt: '1 Ene 2024', status: 'Pendiente', initials: 'SP' },
];

export default function PatientListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Lógica para filtrar pacientes
  const filteredPatients = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Componente para renderizar el badge de estado según el tipo
  const renderStatusBadge = (status) => {
    let bgColor, textColor, iconName, iconColor;

    switch (status) {
      case 'Activo':
        bgColor = '#D1FAE5'; textColor = '#10B981'; iconName = 'ellipse'; iconColor = '#10B981';
        break;
      case 'Pendiente':
        bgColor = '#FEF3C7'; textColor = '#D97706'; iconName = 'time'; iconColor = '#D97706';
        break;
      case 'Urgente':
        bgColor = '#FEE2E2'; textColor = '#EF4444'; iconName = 'alert'; iconColor = '#EF4444';
        break;
      default:
        bgColor = '#F3F4F6'; textColor = '#6B7280'; iconName = 'ellipse'; iconColor = '#6B7280';
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
        <Ionicons name={iconName} size={10} color={iconColor} style={{ marginRight: 4 }} />
        <Text style={[styles.statusText, { color: textColor }]}>{status}</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.patientCard}
      onPress={() => navigation.navigate('PatientDetail', { patient: item })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.initials}</Text>
      </View>
      
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.name}</Text>
        <Text style={styles.patientDate}>Última cita: {item.lastAppt}</Text>
        {renderStatusBadge(item.status)}
      </View>

      <View style={styles.patientRightInfo}>
        <Text style={styles.patientAge}>{item.age}</Text>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pacientes</Text>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications" size={22} color="#4B5563" />
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar pacientes..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filtros y Total */}
      <View style={styles.filterRow}>
        <Text style={styles.totalText}>Total: {filteredPatients.length} pacientes</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="funnel" size={16} color="#2563EB" />
          <Text style={styles.filterBtnText}>Filtros</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Pacientes */}
      <FlatList
        data={filteredPatients}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB (Botón Flotante) */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddPatient')}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Bottom Tabs (Visual) - Luego lo pasaremos a React Navigation */}
      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="people" size={24} color="#2563EB" />
          <Text style={[styles.tabText, { color: '#2563EB' }]}>Pacientes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Appointments')}>
          <Ionicons name="calendar" size={24} color="#9CA3AF" />
          <Text style={styles.tabText}>Citas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings" size={24} color="#9CA3AF" />
          <Text style={styles.tabText}>Ajustes</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  notificationBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    height: '100%',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  totalText: {
    fontSize: 16,
    color: '#4B5563',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterBtnText: {
    color: '#2563EB',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Espacio para el FAB y el BottomTab
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  patientDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  patientRightInfo: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
  },
  patientAge: {
    fontSize: 14,
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    bottom: 90, // Por encima del bottom tab
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#9CA3AF',
  },
});