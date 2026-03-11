import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Datos de prueba basados en tu diseño
const mockAppointments = [
  {
    id: '1',
    patient: 'Carlos Martínez',
    time: '09:00 AM - 09:45 AM',
    reason: 'Consulta de seguimiento por hipertensión',
    status: 'Confirmada',
    type: 'Consulta General',
    initials: 'CM'
  },
  {
    id: '2',
    patient: 'Ana Rodríguez',
    time: '10:30 AM - 11:15 AM',
    reason: 'Revisión de resultados de laboratorio',
    status: 'Pendiente',
    type: 'Resultados',
    initials: 'AR'
  }
];

// Días para el selector superior
const days = ['Hoy', 'Mañana', '17 Ene', '18 Ene', '19 Ene'];

export default function AppointmentsScreen({ navigation }) {
  const [activeDay, setActiveDay] = useState('Hoy');

  // Componente para el badge de estado
  const renderStatusBadge = (status) => {
    let bgColor, textColor;
    if (status === 'Confirmada') {
      bgColor = '#D1FAE5';
      textColor = '#10B981';
    } else {
      bgColor = '#FEF3C7';
      textColor = '#D97706';
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
        <Text style={[styles.statusText, { color: textColor }]}>{status}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Citas</Text>
        <TouchableOpacity style={styles.calendarBtn}>
          <Ionicons name="calendar-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Selector de Días (Horizontal Scroll) */}
      <View style={styles.daysContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
          {days.map((day) => (
            <TouchableOpacity 
              key={day}
              style={[styles.dayButton, activeDay === day && styles.dayButtonActive]}
              onPress={() => setActiveDay(day)}
            >
              <Text style={[styles.dayText, activeDay === day && styles.dayTextActive]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Resumen del Día */}
      <Text style={styles.summaryText}>8 citas programadas para hoy</Text>

      {/* Lista de Citas */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {mockAppointments.map((appt) => (
          <View key={appt.id} style={styles.appointmentCard}>
            
            <View style={styles.cardHeader}>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={16} color="#4B5563" style={styles.timeIcon} />
                <Text style={styles.timeText}>{appt.time}</Text>
              </View>
              {renderStatusBadge(appt.status)}
            </View>

            <View style={styles.patientInfoRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{appt.initials}</Text>
              </View>
              <View style={styles.patientDetails}>
                <Text style={styles.patientName}>{appt.patient}</Text>
                <Text style={styles.appointmentType}>{appt.type}</Text>
              </View>
            </View>

            <Text style={styles.reasonLabel}>Motivo:</Text>
            <Text style={styles.reasonText}>{appt.reason}</Text>

            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.actionBtnOutline}>
                <Text style={styles.actionBtnOutlineText}>Reprogramar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtnSolid}>
                <Text style={styles.actionBtnSolidText}>Iniciar Consulta</Text>
              </TouchableOpacity>
            </View>
            
          </View>
        ))}
      </ScrollView>

      {/* FAB (Botón Flotante) */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => console.log('Nueva Cita')}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Bottom Tabs (Visual) */}
      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Patients')}>
          <Ionicons name="people" size={24} color="#9CA3AF" />
          <Text style={styles.tabText}>Pacientes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="calendar" size={24} color="#2563EB" />
          <Text style={[styles.tabText, { color: '#2563EB' }]}>Citas</Text>
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
  calendarBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daysContainer: {
    marginBottom: 15,
  },
  daysScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  dayButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  dayButtonActive: {
    backgroundColor: '#2563EB',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  dayTextActive: {
    color: '#FFFFFF',
  },
  summaryText: {
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 15,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Espacio para FAB y Bottom Tabs
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: 6,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  patientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  appointmentType: {
    fontSize: 14,
    color: '#6B7280',
  },
  reasonLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 20,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionBtnOutline: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnOutlineText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '600',
  },
  actionBtnSolid: {
    flex: 1,
    height: 44,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnSolidText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
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