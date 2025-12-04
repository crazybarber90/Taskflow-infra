import { useMemo, useState } from 'react'
import { CT_CLASSES, SORT_OPTIONS } from '../assets/dummy'
import { CheckCircle2, Filter } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import type { TaskI } from '../types/taskType'
import TaskItem from '../components/TaskItem'

const CompletePage = () => {
  const { tasks = [], refreshTasks } = useOutletContext<{
    tasks: TaskI[]
    refreshTasks: () => void
  }>()

  const [sortBy, setSortBy] = useState<string>('newest')

  const isCompleted = (val: any): boolean => {
    return ['yes', 'true', '1'].includes(String(val).toLowerCase())
  }

  const sortedCompletedTask = useMemo(() => {
    return tasks
      .filter((task) => isCompleted(task.completed))
      .sort((a, b) => {
        const dateA = new Date(a.createdAt ?? 0).getTime()
        const dateB = new Date(b.createdAt ?? 0).getTime()

        switch (sortBy) {
          case 'newest':
            return dateB - dateA
          case 'oldest':
            return dateA - dateB
          case 'priority': {
            const order = { high: 3, medium: 2, low: 1 }
            return (
              order[b.priority.toLowerCase() as keyof typeof order] -
              order[a.priority.toLowerCase() as keyof typeof order]
            )
          }
          default:
            return 0
        }
      })
  }, [tasks, sortBy])

  return (
    <div className={CT_CLASSES.page}>
      {/* HEADER */}
      <div className={CT_CLASSES.header}>
        <div className={CT_CLASSES.titleWrapper}>
          <h1 className={CT_CLASSES.title}>
            <CheckCircle2 className="text-purple-500 w-5 h-5 md:w-6 md:h-6" />
            <span className="truncate">Completed Task</span>
          </h1>

          <p className={CT_CLASSES.subtitle}>
            {sortedCompletedTask.length} Task{' '}
            {sortedCompletedTask.length !== 1 && 's'}
            Marked as completed
          </p>
        </div>

        {/* SORT CONTROLS */}
        <div className={CT_CLASSES.sortContainer}>
          <div className={CT_CLASSES.sortBox}>
            <div className={CT_CLASSES.filterLabel}>
              <Filter className="w-4 h-4 text-purple-500" />
              <span className="text-xs md:text-sm">Sort by :</span>
            </div>

            {/* MOBILE DROPDOWN */}
            <select
              className={CT_CLASSES.select}
              onChange={(e) => setSortBy(e.target.value)}
              value={sortBy}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label} {opt.id === 'newest' ? 'First' : ''}
                </option>
              ))}
            </select>

            {/* DESKTOP BUTTONS */}
            <div className={CT_CLASSES.btnGroup}>
              {SORT_OPTIONS.map((opt) => (
                <button
                  className={[
                    CT_CLASSES.btnBase,
                    sortBy === opt.id
                      ? CT_CLASSES.btnActive
                      : CT_CLASSES.btnInactive,
                  ].join(' ')}
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TASK LIST */}
      <div className={CT_CLASSES.list}>
        {sortedCompletedTask.length === 0 ? (
          <div className={CT_CLASSES.emptyState}>
            <div className={CT_CLASSES.emptyIconWrapper}>
              <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
            </div>
            <h3 className={CT_CLASSES.emptyTitle}>Nocompleted tasks yet!</h3>
            <p className={CT_CLASSES.emptyText}>
              Complete some tasks and they will appear here
            </p>
          </div>
        ) : (
          sortedCompletedTask.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onRefresh={refreshTasks}
              showCompleteCheckbox={false}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default CompletePage
