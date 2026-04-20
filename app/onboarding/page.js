'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

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

function InputWhatsapp({ value, onChange, placeholder }) {
  const [tocado, setTocado] = useState(false)
  const valido = validarWhatsapp(value)
  const mostrarError = tocado && value.length > 1 && !valido

  return (
    <div style={{ marginBottom:'0.75rem' }}>
      <div style={{ position:'relative' }}>
        <input
          placeholder={placeholder || 'WhatsApp (+56912345678)'}
          value={value}
          onChange={e => onChange(formatearWhatsapp(e.target.value))}
          onBlur={() => setTocado(true)}
          inputMode="tel"
          style={{ width:'100%', padding:'0.8rem', paddingRight:value.length>3?'2.5rem':'0.8rem', border:`1.5px solid ${mostrarError?'#E76F51':valido&&tocado?'#74C69D':'#E5E7EB'}`, borderRadius:'12px', fontSize:'0.95rem', boxSizing:'border-box', outline:'none', fontFamily:'sans-serif', background:'white' }}
        />
        {value.length > 3 && <span style={{ position:'absolute', right:'0.75rem', top:'50%', transform:'translateY(-50%)', fontSize:'1rem' }}>{valido?'✅':'❌'}</span>}
      </div>
      <div style={{ background:'#F8F7F4', borderRadius:'10px', padding:'0.6rem 0.8rem', marginTop:'0.4rem' }}>
        <p style={{ fontSize:'0.75rem', color:'#6B7280', margin:'0 0 0.3rem', fontWeight:'500' }}>📱 Formato con código de país, sin espacios:</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
          {[['🇨🇱','+56912345678'],['🇺🇸','+12125551234'],['🇲🇽','+5215512345678']].map(([flag, ejemplo]) => (
            <span key={ejemplo} style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:'6px', padding:'0.15rem 0.5rem', fontSize:'0.72rem', color:'#4B5563', fontFamily:'monospace' }}>{flag} {ejemplo}</span>
          ))}
        </div>
      </div>
      {mostrarError && <p style={{ fontSize:'0.75rem', color:'#E76F51', margin:'0.3rem 0 0' }}>⚠️ El número parece muy corto. Revisa que incluya el código de país.</p>}
    </div>
  )
}

