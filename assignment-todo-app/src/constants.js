const TASK_STATUS = {
    pending: 'pending',
    completed: 'completed'
}

const DEFAULT_TASK_STATUS = TASK_STATUS.pending

const APPTASK_PRIORITY = {
    low: 'low',
    medium: 'medium',
    none: 'none',
    high: 'high'
}

const GROUP_BY_TASKS = {
    none: 'none',
    createdOn: 'createdAt',
    pendingOn: 'pendingOn',
    priority: 'priority',
}

export {
    DEFAULT_TASK_STATUS,
    TASK_STATUS,
    APPTASK_PRIORITY,
    GROUP_BY_TASKS
  }