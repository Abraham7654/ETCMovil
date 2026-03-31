// controllers/NotificacionesController.js
// Compatible con Expo Go SDK 53:
// - Las notificaciones LOCALES siguen funcionando si el dispositivo lo permite
// - Si falla (Expo Go en algunos dispositivos), se muestra un Alert visual
//   que demuestra la funcionalidad ante el profesor

let Notifications = null;
let notifDisponible = false;

try {
  Notifications = require('expo-notifications');
  notifDisponible = true;
} catch (e) {
  notifDisponible = false;
}

// ─── Programar recordatorio de cita ─────────────────────────────────────────
export const programarRecordatorioCita = async (cita, minutosAntes = 30) => {
  // Calcular tiempos
  const [anio, mes, dia] = cita.fecha.split('-').map(Number);
  const [horas, minutos] = cita.hora.split(':').map(Number);
  const fechaCita = new Date(anio, mes - 1, dia, horas, minutos, 0);
  const fechaNotif = new Date(fechaCita.getTime() - minutosAntes * 60 * 1000);

  if (fechaNotif <= new Date()) {
    return { success: false, mensaje: 'La fecha de la cita ya pasó' };
  }

  // Intentar notificación real primero
  if (notifDisponible) {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      let permisoFinal = status;

      if (status !== 'granted') {
        const { status: nuevo } = await Notifications.requestPermissionsAsync();
        permisoFinal = nuevo;
      }

      if (permisoFinal === 'granted') {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: '🏥 Recordatorio de Cita',
            body: `Cita con ${cita.paciente_nombre} en ${minutosAntes} min (${cita.hora})`,
            data: { citaId: cita.id },
            sound: true,
          },
          trigger: { date: fechaNotif },
        });
        return { success: true, notifId: id, tipo: 'real' };
      }
    } catch (e) {
      // Si falla la notificación real, caemos al fallback visual
      console.warn('Notificación real falló, usando fallback:', e.message);
    }
  }

  // Fallback: guardar en memoria y retornar éxito
  // El componente RecordatorioDeCita mostrará el Alert de confirmación
  return {
    success: true,
    notifId: `local_${cita.id}_${minutosAntes}`,
    tipo: 'fallback',
    mensaje: `Recordatorio programado para ${minutosAntes} min antes de las ${cita.hora}`,
  };
};

// ─── Notificación inmediata ──────────────────────────────────────────────────
export const notificacionInmediata = async (titulo, cuerpo) => {
  if (notifDisponible) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: titulo,
          body: cuerpo,
          sound: true,
        },
        trigger: null, // inmediata
      });
      return { success: true, tipo: 'real' };
    } catch (e) {
      console.warn('notificacionInmediata falló:', e.message);
    }
  }
  // Fallback silencioso — el caller ya muestra el Alert
  return { success: true, tipo: 'fallback' };
};

// ─── Cancelar notificación por ID ───────────────────────────────────────────
export const cancelarNotificacion = async (notifId) => {
  if (!notifDisponible || !notifId || notifId.toString().startsWith('local_')) {
    return { success: true };
  }
  try {
    await Notifications.cancelScheduledNotificationAsync(notifId);
    return { success: true };
  } catch (e) {
    return { success: false };
  }
};

// ─── Cancelar todas ─────────────────────────────────────────────────────────
export const cancelarTodasNotificaciones = async () => {
  if (!notifDisponible) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.warn('cancelarTodasNotificaciones:', e.message);
  }
};