<template>
  <nav class="flex justify-between items-center mb-4">
    <SearchBox @searched="updateResults" :page="page"/>
    <h1 class="text-2xl text-gray-500 tracking-wider">Litelogs</h1>
  </nav>
</template>

<script>
import SearchBox from './SearchBox';

export default {
  props: ['page'],
  components: {
    SearchBox
  },
  methods: {
    updateResults(results) {
      this.$emit('searched', results);
    }
  }
}
</script>