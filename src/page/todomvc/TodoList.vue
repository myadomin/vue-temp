<template>
  <section class="main">
    <!-- v-model="isAllCompleted" 拆分成:checked="isAllCompleted" @click="toggleAll"  -->
    <input id="toggle-all" type="checkbox" class="toggle-all" :checked="isAllCompleted" />
    <label for="toggle-all" @click="toggleAll" v-show="todoList.length"></label>
    <ul class="todo-list">
      <TodoItem v-for="todo in filterTodoList" :key="todo.id" :todo="todo" />
    </ul>
  </section>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import TodoItem from './TodoItem'

export default {
  data () {
    return {
      isEditing: false
    }
  },
  components: {
    TodoItem
  },
  computed: {
    ...mapState('todomvc', ['todoList']),
    ...mapGetters('todomvc', ['isAllCompleted', 'filterTodoList'])
  },
  methods: {
    ...mapActions('todomvc', ['toggleAll'])
  }
}
</script>
