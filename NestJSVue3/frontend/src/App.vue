<template>
  <div id="app">
    <h1>Items</h1>
    <div v-if="items">{{ items }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      items: null,
    };
  },
  async mounted() {
    try {
      const response = await axios.get("http://localhost:3000/items");
      this.items = response.data;
    } catch (error) {
      console.error("An error occurred while fetching the data", error);
    }
  },
};
</script>
