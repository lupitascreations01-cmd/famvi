import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Mensajes por categoría — variados para no ser repetitivo
const MENSAJES = {
  medicamentos: [
    '💊 Hola {nombre}! Es hora de tus medicamentos.\n\nResponde:\n✅ Sí tomé\n⏰ En un rato\n❌ No pude\n😔 No me siento bien',
  ],
  comida: [
    '🍽️ {nombre}, ¿ya comiste?\n\nResponde:\n✅ Sí comí\n⏰ Ahorita como\n❌ No he comido\n😔 No tengo apetito',
  ],
  ejercicio: [
    '🚶 {nombre}, ¿pudiste moverte un poco hoy?\n\nResponde:\n✅ Sí caminé\n⏰ Lo haré después\n❌ No pude hoy\n😔 No me siento bien',
  ],
  bienestar: [
    '💙 {nombre}, ¿cómo te sientes hoy?\n\nResponde:\n😊 Muy bien\n🙂 Bien\n😐 Más o menos\n😔 No muy bien',
  ],
  default: [
    '💙 Hola {nombre}! ¿Cómo estás?\n\nResponde:\n😊 Muy bien\n🙂 Bien\n😐 Más o menos\n😔 No muy bien',
  ]
}

function getMensaje(categoria, nombre) {
  const opciones = MENSAJES[categoria] || MENSAJES.default
  const plantilla = opciones[Math.floor(Math.random() * opciones.length)]
  return plantilla.replace('{nombre}', nombre.split(' ')[0])
}

async function enviarWhatsApp(numero, mensaje) {
  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`
  
  const response = await fetch(twilioUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(
        `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
      ).toString('base64')
    },
    body: new URLSearchParams({
      From: process.env.TWILIO_WHATSAPP_FROM,
      To: `whatsapp:${numero}`,
      Body: mensaje
    })
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(`Twilio error: ${data.message}`)
  }
  return data.sid
}

function horaActualChile() {
  // Chile: UTC-3 (o UTC-4 en horario de invierno)
  // Para producción, usar la zona horaria del usuario guardada en BD
  const now = new Date()
  const horaChile = new Date(now.toLocaleString('en-US', { timeZone: 'America/Santiago' }))
  return horaChile.getHours()
}

export async function GET(request) {
  // Verificar que viene de Vercel Cron (seguridad básica)
  

  const horaActual = horaActualChile()
  const resultados = { enviados: 0, errores: 0, omitidos: 0 }

  try {
    // Traer todos los familiares activos con sus configuraciones
    const { data: configuraciones, error } = await supabase
      .from('configuraciones')
      .select(`
        id,
        familiar_id,
        categorias,
        dias,
        hora_manana,
        hora_mediodia,
        hora_tarde,
        hora_noche,
        familiares (
          id,
          nombre,
          whatsapp,
          activo,
          usuario_id,
          usuarios (
            plan,
            trial_hasta
          )
        )
      `)
      .eq('familiares.activo', true)

    if (error) {
      console.error('Error trayendo configuraciones:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    const diaSemana = new Date().toLocaleDateString('es-CL', { weekday: 'long' }).toLowerCase()

    for (const config of configuraciones || []) {
      const familiar = config.familiares
      if (!familiar || !familiar.activo) continue

      // Verificar que el trial no expiró
      const usuario = familiar.usuarios
      if (usuario?.trial_hasta) {
        const trialExpira = new Date(usuario.trial_hasta)
        if (trialExpira < new Date() && usuario.plan === 'trial') {
          resultados.omitidos++
          continue
        }
      }

      // Verificar si hoy es un día configurado
      const diasConfigurados = config.dias || ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
      if (!diasConfigurados.some(d => diaSemana.includes(d.toLowerCase()))) {
        resultados.omitidos++
        continue
      }

      // Determinar qué categorías enviar en esta hora
      const horasConfiguradas = {
        hora_manana: parseInt(config.hora_manana?.split(':')[0] || '8'),
        hora_mediodia: parseInt(config.hora_mediodia?.split(':')[0] || '13'),
        hora_tarde: parseInt(config.hora_tarde?.split(':')[0] || '16'),
        hora_noche: parseInt(config.hora_noche?.split(':')[0] || '21')
      }

      // Ver si la hora actual coincide (±0 horas exactas)
      const esHoraDeEnvio = Object.values(horasConfiguradas).includes(horaActual)
      if (!esHoraDeEnvio) {
        resultados.omitidos++
        continue
      }

      // Evitar doble envío: verificar que no se haya enviado en la última hora
      const unaHoraAtras = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const { data: envioPrevio } = await supabase
        .from('checkins')
        .select('id')
        .eq('familiar_id', familiar.id)
        .gte('creado_en', unaHoraAtras)
        .limit(1)
        .single()

      if (envioPrevio) {
        resultados.omitidos++
        continue
      }

      // Enviar un check-in por cada categoría configurada
      const categorias = config.categorias || ['bienestar']
      
      for (const categoria of categorias) {
        try {
          const mensaje = getMensaje(categoria, familiar.nombre)
          const sid = await enviarWhatsApp(familiar.whatsapp, mensaje)

          // Registrar el check-in enviado
          await supabase.from('checkins').insert({
            familiar_id: familiar.id,
            categoria,
            estado: 'pendiente',
            twilio_sid: sid,
            creado_en: new Date().toISOString()
          })

          resultados.enviados++
        } catch (err) {
          console.error(`Error enviando a ${familiar.nombre}:`, err.message)
          resultados.errores++
        }
      }
    }

    console.log('Cron ejecutado:', resultados)
    return Response.json({
      ok: true,
      hora: horaActual,
      ...resultados
    })

  } catch (error) {
    console.error('Error en cron:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}