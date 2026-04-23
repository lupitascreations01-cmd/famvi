'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const ESTADO_CONFIG = {
  verde:    { color:'#74C69D', bg:'#D8F3DC', emoji:'✅', texto:'Bien' },
  amarillo: { color:'#F4A261', bg:'#FEF3C7', emoji:'⏰', texto:'Atención' },
  rojo:     { color:'#E76F51', bg:'#FEE2E2', emoji:'🚨', texto:'Alerta' },
  pendiente:{ color:'#D1D5DB', bg:'#F3F4F6', emoji:'⏳', texto:'Pendiente' },
}

const CATEGORIA_EMOJI = { medicamentos:'💊', comida:'🍽️', ejercicio:'🚶', bienestar:'💙', mensaje:'💬', default:'📋' }

function formatearWhatsapp(valor) {
  let limpio = valor.replace(/[^\d+]/g, '')
  if (limpio.startsWith('00')) limpio = '+' + limpio.slice(2)
  if (!limpio.startsWith('+')) limpio = '+' + limpio
  return limpio
}

function validarWhatsapp(numero) {
  const soloDigitos = numero.replace('+', '')
  return soloDigitos.length >= 8 && soloDigitos.length <= 15
}

function EstadoBadge({ estado }) {
  const cfg = ESTADO_CONFIG[estado] || ESTADO_CONFIG.pendiente
  return (
    <span style={{ background:cfg.bg, color:cfg.color, padding:'0.2rem 0.6rem', borderRadius:'20px', fontSize:'0.72rem', fontWeight:'600', display:'inline-flex', alignItems:'center', gap:'0.25rem' }}>
      {cfg.emoji} {cfg.texto}
    </span>
  )
}

