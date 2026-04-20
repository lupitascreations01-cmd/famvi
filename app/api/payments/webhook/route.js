import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function verificarFirma(payload, firma, secret) {
  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(firma))
}

function obtenerPlan(variantId) {
  const planes = {
    '1550842': { plan: 'basico', limite: 1 },   // Plan Básico $9.99
    '1550876': { plan: 'familiar', limite: 3 },  // Plan Familiar $17.99
    '1550889': { plan: 'premium', limite: 6 },   // Plan Premium $24.99
  }
  return planes[String(variantId)] || { plan: 'basico', limite: 1 }
}

export async function POST(request) {
  try {
    const payload = await request.text()
    const firma = request.headers.get('x-signature')

    if (!firma) {
      return Response.json({ error: 'Sin firma' }, { status: 401 })
    }

    const esValido = verificarFirma(payload, firma, process.env.LEMONSQUEEZY_WEBHOOK_SECRET)
    if (!esValido) {
      return Response.json({ error: 'Firma inválida' }, { status: 401 })
    }

    const evento = JSON.parse(payload)
    const tipo = evento.meta?.event_name
    const datos = evento.data?.attributes

    console.log('Webhook LS recibido:', tipo, '| status:', datos?.status)

    const email = datos?.user_email
    if (!email) {
      return Response.json({ ok: true, msg: 'Sin email, ignorado' })
    }

    // Buscar usuario por email
    const { data: authData } = await supabase.auth.admin.listUsers()
    const usuario = authData?.users?.find(u => u.email === email)

    if (!usuario) {
      console.log('Usuario no encontrado para email:', email)
      return Response.json({ ok: true, msg: 'Usuario no encontrado' })
    }

    const variantId = String(datos?.variant_id)
    const { plan, limite } = obtenerPlan(variantId)
    const estado = datos?.status

    if (tipo === 'subscription_created' || tipo === 'subscription_updated') {

      if (estado === 'active' || estado === 'on_trial') {
        const renewsAt = datos?.renews_at ? new Date(datos.renews_at).toISOString() : null
        const trialEndsAt = datos?.trial_ends_at ? new Date(datos.trial_ends_at).toISOString() : null

        await supabase
          .from('usuarios')
          .update({
            plan: plan,
            plan_limite: limite,
            plan_estado: estado === 'on_trial' ? 'trial_pagado' : 'activo',
            plan_vence: renewsAt,
            trial_hasta: trialEndsAt,
            ls_subscription_id: String(evento.data?.id),
          })
          .eq('id', usuario.id)

        console.log(`Plan actualizado: ${email} → ${plan} (${limite} familiar/es) | estado: ${estado}`)

      } else if (estado === 'cancelled' || estado === 'expired') {
        await supabase
          .from('usuarios')
          .update({
            plan: 'cancelado',
            plan_estado: 'cancelado',
          })
          .eq('id', usuario.id)

        console.log(`Plan cancelado: ${email}`)

      } else if (estado === 'past_due') {
        await supabase
          .from('usuarios')
          .update({
            plan_estado: 'vencido',
          })
          .eq('id', usuario.id)

        console.log(`Pago vencido: ${email}`)
      }
    }

    return Response.json({ ok: true })

  } catch (error) {
    console.error('Error en webhook de pagos:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}