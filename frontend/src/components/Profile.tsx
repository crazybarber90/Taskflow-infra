import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import {
  BACK_BUTTON,
  DANGER_BTN,
  FULL_BUTTON,
  INPUT_WRAPPER,
  personalFields,
  SECTION_WRAPPER,
  securityFields,
} from '../assets/dummy'
import {
  ChevronLeft,
  Save,
  Shield,
  UserCircle,
  Lock,
  LogOut,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { UserI } from '../types/userType'
import axios from 'axios'

const API_URL = 'http://localhost:4000'

type ProfileProps = {
  setCurrentUser: React.Dispatch<React.SetStateAction<UserI | null>>
  onLogout: () => void
}

type SingleProfileUser = {
  name: string
  email?: string
}
const INIT_PROFILE: SingleProfileUser = {
  name: '',
  email: '',
}

type Passwords = {
  current: string
  new: string
  confirm: string
}
const INIT_PASSWORDS: Passwords = {
  current: '',
  new: '',
  confirm: '',
}

const Profile = ({ setCurrentUser, onLogout }: ProfileProps) => {
  const [profile, setProfile] = useState<SingleProfileUser>(INIT_PROFILE)
  const [passwords, setPasswords] = useState<Passwords>(INIT_PASSWORDS)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    axios
      .get(`${API_URL}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        if (data.success)
          setProfile({ name: data.user.name, email: data.user.email })
        else toast.error(data.message)
      })
      .catch(() => toast.error('UNABLE TO LOAD PROFILE.'))
  }, [])

  const saveProfile = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.put(
        `${API_URL}/api/user/profile`,
        { name: profile.name, email: profile.email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (data.success) {
        toast.success('Profile Updated')
        setCurrentUser((prev) => ({
          ...(prev as UserI),
          name: profile.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.name
          )}&background=random`,
        }))
      } else toast.error(data.message)
    } catch (err) {
      console.error(err)
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Could not load tasks')

        if (err.response?.status === 401) onLogout()
      } else {
        toast.error((err as Error).message || 'Could not Load tasks')
      }
    }
  }

  const changePassword = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (passwords.new !== passwords.confirm) {
      return toast.error('Password do not match')
    }
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.put(
        `${API_URL}/api/user/password`,
        { currentPassword: passwords.current, newPassword: passwords.new },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (data.success) {
        toast.success('Password succesfully changed')
        setPasswords(INIT_PASSWORDS)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.error(err)
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Password change failed')

        if (err.response?.status === 401) onLogout()
      } else {
        toast.error((err as Error).message || 'Could not change password')
      }
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-4xl mx-auto p-6">
        <button className={BACK_BUTTON} onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to dashboard
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {profile.name ? profile.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Account Settings
            </h1>
            <p className="text-gray-500 text-sm">
              Manage Your profile and security settings
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <section className={SECTION_WRAPPER}>
            <div className="flex items-center gap-2 mb-6">
              <UserCircle className="text-purple-500 w-5 h-5" />
              <h2 className="text-xl font-semibold text-gray-800">
                Personal Informations
              </h2>
            </div>

            {/* PERSONAL INFO NAME/EMAIL */}
            <form className="space-y-4" onSubmit={saveProfile}>
              {personalFields.map(({ name, type, placeholder, icon: Icon }) => (
                <div key={name} className={INPUT_WRAPPER}>
                  <Icon className="text-purple-500 w-5 h-5 mr-2" />
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={profile[name as keyof SingleProfileUser]}
                    onChange={(e) =>
                      setProfile({ ...profile, [name]: e.target.value })
                    }
                    className="w-full focus:outline-none text-sm"
                    required
                  />
                </div>
              ))}
              <button className={FULL_BUTTON}>
                <Save className="w-4 h-4" /> Save changes
              </button>
            </form>
          </section>

          <section className={SECTION_WRAPPER}>
            <div className="flex items-center gap-2 mb-6">
              <Shield className="text-purple-500 w-5 h-5" />
              <h2 className="text-xl font-semibold text-gray-800">Security</h2>
            </div>

            <form className="space-y-4" onSubmit={changePassword}>
              {securityFields.map(({ name, placeholder }) => (
                <div key={name} className={INPUT_WRAPPER}>
                  <Lock className="text-purple-500 w-5 h-5 mr-2" />
                  <input
                    type="password"
                    placeholder={placeholder}
                    value={passwords[name as keyof Passwords]}
                    onChange={(e) =>
                      setPasswords((prev) => ({
                        ...prev,
                        [name as keyof Passwords]: e.target.value,
                      }))
                    }
                    className="w-full focus:outline-none text-sm"
                    required
                  />
                </div>
              ))}
              <button className={FULL_BUTTON}>
                <Shield className="w-4 h-4" /> Change Password
              </button>

              <div className="mt-8 pt-6 border-t border-purple-600">
                <h3 className="text-red-600 font-semibold mb-4 flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Danger Zone
                </h3>
                <button className={DANGER_BTN} onClick={onLogout}>
                  Logout
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Profile