export default function Onboarding() {
  const [paso, setPaso] = useState(1)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [usuario, setUsuario] = useState(null)
  const [nombreHijo, setNombreHijo] = useState('')
  const [whatsappHijo, setWhatsappHijo] = useState('+')
  const [nombreFamiliar, setNombreFamiliar] = useState('')
  const [relacion, setRelacion] = useState('')
  const [whatsappFamiliar, setWhatsappFamiliar] = useState('+')
  const [ciudad, setCiudad] = useState('')
  const [categorias, setCategorias] = useState(['Medicinas','Alimentación','Estado de ánimo','Movilidad'])
  const [dias, setDias] = useState(['L','M','X','J','V','S','D'])
  const [horaManana, setHoraManana] = useState('08:00')
  const [horaMedio, setHoraMedio] = useState('13:00')
  const [horaTarde, setHoraTarde] = useState('17:00')
  const [activarManana, setActivarManana] = useState(true)
  const [activarMedio, setActivarMedio] = useState(true)
  const [activarTarde, setActivarTarde] = useState(true)
  const [activarNoche, setActivarNoche] = useState(false)

  useEffect(() => {
    const getUsuario = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUsuario(user)
    }
    getUsuario()
  }, [])

  const toggleCategoria = (nombre) => setCategorias(prev => prev.includes(nombre) ? prev.filter(c => c !== nombre) : [...prev, nombre])
  const toggleDia = (dia) => setDias(prev => prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia])

  const irPaso2 = async () => {
    if (!nombreHijo.trim()) { setError('Por favor ingresa tu nombre'); return }
    if (!validarWhatsapp(whatsappHijo)) { setError('El número de WhatsApp no es válido. Incluye el código de país sin espacios, ej: +56912345678'); return }
    setError(''); setCargando(true)
    try {
      await supabase.from('usuarios').upsert({ id: usuario.id, nombre: nombreHijo, whatsapp: whatsappHijo, plan: 'trial' })
      setPaso(2)
    } catch { setError('Error al guardar. Intenta de nuevo.') }
    finally { setCargando(false) }
  }

  const irPaso3 = async () => {
    if (!nombreFamiliar.trim()) { setError('Por favor ingresa el nombre de tu familiar'); return }
    if (!relacion) { setError('Por favor selecciona la relación'); return }
    if (!validarWhatsapp(whatsappFamiliar)) { setError('El número de WhatsApp no es válido. Incluye el código de país sin espacios, ej: +56972669589'); return }
    setError(''); setCargando(true)
    try {
      const { data: usuarioData } = await supabase.from('usuarios').select('plan_limite, plan_estado').eq('id', usuario.id).single()
      const limite = usuarioData?.plan_limite ?? 1
      const estado = usuarioData?.plan_estado ?? 'trial'
      const { count } = await supabase.from('familiares').select('id', { count:'exact' }).eq('usuario_id', usuario.id).eq('activo', true)
      if (count >= limite && estado !== 'trial') {
        setError(`Tu plan permite máximo ${limite} familiar${limite > 1 ? 'es' : ''}. Actualiza tu plan para agregar más.`)
        setCargando(false); return
      }
      setPaso(3)
    } catch { setPaso(3) }
    finally { setCargando(false) }
  }

  const finalizar = async () => {
    if (categorias.length === 0) { setError('Selecciona al menos una área'); return }
    if (dias.length === 0) { setError('Selecciona al menos un día'); return }
    setCargando(true); setError('')
    try {
      const { data: familiarData, error: familiarError } = await supabase.from('familiares').insert({ usuario_id: usuario.id, nombre: nombreFamiliar, relacion, whatsapp: whatsappFamiliar, ciudad, activo: true }).select().single()
      if (familiarError) throw familiarError
      await supabase.from('configuraciones').insert({ familiar_id: familiarData.id, categorias, dias, hora_manana: activarManana ? horaManana : null, hora_mediodia: activarMedio ? horaMedio : null, hora_tarde: activarTarde ? horaTarde : null, hora_noche: activarNoche ? '21:00' : null })
      setPaso(4)
    } catch (err) { setError('Error al guardar. Intenta de nuevo.'); console.error(err) }
    finally { setCargando(false) }
  }

  const estiloInput = { width:'100%', padding:'0.8rem', border:'1.5px solid #E5E7EB', borderRadius:'12px', marginBottom:'0.75rem', fontSize:'0.95rem', boxSizing:'border-box', outline:'none', fontFamily:'sans-serif' }
  const estiloBtn = { width:'100%', padding:'1rem', background:cargando?'#9CA3AF':'#2D6A4F', color:'white', border:'none', borderRadius:'12px', fontSize:'1rem', fontWeight:'500', cursor:cargando?'not-allowed':'pointer', marginTop:'0.5rem' }
  const fondoBase = { minHeight:'100vh', background:'linear-gradient(135deg, #1A1A2E 0%, #2D6A4F 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif', padding:'2rem' }
  const logo = <img src="/logo.png" alt="famvi" style={{ height:'32px', marginBottom:'1rem' }} />
  const card = (children) => <div style={{ background:'white', borderRadius:'24px', padding:'2rem', width:'100%', maxWidth:'420px', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>{children}</div>
  const pasoLabel = (n, total) => (
    <>
      <p style={{ fontSize:'0.72rem', color:'#2D6A4F', textTransform:'uppercase', letterSpacing:'2px', marginBottom:'0.5rem' }}>Paso {n} de {total}</p>
      <div style={{ width:'100%', height:'4px', background:'#E5E7EB', borderRadius:'2px', marginBottom:'1.2rem' }}>
        <div style={{ width:`${(n/total)*100}%`, height:'100%', background:'#2D6A4F', borderRadius:'2px' }}></div>
      </div>
    </>
  )

  if (paso === 1) return (
    <main style={fondoBase}>{logo}{card(<>
      {pasoLabel(1,3)}
      <h2 style={{ fontSize:'1.5rem', fontWeight:'400', marginBottom:'0.4rem' }}>Cuéntanos sobre ti</h2>
      <p style={{ color:'#6B7280', fontSize:'0.88rem', marginBottom:'1.5rem' }}>Te enviaremos alertas a este WhatsApp.</p>
      <input placeholder="Tu nombre completo" value={nombreHijo} onChange={e => setNombreHijo(e.target.value)} style={estiloInput} />
      <InputWhatsapp value={whatsappHijo} onChange={setWhatsappHijo} placeholder="Tu WhatsApp (+56912345678)" />
      <p style={{ fontSize:'0.78rem', color:'#9CA3AF', marginBottom:'1rem' }}>📧 Cuenta: {usuario?.email}</p>
      {error && <div style={{ background:'#FEE2E2', borderRadius:'10px', padding:'0.75rem', marginBottom:'1rem', fontSize:'0.82rem', color:'#E76F51' }}>{error}</div>}
      <button onClick={irPaso2} disabled={cargando} style={estiloBtn}>{cargando?'Guardando...':'Continuar →'}</button>
      <button onClick={() => window.location.href='/'} style={{ width:'100%', padding:'0.75rem', background:'none', border:'none', color:'#6B7280', fontSize:'0.85rem', cursor:'pointer', marginTop:'0.5rem' }}>← Volver</button>
    </>)}</main>
  )

  if (paso === 2) return (
    <main style={fondoBase}>{logo}{card(<>
      {pasoLabel(2,3)}
      <h2 style={{ fontSize:'1.5rem', fontWeight:'400', marginBottom:'0.4rem' }}>¿A quién cuidas?</h2>
      <p style={{ color:'#6B7280', fontSize:'0.88rem', marginBottom:'1.5rem' }}>No tiene que instalar nada — solo usa su WhatsApp.</p>
      <input placeholder="Nombre de tu familiar" value={nombreFamiliar} onChange={e => setNombreFamiliar(e.target.value)} style={estiloInput} />
      <select value={relacion} onChange={e => setRelacion(e.target.value)} style={{ ...estiloInput, color:relacion?'#1A1A2E':'#9CA3AF' }}>
        <option value="">Selecciona la relación...</option>
        <option>Mamá</option><option>Papá</option><option>Abuela</option><option>Abuelo</option><option>Tía</option><option>Tío</option><option>Otro familiar</option>
      </select>
      <InputWhatsapp value={whatsappFamiliar} onChange={setWhatsappFamiliar} placeholder="WhatsApp de tu familiar (+56972669589)" />
      <input placeholder="Ciudad donde vive (ej. Santiago)" value={ciudad} onChange={e => setCiudad(e.target.value)} style={estiloInput} />
      {error && <div style={{ background:'#FEE2E2', borderRadius:'10px', padding:'0.75rem', marginBottom:'1rem', fontSize:'0.82rem', color:'#E76F51' }}>{error}</div>}
      <button onClick={irPaso3} style={estiloBtn}>Continuar →</button>
      <button onClick={() => { setPaso(1); setError('') }} style={{ width:'100%', padding:'0.75rem', background:'none', border:'none', color:'#6B7280', fontSize:'0.85rem', cursor:'pointer', marginTop:'0.5rem' }}>← Volver</button>
    </>)}</main>
  )

  if (paso === 3) return (
    <main style={{ ...fondoBase, justifyContent:'flex-start', paddingTop:'2rem' }}>{logo}{card(<>
      {pasoLabel(3,3)}
      <h2 style={{ fontSize:'1.5rem', fontWeight:'400', marginBottom:'0.4rem' }}>¿Qué quieres monitorear?</h2>
      <p style={{ color:'#6B7280', fontSize:'0.88rem', marginBottom:'1.2rem' }}>Elige áreas, días y horarios.</p>
      <p style={{ fontSize:'0.75rem', fontWeight:'500', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.6rem' }}>Áreas de cuidado</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem', marginBottom:'1.2rem' }}>
        {[['💊','Medicinas'],['🍽️','Alimentación'],['😊','Estado de ánimo'],['🚶','Movilidad'],['😴','Sueño'],['💧','Hidratación']].map(([icono, nombre]) => (
          <div key={nombre} onClick={() => toggleCategoria(nombre)} style={{ border:`1.5px solid ${categorias.includes(nombre)?'#2D6A4F':'#E5E7EB'}`, borderRadius:'12px', padding:'0.8rem', background:categorias.includes(nombre)?'#D8F3DC':'#F8F7F4', display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer' }}>
            <span style={{ fontSize:'1.1rem' }}>{icono}</span>
            <span style={{ fontSize:'0.83rem', fontWeight:'500', color:categorias.includes(nombre)?'#1A1A2E':'#6B7280' }}>{nombre}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize:'0.75rem', fontWeight:'500', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.6rem' }}>Días de envío</p>
      <div style={{ display:'flex', gap:'0.4rem', marginBottom:'1.2rem', justifyContent:'space-between' }}>
        {['L','M','X','J','V','S','D'].map(dia => (
          <div key={dia} onClick={() => toggleDia(dia)} style={{ flex:1, aspectRatio:'1', border:`1.5px solid ${dias.includes(dia)?'#2D6A4F':'#E5E7EB'}`, borderRadius:'10px', background:dias.includes(dia)?'#D8F3DC':'#F8F7F4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.78rem', fontWeight:'600', color:dias.includes(dia)?'#2D6A4F':'#6B7280', cursor:'pointer' }}>{dia}</div>
        ))}
      </div>
      <p style={{ fontSize:'0.75rem', fontWeight:'500', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.6rem' }}>Horarios</p>
      {[['🌅','Mañana',activarManana,setActivarManana,horaManana,setHoraManana],['☀️','Mediodía',activarMedio,setActivarMedio,horaMedio,setHoraMedio],['🌆','Tarde',activarTarde,setActivarTarde,horaTarde,setHoraTarde],['🌙','Noche',activarNoche,setActivarNoche,'21:00',null]].map(([icono,nombre,activo,setActivo,hora,setHora]) => (
        <div key={nombre} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.75rem 1rem', border:`1.5px solid ${activo?'#2D6A4F':'#E5E7EB'}`, borderRadius:'12px', marginBottom:'0.6rem', background:activo?'#D8F3DC':'#F8F7F4' }}>
          <input type="checkbox" checked={activo} onChange={e => setActivo(e.target.checked)} style={{ accentColor:'#2D6A4F', width:'16px', height:'16px', cursor:'pointer' }} />
          <span style={{ fontSize:'0.88rem', flex:1 }}>{icono} {nombre}</span>
          {setHora && activo && <input type="time" value={hora} onChange={e => setHora(e.target.value)} style={{ border:'1px solid #D1D5DB', borderRadius:'8px', padding:'0.25rem 0.4rem', fontSize:'0.78rem', background:'white' }} />}
          {!setHora && <span style={{ fontSize:'0.8rem', color:'#6B7280' }}>9:00 PM</span>}
        </div>
      ))}
      {error && <div style={{ background:'#FEE2E2', borderRadius:'10px', padding:'0.75rem', marginBottom:'1rem', fontSize:'0.82rem', color:'#E76F51' }}>{error}</div>}
      <button onClick={finalizar} disabled={cargando} style={estiloBtn}>{cargando?'Guardando...':'Activar Famvi ✓'}</button>
      <button onClick={() => { setPaso(2); setError('') }} style={{ width:'100%', padding:'0.75rem', background:'none', border:'none', color:'#6B7280', fontSize:'0.85rem', cursor:'pointer', marginTop:'0.5rem' }}>← Volver</button>
    </>)}</main>
  )

  return (
    <main style={fondoBase}>{logo}{card(<>
      <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
        <div style={{ width:'64px', height:'64px', background:'#D8F3DC', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', margin:'0 auto 1rem' }}>✅</div>
        <h2 style={{ fontSize:'1.5rem', fontWeight:'400', marginBottom:'0.4rem' }}>¡Todo listo!</h2>
        <p style={{ color:'#6B7280', fontSize:'0.88rem' }}>Así quedó configurado Famvi para {nombreFamiliar.split(' ')[0]}</p>
      </div>
      <div style={{ background:'#F8F7F4', borderRadius:'16px', padding:'1.2rem', marginBottom:'1rem' }}>
        <p style={{ fontSize:'0.75rem', fontWeight:'500', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.75rem' }}>Áreas monitoreadas</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
          {categorias.map(c => <span key={c} style={{ background:'#D8F3DC', color:'#2D6A4F', padding:'0.3rem 0.75rem', borderRadius:'20px', fontSize:'0.82rem', fontWeight:'500' }}>{c}</span>)}
        </div>
      </div>
      <div style={{ background:'#F8F7F4', borderRadius:'16px', padding:'1.2rem', marginBottom:'1rem' }}>
        <p style={{ fontSize:'0.75rem', fontWeight:'500', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.75rem' }}>Días de envío</p>
        <div style={{ display:'flex', gap:'0.4rem' }}>
          {['L','M','X','J','V','S','D'].map(d => <div key={d} style={{ width:'32px', height:'32px', borderRadius:'8px', background:dias.includes(d)?'#D8F3DC':'#E5E7EB', color:dias.includes(d)?'#2D6A4F':'#9CA3AF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.78rem', fontWeight:'600' }}>{d}</div>)}
        </div>
      </div>
      <div style={{ background:'#D8F3DC', borderRadius:'12px', padding:'1rem', marginBottom:'1.5rem', display:'flex', gap:'0.75rem', alignItems:'flex-start' }}>
        <span style={{ fontSize:'1.2rem' }}>💬</span>
        <p style={{ fontSize:'0.82rem', color:'#2D6A4F', lineHeight:'1.5', margin:0 }}>En unos minutos {nombreFamiliar.split(' ')[0]} recibirá su primer mensaje de Famvi en WhatsApp al número {whatsappFamiliar}.</p>
      </div>
      <button onClick={() => window.location.href='/dashboard'} style={estiloBtn}>Ver mi dashboard →</button>
    </>)}</main>
  )
}