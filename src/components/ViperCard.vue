<template>
  <v-card
      class="mx-auto my-12"
      max-width="374"
  >
    <v-img
        height="250"
        :src="viper.url"
    ></v-img>

    <v-card-title><b>ID:</b> {{ viper.id }}</v-card-title>

    <v-card-text>
      <span v-if="viper.matron == 0 && viper.sire == 0">Bought</span>
      <span v-else>{{ viper.matron }} & {{ viper.sire }}</span>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "ViperCard",
  props: [
      'viper'
  ]
}
</script>