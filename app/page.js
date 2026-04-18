'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1A1A2E 0%, #2D6A4F 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif',
      padding: '2rem'
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '300',
        color: '#ffffff',
        marginBottom: '0.3rem'
      }}>
        fam<span style={{color: '#74C69D'}}>vi</span>
      </h1>

      <p style={{
        color: 'rgba(255,255,255,0.75)',
        fontSize: '1.05rem',
        fontStyle: 'italic',
        fontWeight: '300',
        marginBottom: '2.5rem'
      }}>
        para los que cuidan desde lejos
      </p>

      <div style={{display:'flex', flexDirection:'column', gap:'0.75rem', width:'100%', maxWidth:'300px'}}>
        <button
          onClick={() => router.push('/onboarding')}
          style={{
            width: '100%',
            padding: '1rem',
            background: '#74C69D',
            color: '#1A1A2E',
            border: '2px solid #74C69D',
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
          Comenzar gratis →
        </button>

        <button
          onClick={() => {
            document.getElementById('como-funciona')?.scrollIntoView({behavior: 'smooth'})
          }}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'transparent',
            color: '#ffffff',
            border: '2px solid #ffffff',
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
          Ver cómo funciona ↓
        </button>
      </div>
    </main>
  )
}
