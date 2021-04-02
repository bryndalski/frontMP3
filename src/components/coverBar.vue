<template>
    <div class="coverBarContainer" >
         <img v-for="item in coverArray" v-on:click="newCover(item.path)" :key="item.src" :src="config.serverAdress +item.source">
    </div>
</template>

<script>
import config from "../../config.json"
export default {
    name:"coverBar",

    computed:{ // lepsza inichajlizacja danych => pod zapytania asynchroniczne
        coverArray(){
            return this.$store.getters.getCoverArray
        }  
    },
    data() {
        return {
            config:config
        }
    },
    methods: {
        newCover(dir){
            this.$store.commit("setDirectory", dir)
        }
    },
}
</script>

<style scoped lang="css">
@import url('./style/coverStyles.css');

</style>