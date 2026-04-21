'use client'
import { useState } from 'react'

const Logo = () => (
  <div style={{ textAlign:'center', marginBottom:'0.5rem' }}>
    <img src="/logo.png" alt="famvi" style={{ height:'80px', filter:'brightness(0) invert(1)' }} />
  </div>
)

export default function Home() {
  const [pantalla, setPantalla] = useState('landing')

  if (pantalla === 'como-funciona') {
    return (
      <main style={{ minHeight:'100vh', background:'linear-gradient(135deg, #1A1A2E 0%, #2D6A4F 100%)', fontFamily:'sans-serif', padding:'2rem' }}>
        <div style={{ maxWidth:'500px', margin:'0 auto' }}>
          <div style={{ paddingTop:'2rem', marginBottom:'1rem' }}><Logo /></div>
          <p style={{ color:'rgba(255,255,255,0.6)', textAlign:'center', marginBottom:'2rem', fontStyle:'italic' }}>¿Cómo funciona?</p>
          {[['1','Tú configuras en 5 minutos','Agregas a tu familiar, eliges qué monitorear y a qué horas enviar los check-ins.'],['2','Tu familiar recibe mensajes en WhatsApp','Nada que instalar. Solo responde botones simples desde su WhatsApp de siempre.'],['3','Tú ves el resumen en tu dashboard','Cada día ves cómo estuvo — qué respondió, cómo se sintió, si comió bien.'],['4','Alerta si algo falla','Si tu familiar no responde, recibes una notificación inmediata en tu WhatsApp.']].map(([num, titulo, desc]) => (
            <div key={num} style={{ background:'rgba(255,255,255,0.08)', borderRadius:'16px', padding:'1.2rem', marginBottom:'1rem', display:'flex', gap:'1rem', border:'1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'#74C69D', color:'#1A1A2E', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'600', fontSize:'0.85rem', flexShrink:0 }}>{num}</div>
              <div>
                <h4 style={{ color:'white', fontSize:'0.95rem', fontWeight:'500', marginBottom:'0.3rem' }}>{titulo}</h4>
                <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.82rem', lineHeight:'1.5' }}>{desc}</p>
              </div>
            </div>
          ))}
          <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:'20px', padding:'1.2rem', margin:'1.5rem 0', border:'1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.75rem', textAlign:'center', marginBottom:'1rem', textTransform:'uppercase', letterSpacing:'1px' }}>Lo que ve tu familiar</p>
            <div style={{ borderRadius:'12px', overflow:'hidden', maxWidth:'300px', margin:'0 auto' }}>
              <div style={{ background:'#075E54', padding:'0.7rem 1rem', display:'flex', alignItems:'center', gap:'0.6rem' }}>
                <div style={{ width:'32px', height:'32px', background:'#25D366', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem' }}>🤖</div>
                <div>
                  <div style={{ color:'white', fontSize:'0.85rem', fontWeight:'500' }}>Famvi</div>
                  <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.7rem' }}>en línea</div>
                </div>
              </div>
              <div style={{ background:'#ECE5DD', padding:'1rem' }}>
                <div style={{ background:'white', borderRadius:'12px 12px 12px 2px', padding:'0.6rem 0.8rem', maxWidth:'85%', boxShadow:'0 1px 3px rgba(0,0,0,0.1)', marginBottom:'0.75rem' }}>
                  <p style={{ fontSize:'0.8rem', color:'#1A1A2E', lineHeight:'1.4', margin:0 }}>¡Buenos días, María! 🌸<br/>¿Ya tomaste tus medicinas de la mañana?</p>
                  <p style={{ fontSize:'0.65rem', color:'#6B7280', margin:'0.2rem 0 0', textAlign:'right' }}>8:00 AM ✓✓</p>
                </div>
                <div style={{ display:'flex', gap:'0.4rem' }}>
                  <button style={{ background:'#25D366', color:'white', border:'none', padding:'0.4rem 0.7rem', borderRadius:'8px', fontSize:'0.72rem', cursor:'pointer' }}>✅ Sí, ya las tomé</button>
                  <button style={{ background:'#25D366', color:'white', border:'none', padding:'0.4rem 0.7rem', borderRadius:'8px', fontSize:'0.72rem', cursor:'pointer' }}>⏰ Recuérdame</button>
                </div>
              </div>
            </div>
          </div>
          <button onClick={() => window.location.href='/login'} style={{ width:'100%', padding:'1rem', background:'#74C69D', color:'#1A1A2E', border:'none', borderRadius:'50px', fontSize:'1rem', fontWeight:'600', cursor:'pointer', marginTop:'0.5rem' }}>Comenzar gratis →</button>
          <button onClick={() => setPantalla('landing')} style={{ width:'100%', padding:'0.75rem', background:'none', border:'none', color:'rgba(255,255,255,0.6)', fontSize:'0.85rem', cursor:'pointer', marginTop:'0.5rem' }}>← Volver</button>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight:'100vh', background:'linear-gradient(135deg, #1A1A2E 0%, #2D6A4F 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif', padding:'2rem' }}>
      <Logo />
      <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'1.05rem', fontStyle:'italic', marginBottom:'2.5rem' }}>para los que cuidan desde lejos</p>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', width:'100%', maxWidth:'320px' }}>
        <button onClick={() => window.location.href='/login'} style={{ width:'100%', padding:'1rem', background:'#74C69D', color:'#1A1A2E', border:'2px solid #74C69D', borderRadius:'50px', fontSize:'0.95rem', fontWeight:'600', cursor:'pointer' }}>Comenzar prueba gratis — 7 días →</button>
        <button onClick={() => window.location.href='/precios'} style={{ width:'100%', padding:'1rem', background:'transparent', color:'#ffffff', border:'2px solid #ffffff', borderRadius:'50px', fontSize:'1rem', fontWeight:'500', cursor:'pointer' }}>Ver planes y precios</button>
        <button onClick={() => setPantalla('como-funciona')} style={{ width:'100%', padding:'0.75rem', background:'transparent', color:'rgba(255,255,255,0.7)', border:'none', fontSize:'0.88rem', cursor:'pointer' }}>Ver cómo funciona ↓</button>
        <button onClick={() => window.location.href='/login'} style={{ width:'100%', padding:'0.5rem', background:'transparent', color:'rgba(255,255,255,0.5)', border:'none', fontSize:'0.85rem', cursor:'pointer' }}>Ya tengo cuenta →</button>
      </div>
      <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.78rem', marginTop:'1rem', textAlign:'center' }}>Cancela cuando quieras.</p>
    </main>
  )
}