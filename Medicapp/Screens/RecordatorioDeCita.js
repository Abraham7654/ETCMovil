import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RecordatorioDeCita({ navigation }) {
  const [r15min, setR15min] = useState(true);
  const [r1hora, setR1hora] = useState(false);
  const [r1dia, setR1dia] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recordatorio de Cita</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Banner de Notificación Simulado */}
        <View style={styles.notifBanner}>
          <View style={styles.notifIcon}>
            <Ionicons name="notifications" size={20} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.notifTitle}>Recordatorio Próximo</Text>
            <Text style={styles.notifSub}>
              Cita con María González mañana a las 10:30 AM
            </Text>
            <Text style={styles.notifTime}>Hace 2 minutos</Text>
          </View>
        </View>

        {/* Tarjeta de Detalles */}
        <View style={styles.citaCard}>
          <View style={styles.citaCardHeader}>
            <Text style={styles.citaCardTitle}>Detalles de la Cita</Text>
            <Text style={styles.confirmadaBadge}>Confirmada</Text>
          </View>

          <View style={styles.fechaBlock}>
            <Text style={styles.fechaDia}>15</Text>
            <Text style={styles.fechaMes}>Marzo 2024</Text>
            <Text style={styles.fechaHora}>10:30 AM</Text>
            <Text style={styles.fechaDuracion}>45 minutos de duración</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.avatarSmall}>
              <Ionicons name="person-circle-outline" size={24} color="#9CA3AF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoName}>María González</Text>
              <Text style={styles.infoSub}>ID: 001234</Text>
            </View>
            <TouchableOpacity style={styles.phoneBtn}>
              <Ionicons name="call" size={18} color="#2563EB" />
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#6B7280" style={styles.rowIcon} />
            <View>
              <Text style={styles.detailLabel}>Centro Médico San Rafael</Text>
              <Text style={styles.detailSub}>Piso 3, Consultorio 301</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="medical-outline" size={16} color="#6B7280" style={styles.rowIcon} />
            <View>
              <Text style={styles.detailLabel}>Control de rutina</Text>
              <Text style={styles.detailSub}>Consulta general</Text>
            </View>
          </View>
        </View>

        {/* Opciones de Recordatorio */}
        <View style={styles.reminderCard}>
          <Text style={styles.reminderTitle}>Opciones de Recordatorio</Text>

          <ReminderRow
            icon="notifications-outline" label="15 minutos antes"
            value={r15min} onValueChange={setR15min}
          />
          <ReminderRow
            icon="time-outline" label="1 hora antes"
            value={r1hora} onValueChange={setR1hora}
          />
          <ReminderRow
            icon="calendar-outline" label="1 día antes"
            value={r1dia} onValueChange={setR1dia}
            noBorder
          />
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="checkmark" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>Entendido</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn}>
            <Ionicons name="calendar-outline" size={18} color="#374151" style={{ marginRight: 8 }} />
            <Text style={styles.secondaryBtnText}>Reprogramar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dangerBtn}>
            <Ionicons name="close-circle-outline" size={18} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={styles.dangerBtnText}>Cancelar Cita</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Componente Auxiliar para las filas de Switch ---
function ReminderRow({ icon, label, value, onValueChange, noBorder }) {
  return (
    <View style={[styles.reminderRow, !noBorder && styles.reminderRowBorder]}>
      <Ionicons name={icon} size={18} color={value ? '#2563EB' : '#9CA3AF'} style={{ marginRight: 12 }} />
      <Text style={styles.reminderLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
        thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 16, 
    paddingVertical: 12,
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6',
  },
  backBtn: { 
    width: 40, 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#111827' 
  },
  scroll: { 
    padding: 16, 
    paddingBottom: 40 
  },
  notifBanner: {
    flexDirection: 'row', 
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF', 
    borderRadius: 14, 
    padding: 14, 
    marginBottom: 16,
  },
  notifIcon: {
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    backgroundColor: '#2563EB',
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12,
  },
  notifTitle: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#1E40AF' 
  },
  notifSub: { 
    fontSize: 12, 
    color: '#3B82F6', 
    marginTop: 2, 
    lineHeight: 16 
  },
  notifTime: { 
    fontSize: 11, 
    color: '#93C5FD', 
    marginTop: 4 
  },
  citaCard: {
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    borderRadius: 16,
    padding: 16, 
    marginBottom: 16,
  },
  citaCardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 12 
  },
  citaCardTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#111827' 
  },
  confirmadaBadge: { 
    color: '#10B981', 
    fontWeight: '700', 
    fontSize: 13 
  },
  fechaBlock: {
    backgroundColor: '#F9FAFB', 
    borderRadius: 12, 
    padding: 16,
    alignItems: 'center', 
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  fechaDia: { 
    fontSize: 40, 
    fontWeight: '800', 
    color: '#2563EB' 
  },
  fechaMes: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#2563EB', 
    marginBottom: 6 
  },
  fechaHora: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#111827' 
  },
  fechaDuracion: { 
    fontSize: 13, 
    color: '#6B7280', 
    marginTop: 2 
  },
  infoRow: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 12, 
    paddingBottom: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6',
  },
  avatarSmall: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#F3F4F6', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 10 
  },
  infoName: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#111827' 
  },
  infoSub: { 
    fontSize: 12, 
    color: '#9CA3AF' 
  },
  phoneBtn: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: '#EFF6FF', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  detailRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 10 
  },
  rowIcon: { 
    marginRight: 8, 
    marginTop: 2 
  },
  detailLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#111827' 
  },
  detailSub: { 
    fontSize: 12, 
    color: '#6B7280', 
    marginTop: 2 
  },
  reminderCard: {
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    borderRadius: 16,
    padding: 16, 
    marginBottom: 16,
  },
  reminderTitle: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#111827', 
    marginBottom: 12 
  },
  reminderRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 10,
  },
  reminderRowBorder: { 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6' 
  },
  reminderLabel: { 
    flex: 1, 
    fontSize: 14, 
    color: '#374151', 
    fontWeight: '500' 
  },
  actionsContainer: { 
    gap: 10 
  },
  primaryBtn: {
    height: 52, 
    backgroundColor: '#2563EB', 
    borderRadius: 14,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  primaryBtnText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 15 
  },
  secondaryBtn: {
    height: 50, 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    borderRadius: 14,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  secondaryBtnText: { 
    color: '#374151', 
    fontWeight: '600', 
    fontSize: 14 
  },
  dangerBtn: {
    height: 50, 
    borderWidth: 1, 
    borderColor: '#FEE2E2', 
    borderRadius: 14,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
  },
  dangerBtnText: { 
    color: '#EF4444', 
    fontWeight: '600', 
    fontSize: 14 
  },
});