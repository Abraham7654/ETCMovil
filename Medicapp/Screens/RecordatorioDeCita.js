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

  // Mapa de recordatorios activos para mostrar estado visual
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
      // Notificación inmediata de confirmación
      await notificacionInmediata(
        '✅ Cita Confirmada',
        `Cita con ${cita.paciente_nombre} el ${cita.fecha} a las ${cita.hora}`
      );
      Alert.alert(
        '✅ Cita Confirmada',
        `La cita con ${cita.paciente_nombre} para el ${cita.fecha} a las ${cita.hora} ha sido confirmada.`
      );
    }
  };

  const handleActivarRecordatorio = async (minutos, valor) => {
    // Actualizar estado visual inmediatamente
    setRecordatoriosActivos(prev => ({ ...prev, [minutos]: valor }));

    if (!valor) {
      // Desactivado — solo actualizar UI
      return;
    }

    const result = await programarRecordatorioCita(cita, minutos);

    if (result.success) {
      // Mostrar confirmación visual siempre (funcione o no la notif del sistema)
      const labelMinutos =
        minutos === 15 ? '15 minutos' :
        minutos === 60 ? '1 hora' : '1 día';

      Alert.alert(
        '🔔 Recordatorio Activado',
        `Recibirás un aviso ${labelMinutos} antes de la cita a las ${cita.hora} del ${cita.fecha}.`,
        [{ text: 'Entendido' }]
      );
    } else {
      // Revertir switch si no se pudo programar
      setRecordatoriosActivos(prev => ({ ...prev, [minutos]: false }));
      if (minutos === 15) setR15min(false);
      if (minutos === 60) setR1hora(false);
      if (minutos === 1440) setR1dia(false);
      Alert.alert('Aviso', result.mensaje || 'No se pudo programar el recordatorio');
    }
  };

  const handleCancelar = async () => {
    if (!cita?.id) return;
    Alert.alert('Cancelar Cita', 'Esta acción no se puede deshacer.', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, cancelar', style: 'destructive',
        onPress: async () => {
          const result = await cancelarCita(cita.id);
          if (result.success) {
            setEstadoCita('Cancelada');
            Alert.alert('Cita cancelada', '', [{ text: 'OK', onPress: () => navigation.goBack() }]);
          }
        },
      },
    ]);
  };

  if (!cita) return null;

  const colorEstado =
    estadoCita === 'Confirmada' ? '#10B981' :
    estadoCita === 'Cancelada'  ? '#EF4444' : '#F59E0B';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar barStyle={t.statusBar} />
      <View style={[styles.header, { borderBottomColor: t.separator }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={t.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.text }]}>Recordatorio de Cita</Text>
        {/* Botón editar cita */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('EditarCita', { cita })}
        >
          <Ionicons name="create-outline" size={22} color={t.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Banner */}
        <View style={[styles.notifBanner, { backgroundColor: darkMode ? '#1E3A5F' : '#EFF6FF' }]}>
          <View style={[styles.notifIcon, { backgroundColor: t.primary }]}>
            <Ionicons name="notifications" size={20} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.notifTitle, { color: darkMode ? '#93C5FD' : '#1E40AF' }]}>
              Recordatorio de Cita Médica
            </Text>
            <Text style={[styles.notifSub, { color: darkMode ? '#60A5FA' : '#3B82F6' }]}>
              Cita con {cita.paciente_nombre} — {cita.fecha} a las {cita.hora}
            </Text>
          </View>
        </View>

        {/* Detalles */}
        <View style={[styles.citaCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={styles.citaCardHeader}>
            <Text style={[styles.citaCardTitle, { color: t.text }]}>Detalles de la Cita</Text>
            <Text style={[styles.confirmadaBadge, { color: colorEstado }]}>{estadoCita}</Text>
          </View>
          <View style={[styles.fechaBlock, { backgroundColor: t.bg3, borderColor: t.separator }]}>
            <Text style={[styles.fechaDia, { color: t.primary }]}>{cita.fecha?.split('-')[2] || '--'}</Text>
            <Text style={[styles.fechaMes, { color: t.primary }]}>{cita.fecha || 'Sin fecha'}</Text>
            <Text style={[styles.fechaHora, { color: t.text }]}>{cita.hora}</Text>
            <Text style={[styles.fechaDuracion, { color: t.textSub }]}>Consulta médica</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomColor: t.separator }]}>
            <View style={[styles.avatarSmall, { backgroundColor: t.bg3 }]}>
              <Ionicons name="person-circle-outline" size={24} color={t.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoName, { color: t.text }]}>{cita.paciente_nombre}</Text>
              <Text style={[styles.infoSub, { color: t.textMuted }]}>ID: {cita.paciente_id}</Text>
            </View>
            <TouchableOpacity style={[styles.phoneBtn, { backgroundColor: darkMode ? '#1E3A5F' : '#EFF6FF' }]}>
              <Ionicons name="call" size={18} color={t.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="medical-outline" size={16} color={t.textSub} style={styles.rowIcon} />
            <View>
              <Text style={[styles.detailLabel, { color: t.text }]}>{cita.motivo || 'Sin motivo especificado'}</Text>
              <Text style={[styles.detailSub, { color: t.textSub }]}>Doctor: {cita.doctor}</Text>
            </View>
          </View>
          {cita.notas ? (
            <View style={styles.detailRow}>
              <Ionicons name="document-text-outline" size={16} color={t.textSub} style={styles.rowIcon} />
              <Text style={[styles.detailLabel, { color: t.text }]}>{cita.notas}</Text>
            </View>
          ) : null}
        </View>

        {/* Recordatorios */}
        <View style={[styles.reminderCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={styles.reminderTitleRow}>
            <Ionicons name="alarm-outline" size={18} color={t.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.reminderTitle, { color: t.text }]}>Opciones de Recordatorio</Text>
          </View>

          <ReminderRow
            icon="notifications-outline"
            label="15 minutos antes"
            value={r15min}
            activo={recordatoriosActivos[15]}
            onValueChange={(v) => { setR15min(v); handleActivarRecordatorio(15, v); }}
            t={t}
          />
          <ReminderRow
            icon="time-outline"
            label="1 hora antes"
            value={r1hora}
            activo={recordatoriosActivos[60]}
            onValueChange={(v) => { setR1hora(v); handleActivarRecordatorio(60, v); }}
            t={t}
          />
          <ReminderRow
            icon="calendar-outline"
            label="1 día antes"
            value={r1dia}
            activo={recordatoriosActivos[1440]}
            onValueChange={(v) => { setR1dia(v); handleActivarRecordatorio(1440, v); }}
            t={t}
            noBorder
          />
        </View>

        {/* Acciones */}
        <View style={styles.actionsContainer}>
          {estadoCita !== 'Confirmada' && estadoCita !== 'Cancelada' && (
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: t.primary }]} onPress={handleConfirmar}>
              <Ionicons name="checkmark" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.primaryBtnText}>Confirmar Cita</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.editCitaBtn, { borderColor: t.primary, backgroundColor: darkMode ? '#0C2340' : '#EFF6FF' }]}
            onPress={() => navigation.navigate('EditarCita', { cita })}
          >
            <Ionicons name="create-outline" size={18} color={t.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.editCitaBtnText, { color: t.primary }]}>Editar Cita</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.secondaryBtn, { borderColor: t.cardBorder }]}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={18} color={t.text} style={{ marginRight: 8 }} />
            <Text style={[styles.secondaryBtnText, { color: t.text }]}>Volver</Text>
          </TouchableOpacity>

          {estadoCita !== 'Cancelada' && (
            <TouchableOpacity
              style={[styles.dangerBtn, {
                borderColor: darkMode ? '#7F1D1D' : '#FEE2E2',
                backgroundColor: darkMode ? '#1C0A0A' : '#FFF5F5',
              }]}
              onPress={handleCancelar}
            >
              <Ionicons name="close-circle-outline" size={18} color="#EF4444" style={{ marginRight: 8 }} />
              <Text style={styles.dangerBtnText}>Cancelar Cita</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ReminderRow({ icon, label, value, activo, onValueChange, noBorder, t }) {
  return (
    <View style={[styles.reminderRow, !noBorder && { borderBottomWidth: 1, borderBottomColor: t.separator }]}>
      <Ionicons name={icon} size={18} color={activo ? t.primary : t.textMuted} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.reminderLabel, { color: t.text }]}>{label}</Text>
        {activo && (
          <Text style={[styles.reminderActivo, { color: t.primary }]}>● Recordatorio activo</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E5E7EB', true: t.primary }}
        thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  editBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 16, paddingBottom: 40 },
  notifBanner: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: 14, padding: 14, marginBottom: 16 },
  notifIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  notifTitle: { fontSize: 14, fontWeight: '700' },
  notifSub: { fontSize: 12, marginTop: 2, lineHeight: 16 },
  citaCard: { borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 16 },
  citaCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  citaCardTitle: { fontSize: 16, fontWeight: '700' },
  confirmadaBadge: { fontWeight: '700', fontSize: 13 },
  fechaBlock: { borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 14, borderWidth: 1 },
  fechaDia: { fontSize: 40, fontWeight: '800' },
  fechaMes: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  fechaHora: { fontSize: 20, fontWeight: '700' },
  fechaDuracion: { fontSize: 13, marginTop: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1 },
  avatarSmall: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  infoName: { fontSize: 15, fontWeight: '700' },
  infoSub: { fontSize: 12 },
  phoneBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  rowIcon: { marginRight: 8, marginTop: 2 },
  detailLabel: { fontSize: 14, fontWeight: '600' },
  detailSub: { fontSize: 12, marginTop: 2 },
  reminderCard: { borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 16 },
  reminderTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  reminderTitle: { fontSize: 15, fontWeight: '700' },
  reminderRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  reminderLabel: { fontSize: 14, fontWeight: '500' },
  reminderActivo: { fontSize: 11, marginTop: 2 },
  actionsContainer: { gap: 10 },
  primaryBtn: { height: 52, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  editCitaBtn: { height: 50, borderWidth: 1.5, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  editCitaBtnText: { fontWeight: '700', fontSize: 14 },
  secondaryBtn: { height: 50, borderWidth: 1, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { fontWeight: '600', fontSize: 14 },
  dangerBtn: { height: 50, borderWidth: 1, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  dangerBtnText: { color: '#EF4444', fontWeight: '600', fontSize: 14 },
});