'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Dashboard() {
  const [tab, setTab] = useState('inicio')
  const [usuario, setUsuario] = useState(null)
  const [familiares, setFamiliares] = useState([])
  const [checkins, setCheckins] = useState([])
  const [cargando, setCargando] = useState(true)
  const [filtroFamiliar, setFiltroFamiliar] = useState('todos')

  const colores = ['#2D6A4F','#6B4226','#5B4E7E','#1A5276','#784212','#1B4F72']

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUsuario(user)

      const { data: familiaresData } = await supabase
        .from('familiares')
        .select('*, configuraciones(*)')
        .eq('usuario_id', user.id)
        .eq('activo', true)

      if (familiaresData) setFamiliares(familiaresData)

      if (familiaresData && familiaresData.length > 0) {
        const ids = familiaresData.map(f => f.id)
        const { data: checkinsData } = await supabase
          .from('checkins')
          .select('*')
          .in('familiar_id', ids)
          .order('creado_en', { ascending: false })
          .limit(20)
        if (checkinsData) setCheckins(checkinsData)
      }

      setCargando(false)
    }
    cargarDatos()
  }, [])

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const estiloNav = (t) => ({
    display:'flex', flexDirection:'column', alignItems:'center', gap:'0.15rem',
    cursor:'pointer', color: tab===t ? '#2D6A4F' : '#6B7280',
    fontSize:'0.68rem', fontWeight:'500', border:'none',
    background:'none', padding:'0.5rem'
  })

  if (cargando) return (
    <main style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F8F7F4', fontFamily:'sans-serif'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:'2rem', marginBottom:'1rem'}}>⏳</div>
        <p style={{color:'#6B7280'}}>Cargando tu dashboard...</p>
      </div>
    </main>
  )

  const nombreUsuario = usuario?.user_metadata?.full_name?.split(' ')[0] || usuario?.email?.split('@')[0] || 'tú'

  return (
    <main style={{minHeight:'100vh', background:'#F8F7F4', fontFamily:'sans-serif', paddingBottom:'70px'}}>

      <div style={{background:'white', padding:'1rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', position:'sticky', top:0, zIndex:10}}>
        <span style={{fontSize:'1.4rem', color:'#2D6A4F', fontWeight:'300'}}>fam<span style={{color:'#74C69D'}}>vi</span></span>
        <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
          <div style={{display:'flex', alignItems:'center', gap:'0.5rem', background:'#D8F3DC', padding:'0.35rem 0.85rem', borderRadius:'20px'}}>
            <div style={{width:'26px', height:'26px', background:'#2D6A4F', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'0.7rem', fontWeight:'600'}}>
              {nombreUsuario.charAt(0).toUpperCase()}
            </div>
            <span style={{fontSize:'0.82rem', fontWeight:'500', color:'#2D6A4F'}}>{nombreUsuario}</span>
          </div>
          <button onClick={cerrarSesion} style={{background:'none', border:'none', color:'#9CA3AF', fontSize:'0.8rem', cursor:'pointer'}}>Salir</button>
        </div>
      </div>

      <div style={{padding:'1.4rem', maxWidth:'600px', margin:'0 auto'}}>

        {tab === 'inicio' && (
          <div>
            <div style={{marginBottom:'1.1rem', marginTop:'0.5rem'}}>
              <h2 style={{fontSize:'1.35rem', fontWeight:'400', marginBottom:'0.2rem'}}>Hoy</h2>
              <p style={{color:'#6B7280', fontSize:'0.82rem'}}>{new Date().toLocaleDateString('es-ES',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
            </div>

            {familiares.length === 0 ? (
              <div style={{background:'white', borderRadius:'20px', padding:'2rem', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
                <div style={{fontSize:'2rem', marginBottom:'1rem'}}>👨‍👩‍👧</div>
                <h3 style={{fontSize:'1rem', fontWeight:'500', marginBottom:'0.5rem'}}>Aún no tienes familiares configurados</h3>
                <p style={{color:'#6B7280', fontSize:'0.85rem', marginBottom:'1.5rem'}}>Agrega a tu primer familiar para comenzar.</p>
                <button onClick={() => window.location.href='/onboarding'} style={{padding:'0.9rem 2rem', background:'#2D6A4F', color:'white', border:'none', borderRadius:'12px', fontSize:'0.95rem', fontWeight:'500', cursor:'pointer'}}>
                  Agregar familiar →
                </button>
              </div>
            ) : (
              <>
                <div style={{background:'white', borderRadius:'20px', padding:'1.4rem', marginBottom:'1.2rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', display:'flex', gap:'1rem', alignItems:'center'}}>
                  <div style={{width:'56px', height:'56px', borderRadius:'50%', background:'#F3F4F6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', flexShrink:0}}>⏳</div>
                  <div>
                    <h3 style={{fontSize:'0.95rem', fontWeight:'500', marginBottom:'0.2rem'}}>Esperando respuestas</h3>
                    <p style={{fontSize:'0.82rem', color:'#6B7280'}}>Los check-ins comenzarán según el horario configurado.</p>
                  </div>
                </div>

                <p style={{fontSize:'0.75rem', fontWeight:'500', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.75rem'}}>Tus familiares</p>
                {familiares.map((f, i) => (
                  <div key={f.id} style={{background:'white', borderRadius:'16px', padding:'1.1rem', marginBottom:'0.75rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', display:'flex', alignItems:'center', gap:'1rem'}}>
                    <div style={{width:'42px', height:'42px', borderRadius:'50%', background:colores[i % colores.length], display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'1rem', fontWeight:'600', flexShrink:0}}>
                      {f.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div style={{flex:1}}>
                      <h4 style={{fontSize:'0.9rem', fontWeight:'500', marginBottom:'0.2rem'}}>{f.nombre}</h4>
                      <p style={{fontSize:'0.78rem', color:'#6B7280'}}>{f.relacion} · {f.ciudad || ''} · {f.whatsapp}</p>
                    </div>
                    <span style={{width:'10px', height:'10px', borderRadius:'50%', background:'#D1D5DB', display:'block', flexShrink:0}}></span>
                  </div>
                ))}

                <div style={{background:'white', borderRadius:'12px', padding:'1rem', marginTop:'1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
                  <p style={{fontSize:'0.75rem', fontWeight:'500', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.75rem'}}>¿Qué significa cada color?</p>
                  <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                    {[['#74C69D','Todo bien — respondió y está bien'],['#F4A261','Atención — respondió pero hay algo que revisar'],['#E76F51','Alerta — no respondió o necesita ayuda'],['#D1D5DB','Pendiente — el check-in aún no ha llegado']].map(([color, texto]) => (
                      <div key={color} style={{display:'flex', alignItems:'center', gap:'0.6rem'}}>
                        <span style={{width:'10px', height:'10px', borderRadius:'50%', background:color, display:'block', flexShrink:0}}></span>
                        <span style={{fontSize:'0.82rem', color:'#6B7280'}}>{texto}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'historial' && (
          <div>
            <div style={{marginBottom:'1.1rem', marginTop:'0.5rem'}}>
              <h2 style={{fontSize:'1.35rem', fontWeight:'400', marginBottom:'0.2rem'}}>Historial</h2>
              <p style={{color:'#6B7280', fontSize:'0.82rem', marginBottom:'1rem'}}>Registro de check-ins</p>
              <div style={{display:'flex', gap:'0.5rem', overflowX:'auto', paddingBottom:'0.5rem'}}>
                {['todos', ...familiares.map(f => f.nombre)].map(opcion => (
                  <button key={opcion} onClick={() => setFiltroFamiliar(opcion)} style={{padding:'0.4rem 0.9rem', borderRadius:'20px', border:`1.5px solid ${filtroFamiliar===opcion?'#2D6A4F':'#E5E7EB'}`, background:filtroFamiliar===opcion?'#D8F3DC':'white', color:filtroFamiliar===opcion?'#2D6A4F':'#6B7280', fontSize:'0.8rem', fontWeight:'500', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0}}>
                    {opcion==='todos'?'Todos':opcion.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
            {checkins.length === 0 ? (
              <div style={{background:'white', borderRadius:'16px', padding:'2rem', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
                <p style={{fontSize:'2rem', marginBottom:'0.75rem'}}>📭</p>
                <p style={{color:'#6B7280', fontSize:'0.88rem'}}>Aún no hay check-ins. Aparecerán cuando tu familiar responda los mensajes.</p>
              </div>
            ) : (
              checkins
                .filter(c => filtroFamiliar === 'todos' || familiares.find(f => f.id === c.familiar_id)?.nombre === filtroFamiliar)
                .map((c, i) => (
                  <div key={i} style={{background:'white', borderRadius:'14px', padding:'1rem', marginBottom:'0.65rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', display:'flex', alignItems:'flex-start', gap:'0.8rem', borderLeft:`3px solid ${c.estado==='bien'?'#74C69D':c.estado==='atencion'?'#F4A261':'#E76F51'}`}}>
                    <div style={{flex:1}}>
                      <h4 style={{fontSize:'0.88rem', fontWeight:'500', marginBottom:'0.15rem'}}>{c.categoria}</h4>
                      <p style={{fontSize:'0.8rem', color:'#6B7280', marginBottom:'0.25rem'}}>{c.respuesta}</p>
                      <div style={{display:'flex', justifyContent:'space-between'}}>
                        <span style={{fontSize:'0.72rem', color:'#9CA3AF'}}>{familiares.find(f => f.id === c.familiar_id)?.nombre}</span>
                        <span style={{fontSize:'0.72rem', color:'#9CA3AF'}}>{new Date(c.creado_en).toLocaleString('es-ES',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</span>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {tab === 'familia' && (
          <div>
            <div style={{marginBottom:'1.1rem', marginTop:'0.5rem'}}>
              <h2 style={{fontSize:'1.35rem', fontWeight:'400', marginBottom:'0.2rem'}}>Mi familia</h2>
              <p style={{color:'#6B7280', fontSize:'0.82rem', marginBottom:'1.2rem'}}>Familiares que reciben check-ins</p>
            </div>
            {familiares.map((f, i) => (
              <div key={f.id} style={{background:'white', borderRadius:'18px', padding:'1.3rem', marginBottom:'1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
                <div style={{display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem'}}>
                  <div style={{width:'48px', height:'48px', borderRadius:'50%', background:colores[i % colores.length], display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'1.2rem', fontWeight:'600', flexShrink:0}}>
                    {f.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div style={{flex:1}}>
                    <h4 style={{fontSize:'0.95rem', fontWeight:'500', marginBottom:'0.15rem'}}>{f.nombre}</h4>
                    <p style={{fontSize:'0.8rem', color:'#6B7280'}}>{f.relacion} · {f.ciudad || ''}</p>
                    <p style={{fontSize:'0.78rem', color:'#6B7280'}}>📱 {f.whatsapp}</p>
                  </div>
                </div>
                {f.configuraciones?.[0] && (
                  <div style={{background:'#F8F7F4', borderRadius:'12px', padding:'0.85rem', marginBottom:'1rem'}}>
                    <div style={{display:'flex', flexWrap:'wrap', gap:'0.4rem', marginBottom:'0.5rem'}}>
                      {f.configuraciones[0].categorias?.map(c => (
                        <span key={c} style={{background:'#D8F3DC', color:'#2D6A4F', padding:'0.2rem 0.6rem', borderRadius:'20px', fontSize:'0.75rem'}}>{c}</span>
                      ))}
                    </div>
                    <div style={{display:'flex', gap:'0.3rem'}}>
                      {['L','M','X','J','V','S','D'].map(d => (
                        <div key={d} style={{width:'24px', height:'24px', borderRadius:'6px', background:f.configuraciones[0].dias?.includes(d)?'#D8F3DC':'#E5E7EB', color:f.configuraciones[0].dias?.includes(d)?'#2D6A4F':'#9CA3AF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.68rem', fontWeight:'600'}}>
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={() => window.open(`https://wa.me/${f.whatsapp.replace(/\D/g,'')}`, '_blank')} style={{width:'100%', padding:'0.7rem', background:'#25D366', color:'white', border:'none', borderRadius:'10px', fontSize:'0.82rem', fontWeight:'500', cursor:'pointer'}}>
                  💬 Enviar WhatsApp
                </button>
              </div>
            ))}
            <button onClick={() => window.location.href='/onboarding'} style={{width:'100%', padding:'1rem', background:'transparent', border:'2px dashed #D1D5DB', borderRadius:'16px', color:'#6B7280', fontSize:'0.9rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem'}}>
              + Agregar familiar
            </button>
          </div>
        )}

        {tab === 'config' && (
          <div>
            <div style={{marginBottom:'1.1rem', marginTop:'0.5rem'}}>
              <h2 style={{fontSize:'1.35rem', fontWeight:'400', marginBottom:'0.2rem'}}>Configuración</h2>
              <p style={{color:'#6B7280', fontSize:'0.82rem', marginBottom:'1.2rem'}}>Tu cuenta y preferencias</p>
            </div>
            <div style={{background:'white', borderRadius:'16px', padding:'1.2rem', marginBottom:'1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
              <p style={{fontSize:'0.75rem', fontWeight:'500', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.75rem'}}>Tu cuenta</p>
              <p style={{fontSize:'0.88rem', color:'#1A1A2E', marginBottom:'0.3rem'}}>📧 {usuario?.email}</p>
              <p style={{fontSize:'0.82rem', color:'#6B7280'}}>Plan: Trial (7 días gratis)</p>
            </div>
            <div style={{background:'#2D6A4F', borderRadius:'16px', padding:'1.2rem', marginBottom:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <p style={{fontSize:'0.75rem', color:'rgba(255,255,255,0.6)', marginBottom:'0.2rem', textTransform:'uppercase', letterSpacing:'0.5px'}}>Actualiza tu plan</p>
                <h3 style={{fontSize:'1rem', fontWeight:'600', color:'white', marginBottom:'0.2rem'}}>Elige el plan ideal</h3>
                <p style={{fontSize:'0.82rem', color:'rgba(255,255,255,0.7)'}}>Desde $9.99/mes</p>
              </div>
              <button onClick={() => window.location.href='/precios'} style={{background:'#74C69D', color:'#1A1A2E', border:'none', borderRadius:'10px', padding:'0.6rem 1rem', fontSize:'0.82rem', fontWeight:'600', cursor:'pointer'}}>Ver planes</button>
            </div>
            <button onClick={cerrarSesion} style={{width:'100%', padding:'1rem', background:'white', color:'#E76F51', border:'1.5px solid #E76F51', borderRadius:'12px', fontSize:'0.95rem', fontWeight:'500', cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      <div style={{background:'white', padding:'0.75rem 1.5rem', display:'flex', justifyContent:'space-around', boxShadow:'0 -2px 16px rgba(0,0,0,0.06)', position:'fixed', bottom:0, width:'100%', maxWidth:'600px', left:'50%', transform:'translateX(-50%)'}}>
        {[['inicio','🏠','Inicio'],['historial','📊','Historial'],['familia','👥','Familia'],['config','⚙️','Config']].map(([t, icono, label]) => (
          <button key={t} onClick={() => setTab(t)} style={estiloNav(t)}>
            <span style={{fontSize:'1.25rem'}}>{icono}</span>
            {label}
          </button>
        ))}
      </div>
    </main>
  )
}