<template>
  <li class="todo-item" :class="{ completed: todo.completed, editing: isEditing, [`priority-${todo.priority}`]: true }">
    <div class="view" v-if="!isEditing">
      <div class="priority-indicator" :class="`priority-${todo.priority}`"></div>
      <input
        class="toggle"
        type="checkbox"
        :checked="todo.completed"
        @change="$emit('toggleTodo', todo.id)"
      />
      <label @dblclick="startEditing" class="todo-text">{{ todo.text }}</label>
      <span class="priority-badge" :class="`priority-${todo.priority}`">
        {{ todo.priority === 'high' ? '●' : todo.priority === 'medium' ? '○' : '●' }}
      </span>
      <button class="destroy" @click="$emit('removeTodo', todo.id)">×</button>
    </div>
    
    <form v-else @submit.prevent="finishEditing" class="edit-form">
      <input
        ref="editInput"
        v-model="editText"
        class="edit"
        type="text"
        @blur="finishEditing"
        @keyup.escape="cancelEditing"
      />
    </form>
  </li>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { Todo } from '@/types/Todo'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  toggleTodo: [id: string]
  removeTodo: [id: string]
  updateTodo: [event: { id: string; text: string }]
}>()

const isEditing = ref(false)
const editText = ref('')
const editInput = ref<HTMLInputElement>()

const startEditing = async () => {
  isEditing.value = true
  editText.value = props.todo.text
  await nextTick()
  editInput.value?.focus()
  editInput.value?.select()
}

const finishEditing = () => {
  if (isEditing.value) {
    const trimmedText = editText.value.trim()
    if (trimmedText) {
      emit('updateTodo', { id: props.todo.id, text: trimmedText })
    } else {
      emit('removeTodo', props.todo.id)
    }
    isEditing.value = false
  }
}

const cancelEditing = () => {
  isEditing.value = false
  editText.value = props.todo.text
}
</script>

<style scoped>
.todo-item {
  position: relative;
  border-bottom: 1px solid #f1f5f9;
  background: white;
  transition: all 0.2s ease;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item:hover {
  background: #fafbfc;
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-item.completed .todo-text {
  color: #6b7280;
  text-decoration: line-through;
}

.view {
  display: flex;
  align-items: center;
  padding: 18px 16px;
  gap: 14px;
  min-height: 64px;
}

.toggle {
  width: 18px;
  height: 18px;
  cursor: pointer;
  appearance: none;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  background: white;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.toggle:hover {
  border-color: #3b82f6;
}

.toggle:checked {
  background: #3b82f6;
  border-color: #3b82f6;
}

.toggle:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
}

.todo-text {
  flex: 1;
  cursor: pointer;
  user-select: none;
  word-break: break-word;
  line-height: 1.5;
  color: #374151;
  font-weight: 400;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 0.95rem;
}

.destroy {
  opacity: 0;
  width: 28px;
  height: 28px;
  font-size: 1rem;
  color: #ef4444;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.destroy:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.todo-item:hover .destroy {
  opacity: 1;
}

.edit {
  width: 100%;
  padding: 14px 16px;
  margin: 0;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 0.95rem;
  line-height: 1.5;
  border: 2px solid #3b82f6;
  border-radius: 6px;
  outline: none;
  background: white;
  color: #374151;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.edit-form {
  padding: 16px;
}

.todo-item.editing {
  border-bottom: 1px solid #f1f5f9;
  background: #fafbfc;
}

.todo-item.editing .view {
  display: none;
}

.priority-indicator {
  width: 4px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 0 4px 4px 0;
}

.priority-indicator.priority-high {
  background: #ef4444;
}

.priority-indicator.priority-medium {
  background: #f59e0b;
}

.priority-indicator.priority-low {
  background: #10b981;
}

.priority-badge {
  font-size: 1rem;
  margin-left: 8px;
  font-weight: 500;
}

.priority-badge.priority-high {
  color: #ef4444;
}

.priority-badge.priority-medium {
  color: #6b7280;
}

.priority-badge.priority-low {
  color: #10b981;
}

.todo-item.priority-high {
  border-left: 4px solid #ef4444;
}

.todo-item.priority-medium {
  border-left: 4px solid #f59e0b;
}

.todo-item.priority-low {
  border-left: 4px solid #10b981;
}

/* Tablet */
@media (min-width: 768px) {
  .view {
    padding: 20px;
    gap: 16px;
    min-height: 68px;
  }
  
  .toggle {
    width: 20px;
    height: 20px;
  }
  
  .toggle:checked::after {
    font-size: 0.75rem;
  }
  
  .todo-text {
    font-size: 1rem;
  }
  
  .destroy {
    width: 30px;
    height: 30px;
    font-size: 1.1rem;
  }
  
  .edit {
    font-size: 1rem;
    padding: 16px 20px;
  }
  
  .edit-form {
    padding: 18px 20px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .view {
    padding: 22px 24px;
    gap: 18px;
    min-height: 72px;
  }
  
  .todo-text {
    font-size: 1.125rem;
  }
  
  .destroy {
    width: 32px;
    height: 32px;
    font-size: 1.2rem;
  }
  
  .edit {
    font-size: 1.125rem;
    padding: 18px 24px;
  }
  
  .edit-form {
    padding: 20px 24px;
  }
}
</style>