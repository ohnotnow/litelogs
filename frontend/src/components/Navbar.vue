<template>
  <nav class="flex justify-between items-center mb-4">
    <SearchBox @searched="updateResults" />
    <h1 class="text-2xl text-gray-500 tracking-wider">Litelogs</h1>
  </nav>
</template>

<script>
import SearchBox from './SearchBox';

export default {
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