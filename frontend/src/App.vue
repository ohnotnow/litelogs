<template>
  <div id="app" class="container mx-auto">
    <Navbar @searched="updateResults" :page="pageNumber"/>
    <Results :results="results" />
    <Paginator :results="results" @changepage="changePage" />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Results from './components/Results.vue'
import Paginator from './components/Paginator.vue'

export default {
  name: 'app',
  components: {
    Navbar,
    Results,
    Paginator
  },
  data() {
    return {
      pageNumber: 1,
      results: {
        docs: [],
        totalDocs: 0,
        limit: 0,
        page: 1,
        totalPages: 1,
        offset: 0
      }
    }
  },
  methods: {
    updateResults(results) {
      this.results = results;
    },
    changePage(page) {
      this.pageNumber = page;
    }
  }
}
</script>