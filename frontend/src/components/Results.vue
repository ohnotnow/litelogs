<template>
  <div>
    <div class="bg-gray-200 rounded mb-4 p-2">
      {{ results.totalDocs }} results in total
    </div>
    <div v-for="result in results.docs" :key="result._id">
        <Result :result="result" />
    </div>
  </div>
</template>

<script>
import Result from './Result';

export default {
    props: ['results'],
    components: {
        Result
    },
}
</script>