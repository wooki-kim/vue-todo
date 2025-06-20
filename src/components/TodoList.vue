<template>
  <ul class="todo-list">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @toggle-todo="$emit('toggleTodo', $event)"
      @remove-todo="$emit('removeTodo', $event)"
      @update-todo="$emit('updateTodo', $event.id, $event.text)"
    />
  </ul>
</template>

<script setup lang="ts">
import type { Todo } from '@/types/Todo'
import TodoItem from './TodoItem.vue'

defineProps<{
  todos: Todo[]
}>()

defineEmits<{
  toggleTodo: [id: string]
  removeTodo: [id: string]
  updateTodo: [id: string, text: string]
}>()
</script>

<style scoped>
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>