<template>
  <div id="app" class="container mx-auto">
    <Navbar @searched="updateResults"/>
    <Results :results="results" />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Results from './components/Results.vue'

export default {
  name: 'app',
  components: {
    Navbar,
    Results
  },
  data() {
    return {
      results: []
    }
  },
  methods: {
    updateResults(results) {
      this.results = results;
    }
  }
}
</script>