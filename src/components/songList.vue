<template>
    <div class="musicContianer">
        <h1 v-if="titleArray.status == 'error' ">Podany album nie zawiera utworów</h1>
        <div v-else :class="[{'active' : item.number == songPlayNbr },'rowContainer']" @click="sendNumber(item.number)" v-for="item in titleArray" :key="item.name">
            <div> <span>{{item.path}}</span> </div>
            <div> <span>{{item.name}}</span></div>
            <div> <span>{{item.size}}.MB</span> </div>
            <div>            
                  <img  v-if="songPlayNbr == item.number" :src="config.serverAdress+`/img/pause.svg`"/>
                  <img v-else :src="config.serverAdress+`/img/play.svg`"/>
             </div>
        </div>
    </div>
</template>

<script>
import config from "../../config.json"
export default {
    name:"songList",
    props: ['title',"songToEmit","songNumber","songArrayEmit"],
    data() {
        return {
            titleArray: [],
            config:config,
            songPlayNbr:this.songNumber
        }
    },
    watch: {
        title() {
            console.log(this.title)
            fetch(config.getMusic, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        path: this.title
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    this.titleArray = data
                    if(data.status!="error"){
                        this.titleArray.map((item,counter) => {
                            item.source = encodeURI(this.config.serverAdress + item.source)
                            item.number = counter
                            item.cover = this.title
                            })
                    }    
                    
                    this.sendArray()                
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        },
        songNumber(){
            this.songPlayNbr = this.songNumber
        }
    },
    methods:{
        sendNumber(name){
            console.log(name);  
            this.songPlayNbr = name
            this.$emit("update:songToEmit",name)
        },
        sendArray(){
            this.$emit("update:songArrayEmit",this.titleArray)
        },
        playPause(){

        }
    }
}
</script>

<style scoped lang="css">
  @import url('./style/rightContainer.css');

</style>