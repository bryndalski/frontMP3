<template>
  <div class="musicContianer">
    <h1 v-if="playArray.status == 'error'">Podany album nie zawiera utworów</h1>
    <table v-else>
      <tr
        :class="[{ active: item.number == currentPlay }, 'rowContainer']"
        v-for="(item, counter) in playArray"
        @click="
          changeSongNumber(counter);
          playPause();
        "
        :key="item.name"
      >
        <th>
          <span>{{ item.path }}</span>
        </th>
        <th>
          <span>{{ item.name }}</span>
        </th>
        <th>
          <span>{{ item.size }}.MB</span>
        </th>
        <th>
          <img
            v-if="currentPlay == item.number && playStatus"
            :src="config.serverAdress + `/img/pause.svg`"
          />
          <img v-else :src="config.serverAdress + `/img/play.svg`" />
        </th>
        <th>
          <img
            v-if="currentPlay == item.number && playStatus"
            :src="config.serverAdress + `/img/pause.svg`"
          />
          <img v-else :src="config.serverAdress + `/img/play.svg`" />
        </th>
      </tr>
    </table>
  </div>
</template>

<script>
import config from "../../config.json";
export default {
  name: "songList",
  computed: {
    playArray() {
      return this.$store.getters.getPlayArray;
    },
    currentPlay() {
      return this.$store.getters.getCurrentPlay;
    },
    playStatus() {
      return this.$store.getters.getPlayStatus;
    },
  },
  data() {
    return {
      config: config,
    };
  },

  methods: {
    changeSongNumber(number) {
      this.$store.commit("setCurrentPlay", number); // pierwszy item
    },
    playPause() {
      console.log("XDDD");
      this.$store.commit("setPlayStatus");
    },
  },
};
</script>

<style scoped lang="css">
@import url("./style/rightContainer.css");
</style>
