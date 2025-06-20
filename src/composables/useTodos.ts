import { ref, computed, watch } from 'vue'
import type { Todo, TodoFilter } from '@/types/Todo'

const STORAGE_KEY = 'vue-todos'

export function useTodos() {
  const allTodos = ref<Todo[]>([])
  const filter = ref<TodoFilter>('all')

  const loadTodos = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        allTodos.value = parsed.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt)
        }))
      }
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error)
    }
  }

  watch(
    allTodos,
    (newTodos) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos))
      } catch (error) {
        console.error('Failed to save todos to localStorage:', error)
      }
    },
    { deep: true }
  )

  const addTodo = (text: string, priority: 'high' | 'medium' | 'low' = 'medium') => {
    if (!text.trim()) return

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      priority,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    allTodos.value.push(newTodo)
  }

  const removeTodo = (id: string) => {
    const index = allTodos.value.findIndex(todo => todo.id === id)
    if (index > -1) {
      allTodos.value.splice(index, 1)
    }
  }

  const toggleTodo = (id: string) => {
    const todo = allTodos.value.find(todo => todo.id === id)
    if (todo) {
      todo.completed = !todo.completed
      todo.updatedAt = new Date()
    }
  }

  const updateTodo = (id: string, text: string) => {
    const todo = allTodos.value.find(todo => todo.id === id)
    if (todo && text.trim()) {
      todo.text = text.trim()
      todo.updatedAt = new Date()
    }
  }

  const clearCompleted = () => {
    allTodos.value = allTodos.value.filter(todo => !todo.completed)
  }

  const toggleAllTodos = () => {
    const allCompleted = allTodos.value.every(todo => todo.completed)
    allTodos.value.forEach(todo => {
      todo.completed = !allCompleted
      todo.updatedAt = new Date()
    })
  }

  const filteredTodos = computed(() => {
    switch (filter.value) {
      case 'active':
        return allTodos.value.filter(todo => !todo.completed)
      case 'completed':
        return allTodos.value.filter(todo => todo.completed)
      default:
        return allTodos.value
    }
  })

  const todoStats = computed(() => ({
    total: allTodos.value.length,
    completed: allTodos.value.filter(todo => todo.completed).length,
    active: allTodos.value.filter(todo => !todo.completed).length
  }))

  loadTodos()

  return {
    todos: filteredTodos,
    filter,
    addTodo,
    removeTodo,
    toggleTodo,
    updateTodo,
    clearCompleted,
    toggleAllTodos,
    todoStats
  }
}