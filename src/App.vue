<script setup lang="ts">
import { Analytics } from "@vercel/analytics/vue";
import { SpeedInsights } from "@vercel/speed-insights/vue";
import HomePage from "./pages/HomePage.vue";
</script>

<template>
  <Analytics />
  <SpeedInsights />
  <HomePage />
</template>
