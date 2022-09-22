<template>
  <div class="LyricWrapper">
    <!-- <div class="mask"></div> -->
    <div class="lrc-contents" :style="transformStyle">
     <p v-for="(item,index) in CurrentLricyLine" :key="index">{{item[1]}}</p>
    </div>
    
    <p>{{CurrentLricyLine[CurrentLineIndex]}}zhege </p>
  </div>
</template>

<script>
import { computed,watch,ref } from "vue";
import { parseLrc } from "../utils";
export default {
  name: "LyricParser",
  props: {
    lrc: String,
    playing: Boolean,
    currentTime: Number
  },
  setup(props) {
    const CurrentLineIndex = ref(0);

    const CurrentLricyLine = computed(()=>{
      return parseLrc(props.lrc)
    })
  
      console.log(CurrentLricyLine)
    const transformStyle = computed(()=>{
        return {
          transform: `translateY(${-CurrentLineIndex.value * 22}px)`,
          webkitTransform: `translateY(${-CurrentLineIndex.value * 22}px)`,
        }
    })
    // 侦听时间变化
    watch(()=>props.currentTime,NewCurrentTime=>{
        for (let i = 0; i < CurrentLricyLine.value.length; i++) {
        const line = CurrentLricyLine.value[i];
        const nextLine = CurrentLricyLine.value[i + 1];
        if (
          NewCurrentTime >= line[0] &&
          (!nextLine || NewCurrentTime < nextLine[0])
        ) {
          CurrentLineIndex.value = i;
        }
    }
    })

    // watch(()=>props.lrc,Newlrx=>{
      
    // })

    return {
      CurrentLricyLine,
      CurrentLineIndex,
      transformStyle
    };
  }
};
</script>

<style lang="scss" scoped>
.LyricWrapper {
  height: 50px;
  width: 300px;
  position: relative;
  overflow: hidden;
  .mask {
    z-index: 10;
    position: absolute;
    bottom: 0;
    height: 20px;
    width: 300px;
    background: linear-gradient(to bottom, transparent -100%, #55eb98);
  }
  .lrc-contents{
    transition: all 0.5s linear 0s;
    p {
    line-height: 12px;
    font-size: 10px;

     }
  }
}
</style>