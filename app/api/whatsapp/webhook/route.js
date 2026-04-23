import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function clasificarRespuesta(texto) {
  const t = texto.toLowerCase().trim()

  if (t === 'si' || t === 'sí' || t === '✅' || t === 'tome' || t === 'tomé' || t.includes('ya tome') || t.includes('ya tomé')) {
    return { estado: 'verde', resumen: 'Confirmó positivamente' }
  }
  if (t.includes('recuérda') || t.includes('recuerda') || t.includes('1hr') || t.includes('después') || t.includes('despues') || t.includes('rato')) {
    return { estado: 'amarillo', resumen: 'Pidió recordatorio más tarde' }
  }
  if (t.includes('mal') || t.includes('dolor') || t.includes('cansad') || t.includes('no pued') || t.includes('ayuda')) {
    return { estado: 'rojo', resumen: 'Indicó que no se siente bien' }
  }
  if (t.includes('bien') || t.includes('perfecto') || t.includes('claro') || t.includes('listo') || t.includes('ok')) {
    return { estado: 'verde', resumen: 'Respondió positivamente' }
  }
  if (t.includes('más o menos') || t.includes('mas o menos') || t.includes('regular') || t.includes('ahí') || t.includes('ahi')) {
    return { estado: 'amarillo', resumen: 'Respuesta neutral' }
  }
  if (t === 'no' || t.includes('no tomé') || t.includes('no tome') || t.includes('olvidé') || t.includes('olvide')) {
    return { estado: 'rojo', resumen: 'No completó la actividad' }
  }
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
    const from = formData.get('From')
    const body = formData.get('Body') || ''

    if (!from || !body) {
      return new Response('OK', { status: 200 })
    }

    const whatsappNumero = from.replace('whatsapp:', '').trim()

    // Buscar familiar
    const { data: familiar, error: familiarError } = await supabase
      .from('familiares')
      .select(`
        id,
        nombre,
        usuario_id,
        bienvenida_enviada,
        usuarios (
          whatsapp,
          nombre
        )
      `)
      .eq('whatsapp', whatsappNumero)
      .eq('activo', true)
      .single()

    if (familiarError || !familiar) {
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Message>Gracias por tu mensaje 💙 No encontramos tu registro. Pide a tu familiar que revise la configuración en Famvi.</Message>
        </Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      )
    }

    const primerNombre = familiar.nombre.split(' ')[0]

    // — BIENVENIDA: solo si es la primera vez —
    if (!familiar.bienvenida_enviada) {
      await supabase
        .from('familiares')
        .update({ bienvenida_enviada: true })
        .eq('id', familiar.id)

      const mensajeBienvenida = `¡Hola ${primerNombre}! 👋 Soy Famvi. Tu familia me pidió que te acompañe, de vez en cuando te voy a escribir por aquí para saber cómo te sientes, si comiste bien, si tomaste tus medicinas... No tienes que instalar nada — solo respóndeme aquí en WhatsApp cuando te escriba 💙 Pronto recibirás tu primer check-in. ¡Que tengas un lindo día!`

      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Message>${mensajeBienvenida}</Message>
        </Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      )
    }

    // — FLUJO NORMAL: clasificar respuesta —
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

    let clasificacion
    if (process.env.ANTHROPIC_API_KEY && checkinPendiente) {
      clasificacion = await clasificarConClaude(body, checkinPendiente.categoria)
    } else {
      clasificacion = clasificarRespuesta(body)
    }

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

    if (clasificacion.estado === 'rojo' && familiar.usuarios?.whatsapp) {
      await enviarAlerta(
        familiar.usuarios.whatsapp,
        familiar.nombre,
        checkinPendiente?.categoria || 'bienestar',
        clasificacion.resumen
      )
    }

    let respuestaMama
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
    return new Response('OK', { status: 200 })
  }
}

export async function GET() {
  return new Response('Famvi WhatsApp Webhook activo ✅', { status: 200 })
}