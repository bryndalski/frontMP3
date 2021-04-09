<template>
  <div class="musicContianer">
    <h1 v-if="playArray.status == 'error'">Podany album nie zawiera utworów</h1>
    <table v-else>
      <tr
        :class="[{ active: counter == currentPlay }, 'rowContainer']"
        v-for="(item, counter) in playArray"
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
        <th
          @click="
            changeSongNumber(counter);
            playPause();
          "
        >
          <img
            v-if="currentPlay == counter && playStatus"
            :src="config.serverAdress + `/img/pause.svg`"
          />
          <img v-else :src="config.serverAdress + `/img/play.svg`" />
        </th>
        <th>
          <img
            v-if="ifPlayListContains(item)"
            :src="config.serverAdress + `/img/heart.svg`"
            @click="addToPlaylist(item)"
          />
          <img
            v-else
            :src="config.serverAdress + `/img/love.svg`"
            @click="removeFromPlaylist(item)"
          />
        </th>
      </tr>
    </table>
  </div>
</template>

<script>
import config from "../../config.json";
import axios from "axios";
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
    playList() {
      return this.$store.getters.getPlayList;
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
      this.$store.commit("setPlayStatus");
    },
    //do porównywania wystarczy poprosić ładnie o adresy z serwera :)
    ifPlayListContains(index) {
      let toReturn = true;
      this.playList.forEach((element) => {
        if (element.source == index.source) toReturn = false;
      });
      return toReturn;
    },
    //playlista
    addToPlaylist(item) {
      this.$store.commit("addToPlayList", item);
      axios({
        url: config.addToPlayList,
        method: "POST",
        data: {
          source: item.serverSource,
          size: item.size,
          path: item.path,
          name: item.name,
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        },
      }).then((response) => {
        console.log(response);
      });
    },
    removeFromPlaylist(item) {
      this.$store.commit("removeFromPlayList", item);
      axios({
        url: config.removeFromPlayList,
        method: "POST",
        data: {
          source: item.serverSource,
          size: item.size,
          path: item.path,
          name: item.name,
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        },
      }).then((response) => {
        console.log(response);
      });
    },
  },
};
</script>

<style scoped lang="css">
@import url("./style/rightContainer.css");
</style>
