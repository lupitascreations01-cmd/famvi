export default function Privacidad() {
  return (
    <main style={{ minHeight:'100vh', background:'#F8F7F4', fontFamily:'sans-serif', padding:'2rem' }}>
      <div style={{ maxWidth:'700px', margin:'0 auto' }}>
        <a href="/" style={{ color:'#2D6A4F', fontSize:'0.88rem', textDecoration:'none', display:'inline-block', marginBottom:'2rem' }}>← Volver</a>
        <div style={{ marginBottom:'0.5rem' }}>
          <img src="/logo.png" alt="famvi" style={{ height:'28px' }} />
        </div>
        <h2 style={{ fontSize:'1.3rem', fontWeight:'500', color:'#1A1A2E', marginBottom:'0.3rem' }}>Política de Privacidad</h2>
        <p style={{ color:'#6B7280', fontSize:'0.85rem', marginBottom:'2rem' }}>Última actualización: abril 2026</p>
        {[
          ['1. Información que recopilamos','Recopilamos la información que nos proporcionas al crear tu cuenta (nombre, correo electrónico, número de WhatsApp), los datos de los familiares que registras (nombre, relación, número de WhatsApp, ciudad), las respuestas a los check-ins enviados por WhatsApp, y datos de uso del dashboard.'],
          ['2. Cómo usamos tu información','Usamos tu información para: enviar check-ins automáticos a tus familiares por WhatsApp, mostrarte el estado de bienestar de tus familiares en el dashboard, enviarte alertas cuando un familiar no responde, y mejorar el servicio.'],
          ['3. Datos de familiares','Los números de WhatsApp de tus familiares se usan exclusivamente para enviarles mensajes de check-in de bienestar. No los usamos para publicidad ni los compartimos con terceros.'],
          ['4. Compartición de datos','No vendemos ni compartimos tu información personal con terceros, excepto con los proveedores de servicio necesarios: Supabase (base de datos), Twilio (envío de WhatsApp), Vercel (hosting), y Lemon Squeezy (pagos).'],
          ['5. Seguridad','Protegemos tu información con cifrado SSL, autenticación segura, y acceso restringido a datos.'],
          ['6. Retención de datos','Conservamos tus datos mientras tu cuenta esté activa. Si cancelas tu cuenta, eliminamos tus datos personales dentro de los 30 días siguientes.'],
          ['7. Tus derechos','Tienes derecho a acceder a tus datos personales, corregirlos, solicitar su eliminación, y exportarlos. Contáctanos en hola@famvi.app.'],
          ['8. Cookies','Famvi usa cookies esenciales para mantener tu sesión activa. No usamos cookies de rastreo publicitario.'],
          ['9. Menores de edad','Famvi está dirigido a adultos. No recopilamos intencionalmente datos de menores de 18 años.'],
          ['10. Cambios a esta política','Si hacemos cambios importantes, te notificaremos por correo electrónico con al menos 7 días de anticipación.'],
          ['11. Contacto','Para preguntas sobre privacidad: hola@famvi.app'],
        ].map(([titulo, texto]) => (
          <div key={titulo} style={{ marginBottom:'1.5rem' }}>
            <h3 style={{ fontSize:'1rem', fontWeight:'600', color:'#1A1A2E', marginBottom:'0.4rem' }}>{titulo}</h3>
            <p style={{ fontSize:'0.88rem', color:'#4B5563', lineHeight:'1.7' }}>{texto}</p>
          </div>
        ))}
      </div>
    </main>
  )
}