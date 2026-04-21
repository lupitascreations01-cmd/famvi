export default function Terminos() {
  return (
    <main style={{ minHeight:'100vh', background:'#F8F7F4', fontFamily:'sans-serif', padding:'2rem' }}>
      <div style={{ maxWidth:'700px', margin:'0 auto' }}>
        <a href="/" style={{ color:'#2D6A4F', fontSize:'0.88rem', textDecoration:'none', display:'inline-block', marginBottom:'2rem' }}>← Volver</a>
        <div style={{ marginBottom:'0.5rem' }}>
         <img src="/logo.png" alt="famvi" style={{ height:'32px' }} />
        </div>
        <h2 style={{ fontSize:'1.3rem', fontWeight:'500', color:'#1A1A2E', marginBottom:'0.3rem' }}>Términos de Uso</h2>
        <p style={{ color:'#6B7280', fontSize:'0.85rem', marginBottom:'2rem' }}>Última actualización: abril 2026</p>
        {[
          ['1. Descripción del servicio','Famvi es un servicio de monitoreo de bienestar que permite a usuarios ("hijos") configurar check-ins automáticos para sus familiares mayores ("familiares") a través de WhatsApp. El servicio incluye un dashboard web para visualizar el estado de los familiares.'],
          ['2. Aceptación de los términos','Al crear una cuenta en Famvi, aceptas estos Términos de Uso en su totalidad. Si no estás de acuerdo con alguna parte, no debes usar el servicio.'],
          ['3. Registro y cuenta','Para usar Famvi debes crear una cuenta con información veraz. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.'],
          ['4. Uso del servicio','Te comprometes a usar Famvi únicamente para monitorear el bienestar de familiares con su consentimiento explícito. Está prohibido usar el servicio para vigilancia sin consentimiento, spam, o cualquier actividad ilegal.'],
          ['5. Consentimiento del familiar','Eres responsable de obtener el consentimiento expreso del familiar antes de registrar su número de WhatsApp en Famvi. Al agregar un familiar, declaras que tienes su autorización para hacerlo.'],
          ['6. Planes y pagos','Famvi ofrece planes de suscripción mensual. El cobro se realiza a través de Lemon Squeezy. Todos los planes incluyen un período de prueba gratuita de 7 días. Puedes cancelar en cualquier momento desde tu cuenta.'],
          ['7. Cancelación y reembolsos','Puedes cancelar tu suscripción en cualquier momento. La cancelación será efectiva al final del período de facturación actual. No se emiten reembolsos por períodos parciales salvo casos excepcionales a criterio de Famvi.'],
          ['8. Limitación de responsabilidad','Famvi es un servicio de apoyo y monitoreo, no un servicio médico de emergencia. No nos hacemos responsables por situaciones de emergencia médica. En caso de emergencia, contacta a los servicios de urgencia de tu país.'],
          ['9. Privacidad','El uso de tus datos personales está regido por nuestra Política de Privacidad, disponible en famvi.vercel.app/privacidad.'],
          ['10. Modificaciones','Famvi se reserva el derecho de modificar estos términos en cualquier momento. Te notificaremos por correo electrónico ante cambios importantes.'],
          ['11. Contacto','Para consultas sobre estos términos, contáctanos en: hola@famvi.app'],
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