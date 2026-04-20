'use client'
import { useState } from 'react'

export default function Home() {
  const [pantalla, setPantalla] = useState('landing')
  const [categorias, setCategorias] = useState(['Medicinas','Alimentación','Estado de ánimo','Movilidad'])
  const [dias, setDias] = useState(['L','M','X','J','V','S','D'])
  const [ciclo, setCiclo] = useState('mensual')

  const toggleCategoria = (nombre) => {
    setCategorias(prev => prev.includes(nombre) ? prev.filter(c => c !== nombre) : [...prev, nombre])
  }

  const toggleDia = (dia) => {
    setDias(prev => prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia])
  }

  if (pantalla === 'como-funciona') {
    return (
      <main style={{minHeight:'100vh',background:'linear-gradient(135deg, #1A1A2E 0%, #2D6A4F 100%)',fontFamily:'sans-serif',padding:'2rem'}}>
        <div style={{maxWidth:'500px',margin:'0 auto'}}>
          <h1 style={{color:'#fff',fontWeight:'300',fontSize:'2rem',marginBottom:'0.3rem',textAlign:'center',paddingTop:'2rem'}}>fam<span style={{color:'#74C69D'}}>vi</span></h1>
          <p style={{color:'rgba(255,255,255,0.6)',textAlign:'center',marginBottom:'2rem',fontStyle:'italic'}}>¿Cómo funciona?</p>
          {[['1','Tú configuras en 5 minutos','Agregas a tu familiar, eliges qué monitorear y a qué horas enviar los check-ins.'],['2','Tu familiar recibe mensajes en WhatsApp','Nada que instalar. Solo responde botones simples desde su WhatsApp de siempre.'],['3','Tú ves el resumen en tu dashboard','Cada día ves cómo estuvo — qué respondió, cómo se sintió, si comió bien.'],['4','Alerta si algo falla','Si tu familiar no responde, recibes una notificación inmediata en tu WhatsApp.']].map(([num, titulo, desc]) => (
            <div key={num} style={{background:'rgba(255,255,255,0.08)',borderRadius:'16px',padding:'1.2rem',marginBottom:'1rem',display:'flex',gap:'1rem',border:'1px solid rgba(255,255,255,0.1)'}}>
              <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'#74C69D',color:'#1A1A2E',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'600',fontSize:'0.85rem',flexShrink:0}}>{num}</div>
              <div>
                <h4 style={{color:'white',fontSize:'0.95rem',fontWeight:'500',marginBottom:'0.3rem'}}>{titulo}</h4>
                <p style={{color:'rgba(255,255,255,0.55)',fontSize:'0.82rem',lineHeight:'1.5'}}>{desc}</p>
              </div>
            </div>
          ))}
          <div style={{background:'rgba(255,255,255,0.06)',borderRadius:'20px',padding:'1.2rem',margin:'1.5rem 0',border:'1px solid rgba(255,255,255,0.1)'}}>
            <p style={{color:'rgba(255,255,255,0.5)',fontSize:'0.75rem',textAlign:'center',marginBottom:'1rem',textTransform:'uppercase',letterSpacing:'1px'}}>Lo que ve tu familiar</p>
            <div style={{borderRadius:'12px',overflow:'hidden',maxWidth:'300px',margin:'0 auto'}}>
              <div style={{background:'#075E54',padding:'0.7rem 1rem',display:'flex',alignItems:'center',gap:'0.6rem'}}>
                <div style={{width:'32px',height:'32px',background:'#25D366',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.8rem'}}>🤖</div>
                <div>
                  <div style={{color:'white',fontSize:'0.85rem',fontWeight:'500'}}>Famvi</div>
                  <div style={{color:'rgba(255,255,255,0.6)',fontSize:'0.7rem'}}>en línea</div>
                </div>
              </div>
              <div style={{background:'#ECE5DD',padding:'1rem'}}>
                <div style={{background:'white',borderRadius:'12px 12px 12px 2px',padding:'0.6rem 0.8rem',maxWidth:'85%',boxShadow:'0 1px 3px rgba(0,0,0,0.1)',marginBottom:'0.75rem'}}>
                  <p style={{fontSize:'0.8rem',color:'#1A1A2E',lineHeight:'1.4',margin:0}}>¡Buenos días, María! 🌸<br/>¿Ya tomaste tus medicinas de la mañana?</p>
                  <p style={{fontSize:'0.65rem',color:'#6B7280',margin:'0.2rem 0 0',textAlign:'right'}}>8:00 AM ✓✓</p>
                </div>
                <div style={{display:'flex',gap:'0.4rem'}}>
                  <button style={{background:'#25D366',color:'white',border:'none',padding:'0.4rem 0.7rem',borderRadius:'8px',fontSize:'0.72rem',cursor:'pointer'}}>✅ Sí, ya las tomé</button>
                  <button style={{background:'#25D366',color:'white',border:'none',padding:'0.4rem 0.7rem',borderRadius:'8px',fontSize:'0.72rem',cursor:'pointer'}}>⏰ Recuérdame</button>
                </div>
              </div>
            </div>
          </div>
          <button onClick={() => window.location.href='/login'} style={{width:'100%',padding:'1rem',background:'#74C69D',color:'#1A1A2E',border:'none',borderRadius:'50px',fontSize:'1rem',fontWeight:'600',cursor:'pointer',marginTop:'0.5rem'}}>Comenzar gratis →</button>
          <button onClick={() => setPantalla('landing')} style={{width:'100%',padding:'0.75rem',background:'none',border:'none',color:'rgba(255,255,255,0.6)',fontSize:'0.85rem',cursor:'pointer',marginTop:'0.5rem'}}>← Volver</button>
        </div>
      </main>
    )
  }

  if (pantalla === 'login') {
    return (
      <main style={{minHeight:'100vh',background:'linear-gradient(135deg, #1A1A2E 0%, #2D6A4F 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif',padding:'2rem'}}>
        <h1 style={{color:'#fff',fontWeight:'300',fontSize:'2rem',marginBottom:'1rem'}}>fam<span style={{color:'#74C69D'}}>vi</span></h1>
        <div style={{background:'white',borderRadius:'24px',padding:'2rem',width:'100%',maxWidth:'400px'}}>
          <h2 style={{fontSize:'1.5rem',fontWeight:'400',marginBottom:'0.4rem',textAlign:'center'}}>Crea tu cuenta</h2>
          <p style={{color:'#6B7280',fontSize:'0.88rem',marginBottom:'1.5rem',textAlign:'center'}}>Gratis los primeros 7 días. Cancela cuando quieras.</p>

          <button
            onClick={() => window.location.href='/login'}
            style={{width:'100%',padding:'0.9rem',background:'white',color:'#1A1A2E',border:'1.5px solid #E5E7EB',borderRadius:'12px',fontSize:'0.95rem',fontWeight:'500',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.75rem',marginBottom:'1rem',boxShadow:'0 1px 4px rgba(0,0,0,0.08)'}}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continuar con Google
          </button>

          <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'1rem'}}>
            <div style={{flex:1,height:'1px',background:'#E5E7EB'}}></div>
            <span style={{fontSize:'0.8rem',color:'#9CA3AF'}}>o con tu correo</span>
            <div style={{flex:1,height:'1px',background:'#E5E7EB'}}></div>
          </div>

          <input placeholder="Tu correo electrónico" style={{width:'100%',padding:'0.8rem',border:'1.5px solid #E5E7EB',borderRadius:'12px',marginBottom:'0.75rem',fontSize:'0.95rem',boxSizing:'border-box'}} />
          <input type="password" placeholder="Crea una contraseña" style={{width:'100%',padding:'0.8rem',border:'1.5px solid #E5E7EB',borderRadius:'12px',marginBottom:'1.5rem',fontSize:'0.95rem',boxSizing:'border-box'}} />

          <button
            onClick={() => window.location.href='/login'}
            style={{width:'100%',padding:'1rem',background:'#2D6A4F',color:'white',border:'none',borderRadius:'12px',fontSize:'1rem',fontWeight:'500',cursor:'pointer',marginBottom:'1rem'}}>
            Crear cuenta →
          </button>

          <p style={{textAlign:'center',fontSize:'0.82rem',color:'#6B7280',marginBottom:'0.5rem'}}>
            ¿Ya tienes cuenta? <span onClick={() => window.location.href='/login'} style={{color:'#2D6A4F',fontWeight:'500',cursor:'pointer'}}>Inicia sesión</span>
          </p>

          <p style={{textAlign:'center',fontSize:'0.75rem',color:'#9CA3AF',lineHeight:'1.5'}}>
            Al crear tu cuenta aceptas nuestros <a href="/terminos" style={{color:'#2D6A4F'}}>Términos de uso</a> y <a href="/privacidad" style={{color:'#2D6A4F'}}>Política de privacidad</a>
          </p>

          <button onClick={() => window.location.href='/precios'} style={{width:'100%',padding:'0.75rem',background:'none',border:'none',color:'#6B7280',fontSize:'0.85rem',cursor:'pointer',marginTop:'0.5rem'}}>← Volver</button>
        </div>
      </main>
    )
  }

  // LANDING
  return (
    <main style={{minHeight:'100vh',background:'linear-gradient(135deg, #1A1A2E 0%, #2D6A4F 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif',padding:'2rem'}}>
      <h1 style={{fontSize:'3rem',fontWeight:'300',color:'#fff',marginBottom:'0.3rem'}}>fam<span style={{color:'#74C69D'}}>vi</span></h1>
      <p style={{color:'rgba(255,255,255,0.75)',fontSize:'1.05rem',fontStyle:'italic',marginBottom:'2.5rem'}}>para los que cuidan desde lejos</p>
      <div style={{display:'flex',flexDirection:'column',gap:'0.75rem',width:'100%',maxWidth:'320px'}}>
        <button onClick={() => window.location.href='/login'} style={{width:'100%',padding:'1rem',background:'#74C69D',color:'#1A1A2E',border:'2px solid #74C69D',borderRadius:'50px',fontSize:'0.95rem',fontWeight:'600',cursor:'pointer'}}>Comenzar prueba gratis — 7 días →</button>
        <button onClick={() => window.location.href='/precios'} style={{width:'100%',padding:'1rem',background:'transparent',color:'#ffffff',border:'2px solid #ffffff',borderRadius:'50px',fontSize:'1rem',fontWeight:'500',cursor:'pointer'}}>Ver planes y precios</button>
        <button onClick={() => setPantalla('como-funciona')} style={{width:'100%',padding:'0.75rem',background:'transparent',color:'rgba(255,255,255,0.7)',border:'none',fontSize:'0.88rem',cursor:'pointer'}}>Ver cómo funciona ↓</button>
        <button onClick={() => window.location.href='/login'} style={{width:'100%',padding:'0.5rem',background:'transparent',color:'rgba(255,255,255,0.5)',border:'none',fontSize:'0.85rem',cursor:'pointer'}}>Ya tengo cuenta →</button>
      </div>
      <p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.78rem',marginTop:'1rem',textAlign:'center'}}> Cancela cuando quieras.</p>
    </main>
  )

}
