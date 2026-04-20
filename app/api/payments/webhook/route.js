import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Verificar que el webhook viene de Lemon Squeezy
function verificarFirma(payload, firma, secret) {
  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(firma))
}

// Mapear variant ID al plan y límite de familiares
function obtenerPlan(variantId) {
  const planes = {
    '9d377591-719d-4d20-8d51-ad2b2e5f8656': { plan: 'basico', limite: 1 },
    '118b895c-621b-49d9-be87-f30e0d8ab6c2': { plan: 'familiar', limite: 3 },
    'a8effdfa-461e-4a53-a354-ae17d6e291d5': { plan: 'premium', limite: 6 },
  }
  return planes[variantId] || { plan: 'basico', limite: 1 }
}

export async function POST(request) {
  try {
    const payload = await request.text()
    const firma = request.headers.get('x-signature')

    if (!firma) {
      return Response.json({ error: 'Sin firma' }, { status: 401 })
    }

    // Verificar firma
    const esValido = verificarFirma(payload, firma, process.env.LEMONSQUEEZY_WEBHOOK_SECRET)
    if (!esValido) {
      return Response.json({ error: 'Firma inválida' }, { status: 401 })
    }

    const evento = JSON.parse(payload)
    const tipo = evento.meta?.event_name
    const datos = evento.data?.attributes

    console.log('Webhook LS recibido:', tipo)

    // Obtener email del cliente
    const email = datos?.user_email
    if (!email) {
      return Response.json({ ok: true, msg: 'Sin email, ignorado' })
    }

    // Buscar usuario en Supabase por email
    const { data: authUser } = await supabase.auth.admin.listUsers()
    const usuario = authUser?.users?.find(u => u.email === email)

    if (!usuario) {
      console.log('Usuario no encontrado para email:', email)
      return Response.json({ ok: true, msg: 'Usuario no encontrado' })
    }

    const variantId = String(datos?.variant_id)
    const { plan, limite } = obtenerPlan(variantId)
    const estado = datos?.status // active, cancelled, expired, past_due

    if (tipo === 'subscription_created' || tipo === 'subscription_updated') {
      if (estado === 'active') {
        // Calcular fecha de próximo pago (fin del período actual)
        const renewsAt = datos?.renews_at ? new Date(datos.renews_at).toISOString() : null

        await supabase
          .from('usuarios')
          .update({
            plan: plan,
            plan_limite: limite,
            plan_estado: 'activo',
            plan_vence: renewsAt,
            trial_hasta: null, // ya no está en trial
            ls_subscription_id: evento.data?.id,
          })
          .eq('id', usuario.id)

        console.log(`Plan actualizado: ${email} → ${plan} (${limite} familiares)`)

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