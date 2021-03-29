<template>
     <div class="playAudio">
        <div class="title">{{songName}}</div>
        <div class="controls">
            <div> <img @click="prevTrack" :src="config.serverAdress+`/img/prev.svg`"/> </div>
            <div> <img @click="playOrPause" :src="playPauseImg"/> </div>
            <div> <img @click="nextTrack" :src="config.serverAdress+`/img/next.svg`"/> </div>
        </div>
    </div>
</template>

<script>
import config from "../../config.json"

export default ({
    name:"playerComponent",
    props:["audioArray","emitSongNumber","emitSongStatus","songNumber"],
    data() {
        return {
            config:config,
            plaing:false,
            playNumber:this.songNumber,
            currentPlay:null,
            songName:"Nie wybrano utworu",
            playPauseImg:`${config.serverAdress}/img/play.svg`
        }
    },
    methods: {
        playOrPause(){
            if(this.playNumber ==null){
                this.playNumber = 0
                this.plaing = false
                this.$emit("update:emitSongNumber",this.playNumber)

            }
            if(this.plaing){
                //pause
              
                try {
                    if(this.currentPlay){
                    this.currentPlay.pause()
                    this.plaing=false
                    this.$emit("update:emitSongStatus",this.plaing)
                    this.playPauseImg=`${config.serverAdress}/img/play.svg`
                } 
                } catch (error) {
                    console.log("WRUM");
                }

           }else{
               try {         
                if(this.currentPlay){
                    this.currentPlay.play()
                    this.plaing=true
                    this.$emit("update:emitSongStatus",this.plaing)
                    this.playPauseImg=`${config.serverAdress}/img/pause.svg`
                }else{
                    this.playAduio()
                }
                } catch (error) {
                  console.log("hi"); 
                }
           }
        },
        nextTrack(){
            if(this.playNumber ==null)
                this.playNumber = -1
            if(this.playNumber+1==this.audioArray.length)
                this.playNumber=0
            else
                this.playNumber =  this.playNumber +1
            this.playAduio()
            this.$emit("update:emitSongNumber",this.playNumber)

        },
        playAduio(){
            try {
                if(this.currentPlay)
                    this.currentPlay.pause()
                this.currentPlay = new Audio(this.audioArray[this.playNumber].source)
                this.plaing = true,
                this.currentPlay.play()
                this.songName=`${this.audioArray[this.playNumber].cover}/${this.audioArray[this.playNumber].name}`
                this.playPauseImg=`${config.serverAdress}/img/pause.svg`
                this.currentPlay.addEventListener("ended",()=>{this.nextTrack()})
            } catch (error) {
                console.log("error");
            }
            
        },
        prevTrack(){
            if(this.playNumber==null)
                this.playNumber = this.audioArray.length
            if(this.playNumber-1<0)
                this.playNumber=this.audioArray.length -1
            else
                this.playNumber =  this.playNumber -1
            this.$emit("update:emitSongNumber",this.playNumber)
            this.playAduio()
        },
    },
    watch:{
        audioArray(){
            if(this.currentPlay)
                this.currentPlay.pause()
            this.plaing=false
            this.playNumber=null
            this.currentPlay=null
            this.songName="Nie wybrano utworu"
            this.playPauseImg=`${config.serverAdress}/img/play.svg`


        },
        songNumber(){
            this.playNumber=this.songNumber
            this.playAduio()
        },
    }

})
</script>

<style scoped lang="css">
  @import url('./style/playAudioStyle.css');

</style>