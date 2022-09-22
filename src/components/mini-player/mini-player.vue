<template>
  <transition
  name="mini"
  >
  <div class="mini-player" v-show="!Fullbody">
        
      <div class="cd-wrapper">
        <span id="icon" :class="iconStyle" @click="TogglePlay()"></span>
        <div
          ref="cdRef"
          class="cd"
        >
          <img
            ref="cdImageRef"
            width="40"
            height="40"
            :src="pic"
            :class="cdCls"
          >
        </div>
      </div>
      <span class="grow" @click="grow">></span>
    </div>
  </transition>
    
</template>

<script>
import useCd from './use-cd';
import { computed } from 'vue';
export default {
    props:{
      pic:String,
      playing:Boolean,
      Fullbody:Boolean
    },
    emits:['toggle-playing','grow'],
    setup (props,{emit}) {

       const {cdCls,cdImageRef,cdRef} = useCd(props)
      
       const iconStyle = computed(()=>{
        if(props.playing)
        return 'icon-pause'
        else
        return 'icon-play'
       })

       function TogglePlay(){
            emit('toggle-playing');
        }

        function grow(){
            emit('grow');
        }
        return {
          cdCls,
          cdImageRef,
          cdRef,
          iconStyle,
          TogglePlay,
          grow
        }
    }
}
</script>

<style lang="scss" scoped>
  @import url('../../scss/varabal.scss');
  .mini-player {
    // width: 40px;
    // height: 40px;
    display: flex;
    align-items: center;
    .cd-wrapper {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;
      position: relative;
      cursor: move;
      #icon{
        position: absolute;
        left: 50%;
        top:50%;
        font-size: 30px;
        transform: translate(-36%, -50%);
        color: #b7c0ea;
        z-index: 10;
        cursor: pointer;
      }
      .cd {
        height: 100%;
        width: 100%;
        img {
          border-radius: 50%;
          &.playing {
            animation: rotate 10s linear infinite;
          }
          &.pause {
            animation-play-state: paused;
          }
        }
      }
    }
    .grow{
      cursor: pointer;
    }
    &.mini-enter-active, &.mini-leave-active {
      transition: all 1s cubic-bezier(0.45, 0, 0.55, 1);
    }
    &.mini-enter-from, &.mini-leave-to {
      opacity:0;
      transform: translate3d(10%, 0, 0) 
      scale(1.5)
    }
  }

</style>