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

// Datos estáticos basados en tu diseño
const historyData = [
  {
    id: '1',
    type: 'Consulta General',
    date: '15 Ene 2024',
    description: 'Dolor de cabeza persistente. Prescripción de analgésicos.',
    doctor: 'Dr. Rodríguez',
    icon: 'medical',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB'
  },
  {
    id: '2',
    type: 'Chequeo Anual',
    date: '10 Dic 2023',
    description: 'Examen físico completo. Resultados normales.',
    doctor: 'Dr. López',
    icon: 'heart',
    iconBg: '#D1FAE5',
    iconColor: '#10B981'
  }
];

export default function PatientDetailScreen({ navigation }) {
  // Estado para controlar la pestaña activa (Historial, Citas, Fotos, Notas)
  const [activeTab, setActiveTab] = useState('Historial');

  const tabs = ['Historial', 'Citas', 'Fotos', 'Notas'];

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ficha del Paciente</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="ellipsis-vertical" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Tarjeta de Información del Paciente */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#D1D5DB" />
            </View>
            <View style={styles.patientDetails}>
              <Text style={styles.patientName}>María González</Text>
              <Text style={styles.patientId}>ID: 001234</Text>
              <Text style={styles.patientStatus}>Activo</Text>
            </View>
            <View style={styles.patientStats}>
              <Text style={styles.patientAge}>42 años</Text>
              <Text style={styles.patientGender}>Femenino</Text>
            </View>
          </View>
        </View>

        {/* Cajas de Estadísticas (Última Cita, Próxima, Total) */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Última Cita</Text>
            <Text style={styles.statValue}>15 Ene</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Próxima</Text>
            <Text style={[styles.statValue, { color: '#2563EB' }]}>22 Ene</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Citas</Text>
            <Text style={styles.statValue}>24</Text>
          </View>
        </View>

        {/* Pestañas de Navegación Interna */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contenido de la pestaña "Historial" */}
        {activeTab === 'Historial' && (
          <View style={styles.historyContainer}>
            {historyData.map((item) => (
              <View key={item.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <View style={styles.historyTitleRow}>
                    <View style={[styles.historyIconContainer, { backgroundColor: item.iconBg }]}>
                      <Ionicons name={item.icon} size={16} color={item.iconColor} />
                    </View>
                    <Text style={styles.historyTitle}>{item.type}</Text>
                  </View>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </View>
                
                <Text style={styles.historyDescription}>{item.description}</Text>
                
                <View style={styles.historyDoctorRow}>
                  <Ionicons name="person" size={14} color="#6B7280" style={{ marginRight: 6 }} />
                  <Text style={styles.historyDoctor}>{item.doctor}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

      </ScrollView>

      {/* Bottom Tabs (Visual) */}
      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="people" size={24} color="#2563EB" />
          <Text style={[styles.tabTextBottom, { color: '#2563EB' }]}>Pacientes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Appointments')}>
          <Ionicons name="calendar" size={24} color="#9CA3AF" />
          <Text style={styles.tabTextBottom}>Citas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings" size={24} color="#9CA3AF" />
          <Text style={styles.tabTextBottom}>Ajustes</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerIcon: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Espacio para el Bottom Tab
  },
  infoCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  patientId: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  patientStatus: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  patientStats: {
    alignItems: 'flex-end',
  },
  patientAge: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  patientGender: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  historyContainer: {
    marginTop: 10,
  },
  historyCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  historyDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  historyDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  historyDoctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDoctor: {
    fontSize: 14,
    color: '#6B7280',
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
  tabTextBottom: {
    fontSize: 12,
    marginTop: 4,
    color: '#9CA3AF',
  },
});