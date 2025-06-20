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
          <span class="action-text">완료삭제</span>
        </button>
        
        <button
          v-if="stats.total > 0"
          @click="showClearAllModal = true"
          class="clear-all"
        >
          <span class="action-icon">⚠️</span>
          <span class="action-text">전체삭제</span>
        </button>
      </div>
    </div>
    
    <!-- Clear All Confirmation Modal -->
    <div v-if="showClearAllModal" class="modal-overlay" @click="showClearAllModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>전체 삭제 확인</h3>
        </div>
        <div class="modal-body">
          <p>모든 할 일을 삭제하시겠습니까?</p>
          <p class="modal-warning">이 작업은 되돌릴 수 없습니다.</p>
        </div>
        <div class="modal-actions">
          <button @click="showClearAllModal = false" class="modal-cancel">
            취소
          </button>
          <button @click="handleClearAll" class="modal-confirm">
            삭제
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TodoFilter } from '@/types/Todo'

defineProps<{
  stats: {
    total: number
    completed: number
    active: number
  }
  currentFilter: TodoFilter
}>()

const emit = defineEmits<{
  setFilter: [filter: TodoFilter]
  clearCompleted: []
  clearAll: []
  toggleAll: []
}>()

const showClearAllModal = ref(false)

const handleClearAll = () => {
  emit('clearAll')
  showClearAllModal.value = false
}

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
.clear-completed,
.clear-all {
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
.clear-completed:hover,
.clear-all:hover {
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

.clear-all {
  background: #fef3cd;
  border-color: #fde68a;
  color: #d97706;
}

.clear-all:hover {
  background: #d97706;
  border-color: #d97706;
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
  .clear-completed,
  .clear-all {
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
  .clear-completed,
  .clear-all {
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 400px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
}

.modal-header {
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  font-family: 'Noto Sans KR', sans-serif;
}

.modal-body {
  padding: 20px 24px;
}

.modal-body p {
  margin: 0 0 12px 0;
  color: #4b5563;
  line-height: 1.6;
  font-family: 'Noto Sans KR', sans-serif;
}

.modal-warning {
  color: #dc2626;
  font-size: 0.9rem;
  font-weight: 500;
}

.modal-actions {
  padding: 16px 24px 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-cancel,
.modal-confirm {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
}

.modal-cancel {
  background: white;
  color: #6b7280;
  border-color: #d1d5db;
}

.modal-cancel:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.modal-confirm {
  background: #dc2626;
  color: white;
  border-color: #dc2626;
}

.modal-confirm:hover {
  background: #b91c1c;
  border-color: #b91c1c;
}
</style>