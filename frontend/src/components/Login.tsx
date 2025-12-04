import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react'
import { INPUTWRAPPER, BUTTON_CLASSES } from '../assets/dummy'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

type LoginUser = {
  token: string
  userId: string
  email: string
  name: string
}

type LoginProps = {
  onSubmit?: (data: LoginUser) => void
  onSwitchMode: () => void
}

type InitForm = {
  email: string
  password: string
}

const INITIAL_FORM: InitForm = {
  email: '',
  password: '',
}

type LoginResponse = {
  user: {
    id: string
    name: string
    email: string
  }
  token: string
  message: string
}

const Login = ({ onSubmit, onSwitchMode }: LoginProps) => {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  const navigate = useNavigate()
  const url = 'http://localhost:4000'

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')

    if (token) {
      ;(async () => {
        try {
          const { data } = await axios.get(`${url}/api/user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (data.success) {
            onSubmit?.({ token, userId, ...data.user })
            toast.success('Session restored. Redirecting')
            navigate('/')
          } else {
            localStorage.clear()
          }
        } catch {
          localStorage.clear()
        }
      })()
    }
  }, [navigate, onSubmit])

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!rememberMe) {
      toast.error('You must enable "Remember Me" to login.')
    }
    setLoading(true)

    try {
      const response = await axios.post<LoginResponse>(
        `${url}/api/user/login`,
        formData
      )
      const data = response.data

      if (!data.token) throw new Error(data.message || 'Login filed')

      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.user.id)

      setFormData(INITIAL_FORM)
      onSubmit?.({ token: data.token, userId: data.user.id, ...data.user })

      toast.success('Login successfull, Redirecting...')
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (err) {
      console.error('Signup Error', err)
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'An error occurred')
      } else if (err instanceof Error) {
        toast.error(err.message || 'An unexpected error occurred')
      } else {
        toast.error('Unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchMode = () => {
    toast.dismiss()
    onSwitchMode?.()
  }

  const fields = [
    {
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      icon: Mail,
    },
    {
      name: 'password',
      type: showPassword ? 'text' : 'password',
      placeholder: 'Password',
      isPassword: true,
      icon: Lock,
    },
  ]

  return (
    <div className="max-w-md bg-white w-full shadow-lg border-purple-100 rounded-xl p-8">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-linear-to-br from-fuchsia-500 to bg-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-500 text-sm mt-1">
          Sign in to continue to TaskFlow
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
          <div key={name} className={INPUTWRAPPER}>
            {Icon && <Icon className="text-purple-500 w-5 h-5 mr-2" />}
            <input
              type={type}
              placeholder={placeholder}
              value={formData[name as keyof InitForm]}
              onChange={(e) =>
                setFormData({ ...formData, [name]: e.target.value })
              }
              className="w-full focus:outline-none text-sm text-gray-700"
              required
            />
            {isPassword && (
              <button
                className="ml-2 text-gray-500 hover:text-purple-500 transition-colors"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        ))}
        <div className="flex items-center">
          <input
            className="h-4 w-4 text-purple-500 focus:ring-purple-400 border-gray-300 rounded"
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            required
          />
          <label
            className="ml-2 block text-sm text-gray-700 "
            htmlFor="rememberMe"
          >
            Remember Me
          </label>
        </div>
        <button className={BUTTON_CLASSES} disabled={loading} type="submit">
          {loading ? (
            'Logining in...'
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Login
            </>
          )}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have ann acc?
      </p>
      <button
        className="text-purple-600 hover:text-purple-700 hover:underline font-medium transition-colors"
        type="button"
        onClick={handleSwitchMode}
      >
        Sign Up
      </button>
    </div>
  )
}

export default Login
