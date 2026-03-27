'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, LogIn } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Error al iniciar sesión')
        return
      }

      router.push('/admin/dashboard')
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF8] to-[#F5F0E8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col leading-none group">
            <span className="font-serif text-4xl font-bold tracking-wide text-[#1B4D5C]">
              ALAMAR
            </span>
            <span className="font-sans text-xs tracking-[0.25em] uppercase text-[#D4A574] mt-1">
              HOUSE
            </span>
          </Link>
          <p className="text-[#888880] text-sm mt-4 tracking-wide">
            Panel de Administración
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-md border border-[#E8E3D8] p-8">
          <h1 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-6 text-center">
            Inicia sesión
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-[#D97373]/10 border border-[#D97373] rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#D97373] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#D97373]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E8E3D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4D5C] focus:border-transparent bg-white text-[#2C2C2C] placeholder-[#888880] transition-all"
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E8E3D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4D5C] focus:border-transparent bg-white text-[#2C2C2C] placeholder-[#888880] transition-all"
                placeholder="Tu contraseña"
                required
                disabled={loading}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-[#1B4D5C] text-white font-sans font-medium py-2.5 rounded-lg hover:bg-[#2A6B7E] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn size={18} />
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          {/* Note */}
          <p className="text-xs text-[#888880] text-center mt-6">
            Acceso únicamente para administradores
          </p>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-[#1B4D5C] hover:text-[#D4A574] transition-colors"
          >
            Volver al sitio principal
          </Link>
        </div>
      </div>
    </div>
  )
}
