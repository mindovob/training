<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline">
        <span>Azure  </span>
        <span class="font-weight-light">Sample Apps</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu>
        <v-btn flat slot="activator">MENU</v-btn>
        <v-list>
          <v-list-tile flat href="/sample1">
            <v-list-tile-title class="mr-2">DEMO 1</v-list-tile-title>
          </v-list-tile>
          <v-list-tile flat href="/sample2">
            <v-list-tile-title class="mr-2">DEMO 2</v-list-tile-title>
          </v-list-tile>
          <v-list-tile flat href="/sample3">
            <v-list-tile-title class="mr-2">DEMO 3</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      //
    }
  }
}
</script>
