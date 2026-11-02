<template>
  <!-- Mount the premium Obsidian Frame Dashboard wrapper -->
  <ObsidianDashboard />
</template>

<script setup lang="ts">
import ObsidianDashboard from './components/ObsidianDashboard.vue';
</script>

<style>
/* Reset global body metrics to enforce dark theme boundaries */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #0c0c0e;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  height: 100%;
}

/* Global scrollbar track stylings across layout modules */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #0c0c0e;
}

::-webkit-scrollbar-thumb {
  background: #1e1e24;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.02);
}

::-webkit-scrollbar-thumb:hover {
  background: #2a2a35;
}
</style>
