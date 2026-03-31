import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, Switch, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/useTheme';
import { cancelarCita, confirmarCita } from '../controllers/CitaController';
import { programarRecordatorioCita, notificacionInmediata } from '../controllers/NotificacionesController';

export default function RecordatorioDeCita({ navigation, route }) {
  const { darkMode, t } = useTheme();
  const cita = route?.params?.cita;
  const [r15min, setR15min] = useState(cita?.recordatorio === 1);
  const [r1hora, setR1hora] = useState(false);
  const [r1dia, setR1dia] = useState(false);
  const [estadoCita, setEstadoCita] = useState(cita?.estado || 'Pendiente');

  const [recordatoriosActivos, setRecordatoriosActivos] = useState({
    15: cita?.recordatorio === 1,
    60: false,
    1440: false,
  });

  const handleConfirmar = async () => {
    if (!cita?.id) return;
    const result = await confirmarCita(cita.id);
    if (result.success) {
      setEstadoCita('Confirmada');
      await notificacionInmediata(
        '✅ Cita Confirmada',
        `Cita con ${cita.paciente_nombre} el ${cita.fecha} a las ${cita.hora}`
      );
      Alert.alert('✅ Éxito', `La cita ha sido confirmada correctamente.`);
    }
  };

  const handleActivarRecordatorio = async (minutos, valor) => {
    setRecordatoriosActivos(prev => ({ ...prev, [minutos]: valor }));
    if (!valor) return;

    const result = await programarRecordatorioCita(cita, minutos);
    if (result.success) {
      const label = minutos === 15 ? '15 min' : minutos === 60 ? '1 hora' : '1 día';
      Alert.alert('🔔 Recordatorio Set', `Te avisaremos ${label} antes de la cita.`);
    } else {
      setRecordatoriosActivos(prev => ({ ...prev, [minutos]: false }));
      Alert.alert('Error', result.mensaje || 'No se pudo programar');
    }
  };

  const handleCancelar = async () => {
    Alert.alert('⚠️ Cancelar Cita', '¿Confirmas que deseas cancelar esta cita?', [
      { text: 'Volver', style: 'cancel' },
      {
        text: 'Sí, cancelar', style: 'destructive',
        onPress: async () => {
          const result = await cancelarCita(cita.id);
          if (result.success) {
            setEstadoCita('Cancelada');
            navigation.goBack();
          }
        },
      },
    ]);
  };

  if (!cita) return null;

  // Helpers visuales
  const getEstadoStyles = () => {
    switch(estadoCita) {
      case 'Confirmada': return { color: '#10B981', bg: '#10B98115' };
      case 'Cancelada': return { color: '#EF4444', bg: '#EF444415' };
      default: return { color: '#F59E0B', bg: '#F59E0B15' };
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />
      
      {/* Header Estilizado */}
      <View style={[styles.header, { borderBottomColor: t.separator }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={t.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.text }]}>Gestión de Cita</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditarCita', { cita })} style={styles.backBtn}>
          <Ionicons name="options-outline" size={22} color={t.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Ticket de Cita */}
        <View style={[styles.ticket, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={styles.ticketHeader}>
            <View style={[styles.statusBadge, { backgroundColor: getEstadoStyles().bg }]}>
              <Text style={[styles.statusText, { color: getEstadoStyles().color }]}>{estadoCita.toUpperCase()}</Text>
            </View>
            <Text style={[styles.ticketId, { color: t.textSub }]}>REF: #{cita.id.toString().padStart(4, '0')}</Text>
          </View>

          <View style={styles.dateTimeContainer}>
            <View style={[styles.dateBox, { backgroundColor: t.primary }]}>
              <Text style={styles.dateDay}>{cita.fecha?.split('-')[2] || '--'}</Text>
              <Text style={styles.dateMonth}>SÉP</Text> 
            </View>
            <View style={styles.timeInfo}>
              <Text style={[styles.timeText, { color: t.text }]}>{cita.hora}</Text>
              <Text style={[styles.durationText, { color: t.textSub }]}>Duración: 30 - 45 min</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: t.separator }]} />

          <View style={styles.patientSection}>
            <View style={[styles.avatarBox, { backgroundColor: t.bg3 }]}>
              <Ionicons name="person" size={24} color={t.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.patientName, { color: t.text }]}>{cita.paciente_nombre}</Text>
              <Text style={[styles.patientMeta, { color: t.textMuted }]}>Expediente: {cita.paciente_id}</Text>
            </View>
            <TouchableOpacity style={[styles.callBtn, { backgroundColor: t.primary }]}>
              <Ionicons name="call" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {cita.motivo && (
            <View style={[styles.motivoBox, { backgroundColor: t.bg3 }]}>
              <Text style={[styles.motivoTitle, { color: t.textSub }]}>MOTIVO DE CONSULTA</Text>
              <Text style={[styles.motivoContent, { color: t.text }]}>{cita.motivo}</Text>
            </View>
          )}
        </View>

        {/* Panel de Notificaciones */}
        <Text style={[styles.sectionTitle, { color: t.textSub }]}>RECORDATORIOS SMART</Text>
        <View style={[styles.reminderPanel, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <ReminderRow
            icon="notifications"
            label="15 minutos antes"
            desc="Ideal para preparación inmediata"
            value={r15min}
            activo={recordatoriosActivos[15]}
            onValueChange={(v) => { setR15min(v); handleActivarRecordatorio(15, v); }}
            t={t}
          />
          <View style={[styles.innerDivider, { backgroundColor: t.separator }]} />
          <ReminderRow
            icon="time"
            label="1 hora antes"
            desc="Revisión de expediente previo"
            value={r1hora}
            activo={recordatoriosActivos[60]}
            onValueChange={(v) => { setR1hora(v); handleActivarRecordatorio(60, v); }}
            t={t}
          />
          <View style={[styles.innerDivider, { backgroundColor: t.separator }]} />
          <ReminderRow
            icon="calendar"
            label="1 día antes"
            desc="Confirmación de agenda"
            value={r1dia}
            activo={recordatoriosActivos[1440]}
            onValueChange={(v) => { setR1dia(v); handleActivarRecordatorio(1440, v); }}
            t={t}
            last
          />
        </View>

        {/* Acciones Finales */}
        <View style={styles.actions}>
          {estadoCita === 'Pendiente' && (
            <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: t.primary }]} onPress={handleConfirmar}>
              <Text style={styles.btnTextWhite}>Confirmar Asistencia</Text>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            </TouchableOpacity>
          )}

          <View style={styles.row}>
            <TouchableOpacity 
              style={[styles.btnSecondary, { backgroundColor: t.card, borderColor: t.cardBorder }]}
              onPress={() => navigation.navigate('EditarCita', { cita })}
            >
              <Text style={[styles.btnText, { color: t.text }]}>Editar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.btnSecondary, { backgroundColor: '#EF444415', borderColor: '#EF444430' }]}
              onPress={handleCancelar}
            >
              <Text style={[styles.btnText, { color: '#EF4444' }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ReminderRow({ icon, label, desc, value, activo, onValueChange, t, last }) {
  return (
    <View style={styles.remRow}>
      <View style={[styles.remIconBox, { backgroundColor: activo ? t.primary + '15' : t.bg3 }]}>
        <Ionicons name={icon} size={20} color={activo ? t.primary : t.textMuted} />
      </View>
      <View style={{ flex: 1, marginRight: 10 }}>
        <Text style={[styles.remLabel, { color: t.text }]}>{label}</Text>
        <Text style={[styles.remDesc, { color: t.textMuted }]}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#D1D5DB', true: t.primary }}
        ios_backgroundColor="#D1D5DB"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  scroll: { padding: 20 },

  // Ticket Style
  ticket: { borderRadius: 24, borderWidth: 1, padding: 20, marginBottom: 25, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '800' },
  ticketId: { fontSize: 12, fontWeight: '600' },

  dateTimeContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  dateBox: { width: 60, height: 70, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  dateDay: { color: '#fff', fontSize: 24, fontWeight: '800' },
  dateMonth: { color: '#fff', fontSize: 12, fontWeight: '600', opacity: 0.9 },
  timeInfo: { marginLeft: 18 },
  timeText: { fontSize: 28, fontWeight: '800' },
  durationText: { fontSize: 13, fontWeight: '500' },

  divider: { height: 1, marginVertical: 20, borderStyle: 'dashed', borderRadius: 1 },
  
  patientSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatarBox: { width: 50, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  patientName: { fontSize: 18, fontWeight: '700' },
  patientMeta: { fontSize: 13 },
  callBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  motivoBox: { padding: 15, borderRadius: 16 },
  motivoTitle: { fontSize: 10, fontWeight: '800', marginBottom: 5, letterSpacing: 0.5 },
  motivoContent: { fontSize: 14, lineHeight: 20, fontWeight: '500' },

  // Reminders
  sectionTitle: { fontSize: 12, fontWeight: '800', marginBottom: 12, marginLeft: 5, letterSpacing: 1 },
  reminderPanel: { borderRadius: 24, borderWidth: 1, padding: 10, marginBottom: 30 },
  remRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  remIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  remLabel: { fontSize: 15, fontWeight: '700' },
  remDesc: { fontSize: 12, marginTop: 2 },
  innerDivider: { height: 1, marginLeft: 60 },

  // Actions
  actions: { gap: 12 },
  btnPrimary: { height: 56, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  btnTextWhite: { color: '#fff', fontSize: 16, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 12 },
  btnSecondary: { flex: 1, height: 52, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 15, fontWeight: '700' },
});