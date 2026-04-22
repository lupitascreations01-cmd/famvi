'use client'

import { useState, useEffect } from 'react'

const Logo = () => (
  <div style={{ width:'100%', textAlign:'center', marginBottom:'1rem' }}>
    <img src="/logo.png" alt="famvi" style={{ height:'50px', filter:'brightness(0) invert(1)' }} />
  </div>
)

const PLANES = [
  { nombre:'Básico', familiares:'1 familiar', mensual:9.99, anual:99, anualMes:8.25, urlMensual:'https://famvi.lemonsqueezy.com/checkout/buy/9d377591-719d-4d20-8d51-ad2b2e5f8656', urlAnual:null, color:'white', borde:'#E5E7EB', badge:null, bgBtn:'#2D6A4F', colorBtn:'white', features:['1 familiar monitoreado','Check-ins diarios por WhatsApp','Alertas inmediatas','Dashboard web','Historial 30 días'] },
  { nombre:'Familiar', familiares:'hasta 3 familiares', mensual:17.99, anual:179, anualMes:14.92, urlMensual:'https://famvi.lemonsqueezy.com/checkout/buy/118b895c-621b-49d9-be87-f30e0d8ab6c2', urlAnual:null, color:'#2D6A4F', borde:'#2D6A4F', badge:'Más popular', bgBtn:'#74C69D', colorBtn:'#1A1A2E', features:['Hasta 3 familiares','Check-ins diarios por WhatsApp','Alertas inmediatas','Dashboard web','Historial ilimitado','Reportes semanales'] },
  { nombre:'Premium', familiares:'hasta 6 familiares', mensual:24.99, anual:249, anualMes:20.75, urlMensual:'https://famvi.lemonsqueezy.com/checkout/buy/a8effdfa-461e-4a53-a354-ae17d6e291d5', urlAnual:null, color:'white', borde:'#E5E7EB', badge:null, bgBtn:'#2D6A4F', colorBtn:'white', features:['Hasta 6 familiares','Check-ins diarios por WhatsApp','Alertas inmediatas','Dashboard web','Historial ilimitado','Reportes semanales','Soporte prioritario'] }
]

export default function Precios() {
  const [ciclo, setCiclo] = useState('mensual')
  const [expirado, setExpirado] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setExpirado(params.get('expired') === 'true')
  }, [])

  const irACheckout = (plan) => {
    window.location.href = ciclo === 'anual' ? (plan.urlAnual || plan.urlMensual) : plan.urlMensual
  }

  return (
    <main style={{ minHeight:'100vh', background:'linear-gradient(135deg, #1A1A2E 0%, #2D6A4F 100%)', fontFamily:'sans-serif', padding:'2rem' }}>
      <div style={{ maxWidth:'600px', margin:'0 auto' }}>
        <div style={{ paddingTop:'2rem' }}><Logo /></div>
        <h2 style={{ color:'white', fontWeight:'400', fontSize:'1.5rem', textAlign:'center', marginBottom:'0.5rem' }}>Elige tu plan</h2>
        <p style={{ color:'rgba(255,255,255,0.6)', textAlign:'center', marginBottom:'1.5rem', fontSize:'0.9rem' }}>Sin contratos. Cancela cuando quieras.</p>

        {expirado && (
          <div style={{ background:'#FEE2E2', borderRadius:'12px', padding:'1rem', marginBottom:'1.5rem', textAlign:'center' }}>
            <p style={{ color:'#E76F51', fontSize:'0.88rem', margin:0 }}>⏰ Tu período de prueba ha terminado. Elige un plan para continuar usando Famvi.</p>
          </div>
        )}

        <div style={{ display:'flex', background:'rgba(255,255,255,0.1)', borderRadius:'50px', padding:'4px', maxWidth:'260px', margin:'0 auto 2rem' }}>
          <button onClick={() => setCiclo('mensual')} style={{ flex:1, padding:'0.6rem', borderRadius:'50px', border:'none', background:ciclo==='mensual'?'white':'transparent', color:ciclo==='mensual'?'#1A1A2E':'rgba(255,255,255,0.7)', fontWeight:'500', cursor:'pointer', fontSize:'0.88rem' }}>Mensual</button>
          <button onClick={() => setCiclo('anual')} style={{ flex:1, padding:'0.6rem', borderRadius:'50px', border:'none', background:ciclo==='anual'?'white':'transparent', color:ciclo==='anual'?'#1A1A2E':'rgba(255,255,255,0.7)', fontWeight:'500', cursor:'pointer', fontSize:'0.88rem' }}>
            Anual <span style={{ fontSize:'0.72rem', color:ciclo==='anual'?'#2D6A4F':'rgba(255,255,255,0.5)' }}>-17%</span>
          </button>
        </div>

        {PLANES.map(plan => (
          <div key={plan.nombre} style={{ background:plan.color, borderRadius:'20px', padding:'1.5rem', marginBottom:'1rem', border:`2px solid ${plan.borde}`, position:'relative' }}>
            {plan.badge && <span style={{ position:'absolute', top:'-12px', left:'50%', transform:'translateX(-50%)', background:'#74C69D', color:'#1A1A2E', padding:'0.25rem 1rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:'600' }}>{plan.badge}</span>}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
              <div>
                <h3 style={{ fontSize:'1.1rem', fontWeight:'600', color:plan.nombre==='Familiar'?'white':'#1A1A2E', marginBottom:'0.2rem' }}>{plan.nombre}</h3>
                <p style={{ fontSize:'0.82rem', color:plan.nombre==='Familiar'?'rgba(255,255,255,0.7)':'#6B7280' }}>{plan.familiares}</p>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:'1.8rem', fontWeight:'600', color:plan.nombre==='Familiar'?'#74C69D':'#2D6A4F', lineHeight:1 }}>${ciclo==='mensual'?plan.mensual:plan.anualMes}</div>
                <div style={{ fontSize:'0.75rem', color:plan.nombre==='Familiar'?'rgba(255,255,255,0.6)':'#6B7280' }}>/mes{ciclo==='anual'?' · cobrado anual':''}</div>
                {ciclo==='anual' && <div style={{ fontSize:'0.72rem', color:'#74C69D', fontWeight:'500' }}>Total ${plan.anual}/año</div>}
              </div>
            </div>
            <div style={{ marginBottom:'1.2rem' }}>
              {plan.features.map(f => (
                <div key={f} style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.4rem' }}>
                  <span style={{ color:'#74C69D', fontSize:'0.85rem' }}>✓</span>
                  <span style={{ fontSize:'0.83rem', color:plan.nombre==='Familiar'?'rgba(255,255,255,0.85)':'#4B5563' }}>{f}</span>
                </div>
              ))}
            </div>
            <button onClick={() => irACheckout(plan)} style={{ width:'100%', padding:'0.9rem', background:plan.bgBtn, color:plan.colorBtn, border:'none', borderRadius:'12px', fontSize:'0.95rem', fontWeight:'600', cursor:'pointer' }}>
              Elegir {plan.nombre} →
            </button>
          </div>
        ))}

        <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:'12px', padding:'1rem', marginBottom:'1rem', textAlign:'center' }}>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.82rem', margin:0 }}>🎁 Todos los planes incluyen <strong style={{ color:'#74C69D' }}>7 días gratis</strong> sin cargo.</p>
        </div>

        <button onClick={() => window.location.href='/'} style={{ width:'100%', padding:'0.75rem', background:'none', border:'none', color:'rgba(255,255,255,0.6)', fontSize:'0.85rem', cursor:'pointer' }}>← Volver</button>
      </div>
    </main>
  )
}