function ModalEditar({ familiar, onClose, onGuardado }) {
  const config = familiar.configuraciones?.[0] || {}
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  // Campos del familiar
  const [nombre, setNombre] = useState(familiar.nombre || '')
  const [relacion, setRelacion] = useState(familiar.relacion || '')
  const [whatsapp, setWhatsapp] = useState(familiar.whatsapp || '+')
  const [ciudad, setCiudad] = useState(familiar.ciudad || '')

  // Campos de configuración
  const [categorias, setCategorias] = useState(config.categorias || ['Medicinas'])
  const [dias, setDias] = useState(config.dias || ['L','M','X','J','V','S','D'])
  const [horaManana, setHoraManana] = useState(config.hora_manana || '08:00')
  const [horaMedio, setHoraMedio] = useState(config.hora_mediodia || '13:00')
  const [horaTarde, setHoraTarde] = useState(config.hora_tarde || '17:00')
  const [activarManana, setActivarManana] = useState(!!config.hora_manana)
  const [activarMedio, setActivarMedio] = useState(!!config.hora_mediodia)
  const [activarTarde, setActivarTarde] = useState(!!config.hora_tarde)
  const [activarNoche, setActivarNoche] = useState(!!config.hora_noche)

  const toggleCategoria = (c) => setCategorias(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  const toggleDia = (d) => setDias(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])

  const guardar = async () => {
    if (!nombre.trim()) { setError('El nombre es obligatorio'); return }
    if (!validarWhatsapp(whatsapp)) { setError('Número de WhatsApp inválido. Incluye el código de país, ej: +56912345678'); return }
    if (categorias.length === 0) { setError('Selecciona al menos una área'); return }
    if (dias.length === 0) { setError('Selecciona al menos un día'); return }

    setGuardando(true); setError('')
    try {
      // Actualizar familiar
      const { error: errorFamiliar } = await supabase
        .from('familiares')
        .update({ nombre, relacion, whatsapp, ciudad })
        .eq('id', familiar.id)
      if (errorFamiliar) throw errorFamiliar

      // Actualizar o insertar configuración
      const configData = {
        familiar_id: familiar.id,
        categorias,
        dias,
        hora_manana: activarManana ? horaManana : null,
        hora_mediodia: activarMedio ? horaMedio : null,
        hora_tarde: activarTarde ? horaTarde : null,
        hora_noche: activarNoche ? '21:00' : null,
      }

      if (config.id) {
        await supabase.from('configuraciones').update(configData).eq('id', config.id)
      } else {
        await supabase.from('configuraciones').insert(configData)
      }

      onGuardado()
    } catch (err) {
      setError('Error al guardar. Intenta de nuevo.')
      console.error(err)
    } finally {
      setGuardando(false)
    }
  }

  const estiloInput = { width:'100%', padding:'0.75rem', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'0.9rem', boxSizing:'border-box', outline:'none', fontFamily:'sans-serif', marginBottom:'0.65rem' }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:100, display:'flex', alignItems:'flex-end', justifyContent:'center' }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background:'white', borderRadius:'24px 24px 0 0', width:'100%', maxWidth:'600px', maxHeight:'90vh', overflowY:'auto', padding:'1.5rem' }}>
        {/* Handle */}
        <div style={{ width:'40px', height:'4px', background:'#E5E7EB', borderRadius:'2px', margin:'0 auto 1.2rem' }}></div>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' }}>
          <h3 style={{ fontSize:'1.1rem', fontWeight:'500', margin:0 }}>Editar familiar</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'1.3rem', cursor:'pointer', color:'#6B7280' }}>✕</button>
        </div>

        {/* Datos del familiar */}
        <p style={{ fontSize:'0.72rem', fontWeight:'600', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.6rem' }}>Datos personales</p>
        <input placeholder="Nombre completo" value={nombre} onChange={e => setNombre(e.target.value)} style={estiloInput} />
        <select value={relacion} onChange={e => setRelacion(e.target.value)} style={{ ...estiloInput, color: relacion ? '#1A1A2E' : '#9CA3AF' }}>
          <option value="">Selecciona la relación...</option>
          <option>Mamá</option><option>Papá</option><option>Abuela</option><option>Abuelo</option><option>Tía</option><option>Tío</option><option>Otro familiar</option>
        </select>
        <div style={{ marginBottom:'0.65rem' }}>
          <div style={{ position:'relative' }}>
            <input
              placeholder="WhatsApp (+56912345678)"
              value={whatsapp}
              onChange={e => setWhatsapp(formatearWhatsapp(e.target.value))}
              inputMode="tel"
              style={{ ...estiloInput, marginBottom:0, paddingRight: whatsapp.length > 3 ? '2.5rem' : '0.75rem' }}
            />
            {whatsapp.length > 3 && (
              <span style={{ position:'absolute', right:'0.75rem', top:'50%', transform:'translateY(-50%)' }}>
                {validarWhatsapp(whatsapp) ? '✅' : '❌'}
              </span>
            )}
          </div>
        </div>
        <input placeholder="Ciudad (ej. Santiago)" value={ciudad} onChange={e => setCiudad(e.target.value)} style={estiloInput} />

        {/* Categorías */}
        <p style={{ fontSize:'0.72rem', fontWeight:'600', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', margin:'0.8rem 0 0.6rem' }}>Áreas de cuidado</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'0.8rem' }}>
          {[['💊','Medicinas'],['🍽️','Alimentación'],['😊','Estado de ánimo'],['🚶','Movilidad'],['😴','Sueño'],['💧','Hidratación']].map(([icono, cat]) => (
            <div key={cat} onClick={() => toggleCategoria(cat)} style={{ border:`1.5px solid ${categorias.includes(cat)?'#2D6A4F':'#E5E7EB'}`, borderRadius:'10px', padding:'0.65rem', background:categorias.includes(cat)?'#D8F3DC':'#F8F7F4', display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer' }}>
              <span>{icono}</span>
              <span style={{ fontSize:'0.8rem', fontWeight:'500', color:categorias.includes(cat)?'#1A1A2E':'#6B7280' }}>{cat}</span>
            </div>
          ))}
        </div>

        {/* Días */}
        <p style={{ fontSize:'0.72rem', fontWeight:'600', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.6rem' }}>Días de envío</p>
        <div style={{ display:'flex', gap:'0.4rem', marginBottom:'0.8rem', justifyContent:'space-between' }}>
          {['L','M','X','J','V','S','D'].map(dia => (
            <div key={dia} onClick={() => toggleDia(dia)} style={{ flex:1, aspectRatio:'1', border:`1.5px solid ${dias.includes(dia)?'#2D6A4F':'#E5E7EB'}`, borderRadius:'8px', background:dias.includes(dia)?'#D8F3DC':'#F8F7F4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:'600', color:dias.includes(dia)?'#2D6A4F':'#6B7280', cursor:'pointer' }}>{dia}</div>
          ))}
        </div>

        {/* Horarios */}
        <p style={{ fontSize:'0.72rem', fontWeight:'600', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.6rem' }}>Horarios</p>
        {[
          ['🌅','Mañana', activarManana, setActivarManana, horaManana, setHoraManana],
          ['☀️','Mediodía', activarMedio, setActivarMedio, horaMedio, setHoraMedio],
          ['🌆','Tarde', activarTarde, setActivarTarde, horaTarde, setHoraTarde],
          ['🌙','Noche', activarNoche, setActivarNoche, '21:00', null],
        ].map(([icono, nombre2, activo, setActivo, hora, setHora]) => (
          <div key={nombre2} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.65rem 0.85rem', border:`1.5px solid ${activo?'#2D6A4F':'#E5E7EB'}`, borderRadius:'10px', marginBottom:'0.5rem', background:activo?'#D8F3DC':'#F8F7F4' }}>
            <input type="checkbox" checked={activo} onChange={e => setActivo(e.target.checked)} style={{ accentColor:'#2D6A4F', width:'16px', height:'16px', cursor:'pointer' }} />
            <span style={{ fontSize:'0.85rem', flex:1 }}>{icono} {nombre2}</span>
            {setHora && activo && <input type="time" value={hora} onChange={e => setHora(e.target.value)} style={{ border:'1px solid #D1D5DB', borderRadius:'8px', padding:'0.25rem 0.4rem', fontSize:'0.78rem', background:'white' }} />}
            {!setHora && <span style={{ fontSize:'0.78rem', color:'#6B7280' }}>9:00 PM</span>}
          </div>
        ))}

        {error && <div style={{ background:'#FEE2E2', borderRadius:'10px', padding:'0.75rem', marginTop:'0.5rem', fontSize:'0.82rem', color:'#E76F51' }}>{error}</div>}

        <div style={{ display:'flex', gap:'0.75rem', marginTop:'1.2rem' }}>
          <button onClick={onClose} style={{ flex:1, padding:'0.9rem', background:'#F3F4F6', border:'none', borderRadius:'12px', fontSize:'0.9rem', color:'#6B7280', cursor:'pointer', fontWeight:'500' }}>Cancelar</button>
          <button onClick={guardar} disabled={guardando} style={{ flex:2, padding:'0.9rem', background:guardando?'#9CA3AF':'#2D6A4F', color:'white', border:'none', borderRadius:'12px', fontSize:'0.9rem', fontWeight:'600', cursor:guardando?'not-allowed':'pointer' }}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [tab, setTab] = useState('inicio')
  const [usuario, setUsuario] = useState(null)
  const [familiares, setFamiliares] = useState([])
  const [checkins, setCheckins] = useState([])
  const [cargando, setCargando] = useState(true)
  const [filtroFamiliar, setFiltroFamiliar] = useState('todos')
  const [familiarEditando, setFamiliarEditando] = useState(null)

  const colores = ['#2D6A4F','#6B4226','#5B4E7E','#1A5276','#784212','#1B4F72']

  const cargarDatos = async (userId) => {
    const { data: familiaresData } = await supabase.from('familiares').select('*, configuraciones(*)').eq('usuario_id', userId).eq('activo', true)
    if (familiaresData) setFamiliares(familiaresData)

    if (familiaresData && familiaresData.length > 0) {
      const ids = familiaresData.map(f => f.id)
      const { data: checkinsData } = await supabase.from('checkins').select('*').in('familiar_id', ids).order('creado_en', { ascending:false }).limit(50)
      if (checkinsData) setCheckins(checkinsData)
    }
  }

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUsuario(user)

      const { data: usuarioData } = await supabase.from('usuarios').select('plan, plan_estado, trial_hasta').eq('id', user.id).single()
      if (usuarioData) {
        const planEstado = usuarioData.plan_estado
        const trialHasta = usuarioData.trial_hasta ? new Date(usuarioData.trial_hasta) : null
        const trialExpirado = trialHasta && trialHasta < new Date()
        const planActivo = ['trial', 'trial_pagado', 'activo'].includes(planEstado)
        if (!planActivo || (trialExpirado && planEstado === 'trial')) {
          window.location.href = '/precios?expired=true'; return
        }
      }

      await cargarDatos(user.id)
      setCargando(false)
    }
    init()
  }, [])

  const cerrarSesion = async () => { await supabase.auth.signOut(); window.location.href = '/' }
  const estiloNav = (t) => ({ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.15rem', cursor:'pointer', color:tab===t?'#2D6A4F':'#6B7280', fontSize:'0.68rem', fontWeight:'500', border:'none', background:'none', padding:'0.5rem' })
  const checkinsDehoy = checkins.filter(c => new Date(c.creado_en).toDateString() === new Date().toDateString())

  const estadoFamiliar = (familiarId) => {
    const hoy = checkinsDehoy.filter(c => c.familiar_id === familiarId)
    if (hoy.length === 0) return 'pendiente'
    if (hoy.some(c => c.estado === 'rojo')) return 'rojo'
    if (hoy.some(c => c.estado === 'amarillo')) return 'amarillo'
    return 'verde'
  }

  const nombreUsuario = usuario?.user_metadata?.full_name?.split(' ')[0] || usuario?.email?.split('@')[0] || 'tú'

  if (cargando) return (
    <main style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F8F7F4', fontFamily:'sans-serif' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'2rem', marginBottom:'1rem' }}>⏳</div>
        <p style={{ color:'#6B7280' }}>Cargando tu dashboard...</p>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight:'100vh', background:'#F8F7F4', fontFamily:'sans-serif', paddingBottom:'70px' }}>

      {familiarEditando && (
        <ModalEditar
          familiar={familiarEditando}
          onClose={() => setFamiliarEditando(null)}
          onGuardado={async () => {
            setFamiliarEditando(null)
            await cargarDatos(usuario.id)
          }}
        />
      )}

      {/* Header */}
      <div style={{ background:'white', padding:'1rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', position:'sticky', top:0, zIndex:10 }}>
        <img src="/logo.png" alt="famvi" style={{ height:'32px' }} />
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'#D8F3DC', padding:'0.35rem 0.85rem', borderRadius:'20px' }}>
            <div style={{ width:'26px', height:'26px', background:'#2D6A4F', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'0.7rem', fontWeight:'600' }}>{nombreUsuario.charAt(0).toUpperCase()}</div>
            <span style={{ fontSize:'0.82rem', fontWeight:'500', color:'#2D6A4F' }}>{nombreUsuario}</span>
          </div>
          <button onClick={cerrarSesion} style={{ background:'none', border:'none', color:'#9CA3AF', fontSize:'0.8rem', cursor:'pointer' }}>Salir</button>
        </div>
      </div>

      <div style={{ padding:'1.4rem', maxWidth:'600px', margin:'0 auto' }}>

        {tab === 'inicio' && (
          <div>
            <div style={{ marginBottom:'1.1rem', marginTop:'0.5rem' }}>
              <h2 style={{ fontSize:'1.35rem', fontWeight:'400', marginBottom:'0.2rem' }}>Hoy</h2>
              <p style={{ color:'#6B7280', fontSize:'0.82rem' }}>{new Date().toLocaleDateString('es-ES',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
            </div>
            {familiares.length === 0 ? (
              <div style={{ background:'white', borderRadius:'20px', padding:'2rem', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.07)' }}>
                <div style={{ fontSize:'2rem', marginBottom:'1rem' }}>👨‍👩‍👧</div>
                <h3 style={{ fontSize:'1rem', fontWeight:'500', marginBottom:'0.5rem' }}>Aún no tienes familiares configurados</h3>
                <p style={{ color:'#6B7280', fontSize:'0.85rem', marginBottom:'1.5rem' }}>Agrega a tu primer familiar para comenzar.</p>
                <button onClick={() => window.location.href='/onboarding'} style={{ padding:'0.9rem 2rem', background:'#2D6A4F', color:'white', border:'none', borderRadius:'12px', fontSize:'0.95rem', fontWeight:'500', cursor:'pointer' }}>Agregar familiar →</button>
              </div>
            ) : (
              <>
                <p style={{ fontSize:'0.75rem', fontWeight:'500', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.75rem' }}>Estado de hoy</p>
                {familiares.map((f, i) => {
                  const estado = estadoFamiliar(f.id)
                  const cfg = ESTADO_CONFIG[estado]
                  const ultimoCheckin = checkinsDehoy.find(c => c.familiar_id === f.id)
                  return (
                    <div key={f.id} style={{ background:'white', borderRadius:'16px', padding:'1.1rem', marginBottom:'0.75rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', display:'flex', alignItems:'center', gap:'1rem', borderLeft:`4px solid ${cfg.color}` }}>
                      <div style={{ width:'42px', height:'42px', borderRadius:'50%', background:colores[i%colores.length], display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'1rem', fontWeight:'600', flexShrink:0 }}>{f.nombre.charAt(0).toUpperCase()}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.2rem' }}>
                          <h4 style={{ fontSize:'0.9rem', fontWeight:'500', margin:0 }}>{f.nombre}</h4>
                          <EstadoBadge estado={estado} />
                        </div>
                        <p style={{ fontSize:'0.78rem', color:'#6B7280', margin:0 }}>{ultimoCheckin ? `${CATEGORIA_EMOJI[ultimoCheckin.categoria]||'📋'} ${ultimoCheckin.resumen||ultimoCheckin.respuesta||'Respondió'}` : 'Sin check-ins hoy aún'}</p>
                      </div>
                    </div>
                  )
                })}
                {checkinsDehoy.length > 0 && (
                  <>
                    <p style={{ fontSize:'0.75rem', fontWeight:'500', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.75rem', marginTop:'1.2rem' }}>Últimas respuestas</p>
                    {checkinsDehoy.slice(0,5).map((c, i) => {
                      const familiar = familiares.find(f => f.id === c.familiar_id)
                      const cfg = ESTADO_CONFIG[c.estado] || ESTADO_CONFIG.pendiente
                      return (
                        <div key={i} style={{ background:'white', borderRadius:'12px', padding:'0.9rem', marginBottom:'0.5rem', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', display:'flex', gap:'0.75rem', alignItems:'flex-start', borderLeft:`3px solid ${cfg.color}` }}>
                          <span style={{ fontSize:'1.2rem' }}>{CATEGORIA_EMOJI[c.categoria]||'📋'}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.15rem' }}>
                              <span style={{ fontSize:'0.82rem', fontWeight:'500' }}>{familiar?.nombre}</span>
                              <EstadoBadge estado={c.estado} />
                            </div>
                            <p style={{ fontSize:'0.78rem', color:'#6B7280', margin:0 }}>{c.respuesta||c.resumen||'—'}</p>
                          </div>
                        </div>
                      )
                    })}
                  </>
                )}
                <div style={{ background:'white', borderRadius:'12px', padding:'1rem', marginTop:'1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)' }}>
                  <p style={{ fontSize:'0.75rem', fontWeight:'500', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.75rem' }}>¿Qué significa cada color?</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                    {Object.entries(ESTADO_CONFIG).map(([key, cfg]) => (
                      <div key={key} style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                        <span style={{ width:'10px', height:'10px', borderRadius:'50%', background:cfg.color, display:'block', flexShrink:0 }}></span>
                        <span style={{ fontSize:'0.82rem', color:'#6B7280' }}>{cfg.emoji} {cfg.texto} — {key==='verde'?'Respondió y está bien':key==='amarillo'?'Hay algo que revisar':key==='rojo'?'No respondió o necesita ayuda':'El check-in aún no ha llegado'}</span>
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
            <div style={{ marginBottom:'1.1rem', marginTop:'0.5rem' }}>
              <h2 style={{ fontSize:'1.35rem', fontWeight:'400', marginBottom:'0.2rem' }}>Historial</h2>
              <p style={{ color:'#6B7280', fontSize:'0.82rem', marginBottom:'1rem' }}>Registro de check-ins</p>
              <div style={{ display:'flex', gap:'0.5rem', overflowX:'auto', paddingBottom:'0.5rem' }}>
                {['todos', ...familiares.map(f => f.nombre)].map(opcion => (
                  <button key={opcion} onClick={() => setFiltroFamiliar(opcion)} style={{ padding:'0.4rem 0.9rem', borderRadius:'20px', border:`1.5px solid ${filtroFamiliar===opcion?'#2D6A4F':'#E5E7EB'}`, background:filtroFamiliar===opcion?'#D8F3DC':'white', color:filtroFamiliar===opcion?'#2D6A4F':'#6B7280', fontSize:'0.8rem', fontWeight:'500', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
                    {opcion==='todos'?'Todos':opcion.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
            {checkins.length === 0 ? (
              <div style={{ background:'white', borderRadius:'16px', padding:'2rem', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.07)' }}>
                <p style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>📭</p>
                <p style={{ color:'#6B7280', fontSize:'0.88rem' }}>Aún no hay check-ins.</p>
              </div>
            ) : (
              checkins.filter(c => filtroFamiliar==='todos' || familiares.find(f => f.id===c.familiar_id)?.nombre===filtroFamiliar).map((c, i) => {
                const familiar = familiares.find(f => f.id === c.familiar_id)
                const cfg = ESTADO_CONFIG[c.estado] || ESTADO_CONFIG.pendiente
                return (
                  <div key={i} style={{ background:'white', borderRadius:'14px', padding:'1rem', marginBottom:'0.65rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', display:'flex', alignItems:'flex-start', gap:'0.8rem', borderLeft:`3px solid ${cfg.color}` }}>
                    <span style={{ fontSize:'1.3rem', marginTop:'0.1rem' }}>{CATEGORIA_EMOJI[c.categoria]||'📋'}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.2rem' }}>
                        <h4 style={{ fontSize:'0.88rem', fontWeight:'500', margin:0, textTransform:'capitalize' }}>{c.categoria}</h4>
                        <EstadoBadge estado={c.estado} />
                      </div>
                      {c.respuesta && <p style={{ fontSize:'0.8rem', color:'#4B5563', margin:'0.2rem 0' }}>"{c.respuesta}"</p>}
                      {c.resumen && <p style={{ fontSize:'0.75rem', color:'#9CA3AF', margin:'0.15rem 0' }}>{c.resumen}</p>}
                      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'0.3rem' }}>
                        <span style={{ fontSize:'0.72rem', color:'#9CA3AF' }}>{familiar?.nombre}</span>
                        <span style={{ fontSize:'0.72rem', color:'#9CA3AF' }}>{new Date(c.creado_en).toLocaleString('es-ES',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {tab === 'familia' && (
          <div>
            <div style={{ marginBottom:'1.1rem', marginTop:'0.5rem' }}>
              <h2 style={{ fontSize:'1.35rem', fontWeight:'400', marginBottom:'0.2rem' }}>Mi familia</h2>
              <p style={{ color:'#6B7280', fontSize:'0.82rem', marginBottom:'1.2rem' }}>Familiares que reciben check-ins</p>
            </div>
            {familiares.map((f, i) => (
              <div key={f.id} style={{ background:'white', borderRadius:'18px', padding:'1.3rem', marginBottom:'1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem' }}>
                  <div style={{ width:'48px', height:'48px', borderRadius:'50%', background:colores[i%colores.length], display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'1.2rem', fontWeight:'600', flexShrink:0 }}>{f.nombre.charAt(0).toUpperCase()}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.15rem' }}>
                      <h4 style={{ fontSize:'0.95rem', fontWeight:'500', margin:0 }}>{f.nombre}</h4>
                      <EstadoBadge estado={estadoFamiliar(f.id)} />
                    </div>
                    <p style={{ fontSize:'0.8rem', color:'#6B7280', margin:0 }}>{f.relacion} · {f.ciudad||''}</p>
                    <p style={{ fontSize:'0.78rem', color:'#6B7280', margin:0 }}>📱 {f.whatsapp}</p>
                  </div>
                </div>
                {f.configuraciones?.[0] && (
                  <div style={{ background:'#F8F7F4', borderRadius:'12px', padding:'0.85rem', marginBottom:'1rem' }}>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem', marginBottom:'0.5rem' }}>
                      {f.configuraciones[0].categorias?.map(c => <span key={c} style={{ background:'#D8F3DC', color:'#2D6A4F', padding:'0.2rem 0.6rem', borderRadius:'20px', fontSize:'0.75rem' }}>{c}</span>)}
                    </div>
                    <div style={{ display:'flex', gap:'0.3rem' }}>
                      {['L','M','X','J','V','S','D'].map(d => <div key={d} style={{ width:'24px', height:'24px', borderRadius:'6px', background:f.configuraciones[0].dias?.includes(d)?'#D8F3DC':'#E5E7EB', color:f.configuraciones[0].dias?.includes(d)?'#2D6A4F':'#9CA3AF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.68rem', fontWeight:'600' }}>{d}</div>)}
                    </div>
                  </div>
                )}
                <div style={{ display:'flex', gap:'0.6rem' }}>
                  <button onClick={() => setFamiliarEditando(f)} style={{ flex:1, padding:'0.7rem', background:'#F3F4F6', color:'#1A1A2E', border:'none', borderRadius:'10px', fontSize:'0.82rem', fontWeight:'500', cursor:'pointer' }}>✏️ Editar</button>
                  <button onClick={() => window.open(`https://wa.me/${f.whatsapp.replace(/\D/g,'')}`, '_blank')} style={{ flex:1, padding:'0.7rem', background:'#25D366', color:'white', border:'none', borderRadius:'10px', fontSize:'0.82rem', fontWeight:'500', cursor:'pointer' }}>💬 WhatsApp</button>
                </div>
              </div>
            ))}
            <button onClick={() => window.location.href='/onboarding'} style={{ width:'100%', padding:'1rem', background:'transparent', border:'2px dashed #D1D5DB', borderRadius:'16px', color:'#6B7280', fontSize:'0.9rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>+ Agregar familiar</button>
          </div>
        )}

        {tab === 'config' && (
          <div>
            <div style={{ marginBottom:'1.1rem', marginTop:'0.5rem' }}>
              <h2 style={{ fontSize:'1.35rem', fontWeight:'400', marginBottom:'0.2rem' }}>Configuración</h2>
              <p style={{ color:'#6B7280', fontSize:'0.82rem', marginBottom:'1.2rem' }}>Tu cuenta y preferencias</p>
            </div>
            <div style={{ background:'white', borderRadius:'16px', padding:'1.2rem', marginBottom:'1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)' }}>
              <p style={{ fontSize:'0.75rem', fontWeight:'500', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.75rem' }}>Tu cuenta</p>
              <p style={{ fontSize:'0.88rem', color:'#1A1A2E', marginBottom:'0.3rem' }}>📧 {usuario?.email}</p>
              <p style={{ fontSize:'0.82rem', color:'#6B7280' }}>Plan: Trial (7 días gratis)</p>
            </div>
            <div style={{ background:'#2D6A4F', borderRadius:'16px', padding:'1.2rem', marginBottom:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.6)', marginBottom:'0.2rem', textTransform:'uppercase', letterSpacing:'0.5px' }}>Actualiza tu plan</p>
                <h3 style={{ fontSize:'1rem', fontWeight:'600', color:'white', marginBottom:'0.2rem' }}>Elige el plan ideal</h3>
                <p style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.7)' }}>Desde $9.99/mes</p>
              </div>
              <button onClick={() => window.location.href='/precios'} style={{ background:'#74C69D', color:'#1A1A2E', border:'none', borderRadius:'10px', padding:'0.6rem 1rem', fontSize:'0.82rem', fontWeight:'600', cursor:'pointer' }}>Ver planes</button>
            </div>
            <button onClick={cerrarSesion} style={{ width:'100%', padding:'1rem', background:'white', color:'#E76F51', border:'1.5px solid #E76F51', borderRadius:'12px', fontSize:'0.95rem', fontWeight:'500', cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.07)' }}>Cerrar sesión</button>
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ background:'white', padding:'0.75rem 1.5rem', display:'flex', justifyContent:'space-around', boxShadow:'0 -2px 16px rgba(0,0,0,0.06)', position:'fixed', bottom:0, width:'100%', maxWidth:'600px', left:'50%', transform:'translateX(-50%)' }}>
        {[['inicio','🏠','Inicio'],['historial','📊','Historial'],['familia','👥','Familia'],['config','⚙️','Config']].map(([t, icono, label]) => (
          <button key={t} onClick={() => setTab(t)} style={estiloNav(t)}>
            <span style={{ fontSize:'1.25rem' }}>{icono}</span>
            {label}
          </button>
        ))}
      </div>
    </main>
  )
}