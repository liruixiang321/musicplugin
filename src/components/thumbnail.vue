<template>
    <div class="thumbnail">
        <img :src="pic" alt="" @load="imgLoaded">
        <Loading v-if="loading"></Loading>
        <div class="icon-button" @click="TogglePlay()">
            <span :class="IconStyle"></span>
        </div>
    </div>
</template>

<script>
import {computed,ref,watch} from 'vue'
import Loading from './loading/loading.vue'
export default {
    name:'thumb-nail',
    props:{
        playing:{
            type:Boolean,
            default:false
        },
        pic:{
            type:String,
            default:'http://img4.kuwo.cn/star/starheads/120/4/80a74b254395e7d786fdc3f68703377_0.jpg'
        }
    },
    components:{
    Loading,
},
    emits:['toggle-playing'],
    setup (props,{emit}) {
    //  const playing = ref(true)
      const loading = ref(true);
     const IconStyle = computed(()=>{
        return props.playing? 'icon-pause':'icon-play'
     })
      function TogglePlay(){
            emit('toggle-playing');
        }

        function imgLoaded(){
            console.log('图片加载完成');
            loading.value = false
        }
        watch(()=>props.pic,()=>{
            loading.value = true
        })
        return {
            IconStyle,
            TogglePlay,
            imgLoaded,
            loading
        }
    }
}
</script>

<style lang="scss" scoped>
@import url('../scss/varabal.scss');
.thumbnail{
            width: 80px;
            height: 80px;
            background: no-repeat center ;
            // background-image: url('../assets/logo.png');
            background-size: contain;
            background-color: pink;
            position: relative; 
            img{
                width: 100%;
                height: 100%;
            }
            // float: left;
        .icon-button{
            font-size: 30px;
            position: absolute;
            right: 0;
            bottom: 0;
            color: #8a8a8a;
        }
}
</style>