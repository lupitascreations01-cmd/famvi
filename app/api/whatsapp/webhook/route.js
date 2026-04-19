import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // necesitas esta key (no la anon)
)

// Interpreta la respuesta de mamá con lógica simple
// (puedes expandir esto con Claude AI después)
function clasificarRespuesta(texto) {
  const t = texto.toLowerCase().trim()

  // Botones rápidos de Twilio
  if (t === 'si' || t === 'sí' || t === '✅' || t === 'tome' || t === 'tomé' || t.includes('ya tome') || t.includes('ya tomé')) {
    return { estado: 'verde', resumen: 'Confirmó positivamente' }
  }

  // Snooze
  if (t.includes('recuérda') || t.includes('recuerda') || t.includes('1hr') || t.includes('después') || t.includes('despues') || t.includes('rato')) {
    return { estado: 'amarillo', resumen: 'Pidió recordatorio más tarde' }
  }

  // Señales de alerta
  if (t.includes('mal') || t.includes('dolor') || t.includes('cansad') || t.includes('no pued') || t.includes('ayuda')) {
    return { estado: 'rojo', resumen: 'Indicó que no se siente bien' }
  }

  // Respuestas positivas genéricas
  if (t.includes('bien') || t.includes('perfecto') || t.includes('claro') || t.includes('listo') || t.includes('ok')) {
    return { estado: 'verde', resumen: 'Respondió positivamente' }
  }

  // Respuestas neutras
  if (t.includes('más o menos') || t.includes('mas o menos') || t.includes('regular') || t.includes('ahí') || t.includes('ahi')) {
    return { estado: 'amarillo', resumen: 'Respuesta neutral' }
  }

  // Negaciones
  if (t === 'no' || t.includes('no tomé') || t.includes('no tome') || t.includes('olvidé') || t.includes('olvide')) {
    return { estado: 'rojo', resumen: 'No completó la actividad' }
  }

  // Cualquier otra respuesta = registrar como verde (respondió algo)
  return { estado: 'verde', resumen: 'Respondió al check-in' }
}

async function clasificarConClaude(texto, categoria) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: `Eres un asistente que analiza mensajes de personas mayores respondiendo check-ins de bienestar.

El familiar respondió al check-in de "${categoria}" con este mensaje: "${texto}"

Responde SOLO con un JSON así (sin markdown, sin explicación):
{"estado": "verde|amarillo|rojo", "resumen": "frase corta de lo que dijo"}

- verde = todo bien, confirmó actividad
- amarillo = no está seguro, pidió esperar, respuesta vaga  
- rojo = no hizo la actividad, se siente mal, no respondió`
        }]
      })
    })
    const data = await response.json()
    const raw = data.content[0].text.trim()
    return JSON.parse(raw)
  } catch {
    // Si Claude falla, usar clasificación simple
    return clasificarRespuesta(texto)
  }
}

async function enviarAlerta(hijoWhatsapp, nombreFamiliar, categoria, resumen) {
  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`
  const mensaje = `⚠️ Famvi: ${nombreFamiliar} no respondió bien el check-in de ${categoria}.\n\nRespuesta: ${resumen}\n\nRevisa el dashboard: https://famvi.vercel.app/dashboard`

  await fetch(twilioUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')
    },
    body: new URLSearchParams({
      From: process.env.TWILIO_WHATSAPP_FROM,
      To: `whatsapp:${hijoWhatsapp}`,
      Body: mensaje
    })
  })
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    
    const from = formData.get('From') // whatsapp:+56912345678
    const body = formData.get('Body') || ''
    
    if (!from || !body) {
      return new Response('OK', { status: 200 })
    }

    // Extraer número limpio
    const whatsappNumero = from.replace('whatsapp:', '').trim()

    // Buscar familiar por número de WhatsApp
    const { data: familiar, error: familiarError } = await supabase
      .from('familiares')
      .select(`
        id,
        nombre,
        usuario_id,
        usuarios (
          whatsapp,
          nombre
        )
      `)
      .eq('whatsapp', whatsappNumero)
      .eq('activo', true)
      .single()

    if (familiarError || !familiar) {
      console.log('Familiar no encontrado para:', whatsappNumero)
      // Responder igual para no dejar a mamá sin respuesta
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Message>Gracias por tu mensaje 💙 No encontramos tu registro. Pide a tu familiar que revise la configuración en Famvi.</Message>
        </Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      )
    }

    // Buscar el último check-in pendiente (enviado en las últimas 4 horas)
    const cuatroHorasAtras = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    const { data: checkinPendiente } = await supabase
      .from('checkins')
      .select('id, categoria')
      .eq('familiar_id', familiar.id)
      .eq('estado', 'pendiente')
      .gte('creado_en', cuatroHorasAtras)
      .order('creado_en', { ascending: false })
      .limit(1)
      .single()

    // Clasificar respuesta (con Claude si hay API key, sino lógica simple)
    let clasificacion
    if (process.env.ANTHROPIC_API_KEY && checkinPendiente) {
      clasificacion = await clasificarConClaude(body, checkinPendiente.categoria)
    } else {
      clasificacion = clasificarRespuesta(body)
    }

    // Guardar respuesta en checkins
    if (checkinPendiente) {
      await supabase
        .from('checkins')
        .update({
          respuesta: body,
          estado: clasificacion.estado,
          resumen: clasificacion.resumen,
          respondido_en: new Date().toISOString()
        })
        .eq('id', checkinPendiente.id)
    } else {
      // Mensaje espontáneo (mamá escribió sin que le preguntaran)
      await supabase
        .from('checkins')
        .insert({
          familiar_id: familiar.id,
          categoria: 'mensaje',
          respuesta: body,
          estado: clasificacion.estado,
          resumen: clasificacion.resumen
        })
    }

    // Si el estado es rojo, alertar al hijo
    if (clasificacion.estado === 'rojo' && familiar.usuarios?.whatsapp) {
      await enviarAlerta(
        familiar.usuarios.whatsapp,
        familiar.nombre,
        checkinPendiente?.categoria || 'bienestar',
        clasificacion.resumen
      )
    }

    // Respuesta a mamá según el estado
    let respuestaMama
    const primerNombre = familiar.nombre.split(' ')[0]

    if (clasificacion.estado === 'verde') {
      respuestaMama = `¡Perfecto ${primerNombre}! ✅ Quedó registrado. Tu familia puede ver que estás bien 💙`
    } else if (clasificacion.estado === 'amarillo') {
      respuestaMama = `Entendido ${primerNombre} 🕐 Te recordaré en un rato. ¡Cuídate mucho!`
    } else {
      respuestaMama = `Gracias por avisarme ${primerNombre} 💙 Le estoy avisando a tu familia ahora mismo. ¿Necesitas algo?`
    }

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Message>${respuestaMama}</Message>
      </Response>`,
      { headers: { 'Content-Type': 'text/xml' } }
    )

  } catch (error) {
    console.error('Error en webhook:', error)
    return new Response('OK', { status: 200 }) // Twilio necesita 200 siempre
  }
}

// Twilio verifica el webhook con GET
export async function GET() {
  return new Response('Famvi WhatsApp Webhook activo ✅', { status: 200 })
}