<template>
  <div>
    <div class="flex items-center border-b border-b-2 border-teal-500 py-2">
        <input class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Search for something..." aria-label="Search box" autofocus v-model="query" v-on:keyup.enter="search">
        <button @click="search" class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
            Search
        </button>
        <input class="ml-4 appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Container name..." aria-label="Container name filter" autofocus v-model="container" v-on:keyup.enter="search">
        <input class="ml-4 appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Image name..." aria-label="Image name filter" autofocus v-model="image" v-on:keyup.enter="search">
        <input class="ml-4 appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Host name..." aria-label="Host name filter" autofocus v-model="host" v-on:keyup.enter="search">
    </div>
      <p v-text="error"></p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
    props: ['page'],
    data() {
        return {
            query: '',
            error: '',
            container: '',
            image: '',
            host: '',
        }
    },
    watch: {
        page() {
            this.search();
        }
    },
    methods: {
        search() {
            this.error = '';
            if (!this.query) {
                return;
            }
            const queryString = this.buildQueryString();
            axios.get(process.env.VUE_APP_API_SERVER + queryString, {headers: {'X-Auth': process.env.VUE_APP_API_KEY}})
                .then(res => {
                    this.$emit('searched', res.data)
                })
                .catch(error => {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        this.error = error.response.data + ' ' + error.response.status;
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        this.error = error.request;
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        this.error = error.message;
                    }
                });
        },
        buildQueryString() {
            return `/search?q=${encodeURIComponent(this.query)}&page=${encodeURIComponent(this.page)}&container=${encodeURIComponent(this.container)}&image=${encodeURIComponent(this.image)}&host=${encodeURIComponent(this.host)}`;
        }
    }
}
</script>