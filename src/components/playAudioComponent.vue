<template>
  <div class="playAudio">
    <div class="title">{{ songName }}</div>
    <div class="controlContainer">
      <input
        v-if="widoczny"
        type="range"
        :max="maxRange"
        min="0"
        :value="currentValue"
        @input="inputHandler"
      />
      <div class="controls">
        <div>
          <img
            @click="prevTrack"
            :src="config.serverAdress + `/img/prev.svg`"
          />
        </div>
        <div>
          <img
            v-if="playStatus"
            @click="playOrPause"
            :src="config.serverAdress + `/img/pause.svg`"
          />
          <img
            v-else
            @click="playOrPause"
            :src="config.serverAdress + `/img/play.svg`"
          />
        </div>
        <div>
          <img
            @click="nextTrack"
            :src="config.serverAdress + `/img/next.svg`"
          />
        </div>
      </div>
    </div>

    <div class="progressInMin">
      <span>{{ minProgress }}</span>
    </div>
  </div>
</template>

<script>
import config from "../../config.json";

export default {
  name: "playerComponent",
  computed: {
    playArray() {
      //lista utworów
      return this.$store.getters.getPlayArray;
    },
    currentPlay() {
      // aktualnie odtwarzany -> numer
      return this.$store.getters.getCurrentPlay;
    },
    playStatus() {
      // czy gra -> true/false
      return this.$store.getters.getPlayStatus;
    },
    directory() {
      //ścieżka /album
      return this.$store.getters.getDirectory;
    },
    playListStatus() {
      return this.$store.getters.getPlayListStatus;
    },
  },
  data() {
    return {
      config,
      player: null, // zawiera js'owski player muzyki => new Audio
      songName: "Nie wybrano utworu",
      minProgress: "", // muzyka w minutach
      //pasek piosenki
      widoczny: false, //widoczność paska progresu piosenki
      maxRange: null, //maksymalna długość
      currentValue: 0, //obecna wartość
    };
  },
  methods: {
    //input
    inputChanger(e) {
      //inpuciątko
      this.currentValue = e.target.currentTime;
      this.maxRange = e.target.duration;
      //licznik czasu
      this.minProgress = `${new Date(
        e.target.currentTime * 1000
      ).getMinutes()}:${new Date(
        e.target.currentTime * 1000
      ).getSeconds()} / ${new Date(
        this.player.duration * 1000
      ).getMinutes()}:${new Date(this.player.duration * 1000).getSeconds()}`;
    },
    inputHandler(e) {
      this.player.currentTime = e.target.value.toString();
      this.currentValue = e.target.value;
    },
    //muzyka
    async playOrPause() {
      if (this.player == null) {
        // jeśli nie ma playera
        if (this.currentPlay == null)
          // jeśli nie ma odtwaraznego utworu
          this.$store.commit("setCurrentPlay", 0); // pierwszy
      } else {
        if (this.playStatus)
          // odtwarza
          this.player.pause();
        // nie odtwarza
        else this.player.play();
      }
      //długość utworu po załadowaniu
      this.widoczny = true;
      if (this.player != null) {
        this.player.addEventListener("timeupdate", this.inputChanger);
        this.player.addEventListener("ended", this.nextTrack);
      }
      //nazwa utworu
      this.songName = `Aktualnie odtwarzany : ${
        this.playArray[this.currentPlay].name
      } \n z albumu :\n
      ${this.playArray[this.currentPlay].album}`;
      this.$store.commit("setPlayStatus"); // zmieniam status
    },
    nextTrack() {
      if (this.currentPlay == this.playArray.length - 1)
        this.$store.commit("setCurrentPlay", 0);
      // od początku
      else {
        this.$store.commit("setCurrentPlay", this.currentPlay + 1); // pierwszy item
      }
    },
    prevTrack() {
      if (this.currentPlay == 0 || this.currentPlay == null)
        this.$store.commit("setCurrentPlay", this.playArray.length - 1);
      // od początku
      else {
        this.$store.commit("setCurrentPlay", this.currentPlay - 1); // pierwszy item
      }
    },
    //helper
    setPlay() {
      this.$store.dispatch("getMusic");
      this.$store.commit("resetPlaylist");
      if (this.player != null) {
        this.player.pause();
        this.player.removeEventListener("timeupdate", this.inputChanger);
        this.player.removeEventListener("ended", this.nextTrack);
      }
      this.widoczny = false;
      this.player = null;
      this.songName = "Nie wybrano utworu";
      this.minProgress = "";
    },
  },
  watch: {
    "$store.state.directory"() {
      this.setPlay();
    },
    //dodaj watch na opcje playlisty
    currentPlay() {
      if (this.playStatus) this.$store.commit("setPlayStatus"); // zmieniam status
      if (this.currentPlay != null) {
        if (this.player != null) this.player.pause();
        this.player = new Audio(this.playArray[this.currentPlay].source);
        this.playOrPause();
      }
    },
    playStatus() {
      if (this.player)
        if (this.playStatus) this.player.play();
        else this.player.pause();
    },
    //nasłuch na status playlista czy nie 
    "$store.state.playListStatus"() {
      if (this.playListStatus) {
        // true => na playlisty
        this.$store.commit("setMusic", this.$store.getters.getPlayList);
        this.$store.commit("resetPlaylist");
        if (this.player != null) {
          this.player.pause();
          this.player.removeEventListener("timeupdate", this.inputChanger);
          this.player.removeEventListener("ended", this.nextTrack);
        }
        this.widoczny = false;
        this.player = null;
        this.songName = "Nie wybrano utworu";
        this.minProgress = "";
      } else {
        // false na utwory
        this.setPlay();
      }
    },
  },
};
</script>

<style scoped lang="css">
@import url("./style/playAudioStyle.css");
</style>
