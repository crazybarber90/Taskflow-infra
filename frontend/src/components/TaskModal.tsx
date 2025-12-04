import React, { useCallback, useEffect, useState } from 'react'
import type { TaskI } from '../types/taskType'
import {
  baseControlClasses,
  DEFAULT_TASK,
  priorityStyles,
} from '../assets/dummy'
import {
  AlignLeft,
  Calendar,
  CheckCircle,
  Flag,
  PlusCircle,
  Save,
  X,
} from 'lucide-react'

const API_BASE = 'http://localhost:4000/api/tasks'
type TaskModalProps = {
  isOpen: boolean
  onClose: () => void
  taskToEdit: TaskI
  onSave?: (taskData: TaskI) => void
  onLogout?: () => void
}
const TaskModal = ({
  isOpen,
  onClose,
  taskToEdit,
  onSave,
  onLogout,
}: TaskModalProps) => {
  const [taskData, setTaskData] = useState<TaskI>(DEFAULT_TASK)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!isOpen) return
    if (taskToEdit) {
      const normalized =
        taskToEdit.completed === 'Yes' || taskToEdit.completed === true
          ? 'Yes'
          : 'No'

      setTaskData({
        ...DEFAULT_TASK,
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        priority: taskToEdit.priority || 'Low',
        dueDate: taskToEdit.dueDate?.split('T')[0] || '',
        completed: normalized,
        id: taskToEdit._id ?? taskToEdit.id ?? null,
      })
    } else {
      setTaskData(DEFAULT_TASK as TaskI)
    }
    setError(null)
  }, [isOpen, taskToEdit])

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target
      setTaskData((prev) => ({ ...prev, [name]: value }))
    },
    []
  )

  const getHeaders = () => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No auth token found')
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (taskData.dueDate < today) {
        setError("Due date can't be in the past")
        return
      }

      setLoading(true)
      setError(null)

      try {
        const isEdit = Boolean(taskData.id)
        const url = isEdit ? `${API_BASE}/${taskData.id}/gp` : `${API_BASE}/gp`
        const response = await fetch(url, {
          method: isEdit ? 'PUT' : 'POST',
          headers: getHeaders(),
          body: JSON.stringify(taskData),
        })

        if (!response.ok) {
          if (response.status === 401) return onLogout?.()
          const err = await response.json()
          throw new Error(err.message || 'Failed to save task')
        }
        const saved = await response.json()
        onSave?.(saved)
        onClose()
      } catch (err) {
        console.error(err)
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Unknown error occurred')
        }
      } finally {
        setLoading(false)
      }
    },
    [taskData, today, onSave, onLogout, onClose]
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4">
      <div className=" bg-white border border-purple-100 rounded-xl max-w-md w-full shadow-lg relative p-6 animmate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {taskData.id ? (
              <Save className="text-purple-500 w-5 h-5" />
            ) : (
              <PlusCircle className="text-purple-500 w-5 h-5" />
            )}
            {taskData.id ? 'Edit Task' : 'Create New Task'}
          </h2>

          <button
            className="p-2 hover:bg-purple-100 rounded-lg transition-colors text-gray-500 hover:text-purple-700"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM TOFILL TO CREATE A TASK */}

        <form className=" space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="text-sm text-red-600 bg-red-500 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <div className="items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-200">
              <input
                className="w-full focus:outline-none text-sm"
                type="text"
                name="title"
                placeholder="Enter task title"
                required
                value={taskData.title}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
              <AlignLeft className="w-4 h4 text-purple-500" /> Description
            </label>

            <textarea
              className={baseControlClasses}
              name="description"
              rows={3}
              onChange={handleChange}
              value={taskData.description}
              placeholder="Add details about Your task"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                <Flag className="w-4 h4 text-purple-500" /> Priority
              </label>
              <select
                className={`${baseControlClasses} ${
                  priorityStyles[taskData.priority]
                }`}
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h4 text-purple-500" />
                Due Date
              </label>
              <input
                className={baseControlClasses}
                type="date"
                name="dueDate"
                required
                min={today}
                value={taskData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
              <CheckCircle className="w-4 h4 text-purple-500" /> Status
            </label>
            <div className="flex gap-4">
              {[
                { val: 'Yes', label: 'Completed' },
                { val: 'No', label: 'In Progress' },
              ].map(({ val, label }) => (
                <label key={val} className="flex items-center">
                  <input
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    type="radio"
                    name="completed"
                    value={val}
                    checked={taskData.completed === val}
                    onChange={handleChange}
                  />
                  <span className="ml-2 text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            className="w-full bg-linear-to-br from-fuchsia-500 to-purple-600 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-md transition-all duration-200"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              'Saving...'
            ) : taskData.id ? (
              <>
                <Save className="w-4 h-4" />
                Update Task
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                Create Task
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default TaskModal
