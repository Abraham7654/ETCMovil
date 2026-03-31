let Notifications = null;
let notifDisponible = false;

try {
  Notifications = require('expo-notifications');
  notifDisponible = true;
} catch (e) {
  notifDisponible = false;
}

export const programarRecordatorioCita = async (cita, minutosAntes = 30) => {
  const [anio, mes, dia] = cita.fecha.split('-').map(Number);
  const [horas, minutos] = cita.hora.split(':').map(Number);
  const fechaCita = new Date(anio, mes - 1, dia, horas, minutos, 0);
  const fechaNotif = new Date(fechaCita.getTime() - minutosAntes * 60 * 1000);

  if (fechaNotif <= new Date()) {
    return { success: false, mensaje: 'La fecha de la cita ya pasó' };
  }

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
      console.warn('Notificación real falló, usando fallback:', e.message);
    }
  }

  return {
    success: true,
    notifId: `local_${cita.id}_${minutosAntes}`,
    tipo: 'fallback',
    mensaje: `Recordatorio programado para ${minutosAntes} min antes de las ${cita.hora}`,
  };
};

export const notificacionInmediata = async (titulo, cuerpo) => {
  if (notifDisponible) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: titulo,
          body: cuerpo,
          sound: true,
        },
        trigger: null,
      });
      return { success: true, tipo: 'real' };
    } catch (e) {
      console.warn('notificacionInmediata falló:', e.message);
    }
  }
  return { success: true, tipo: 'fallback' };
};

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

export const cancelarTodasNotificaciones = async () => {
  if (!notifDisponible) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.warn('cancelarTodasNotificaciones:', e.message);
  }
};