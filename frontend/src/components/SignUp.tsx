import React, { useState } from 'react'
import type { UserI } from '../types/userType'
import { UserPlus } from 'lucide-react'
import {
  BUTTONCLASSES,
  FIELDS,
  Inputwrapper,
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
} from '../assets/dummy'
import axios from 'axios'

type SignUpProps = {
  onSubmit: (data: UserI) => void
  onSwitchMode: () => void
}

type InitForm = {
  name: string
  email: string
  password: string
}

const INITIAL_FORM: InitForm = {
  name: '',
  email: '',
  password: '',
}

type InitMessage = {
  text: string
  type: string
}

const MESSAGES: InitMessage = {
  text: '',
  type: '',
}

const API_URL = 'http://localhost:4000'

const SignUp = ({ onSwitchMode }: SignUpProps) => {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [message, setMessage] = useState(MESSAGES)
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    try {
      const data = await axios.post(`${API_URL}/api/user/register`, formData)

      if (data) {
        setMessage({
          text: 'Register successfull, You can login now.',
          type: 'success',
        })
        setFormData(INITIAL_FORM)
      }
    } catch (err) {
      console.error('Signup Error', err)
      if (axios.isAxiosError(err)) {
        setMessage({
          text: err.response?.data?.message || 'An error occurred',
          type: 'error',
        })
      } else if (err instanceof Error) {
        setMessage({
          text: err.message || 'An unexpected error occurred',
          type: 'error',
        })
      } else {
        setMessage({
          text: 'Unknown error occurred',
          type: 'error',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full bg-white shadow-lg border border-purple-100 rounded-xl p-8">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-linear-to-br from-fuchsia-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className=" text-2xl font-bold  text-gray-800">Create Account</h2>
        <p className="text-gray-500 text-sm mt-1">
          Join TaskFlow to manage Your tasks
        </p>
      </div>
      {message.text && (
        <div
          className={
            message.type === 'success' ? MESSAGE_SUCCESS : MESSAGE_ERROR
          }
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
          <div key={name} className={Inputwrapper}>
            <Icon className="text-purple-500 w-5 h-5 mr-2" />
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
          </div>
        ))}
        <button className={BUTTONCLASSES} type="submit" disabled={loading}>
          {loading ? (
            'Signing up'
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Sign Up
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Allready have an account ?
      </p>
      <button
        onClick={onSwitchMode}
        className="text-purple-600 hover:text-purple-700 hover:underline font-medium transition-colors"
      >
        Login
      </button>
    </div>
  )
}

export default SignUp

//https://www.youtube.com/watch?v=VAKDr1lsix0 ->>>>> 2.30
