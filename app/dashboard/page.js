'use client'

import { useState } from 'react'

export default function Dashboard() {
  const [tab, setTab] = useState('inicio')
  const [filtroFamiliar, setFiltroFamiliar] = useState('todos')

  const familiares = [
    {id:1, nombre:'María García', relacion:'Mamá', ciudad:'Ciudad de México', estado:'verde', ultima:'hace 2h', checkins:3, avatar:'M', color:'#2D6A4F'},
    {id:2, nombre:'Armando García', relacion:'Papá', ciudad:'Guadalajara', estado:'amarillo', ultima:'hace 5h', checkins:1, avatar:'A', color:'#6B4226'},
    {id:3, nombre:'Rosa Pérez', relacion:'Abuela', ciudad:'Monterrey', estado:'rojo', ultima:'ayer', checkins:0, avatar:'R', color:'#5B4E7E'},
  ]

  const historial = [
    {familiar:'María García', tipo:'💊', titulo:'Medicinas tomadas', desc:'Confirmó medicina de la mañana.', hora:'Hoy, 8:14 AM', color:'#74C69D'},
    {familiar:'María García', tipo:'😊', titulo:'Ánimo regular', desc:'Se siente "más o menos". Considera llamarla.', hora:'Hoy, 1:02 PM', color:'#F4A261'},
    {familiar:'María García', tipo:'🍽️', titulo:'Almorzó bien', desc:'Respondió que comió sopa de pollo y fruta.', hora:'Hoy, 1:05 PM', color:'#74C69D'},
    {familiar:'Armando García', tipo:'💊', titulo:'Medicinas tomadas', desc:'Confirmó medicina de la mañana.', hora:'Hoy, 8:30 AM', color:'#74C69D'},
    {familiar:'Armando García', tipo:'🍽️', titulo:'Sin respuesta', desc:'No respondió el check-in del mediodía.', hora:'Hoy, 1:00 PM', color:'#E76F51'},
    {familiar:'Rosa Pérez', tipo:'⚠️', titulo:'Sin respuesta', desc:'No respondió ningún check-in de hoy.', hora:'Hoy, 8:00 AM', color:'#E76F51'},
    {familiar:'María García', tipo:'💊', titulo:'Medicinas tomadas', desc:'Confirmó medicina de la mañana.', hora:'Ayer, 8:09 AM', color:'#74C69D'},
    {familiar:'María García', tipo:'😊', titulo:'Ánimo excelente', desc:'Dice que se siente muy bien hoy.', hora:'Ayer, 1:15 PM', color:'#74C69D'},
    {familiar:'Armando García', tipo:'🚶', titulo:'Caminó 20 minutos', desc:'Salió a caminar por el parque.', hora:'Ayer, 5:10 PM', color:'#74C69D'},
  ]

  const historialFiltrado = filtroFamiliar === 'todos' ? historial : historial.filter(h => h.familiar === filtroFamiliar)

  const estiloNav = (t) => ({
    display:'flex', flexDirection:'column', alignItems:'center', gap:'0.15rem',
    cursor:'pointer', color: tab===t ? '#2D6A4F' : '#6B7280',
    fontSize:'0.68rem', fontWeight:'500', transition:'color 0.2s', border:'none',
    background:'none', padding:'0.5rem'
  })

  const estiloSemaforo = (estado) => ({
    width:'12px', height:'12px', borderRadius:'50%',
    background: estado==='verde'?'#74C69D': estado==='amarillo'?'#F4A261':'#E76F51',
    flexShrink:0
  })

  return (
    <main style={{minHeight:'100vh', background:'#F8F7F4', fontFamily:'sans-serif', paddingBottom:'70px'}}>

      {/* TOPBAR */}
      <div style={{background:'white', padding:'1rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', position:'sticky', top:0, zIndex:10}}>
        <span style={{fontSize:'1.4rem', color:'#2D6A4F', fontWeight:'300'}}>fam<span style={{color:'#74C69D'}}>vi</span></span>
        <div style={{display:'flex', alignItems:'center', gap:'0.5rem', background:'#D8F3DC', padding:'0.35rem 0.85rem', borderRadius:'20px'}}>
          <div style={{width:'26px', height:'26px', background:'#2D6A4F', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'0.7rem', fontWeight:'600'}}>A</div>
          <span style={{fontSize:'0.82rem', fontWeight:'500', color:'#2D6A4F'}}>Ana</span>
        </div>
      </div>

      <div style={{padding:'1.4rem', maxWidth:'600px', margin:'0 auto'}}>

        {/* TAB INICIO */}
        {tab === 'inicio' && (
          <div>
            <div style={{marginBottom:'1.1rem', marginTop:'0.5rem'}}>
              <h2 style={{fontSize:'1.35rem', fontWeight:'400', marginBottom:'0.2rem'}}>Hoy</h2>
              <p style={{color:'#6B7280', fontSize:'0.82rem'}}>{new Date().toLocaleDateString('es-ES',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
            </div>

            {/* Resumen general */}
            <div style={{background:'white', borderRadius:'20px', padding:'1.4rem', marginBottom:'1.2rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', display:'flex', gap:'1rem', alignItems:'center'}}>
              <div style={{width:'56px', height:'56px', borderRadius:'50%', background:'#FEF3C7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', flexShrink:0}}>⚠️</div>
              <div>
                <h3 style={{fontSize:'0.95rem', fontWeight:'500', marginBottom:'0.2rem'}}>Hay 2 alertas hoy</h3>
                <p style={{fontSize:'0.82rem', color:'#6B7280'}}>Rosa no respondió ningún check-in. Armando no respondió el del mediodía.</p>
              </div>
            </div>

            {/* Familiares resumen */}
            <p style={{fontSize:'0.75rem', fontWeight:'500', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.75rem'}}>Estado de tus familiares</p>
            {familiares.map(f => (
              <div key={f.id} style={{background:'white', borderRadius:'16px', padding:'1.1rem', marginBottom:'0.75rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', display:'flex', alignItems:'center', gap:'1rem'}}>
                <div style={{width:'42px', height:'42px', borderRadius:'50%', background:f.color, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'1rem', fontWeight:'600', flexShrink:0}}>{f.avatar}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.2rem'}}>
                    <h4 style={{fontSize:'0.9rem', fontWeight:'500'}}>{f.nombre}</h4>
                    <span style={estiloSemaforo(f.estado)}></span>
                  </div>
                  <p style={{fontSize:'0.78rem', color:'#6B7280'}}>{f.relacion} · {f.checkins} check-in{f.checkins!==1?'s':''} hoy · {f.ultima}</p>
                </div>
              </div>
            ))}

            {/* Simbología */}
            <div style={{background:'white', borderRadius:'12px', padding:'1rem', marginBottom:'1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
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
          </div>
        )}

        {/* TAB HISTORIAL */}
        {tab === 'historial' && (
          <div>
            <div style={{marginBottom:'1.1rem', marginTop:'0.5rem'}}>
              <h2 style={{fontSize:'1.35rem', fontWeight:'400', marginBottom:'0.2rem'}}>Historial</h2>
              <p style={{color:'#6B7280', fontSize:'0.82rem', marginBottom:'1rem'}}>Registro completo de check-ins</p>

              {/* Filtro por familiar */}
              <div style={{display:'flex', gap:'0.5rem', overflowX:'auto', paddingBottom:'0.5rem'}}>
                {['todos', ...familiares.map(f => f.nombre)].map(opcion => (
                  <button key={opcion} onClick={() => setFiltroFamiliar(opcion)} style={{padding:'0.4rem 0.9rem', borderRadius:'20px', border:`1.5px solid ${filtroFamiliar===opcion?'#2D6A4F':'#E5E7EB'}`, background:filtroFamiliar===opcion?'#D8F3DC':'white', color:filtroFamiliar===opcion?'#2D6A4F':'#6B7280', fontSize:'0.8rem', fontWeight:'500', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0}}>
                    {opcion==='todos'?'Todos':opcion.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {historialFiltrado.map((h, i) => (
              <div key={i} style={{background:'white', borderRadius:'14px', padding:'1rem', marginBottom:'0.65rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', display:'flex', alignItems:'flex-start', gap:'0.8rem', borderLeft:`3px solid ${h.color}`}}>
                <span style={{fontSize:'1.1rem', flexShrink:0, marginTop:'0.1rem'}}>{h.tipo}</span>
                <div style={{flex:1}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.15rem'}}>
                    <h4 style={{fontSize:'0.88rem', fontWeight:'500'}}>{h.titulo}</h4>
                  </div>
                  <p style={{fontSize:'0.8rem', color:'#6B7280', marginBottom:'0.25rem'}}>{h.desc}</p>
                  <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span style={{fontSize:'0.72rem', color:'#9CA3AF'}}>{h.familiar}</span>
                    <span style={{fontSize:'0.72rem', color:'#9CA3AF'}}>{h.hora}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB FAMILIA */}
        {tab === 'familia' && (
          <div>
            <div style={{marginBottom:'1.1rem', marginTop:'0.5rem'}}>
              <h2 style={{fontSize:'1.35rem', fontWeight:'400', marginBottom:'0.2rem'}}>Mi familia</h2>
              <p style={{color:'#6B7280', fontSize:'0.82rem', marginBottom:'1.2rem'}}>Familiares que reciben check-ins</p>
            </div>

            {familiares.map(f => (
              <div key={f.id} style={{background:'white', borderRadius:'18px', padding:'1.3rem', marginBottom:'1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
                <div style={{display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem'}}>
                  <div style={{width:'48px', height:'48px', borderRadius:'50%', background:f.color, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'1.2rem', fontWeight:'600', flexShrink:0}}>{f.avatar}</div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <h4 style={{fontSize:'0.95rem', fontWeight:'500'}}>{f.nombre}</h4>
                      <span style={estiloSemaforo(f.estado)}></span>
                    </div>
                    <p style={{fontSize:'0.8rem', color:'#6B7280'}}>{f.relacion} · {f.ciudad}</p>
                  </div>
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.5rem', marginBottom:'1rem'}}>
                  {[['Check-ins hoy', f.checkins], ['Última respuesta', f.ultima], ['Estado', f.estado==='verde'?'✅ Bien':f.estado==='amarillo'?'⚠️ Atención':'🔴 Alerta']].map(([label, val]) => (
                    <div key={label} style={{background:'#F8F7F4', borderRadius:'10px', padding:'0.6rem', textAlign:'center'}}>
                      <p style={{fontSize:'0.68rem', color:'#9CA3AF', marginBottom:'0.2rem'}}>{label}</p>
                      <p style={{fontSize:'0.82rem', fontWeight:'500', color:'#1A1A2E'}}>{val}</p>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex', gap:'0.5rem'}}>
                  <button style={{flex:1, padding:'0.7rem', background:'#25D366', color:'white', border:'none', borderRadius:'10px', fontSize:'0.82rem', fontWeight:'500', cursor:'pointer'}}>💬 WhatsApp</button>
                  <button style={{flex:1, padding:'0.7rem', background:'#F8F7F4', color:'#6B7280', border:'1.5px solid #E5E7EB', borderRadius:'10px', fontSize:'0.82rem', fontWeight:'500', cursor:'pointer'}}>⚙️ Configurar</button>
                </div>
              </div>
            ))}

            <button style={{width:'100%', padding:'1rem', background:'transparent', border:'2px dashed #D1D5DB', borderRadius:'16px', color:'#6B7280', fontSize:'0.9rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem'}}>
              + Agregar familiar
            </button>
          </div>
        )}

        {/* TAB CONFIGURACIÓN */}
        {tab === 'config' && (
          <div>
            <div style={{marginBottom:'1.1rem', marginTop:'0.5rem'}}>
              <h2 style={{fontSize:'1.35rem', fontWeight:'400', marginBottom:'0.2rem'}}>Configuración</h2>
              <p style={{color:'#6B7280', fontSize:'0.82rem', marginBottom:'1.2rem'}}>Ajusta los check-ins de tus familiares</p>
            </div>

            {/* Plan actual */}
            <div style={{background:'#2D6A4F', borderRadius:'16px', padding:'1.2rem', marginBottom:'1.2rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <p style={{fontSize:'0.75rem', color:'rgba(255,255,255,0.6)', marginBottom:'0.2rem', textTransform:'uppercase', letterSpacing:'0.5px'}}>Tu plan actual</p>
                <h3 style={{fontSize:'1.1rem', fontWeight:'600', color:'white', marginBottom:'0.2rem'}}>Plan Familiar</h3>
                <p style={{fontSize:'0.82rem', color:'rgba(255,255,255,0.7)'}}>hasta 3 familiares · $17.99/mes</p>
              </div>
              <button style={{background:'#74C69D', color:'#1A1A2E', border:'none', borderRadius:'10px', padding:'0.6rem 1rem', fontSize:'0.82rem', fontWeight:'600', cursor:'pointer'}}>Cambiar</button>
            </div>

            {/* Selector de familiar */}
            <div style={{background:'white', borderRadius:'16px', padding:'1.2rem', marginBottom:'1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
              <p style={{fontSize:'0.75rem', fontWeight:'500', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.75rem'}}>Configurar familiar</p>
              <select style={{width:'100%', padding:'0.8rem', border:'1.5px solid #E5E7EB', borderRadius:'12px', fontSize:'0.95rem', color:'#1A1A2E', background:'#F8F7F4'}}>
                {familiares.map(f => <option key={f.id}>{f.nombre} — {f.relacion}</option>)}
              </select>
            </div>

            {/* Días */}
            <div style={{background:'white', borderRadius:'16px', padding:'1.2rem', marginBottom:'1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
              <p style={{fontSize:'0.75rem', fontWeight:'500', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.75rem'}}>Días de envío</p>
              <div style={{display:'flex', gap:'0.4rem', justifyContent:'space-between'}}>
                {['L','M','X','J','V','S','D'].map((dia, i) => (
                  <div key={dia} style={{flex:1, aspectRatio:'1', border:`1.5px solid ${i<5?'#2D6A4F':'#E5E7EB'}`, borderRadius:'10px', background:i<5?'#D8F3DC':'#F8F7F4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.78rem', fontWeight:'600', color:i<5?'#2D6A4F':'#6B7280', cursor:'pointer'}}>
                    {dia}
                  </div>
                ))}
              </div>
            </div>

            {/* Horarios */}
            <div style={{background:'white', borderRadius:'16px', padding:'1.2rem', marginBottom:'1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
              <p style={{fontSize:'0.75rem', fontWeight:'500', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.75rem'}}>Horarios de check-in</p>
              {[['🌅','Mañana','8:00 AM', true],['☀️','Mediodía','1:00 PM', true],['🌆','Tarde','5:00 PM', true],['🌙','Noche','9:00 PM', false]].map(([icono, nombre, hora, activo]) => (
                <div key={nombre} style={{display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.75rem 0', borderBottom:'1px solid #F3F4F6'}}>
                  <span style={{fontSize:'1rem'}}>{icono}</span>
                  <span style={{flex:1, fontSize:'0.88rem'}}>{nombre}</span>
                  <span style={{fontSize:'0.85rem', color:'#2D6A4F', fontWeight:'500'}}>{hora}</span>
                  <div style={{width:'36px', height:'20px', borderRadius:'10px', background:activo?'#2D6A4F':'#D1D5DB', position:'relative', cursor:'pointer'}}>
                    <div style={{width:'16px', height:'16px', borderRadius:'50%', background:'white', position:'absolute', top:'2px', left:activo?'18px':'2px', transition:'left 0.2s'}}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Categorías */}
            <div style={{background:'white', borderRadius:'16px', padding:'1.2rem', marginBottom:'1.5rem', boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
              <p style={{fontSize:'0.75rem', fontWeight:'500', color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.75rem'}}>Áreas monitoreadas</p>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem'}}>
                {[['💊','Medicinas',true],['🍽️','Alimentación',true],['😊','Estado de ánimo',true],['🚶','Movilidad',true],['😴','Sueño',false],['💧','Hidratación',false]].map(([icono, nombre, activo]) => (
                  <div key={nombre} style={{border:`1.5px solid ${activo?'#2D6A4F':'#E5E7EB'}`, borderRadius:'12px', padding:'0.8rem', background:activo?'#D8F3DC':'#F8F7F4', display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer'}}>
                    <span style={{fontSize:'1.1rem'}}>{icono}</span>
                    <span style={{fontSize:'0.83rem', fontWeight:'500', color:activo?'#1A1A2E':'#6B7280'}}>{nombre}</span>
                  </div>
                ))}
              </div>
            </div>

            <button style={{width:'100%', padding:'1rem', background:'#2D6A4F', color:'white', border:'none', borderRadius:'12px', fontSize:'0.95rem', fontWeight:'500', cursor:'pointer'}}>Guardar cambios ✓</button>
          </div>
        )}
      </div>

      {/* NAV BOTTOM */}
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