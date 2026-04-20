'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Login() {
  const [modo, setModo] = useState('registro') // 'registro' o 'login'
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const handleRegistro = async () => {
    if (!correo || !password) {
      setError('Por favor ingresa tu correo y contraseña')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setCargando(true)
    setError('')
    try {
      const { data, error } = await supabase.auth.signUp({
        email: correo,
        password: password,
      })
      if (error) throw error
      if (data.user) {
        // Crear registro en tabla usuarios
        await supabase.from('usuarios').insert({
          id: data.user.id,
          plan: 'trial',
        })
        // Redirigir al onboarding
        window.location.href = '/onboarding'
      }
    } catch (err) {
      setError(err.message === 'User already registered'
        ? 'Ya existe una cuenta con ese correo. Inicia sesión.'
        : 'Hubo un error. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  const handleLogin = async () => {
    if (!correo || !password) {
      setError('Por favor ingresa tu correo y contraseña')
      return
    }
    setCargando(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: correo,
        password: password,
      })
      if (error) throw error
      window.location.href = '/dashboard'
    } catch (err) {
      setError('Correo o contraseña incorrectos')
    } finally {
      setCargando(false)
    }
  }

  const handleGoogle = async () => {
    setCargando(true)
    setError('')
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'existe' : 'NO EXISTE')
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding`
        }
      })
      console.log('data:', data)
      console.log('error:', error)
      if (error) throw error
    } catch (err) {
      console.log('catch error:', err)
      setError('Error: ' + err.message)
      setCargando(false)
    }
  }

  const handleOlvidePassword = async () => {
    if (!correo) {
      setError('Ingresa tu correo primero')
      return
    }
    setCargando(true)
    try {
      await supabase.auth.resetPasswordForEmail(correo, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      setMensaje('Te enviamos un link para restablecer tu contraseña')
    } catch (err) {
      setError('Error al enviar el correo')
    } finally {
      setCargando(false)
    }
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
      <h1 style={{color:'#fff', fontWeight:'300', fontSize:'2rem', marginBottom:'1rem'}}>
        fam<span style={{color:'#74C69D'}}>vi</span>
      </h1>

      <div style={{background:'white', borderRadius:'24px', padding:'2rem', width:'100%', maxWidth:'400px', boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>

        {/* Tabs registro / login */}
        <div style={{display:'flex', background:'#F8F7F4', borderRadius:'12px', padding:'4px', marginBottom:'1.5rem'}}>
          <button
            onClick={() => {setModo('registro'); setError(''); setMensaje('')}}
            style={{flex:1, padding:'0.6rem', borderRadius:'10px', border:'none', background:modo==='registro'?'white':'transparent', color:modo==='registro'?'#1A1A2E':'#6B7280', fontWeight:'500', cursor:'pointer', fontSize:'0.88rem', boxShadow:modo==='registro'?'0 1px 4px rgba(0,0,0,0.1)':'none'}}>
            Crear cuenta
          </button>
          <button
            onClick={() => {setModo('login'); setError(''); setMensaje('')}}
            style={{flex:1, padding:'0.6rem', borderRadius:'10px', border:'none', background:modo==='login'?'white':'transparent', color:modo==='login'?'#1A1A2E':'#6B7280', fontWeight:'500', cursor:'pointer', fontSize:'0.88rem', boxShadow:modo==='login'?'0 1px 4px rgba(0,0,0,0.1)':'none'}}>
            Iniciar sesión
          </button>
        </div>

        {modo === 'registro' && (
          <p style={{color:'#6B7280', fontSize:'0.85rem', marginBottom:'1.2rem', textAlign:'center'}}>
            7 días gratis · Sin tarjeta de crédito
          </p>
        )}

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={cargando}
          style={{width:'100%', padding:'0.9rem', background:'white', color:'#1A1A2E', border:'1.5px solid #E5E7EB', borderRadius:'12px', fontSize:'0.95rem', fontWeight:'500', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.75rem', marginBottom:'1rem', boxShadow:'0 1px 4px rgba(0,0,0,0.08)', opacity:cargando?0.7:1}}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar con Google
        </button>

        {/* Separador */}
        <div style={{display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem'}}>
          <div style={{flex:1, height:'1px', background:'#E5E7EB'}}></div>
          <span style={{fontSize:'0.8rem', color:'#9CA3AF'}}>o con tu correo</span>
          <div style={{flex:1, height:'1px', background:'#E5E7EB'}}></div>
        </div>

        {/* Campos */}
        <input
          type="email"
          placeholder="Tu correo electrónico"
          value={correo}
          onChange={e => setCorreo(e.target.value)}
          style={{width:'100%', padding:'0.8rem', border:'1.5px solid #E5E7EB', borderRadius:'12px', marginBottom:'0.75rem', fontSize:'0.95rem', boxSizing:'border-box', outline:'none'}}
        />
        <input
          type="password"
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (modo === 'registro' ? handleRegistro() : handleLogin())}
          style={{width:'100%', padding:'0.8rem', border:'1.5px solid #E5E7EB', borderRadius:'12px', marginBottom:'0.5rem', fontSize:'0.95rem', boxSizing:'border-box', outline:'none'}}
        />

        {/* Olvidé contraseña */}
        {modo === 'login' && (
          <button
            onClick={handleOlvidePassword}
            style={{background:'none', border:'none', color:'#2D6A4F', fontSize:'0.82rem', cursor:'pointer', padding:'0', marginBottom:'1rem'}}>
            ¿Olvidaste tu contraseña?
          </button>
        )}

        {/* Error */}
        {error && (
          <div style={{background:'#FEE2E2', borderRadius:'10px', padding:'0.75rem', marginBottom:'1rem', fontSize:'0.82rem', color:'#E76F51'}}>
            {error}
          </div>
        )}

        {/* Mensaje éxito */}
        {mensaje && (
          <div style={{background:'#D8F3DC', borderRadius:'10px', padding:'0.75rem', marginBottom:'1rem', fontSize:'0.82rem', color:'#2D6A4F'}}>
            {mensaje}
          </div>
        )}

        {/* Botón principal */}
        <button
          onClick={modo === 'registro' ? handleRegistro : handleLogin}
          disabled={cargando}
          style={{width:'100%', padding:'1rem', background: cargando ? '#9CA3AF' : '#2D6A4F', color:'white', border:'none', borderRadius:'12px', fontSize:'1rem', fontWeight:'500', cursor: cargando ? 'not-allowed' : 'pointer', marginBottom:'1rem'}}>
          {cargando ? 'Cargando...' : modo === 'registro' ? 'Crear cuenta gratis →' : 'Iniciar sesión →'}
        </button>

        <p style={{textAlign:'center', fontSize:'0.75rem', color:'#9CA3AF', lineHeight:'1.5'}}>
          Al crear tu cuenta aceptas nuestros{' '}
          <a href="/terminos" style={{color:'#2D6A4F'}}>Términos de uso</a>
{' '}y{' '}
<a href="/privacidad" style={{color:'#2D6A4F'}}>Política de privacidad</a>
        </p>

        <button
          onClick={() => window.location.href = '/'}
          style={{width:'100%', padding:'0.75rem', background:'none', border:'none', color:'#6B7280', fontSize:'0.85rem', cursor:'pointer', marginTop:'0.5rem'}}>
          ← Volver al inicio
        </button>
      </div>
    </main>
  )
}