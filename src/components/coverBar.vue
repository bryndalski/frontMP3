<template>
    <div class="coverBarContainer" >
         <img v-for="item in coversTitleArray" v-on:click="emitCover(item.path)" :key="item.src" :src="config.serverAdress +item.source">
    </div>
</template>

<script>
import axios from 'axios'
import config from "../../config.json"
export default {
    name:"coverBar",
    props:['toEmit'],
    created() {
        axios({
            url:config.getCovers,
            method:"GET",
            headers:{
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        })
        .then(response => {this.coversTitleArray = response.data
        console.log(response.data)
        this.emitCover(response.data[0].path)
        ;})
        
        .catch(err => console.log(err))
    },
    methods: {
        emitCover(value) {
            console.log(value);
            this.$emit("update:toEmit", value)
        }
    },
    data() {
        return {
            coversTitleArray:[],
            config:config
        }
    },
}
</script>

<style scoped lang="css">
@import url('./style/coverStyles.css');

</style>