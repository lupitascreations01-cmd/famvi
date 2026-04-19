'use client'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

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

  if (pantalla === 'onboarding') {
    return (
      <main style={{minHeight:'100vh',background:'linear-gradient(135deg, #1A1A2E 0%, #2D6A4F 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif',padding:'2rem'}}>
        <h1 style={{color:'#fff',fontWeight:'300',fontSize:'2rem',marginBottom:'1rem'}}>fam<span style={{color:'#74C69D'}}>vi</span></h1>
        <div style={{background:'white',borderRadius:'24px',padding:'2rem',width:'100%',maxWidth:'400px'}}>
          <p style={{fontSize:'0.75rem',color:'#2D6A4F',textTransform:'uppercase',letterSpacing:'2px',marginBottom:'0.5rem'}}>Paso 1 de 3</p>
          <h2 style={{fontSize:'1.5rem',fontWeight:'400',marginBottom:'0.5rem'}}>Cuéntanos sobre ti</h2>
          <p style={{color:'#6B7280',fontSize:'0.9rem',marginBottom:'1.5rem'}}>Primero tus datos para enviarte alertas.</p>
          <input placeholder="Tu nombre" style={{width:'100%',padding:'0.8rem',border:'1.5px solid #E5E7EB',borderRadius:'12px',marginBottom:'1rem',fontSize:'0.95rem',boxSizing:'border-box'}} />
          <input placeholder="Tu WhatsApp" style={{width:'100%',padding:'0.8rem',border:'1.5px solid #E5E7EB',borderRadius:'12px',marginBottom:'1rem',fontSize:'0.95rem',boxSizing:'border-box'}} />
          <input placeholder="Tu correo" style={{width:'100%',padding:'0.8rem',border:'1.5px solid #E5E7EB',borderRadius:'12px',marginBottom:'1.5rem',fontSize:'0.95rem',boxSizing:'border-box'}} />
          <button onClick={() => setPantalla('familiar')} style={{width:'100%',padding:'1rem',background:'#2D6A4F',color:'white',border:'none',borderRadius:'12px',fontSize:'1rem',fontWeight:'500',cursor:'pointer'}}>Continuar →</button>
          <button onClick={() => setPantalla('landing')} style={{width:'100%',padding:'0.75rem',background:'none',border:'none',color:'#6B7280',fontSize:'0.85rem',cursor:'pointer',marginTop:'0.5rem'}}>← Volver</button>
        </div>
      </main>
    )
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
          <button onClick={() => setPantalla('onboarding')} style={{width:'100%',padding:'1rem',background:'#74C69D',color:'#1A1A2E',border:'none',borderRadius:'50px',fontSize:'1rem',fontWeight:'600',cursor:'pointer',marginTop:'0.5rem'}}>Comenzar gratis →</button>
          <button onClick={() => setPantalla('landing')} style={{width:'100%',padding:'0.75rem',background:'none',border:'none',color:'rgba(255,255,255,0.6)',fontSize:'0.85rem',cursor:'pointer',marginTop:'0.5rem'}}>← Volver</button>
        </div>
      </main>
    )
  }

  if (pantalla === 'familiar') {
    return (
      <main style={{minHeight:'100vh',background:'linear-gradient(135deg, #1A1A2E 0%, #2D6A4F 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif',padding:'2rem'}}>
        <h1 style={{color:'#fff',fontWeight:'300',fontSize:'2rem',marginBottom:'1rem'}}>fam<span style={{color:'#74C69D'}}>vi</span></h1>
        <div style={{background:'white',borderRadius:'24px',padding:'2rem',width:'100%',maxWidth:'400px'}}>
          <p style={{fontSize:'0.75rem',color:'#2D6A4F',textTransform:'uppercase',letterSpacing:'2px',marginBottom:'0.5rem'}}>Paso 2 de 3</p>
          <h2 style={{fontSize:'1.5rem',fontWeight:'400',marginBottom:'0.5rem'}}>¿A quién cuidas?</h2>
          <p style={{color:'#6B7280',fontSize:'0.9rem',marginBottom:'1.5rem'}}>No tiene que instalar nada.</p>
          <input placeholder="Nombre de tu familiar" style={{width:'100%',padding:'0.8rem',border:'1.5px solid #E5E7EB',borderRadius:'12px',marginBottom:'1rem',fontSize:'0.95rem',boxSizing:'border-box'}} />
          <select style={{width:'100%',padding:'0.8rem',border:'1.5px solid #E5E7EB',borderRadius:'12px',marginBottom:'1rem',fontSize:'0.95rem',boxSizing:'border-box'}}>
            <option>Selecciona relación...</option>
            <option>Mamá</option>
            <option>Papá</option>
            <option>Abuela</option>
            <option>Abuelo</option>
            <option>Otro familiar</option>
          </select>
          <input placeholder="WhatsApp de tu familiar" style={{width:'100%',padding:'0.8rem',border:'1.5px solid #E5E7EB',borderRadius:'12px',marginBottom:'1.5rem',fontSize:'0.95rem',boxSizing:'border-box'}} />
          <button onClick={() => setPantalla('configuracion')} style={{width:'100%',padding:'1rem',background:'#2D6A4F',color:'white',border:'none',borderRadius:'12px',fontSize:'1rem',fontWeight:'500',cursor:'pointer'}}>Continuar →</button>
          <button onClick={() => setPantalla('onboarding')} style={{width:'100%',padding:'0.75rem',background:'none',border:'none',color:'#6B7280',fontSize:'0.85rem',cursor:'pointer',marginTop:'0.5rem'}}>← Volver</button>
        </div>
      </main>
    )
  }

  if (pantalla === 'configuracion') {
    return (
      <main style={{minHeight:'100vh',background:'linear-gradient(135deg, #1A1A2E 0%, #2D6A4F 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif',padding:'2rem'}}>
        <h1 style={{color:'#fff',fontWeight:'300',fontSize:'2rem',marginBottom:'1rem'}}>fam<span style={{color:'#74C69D'}}>vi</span></h1>
        <div style={{background:'white',borderRadius:'24px',padding:'2rem',width:'100%',maxWidth:'400px'}}>
          <p style={{fontSize:'0.75rem',color:'#2D6A4F',textTransform:'uppercase',letterSpacing:'2px',marginBottom:'0.5rem'}}>Paso 3 de 3</p>
          <h2 style={{fontSize:'1.5rem',fontWeight:'400',marginBottom:'0.4rem'}}>¿Qué quieres monitorear?</h2>
          <p style={{color:'#6B7280',fontSize:'0.88rem',marginBottom:'1.5rem'}}>Elige áreas, días y horarios de los check-ins.</p>
          <p style={{fontSize:'0.75rem',fontWeight:'500',color:'#6B7280',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'0.6rem'}}>Áreas de cuidado</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.6rem',marginBottom:'1.2rem'}}>
            {[['💊','Medicinas'],['🍽️','Alimentación'],['😊','Estado de ánimo'],['🚶','Movilidad'],['😴','Sueño'],['💧','Hidratación']].map(([icono, nombre]) => (
              <div key={nombre} onClick={() => toggleCategoria(nombre)} style={{border:`1.5px solid ${categorias.includes(nombre)?'#2D6A4F':'#E5E7EB'}`,borderRadius:'12px',padding:'0.8rem',background:categorias.includes(nombre)?'#D8F3DC':'#F8F7F4',display:'flex',alignItems:'center',gap:'0.5rem',cursor:'pointer'}}>
                <span style={{fontSize:'1.2rem'}}>{icono}</span>
                <span style={{fontSize:'0.83rem',fontWeight:'500',color:categorias.includes(nombre)?'#1A1A2E':'#6B7280'}}>{nombre}</span>
              </div>
            ))}
          </div>
          <p style={{fontSize:'0.75rem',fontWeight:'500',color:'#6B7280',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'0.6rem'}}>Días de envío</p>
          <div style={{display:'flex',gap:'0.4rem',marginBottom:'1.2rem',justifyContent:'space-between'}}>
            {['L','M','X','J','V','S','D'].map((dia) => (
              <div key={dia} onClick={() => toggleDia(dia)} style={{flex:1,aspectRatio:'1',border:`1.5px solid ${dias.includes(dia)?'#2D6A4F':'#E5E7EB'}`,borderRadius:'10px',background:dias.includes(dia)?'#D8F3DC':'#F8F7F4',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.78rem',fontWeight:'600',color:dias.includes(dia)?'#2D6A4F':'#6B7280',cursor:'pointer'}}>
                {dia}
              </div>
            ))}
          </div>
          <p style={{fontSize:'0.75rem',fontWeight:'500',color:'#6B7280',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'0.6rem'}}>Horarios de check-in</p>
          {[['Mañana','8','AM'],['Mediodía','1','PM'],['Tarde','5','PM']].map(([nombre, hora, ampm]) => (
            <div key={nombre} style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.85rem 1rem',border:'1.5px solid #2D6A4F',borderRadius:'12px',marginBottom:'0.6rem',background:'#D8F3DC'}}>
              <input type="checkbox" defaultChecked style={{accentColor:'#2D6A4F',width:'16px',height:'16px'}} />
              <span style={{fontSize:'0.88rem',flex:1}}>{nombre}</span>
              <select defaultValue={hora} style={{padding:'0.3rem',border:'1px solid #D1D5DB',borderRadius:'8px',fontSize:'0.78rem'}}>
                {['6','7','8','9','10','11','12','1','2','3','4','5','6','7','8','9','10'].map(h => <option key={h}>{h}</option>)}
              </select>
              <span style={{fontSize:'0.8rem',color:'#6B7280'}}>:</span>
              <select style={{padding:'0.3rem',border:'1px solid #D1D5DB',borderRadius:'8px',fontSize:'0.78rem'}}>
                <option>00</option><option>15</option><option>30</option><option>45</option>
              </select>
              <select defaultValue={ampm} style={{padding:'0.3rem',border:'1px solid #D1D5DB',borderRadius:'8px',fontSize:'0.78rem'}}>
                <option>AM</option><option>PM</option>
              </select>
            </div>
          ))}
          <button onClick={() => setPantalla('resumen')} style={{width:'100%',padding:'1rem',background:'#2D6A4F',color:'white',border:'none',borderRadius:'12px',fontSize:'1rem',fontWeight:'500',cursor:'pointer',marginTop:'0.5rem'}}>Activar Famvi ✓</button>
          <button onClick={() => setPantalla('familiar')} style={{width:'100%',padding:'0.75rem',background:'none',border:'none',color:'#6B7280',fontSize:'0.85rem',cursor:'pointer',marginTop:'0.5rem'}}>← Volver</button>
        </div>
      </main>
    )
  }

  if (pantalla === 'resumen') {
    return (
      <main style={{minHeight:'100vh',background:'linear-gradient(135deg, #1A1A2E 0%, #2D6A4F 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif',padding:'2rem'}}>
        <h1 style={{color:'#fff',fontWeight:'300',fontSize:'2rem',marginBottom:'1rem'}}>fam<span style={{color:'#74C69D'}}>vi</span></h1>
        <div style={{background:'white',borderRadius:'24px',padding:'2rem',width:'100%',maxWidth:'400px'}}>
          <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
            <div style={{width:'64px',height:'64px',background:'#D8F3DC',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem',margin:'0 auto 1rem'}}>✅</div>
            <h2 style={{fontSize:'1.5rem',fontWeight:'400',marginBottom:'0.4rem'}}>¡Todo listo!</h2>
            <p style={{color:'#6B7280',fontSize:'0.88rem'}}>Así quedó configurado Famvi para tu familiar</p>
          </div>
          <div style={{background:'#F8F7F4',borderRadius:'16px',padding:'1.2rem',marginBottom:'1rem'}}>
            <p style={{fontSize:'0.75rem',fontWeight:'500',color:'#6B7280',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'0.75rem'}}>Áreas monitoreadas</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
              {categorias.map(c => (
                <span key={c} style={{background:'#D8F3DC',color:'#2D6A4F',padding:'0.3rem 0.75rem',borderRadius:'20px',fontSize:'0.82rem',fontWeight:'500'}}>{c}</span>
              ))}
            </div>
          </div>
          <div style={{background:'#F8F7F4',borderRadius:'16px',padding:'1.2rem',marginBottom:'1rem'}}>
            <p style={{fontSize:'0.75rem',fontWeight:'500',color:'#6B7280',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'0.75rem'}}>Días de envío</p>
            <div style={{display:'flex',gap:'0.4rem'}}>
              {['L','M','X','J','V','S','D'].map(d => (
                <div key={d} style={{width:'32px',height:'32px',borderRadius:'8px',background:dias.includes(d)?'#D8F3DC':'#E5E7EB',color:dias.includes(d)?'#2D6A4F':'#9CA3AF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.78rem',fontWeight:'600'}}>{d}</div>
              ))}
            </div>
          </div>
          <div style={{background:'#F8F7F4',borderRadius:'16px',padding:'1.2rem',marginBottom:'1.5rem'}}>
            <p style={{fontSize:'0.75rem',fontWeight:'500',color:'#6B7280',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'0.75rem'}}>Horarios de check-in</p>
            {[['🌅','Mañana','8:00 AM'],['☀️','Mediodía','1:00 PM'],['🌆','Tarde','5:00 PM']].map(([icono, nombre, hora]) => (
              <div key={nombre} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.5rem 0',borderBottom:'1px solid #E5E7EB'}}>
                <span style={{fontSize:'0.88rem'}}>{icono} {nombre}</span>
                <span style={{fontSize:'0.85rem',fontWeight:'500',color:'#2D6A4F'}}>{hora}</span>
              </div>
            ))}
          </div>
          <div style={{background:'#D8F3DC',borderRadius:'12px',padding:'1rem',marginBottom:'1.5rem',display:'flex',gap:'0.75rem',alignItems:'flex-start'}}>
            <span style={{fontSize:'1.2rem'}}>💬</span>
            <p style={{fontSize:'0.82rem',color:'#2D6A4F',lineHeight:'1.5',margin:0}}>En unos minutos tu familiar recibirá su primer mensaje de Famvi en WhatsApp.</p>
          </div>
          <button onClick={() => window.location.href='/dashboard'} style={{width:'100%',padding:'1rem',background:'#2D6A4F',color:'white',border:'none',borderRadius:'12px',fontSize:'1rem',fontWeight:'500',cursor:'pointer'}}>Ver mi dashboard →</button>
          <button onClick={() => setPantalla('configuracion')} style={{width:'100%',padding:'0.75rem',background:'none',border:'none',color:'#6B7280',fontSize:'0.85rem',cursor:'pointer',marginTop:'0.5rem'}}>← Volver</button>
        </div>
      </main>
    )
  }

  if (pantalla === 'dashboard') {
    return (
      <main style={{minHeight:'100vh',background:'#F8F7F4',fontFamily:'sans-serif',paddingBottom:'80px'}}>
        <div style={{background:'white',padding:'1rem 1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center',boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
          <span style={{fontSize:'1.4rem',color:'#2D6A4F',fontWeight:'300'}}>fam<span style={{color:'#74C69D'}}>vi</span></span>
          <span style={{background:'#D8F3DC',padding:'0.3rem 0.8rem',borderRadius:'20px',fontSize:'0.82rem',color:'#2D6A4F',fontWeight:'500'}}>Tu familiar</span>
        </div>
        <div style={{padding:'1.5rem',maxWidth:'600px',margin:'0 auto'}}>
          <h2 style={{fontSize:'1.3rem',fontWeight:'400',marginBottom:'0.2rem'}}>Hoy</h2>
          <p style={{color:'#6B7280',fontSize:'0.82rem',marginBottom:'1.2rem'}}>{new Date().toLocaleDateString('es-ES',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
          <div style={{background:'white',borderRadius:'20px',padding:'1.4rem',marginBottom:'1.2rem',boxShadow:'0 2px 8px rgba(0,0,0,0.07)',display:'flex',gap:'1rem',alignItems:'center'}}>
            <div style={{width:'56px',height:'56px',borderRadius:'50%',background:'#F3F4F6',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.6rem',flexShrink:0}}>⏳</div>
            <div>
              <h3 style={{fontSize:'0.95rem',fontWeight:'500',marginBottom:'0.2rem'}}>Esperando respuestas</h3>
              <p style={{fontSize:'0.82rem',color:'#6B7280'}}>Los check-ins comenzarán a llegar según el horario configurado.</p>
            </div>
          </div>
          <div style={{background:'white',borderRadius:'12px',padding:'1rem',marginBottom:'1rem',boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
            <p style={{fontSize:'0.75rem',fontWeight:'500',color:'#6B7280',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'0.75rem'}}>¿Qué significa cada color?</p>
            <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
              {[['#74C69D','Todo bien — respondió y está bien'],['#F4A261','Atención — respondió pero hay algo que revisar'],['#E76F51','Alerta — no respondió o necesita ayuda'],['#D1D5DB','Pendiente — el check-in aún no ha llegado']].map(([color, texto]) => (
                <div key={color} style={{display:'flex',alignItems:'center',gap:'0.6rem'}}>
                  <span style={{width:'10px',height:'10px',borderRadius:'50%',background:color,display:'block',flexShrink:0}}></span>
                  <span style={{fontSize:'0.82rem',color:'#6B7280'}}>{texto}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.8rem',marginBottom:'1.2rem'}}>
            {[['💊','Medicinas','Esperando primer check-in','#D1D5DB'],['🍽️','Alimentación','Esperando primer check-in','#D1D5DB'],['😊','Ánimo','Esperando primer check-in','#D1D5DB'],['🚶','Movilidad','Esperando primer check-in','#D1D5DB']].map(([icono, titulo, desc, color]) => (
              <div key={titulo} style={{background:'white',borderRadius:'16px',padding:'1.1rem',boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.6rem'}}>
                  <span style={{fontSize:'1.3rem'}}>{icono}</span>
                  <span style={{width:'10px',height:'10px',borderRadius:'50%',background:color,display:'block',marginTop:'4px'}}></span>
                </div>
                <p style={{fontSize:'0.83rem',fontWeight:'500',marginBottom:'0.15rem'}}>{titulo}</p>
                <p style={{fontSize:'0.76rem',color:'#6B7280'}}>{desc}</p>
              </div>
            ))}
          </div>
          <button style={{width:'100%',padding:'1rem',background:'#25D366',color:'white',border:'none',borderRadius:'12px',fontSize:'0.92rem',fontWeight:'500',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',marginBottom:'0.75rem'}}>
            💬 Enviar mensaje a tu familiar
          </button>
          <button onClick={() => setPantalla('resumen')} style={{width:'100%',padding:'0.75rem',background:'none',border:'1.5px solid #D1D5DB',borderRadius:'12px',color:'#6B7280',fontSize:'0.85rem',cursor:'pointer'}}>← Volver al resumen</button>
        </div>
      </main>
    )
  }

  if (pantalla === 'precios') {
    const planes = [
      {nombre:'Básico', familiares:'1 familiar', mensual:9.99, anual:99, color:'#F8F7F4', borde:'#E5E7EB', badge:null, features:['1 familiar monitoreado','Check-ins diarios por WhatsApp','Alertas inmediatas','Dashboard web','Historial 30 días']},
      {nombre:'Familiar', familiares:'hasta 3 familiares', mensual:17.99, anual:179, color:'#2D6A4F', borde:'#2D6A4F', badge:'Más popular', features:['Hasta 3 familiares','Check-ins diarios por WhatsApp','Alertas inmediatas','Dashboard web','Historial ilimitado','Reportes semanales']},
      {nombre:'Premium', familiares:'hasta 6 familiares', mensual:24.99, anual:249, color:'#F8F7F4', borde:'#E5E7EB', badge:null, features:['Hasta 6 familiares','Check-ins diarios por WhatsApp','Alertas inmediatas','Dashboard web','Historial ilimitado','Reportes semanales','Soporte prioritario']},
    ]
    return (
      <main style={{minHeight:'100vh',background:'linear-gradient(135deg, #1A1A2E 0%, #2D6A4F 100%)',fontFamily:'sans-serif',padding:'2rem'}}>
        <div style={{maxWidth:'600px',margin:'0 auto'}}>
          <h1 style={{color:'#fff',fontWeight:'300',fontSize:'2rem',textAlign:'center',paddingTop:'2rem',marginBottom:'0.3rem'}}>fam<span style={{color:'#74C69D'}}>vi</span></h1>
          <h2 style={{color:'white',fontWeight:'400',fontSize:'1.5rem',textAlign:'center',marginBottom:'0.5rem'}}>Elige tu plan</h2>
          <p style={{color:'rgba(255,255,255,0.6)',textAlign:'center',marginBottom:'2rem',fontSize:'0.9rem'}}>Sin contratos. Cancela cuando quieras.</p>

          <div style={{display:'flex',background:'rgba(255,255,255,0.1)',borderRadius:'50px',padding:'4px',maxWidth:'260px',margin:'0 auto 2rem'}}>
            <button onClick={() => setCiclo('mensual')} style={{flex:1,padding:'0.6rem',borderRadius:'50px',border:'none',background:ciclo==='mensual'?'white':'transparent',color:ciclo==='mensual'?'#1A1A2E':'rgba(255,255,255,0.7)',fontWeight:'500',cursor:'pointer',fontSize:'0.88rem',transition:'all 0.2s'}}>Mensual</button>
            <button onClick={() => setCiclo('anual')} style={{flex:1,padding:'0.6rem',borderRadius:'50px',border:'none',background:ciclo==='anual'?'white':'transparent',color:ciclo==='anual'?'#1A1A2E':'rgba(255,255,255,0.7)',fontWeight:'500',cursor:'pointer',fontSize:'0.88rem',transition:'all 0.2s'}}>
              Anual <span style={{fontSize:'0.72rem',color:ciclo==='anual'?'#2D6A4F':'rgba(255,255,255,0.5)'}}>-17%</span>
            </button>
          </div>

          {planes.map(plan => (
            <div key={plan.nombre} style={{background:plan.nombre==='Familiar'?'#2D6A4F':'white',borderRadius:'20px',padding:'1.5rem',marginBottom:'1rem',border:`2px solid ${plan.borde}`,position:'relative'}}>
              {plan.badge && <span style={{position:'absolute',top:'-12px',left:'50%',transform:'translateX(-50%)',background:'#74C69D',color:'#1A1A2E',padding:'0.25rem 1rem',borderRadius:'20px',fontSize:'0.75rem',fontWeight:'600'}}>{plan.badge}</span>}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1rem'}}>
                <div>
                  <h3 style={{fontSize:'1.1rem',fontWeight:'600',color:plan.nombre==='Familiar'?'white':'#1A1A2E',marginBottom:'0.2rem'}}>{plan.nombre}</h3>
                  <p style={{fontSize:'0.82rem',color:plan.nombre==='Familiar'?'rgba(255,255,255,0.7)':'#6B7280'}}>{plan.familiares}</p>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'1.8rem',fontWeight:'600',color:plan.nombre==='Familiar'?'#74C69D':'#2D6A4F',lineHeight:1}}>
                    ${ciclo==='mensual'?plan.mensual:(plan.anual/12).toFixed(2)}
                  </div>
                  <div style={{fontSize:'0.75rem',color:plan.nombre==='Familiar'?'rgba(255,255,255,0.6)':'#6B7280'}}>/mes{ciclo==='anual'?' · cobrado anual':''}</div>
                  {ciclo==='anual' && <div style={{fontSize:'0.72rem',color:'#74C69D',fontWeight:'500'}}>Total ${plan.anual}/año</div>}
                </div>
              </div>
              <div style={{marginBottom:'1.2rem'}}>
                {plan.features.map(f => (
                  <div key={f} style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.4rem'}}>
                    <span style={{color:'#74C69D',fontSize:'0.85rem'}}>✓</span>
                    <span style={{fontSize:'0.83rem',color:plan.nombre==='Familiar'?'rgba(255,255,255,0.85)':'#4B5563'}}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => window.location.href='/login'} style={{width:'100%',padding:'0.9rem',background:plan.nombre==='Familiar'?'#74C69D':'#2D6A4F',color:plan.nombre==='Familiar'?'#1A1A2E':'white',border:'none',borderRadius:'12px',fontSize:'0.95rem',fontWeight:'600',cursor:'pointer'}}>
                Elegir {plan.nombre} →
              </button>
            </div>
          ))}
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
          <p style={{color:'#6B7280',fontSize:'0.88rem',marginBottom:'1.5rem',textAlign:'center'}}>Gratis los primeros 7 días. Sin tarjeta de crédito.</p>

          <button style={{width:'100%',padding:'0.9rem',background:'white',color:'#1A1A2E',border:'1.5px solid #E5E7EB',borderRadius:'12px',fontSize:'0.95rem',fontWeight:'500',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.75rem',marginBottom:'1rem',boxShadow:'0 1px 4px rgba(0,0,0,0.08)'}}>
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

          <button onClick={() => setPantalla('onboarding')} style={{width:'100%',padding:'1rem',background:'#2D6A4F',color:'white',border:'none',borderRadius:'12px',fontSize:'1rem',fontWeight:'500',cursor:'pointer',marginBottom:'1rem'}}>
            Crear cuenta →
          </button>

          <p style={{textAlign:'center',fontSize:'0.82rem',color:'#6B7280',marginBottom:'0.5rem'}}>
            ¿Ya tienes cuenta? <span onClick={() => window.location.href='/login'} style={{color:'#2D6A4F',fontWeight:'500',cursor:'pointer'}}>Inicia sesión</span>
          </p>

          <p style={{textAlign:'center',fontSize:'0.75rem',color:'#9CA3AF',lineHeight:'1.5'}}>
            Al crear tu cuenta aceptas nuestros <span style={{color:'#2D6A4F',cursor:'pointer'}}>Términos de uso</span> y <span style={{color:'#2D6A4F',cursor:'pointer'}}>Política de privacidad</span>
          </p>

          <button onClick={() => setPantalla('precios')} style={{width:'100%',padding:'0.75rem',background:'none',border:'none',color:'#6B7280',fontSize:'0.85rem',cursor:'pointer',marginTop:'0.5rem'}}>← Volver</button>
        </div>
      </main>
    )
  }

  return (
    <main style={{minHeight:'100vh',background:'linear-gradient(135deg, #1A1A2E 0%, #2D6A4F 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif',padding:'2rem'}}>
      <h1 style={{fontSize:'3rem',fontWeight:'300',color:'#fff',marginBottom:'0.3rem'}}>fam<span style={{color:'#74C69D'}}>vi</span></h1>
      <p style={{color:'rgba(255,255,255,0.75)',fontSize:'1.05rem',fontStyle:'italic',marginBottom:'2.5rem'}}>para los que cuidan desde lejos</p>
      <div style={{display:'flex',flexDirection:'column',gap:'0.75rem',width:'100%',maxWidth:'320px'}}>
        <button onClick={() => setPantalla('login')} style={{width:'100%',padding:'1rem',background:'#74C69D',color:'#1A1A2E',border:'2px solid #74C69D',borderRadius:'50px',fontSize:'0.95rem',fontWeight:'600',cursor:'pointer'}}>Comenzar prueba gratis — 7 días →</button>
        <button  style={{width:'100%',padding:'1rem',background:'transparent',color:'#ffffff',border:'2px solid #ffffff',borderRadius:'50px',fontSize:'1rem',fontWeight:'500',cursor:'pointer'}}>Ver planes y precios</button>
        <button onClick={() => setPantalla('como-funciona')} style={{width:'100%',padding:'0.75rem',background:'transparent',color:'rgba(255,255,255,0.7)',border:'none',fontSize:'0.88rem',cursor:'pointer'}}>Ver cómo funciona ↓</button>
        <button onClick={() => setPantalla('login')} style={{width:'100%',padding:'0.5rem',background:'transparent',color:'rgba(255,255,255,0.5)',border:'none',fontSize:'0.85rem',cursor:'pointer'}}>Ya tengo cuenta →</button>
      </div>
      <p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.78rem',marginTop:'1rem',textAlign:'center'}}>Sin tarjeta de crédito. Cancela cuando quieras.</p>
    </main>
  )
}