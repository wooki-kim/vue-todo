<template>
  <div class="footer">
    <div class="footer-header">
      <span class="todo-count">
        <strong>{{ stats.active }}</strong>
        {{ stats.active === 1 ? '개' : '개' }} 남음
      </span>
    </div>
    
    <div class="footer-content">
      <div class="filters">
        <button
          v-for="filterOption in filterOptions"
          :key="filterOption.value"
          :class="{ selected: currentFilter === filterOption.value }"
          @click="$emit('setFilter', filterOption.value)"
          class="filter-button"
        >
          {{ filterOption.label }}
        </button>
      </div>
      
      <div class="actions">
        <button 
          v-if="stats.total > 0"
          @click="$emit('toggleAll')"
          class="toggle-all-button"
          :class="{ active: stats.completed === stats.total && stats.total > 0 }"
        >
          <span class="action-icon">{{ stats.completed === stats.total && stats.total > 0 ? '↩️' : '✅' }}</span>
          <span class="action-text">{{ stats.completed === stats.total && stats.total > 0 ? '해제' : '완료' }}</span>
        </button>
        
        <button
          v-if="stats.completed > 0"
          @click="$emit('clearCompleted')"
          class="clear-completed"
        >
          <span class="action-icon">🗑️</span>
          <span class="action-text">삭제</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TodoFilter } from '@/types/Todo'

defineProps<{
  stats: {
    total: number
    completed: number
    active: number
  }
  currentFilter: TodoFilter
}>()

defineEmits<{
  setFilter: [filter: TodoFilter]
  clearCompleted: []
  toggleAll: []
}>()

const filterOptions = [
  { value: 'all' as TodoFilter, label: '전체' },
  { value: 'active' as TodoFilter, label: '진행중' },
  { value: 'completed' as TodoFilter, label: '완료' }
]
</script>

<style scoped>
.footer {
  background: white;
  border-top: 1px solid #f1f5f9;
}

.footer-header {
  padding: 14px 16px 10px 16px;
  text-align: center;
  border-bottom: 1px solid #f8fafc;
}

.todo-count {
  color: #6b7280;
  font-size: 0.8rem;
  font-weight: 500;
  font-family: 'Noto Sans KR', sans-serif;
}

.footer-content {
  padding: 14px 16px 16px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
}

.filters {
  display: flex;
  gap: 1px;
  background: #f8fafc;
  padding: 2px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.filter-button {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  font-size: 0.65rem;
  font-weight: 500;
  font-family: 'Noto Sans KR', sans-serif;
  transition: all 0.2s ease;
  min-width: 44px;
}

.filter-button:hover {
  background: #e2e8f0;
  color: #475569;
}

.filter-button.selected {
  background: #3b82f6;
  color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.actions {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.toggle-all-button,
.clear-completed {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px 6px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 44px;
  min-height: 44px;
  gap: 2px;
}

.action-icon {
  font-size: 0.9rem;
  line-height: 1;
}

.action-text {
  font-size: 0.6rem;
  font-weight: 500;
  font-family: 'Noto Sans KR', sans-serif;
  line-height: 1;
}

.toggle-all-button:hover,
.clear-completed:hover {
  background: #f9fafb;
  border-color: #9ca3af;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
}

.toggle-all-button.active {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.toggle-all-button.active:hover {
  background: #059669;
  border-color: #059669;
}

.clear-completed {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.clear-completed:hover {
  background: #dc2626;
  border-color: #dc2626;
  color: white;
}

/* Tablet */
@media (min-width: 768px) {
  .footer-header {
    padding: 16px 20px 12px 20px;
  }
  
  .todo-count {
    font-size: 0.9rem;
  }
  
  .footer-content {
    padding: 14px 20px 18px 20px;
    gap: 18px;
  }
  
  .filters {
    gap: 3px;
    padding: 4px;
  }
  
  .filter-button {
    padding: 7px 14px;
    font-size: 0.8rem;
    min-width: 65px;
  }
  
  .actions {
    gap: 8px;
    flex-direction: row;
  }
  
  .toggle-all-button,
  .clear-completed {
    flex-direction: row;
    padding: 7px 11px;
    min-height: auto;
    gap: 4px;
  }
  
  .action-icon {
    font-size: 0.8rem;
  }
  
  .action-text {
    font-size: 0.75rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .footer-header {
    padding: 18px 32px 14px 32px;
  }
  
  .todo-count {
    font-size: 0.95rem;
  }
  
  .footer-content {
    padding: 16px 32px 22px 32px;
    gap: 36px;
    justify-content: center;
  }
  
  .filters {
    gap: 4px;
  }
  
  .filter-button {
    padding: 10px 20px;
    font-size: 0.9rem;
    min-width: 80px;
  }
  
  .actions {
    gap: 12px;
  }
  
  .toggle-all-button,
  .clear-completed {
    padding: 10px 16px;
    white-space: nowrap;
  }
  
  .action-icon {
    font-size: 1rem;
  }
  
  .action-text {
    font-size: 0.85rem;
  }
}
</style>