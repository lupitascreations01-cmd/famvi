'use client'

import { useState } from 'react'

export default function Home() {
  const [pantalla, setPantalla] = useState('landing')

  if (pantalla === 'onboarding') {
    return (
      <main style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D6A4F 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        padding: '2rem'
      }}>
        <h1 style={{color:'#fff', fontWeight:'300', fontSize:'2rem', marginBottom:'1rem'}}>
          fam<span style={{color:'#74C69D'}}>vi</span>
        </h1>
        <div style={{background:'white', borderRadius:'24px', padding:'2rem', width:'100%', maxWidth:'400px'}}>
          <p style={{fontSize:'0.75rem', color:'#2D6A4F', textTransform:'uppercase', letterSpacing:'2px', marginBottom:'0.5rem'}}>Paso 1 de 3</p>
          <h2 style={{fontSize:'1.5rem', fontWeight:'400', marginBottom:'0.5rem'}}>Cuéntanos sobre ti</h2>
          <p style={{color:'#6B7280', fontSize:'0.9rem', marginBottom:'1.5rem'}}>Primero tus datos para enviarte alertas.</p>
          <input placeholder="Tu nombre" style={{width:'100%', padding:'0.8rem', border:'1.5px solid #E5E7EB', borderRadius:'12px', marginBottom:'1rem', fontSize:'0.95rem', boxSizing:'border-box'}} />
          <input placeholder="Tu WhatsApp" style={{width:'100%', padding:'0.8rem', border:'1.5px solid #E5E7EB', borderRadius:'12px', marginBottom:'1rem', fontSize:'0.95rem', boxSizing:'border-box'}} />
          <input placeholder="Tu correo" style={{width:'100%', padding:'0.8rem', border:'1.5px solid #E5E7EB', borderRadius:'12px', marginBottom:'1.5rem', fontSize:'0.95rem', boxSizing:'border-box'}} />
          <button
            onClick={() => setPantalla('familiar')}
            style={{width:'100%', padding:'1rem', background:'#2D6A4F', color:'white', border:'none', borderRadius:'12px', fontSize:'1rem', fontWeight:'500', cursor:'pointer'}}>
            Continuar →
          </button>
          <button
            onClick={() => setPantalla('landing')}
            style={{width:'100%', padding:'0.75rem', background:'none', border:'none', color:'#6B7280', fontSize:'0.85rem', cursor:'pointer', marginTop:'0.5rem'}}>
            ← Volver
          </button>
        </div>
      </main>
    )
  }

  if (pantalla === 'como-funciona') {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1A1A2E 0%, #2D6A4F 100%)',
      fontFamily: 'sans-serif',
      padding: '2rem'
    }}>
      <div style={{maxWidth:'500px', margin:'0 auto'}}>
        <h1 style={{color:'#fff', fontWeight:'300', fontSize:'2rem', marginBottom:'0.3rem', textAlign:'center', paddingTop:'2rem'}}>
          fam<span style={{color:'#74C69D'}}>vi</span>
        </h1>
        <p style={{color:'rgba(255,255,255,0.6)', textAlign:'center', marginBottom:'2rem', fontStyle:'italic'}}>¿Cómo funciona?</p>

        {[
          ['1','Tú configuras en 5 minutos','Agregas a tu familiar, eliges qué monitorear y a qué horas enviar los check-ins.'],
          ['2','Tu familiar recibe mensajes en WhatsApp','Nada que instalar. Solo responde botones simples desde su WhatsApp de siempre.'],
          ['3','Tú ves el resumen en tu dashboard','Cada día ves cómo estuvo — qué respondió, cómo se sintió, si comió bien.'],
          ['4','Alerta si algo falla','Si tu familiar no responde, recibes una notificación inmediata en tu WhatsApp.'],
        ].map(([num, titulo, desc]) => (
          <div key={num} style={{background:'rgba(255,255,255,0.08)', borderRadius:'16px', padding:'1.2rem', marginBottom:'1rem', display:'flex', gap:'1rem', border:'1px solid rgba(255,255,255,0.1)'}}>
            <div style={{width:'36px', height:'36px', borderRadius:'50%', background:'#74C69D', color:'#1A1A2E', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'600', fontSize:'0.85rem', flexShrink:0}}>{num}</div>
            <div>
              <h4 style={{color:'white', fontSize:'0.95rem', fontWeight:'500', marginBottom:'0.3rem'}}>{titulo}</h4>
              <p style={{color:'rgba(255,255,255,0.55)', fontSize:'0.82rem', lineHeight:'1.5'}}>{desc}</p>
            </div>
          </div>
        ))}

        <button
          onClick={() => setPantalla('onboarding')}
          style={{width:'100%', padding:'1rem', background:'#74C69D', color:'#1A1A2E', border:'none', borderRadius:'50px', fontSize:'1rem', fontWeight:'600', cursor:'pointer', marginTop:'0.5rem'}}>
          Comenzar gratis →
        </button>
        <button
          onClick={() => setPantalla('landing')}
          style={{width:'100%', padding:'0.75rem', background:'none', border:'none', color:'rgba(255,255,255,0.6)', fontSize:'0.85rem', cursor:'pointer', marginTop:'0.5rem'}}>
          ← Volver
        </button>
      </div>
    </main>
  )
}
  if (pantalla === 'familiar') {
    return (
      <main style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D6A4F 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        padding: '2rem'
      }}>
        <h1 style={{color:'#fff', fontWeight:'300', fontSize:'2rem', marginBottom:'1rem'}}>
          fam<span style={{color:'#74C69D'}}>vi</span>
        </h1>
        <div style={{background:'white', borderRadius:'24px', padding:'2rem', width:'100%', maxWidth:'400px'}}>
          <p style={{fontSize:'0.75rem', color:'#2D6A4F', textTransform:'uppercase', letterSpacing:'2px', marginBottom:'0.5rem'}}>Paso 2 de 3</p>
          <h2 style={{fontSize:'1.5rem', fontWeight:'400', marginBottom:'0.5rem'}}>¿A quién cuidas?</h2>
          <p style={{color:'#6B7280', fontSize:'0.9rem', marginBottom:'1.5rem'}}>No tiene que instalar nada.</p>
          <input placeholder="Nombre de tu familiar" style={{width:'100%', padding:'0.8rem', border:'1.5px solid #E5E7EB', borderRadius:'12px', marginBottom:'1rem', fontSize:'0.95rem', boxSizing:'border-box'}} />
          <select style={{width:'100%', padding:'0.8rem', border:'1.5px solid #E5E7EB', borderRadius:'12px', marginBottom:'1rem', fontSize:'0.95rem', boxSizing:'border-box'}}>
            <option>Selecciona relación...</option>
            <option>Mamá</option>
            <option>Papá</option>
            <option>Abuela</option>
            <option>Abuelo</option>
            <option>Otro familiar</option>
          </select>
          <input placeholder="WhatsApp de tu familiar" style={{width:'100%', padding:'0.8rem', border:'1.5px solid #E5E7EB', borderRadius:'12px', marginBottom:'1.5rem', fontSize:'0.95rem', boxSizing:'border-box'}} />
          <button
            onClick={() => setPantalla('dashboard')}
            style={{width:'100%', padding:'1rem', background:'#2D6A4F', color:'white', border:'none', borderRadius:'12px', fontSize:'1rem', fontWeight:'500', cursor:'pointer'}}>
            Continuar →
          </button>
          <button
            onClick={() => setPantalla('onboarding')}
            style={{width:'100%', padding:'0.75rem', background:'none', border:'none', color:'#6B7280', fontSize:'0.85rem', cursor:'pointer', marginTop:'0.5rem'}}>
            ← Volver
          </button>
        </div>
      </main>
    )
  }

  if (pantalla === 'dashboard') {
    return (
      <main style={{minHeight:'100vh', background:'#F8F7F4', fontFamily:'sans-serif', paddingBottom:'80px'}}>
        <div style={{background:'white', padding:'1rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
          <span style={{fontSize:'1.4rem', color:'#2D6A4F', fontWeight:'300'}}>fam<span style={{color:'#74C69D'}}>vi</span></span>
          <span style={{background:'#D8F3DC', padding:'0.3rem 0.8rem', borderRadius:'20px', fontSize:'0.82rem', color:'#2D6A4F', fontWeight:'500'}}>Tu familiar</span>
        </div>
        <div style={{padding:'1.5rem', maxWidth:'600px', margin:'0 auto'}}>
          <h2 style={{fontSize:'1.3rem', fontWeight:'400', marginBottom:'0.2rem'}}>Hoy</h2>
          <p style={{color:'#6B7280', fontSize:'0.82rem', marginBottom:'1.2rem'}}>{new Date().toLocaleDateString('es-ES', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</p>
          <div style={{background:'white', borderRadius:'20px', padding:'1.4rem', marginBottom:'1.2rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', display:'flex', gap:'1rem', alignItems:'center'}}>
            <div style={{width:'56px', height:'56px', borderRadius:'50%', background:'#D8F3DC', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', flexShrink:0}}>✅</div>
            <div>
              <h3 style={{fontSize:'0.95rem', fontWeight:'500', marginBottom:'0.2rem'}}>Todo va bien hoy</h3>
              <p style={{fontSize:'0.82rem', color:'#6B7280'}}>Respondió todos los check-ins. Sin alertas.</p>
            </div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem', marginBottom:'1.2rem'}}>
            {[['💊','Medicinas','Tomó sus pastillas ✓','verde'],['🍽️','Alimentación','Almorzó bien hoy','verde'],['😊','Ánimo','Se siente "más o menos"','amarillo'],['🚶','Movilidad','Check-in a las 5PM','gris']].map(([icono, titulo, desc, color]) => (
              <div key={titulo} style={{background:'white', borderRadius:'16px', padding:'1.1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.6rem'}}>
                  <span style={{fontSize:'1.3rem'}}>{icono}</span>
                  <span style={{width:'10px', height:'10px', borderRadius:'50%', background: color==='verde'?'#74C69D':color==='amarillo'?'#F4A261':'#D1D5DB', display:'block', marginTop:'4px'}}></span>
                </div>
                <p style={{fontSize:'0.83rem', fontWeight:'500', marginBottom:'0.15rem'}}>{titulo}</p>
                <p style={{fontSize:'0.76rem', color:'#6B7280'}}>{desc}</p>
              </div>
            ))}
          </div>
          <button style={{width:'100%', padding:'1rem', background:'#25D366', color:'white', border:'none', borderRadius:'12px', fontSize:'0.92rem', fontWeight:'500', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem'}}>
            💬 Enviar mensaje a tu familiar
          </button>
        </div>
      </main>
    )
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1A1A2E 0%, #2D6A4F 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      padding: '2rem'
    }}>
      <h1 style={{fontSize:'3rem', fontWeight:'300', color:'#fff', marginBottom:'0.3rem'}}>
        fam<span style={{color:'#74C69D'}}>vi</span>
      </h1>
      <p style={{color:'rgba(255,255,255,0.75)', fontSize:'1.05rem', fontStyle:'italic', marginBottom:'2.5rem'}}>
        para los que cuidan desde lejos
      </p>
      <div style={{display:'flex', flexDirection:'column', gap:'0.75rem', width:'100%', maxWidth:'300px'}}>
        <button
          onClick={() => setPantalla('onboarding')}
          style={{width:'100%', padding:'1rem', background:'#74C69D', color:'#1A1A2E', border:'2px solid #74C69D', borderRadius:'50px', fontSize:'1rem', fontWeight:'600', cursor:'pointer'}}>
          Comenzar gratis →
        </button>
        <button
          onClick={() => setPantalla('como-funciona')}
          style={{width:'100%', padding:'1rem', background:'transparent', color:'#ffffff', border:'2px solid #ffffff', borderRadius:'50px', fontSize:'1rem', fontWeight:'500', cursor:'pointer'}}>
          Ver cómo funciona ↓
        </button>
      </div>
    </main>
  )
}