<template>
  <div id="app">
   <div class="pgContainer">
            <cover-bar-container :to-emit.sync="directory"></cover-bar-container>
            <div class="rightContainer">
                <h1>MP3 player</h1>
                <song-list :songNumber.sync="songNumber"  :song-array-emit.sync="playArray" :title="directory" :song-to-emit.sync="songNumber"></song-list>
            </div>
        </div>
       <footer>
      <playerComponent :emit-song-number.sync="songNumber" :song-number.sync="songNumber" :audio-array="playArray" ></playerComponent>
    </footer>
   </div>
</template>

<script>
// import songList from './components/songList.vue'
import coverBarContainer from './components/coverBar.vue'
import SongList from './components/songList.vue'
import playerComponent from "./components/playAudioComponent.vue"
export default {
  name: 'App',
  components: {
    coverBarContainer,
    SongList,
    playerComponent
  },
  data(){
    return{
      directory:"directory",
      playArray:[],
      songNumber:null,
    }
  }
}
</script>

<style>
@import url('./components/style/mainStyle.css');

</style>
