<template>
  <div id="paginator" class="mb-4">
    <div v-if="results.totalDocs > 0">
        <ul class="flex pl-0 list-none rounded my-2">
            <li class="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 ml-0 rounded-l hover:bg-gray-200"><a class="page-link" href="#" @click.prevent="previousPage">Previous</a></li>
            <li v-for="page in pages" :key="page" class="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 hover:bg-gray-200" :class="{'bg-blue-200': page == results.page}"><a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a></li>
            <li class="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 rounded-r hover:bg-gray-200"><a class="page-link" href="#" @click.prevent="nextPage">Next</a></li>
        </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ['results'],
  data() {
    return {
      currentPage: 0,
    }
  },
  computed: {
      pages() {
          return this.calcPages();
      }
  },
  methods: {
      calcPages() {
          let p = [];
          for (let i = 1; i <= this.results.totalPages; i++) {
              p.push(i);
          }
          return p;
      },
      changePage(page) {
          this.$emit('changepage', page);
      },
      previousPage() {
          if (this.results.previousPage) {
              this.$emit('changepage', this.results.previousPage);
          }
      },
      nextPage() {
          if (this.results.nextPage) {
              this.$emit('changepage', this.results.nextPage);
          }
      }
  }
}
</script>