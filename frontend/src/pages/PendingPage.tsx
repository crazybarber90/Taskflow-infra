import React, { useMemo, useState } from 'react'
import { layoutClasses, SORT_OPTIONS } from '../assets/dummy'
import { Clock, Filter, ListCheck, Plus } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import type { PriorityType, TaskI } from '../types/taskType'
import TaskItem from '../components/TaskItem'
import TaskModal from '../components/TaskModal'

const PendingPage = () => {
  const { tasks = [], refreshTasks } = useOutletContext<{
    tasks: TaskI[]
    refreshTasks: () => void
  }>()
  const [sortBy, setSortBy] = useState<string>('newest')
  const [selectedTask, setSelectedTask] = useState<TaskI | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)

  const sortedPendingTasks = useMemo(() => {
    const filtered = tasks.filter(
      (t) =>
        !t.completed ||
        (typeof t.completed === 'string' && t.completed.toLowerCase() === 'no')
    )
    return filtered.sort((a, b) => {
      if (sortBy === 'newest')
        return (
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
        )
      if (sortBy === 'oldest')
        return (
          new Date(a.createdAt ?? 0).getTime() -
          new Date(b.createdAt ?? 0).getTime()
        )
      const order = { High: 3, Medium: 2, Low: 1 }
      return (
        order[b.priority.toLocaleLowerCase() as PriorityType] -
        order[a.priority.toLocaleLowerCase() as PriorityType]
      )
    })
  }, [tasks, sortBy])

  return (
    <div className={layoutClasses.container}>
      <div className={layoutClasses.headerWrapper}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <ListCheck className="text-purple-500" /> Pending Task
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-7">
            {sortedPendingTasks.length} Task{' '}
            {sortedPendingTasks.length !== 1 && 's'}
            needing Your attention
          </p>
        </div>
        <div className={layoutClasses.sortBox}>
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Filter className="w-4 h-4 text-purple-500" />
            <span className="text-sm">Sort by :</span>
          </div>
        </div>
        <select
          className={layoutClasses.select}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">By priority</option>
        </select>
        <div className={layoutClasses.tabWrapper}>
          {SORT_OPTIONS.map((opt) => (
            <button
              className={layoutClasses.tabButton(sortBy === opt.id)}
              key={opt.id}
              onClick={() => setSortBy(opt.id)}
            >
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={layoutClasses.addBox} onClick={() => setShowModal(true)}>
        <div className="flex items-center justify-center gap-3 text-gray-500 group-hover:text-purple-600 transition-colors">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
            <Plus className="text-purple-500" size={18} />
          </div>
          <span className="font-medium">Add new Task</span>
        </div>
      </div>
      <div className="space-y-4">
        {sortedPendingTasks.length === 0 ? (
          <div className={layoutClasses.emptyBtn}>
            <div className="flex items-center justify-center flex-col ms-auto py-6">
              <div className={layoutClasses.emptyIconBg}>
                <Clock className="w-8 h8 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                All caught up!
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                No pending tasks - great work!
              </p>
              <button
                className={layoutClasses.emptyBtn}
                onClick={() => setShowModal(true)}
              >
                Create New Task
              </button>
            </div>
          </div>
        ) : (
          sortedPendingTasks.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              showCompleteCheckbox
              onEdit={() => {
                setSelectedTask(task)
                setShowModal(true)
              }}
              onRefresh={refreshTasks}
            />
          ))
        )}
      </div>
      <TaskModal
        isOpen={!!selectedTask || showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedTask(null)
          refreshTasks()
        }}
        taskToEdit={selectedTask as TaskI}
      />
    </div>
  )
}

export default PendingPage
