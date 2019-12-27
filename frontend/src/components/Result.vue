<template>
  <div class="shadow mb-4 rounded-lg relative">
      <button class="flex justify-between min-w-full bg-gray-200 hover:bg-gray-100 p-2 rounded rounded-b-none" @click="toggleExpanded(result)" title="Expand" aria-label="Expand content">
        <span v-text="result.host" />
        <span v-text="result.created_at" />
      </button>

      <div class="flex justify-between">
        <div v-for="(tag, key) in dockerTags" :key="result._id + tag" class="px-2">
          <span class="font-bold">
            {{ key }}
          </span>
          <span v-text="key === 'Created' ? formatDate(result.tags[tag]) : result.tags[tag]">
          </span>
        </div>
      </div>

      <div v-if="result.short_message" class="flex">
        <span class="font-bold px-2">
            Short
        </span>
        <span v-text="result.short_message" />
      </div>
      <div v-if="result.full_message" class="flex">
        <span class="font-bold px-2">
            Long
        </span>
        <span v-text="result.full_message" />
      </div>
      <div v-if="isExpanded(result)" class="overflow-scroll mt-2 ml-2 bg-gray-100 mr-2">
        <pre v-text="JSON.stringify(result, null, 2)"></pre>
      </div>
  </div>
</template>

<script>
import parseJSON from 'date-fns/parseJSON';
import formatISO from 'date-fns/formatISO';

export default {
    props: ['result'],
    data() {
      return {
        expanded: [],
        dockerTags: {
          Container: '_container_name',
          Image: '_image_name',
          Tag: '_tag',
          Created: '_created'
        }
      }
    },
    methods: {
      formatDate(date) {
        return formatISO(parseJSON(date));
      },
      isExpanded(result) {
        return this.expanded.indexOf(result._id) > -1;
      },
      toggleExpanded(result) {
        const index = this.expanded.indexOf(result._id);
        if (index > -1) {
          this.expanded = [...this.expanded.slice(0, index), ...this.expanded.slice(index + 1)];
          return;
        }
        this.expanded.push(result._id);
      }
    }
}
</script>