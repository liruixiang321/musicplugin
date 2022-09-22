<template>
    <div class="progress-bar" >
        <div class="bar-inner">
            <div class="progress" :style="{width:`${progress*100}%`}" ref="ProgressRef"></div>
            <div class="progress-btn-wrapper" 
            :style="TranslatexStyle"
            @mousedown="onTouchStart"
            @mousemove="onTouchMove"
            @mouseup="onTouchEnd">
                <div class="progress-btn"></div>     
            </div>
            <span class="timer">{{Ltime}}/{{Rtime}}</span> 
        </div>
        
    </div>
</template>

<script>
import { computed,ref,onMounted,reactive} from 'vue'
import { formateTime } from '../utils'
export default {
    emits:['progress-changing','progress-changed'],
    props:{
        currentTime:Number,
        totalTime:Number,
    },

    setup (props,{emit}) {
        const BtnWidth = 10;//进度条按钮
        const ProgressRef = ref(null);
        const mouse = reactive({});

        const Ltime = computed(()=>{
            return formateTime(props.currentTime)
        })

        const Rtime = computed(()=>{
            return formateTime(props.totalTime)
        })

        const progress = computed(()=>{
            return props.currentTime/props.totalTime;//当前进度
        })
        
        const BarWidth = computed(()=>{//进度条左边
            return (252 - BtnWidth)*progress.value
        })
        const TranslatexStyle = computed(()=>{
            return {
                transform: `translateX(${BarWidth.value}px)`,
            }
        })

       function onTouchStart(e) {
        // console.log(e)
        mouse.x1 = e.pageX;
        mouse.beginWidth = ProgressRef.value.clientWidth;
      }
       function onTouchMove(e) {
        // console.log('move'+e)
        // console.log('拖动按钮')
        if(!isNaN(mouse.x1)){
            const delta = e.pageX - mouse.x1
            const tempWidth = mouse.beginWidth + delta;
            const barWidth = 252 - BtnWidth
            const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
            emit('progress-changing', progress)
        }
        
      }
       function onTouchEnd() {
            delete(mouse.x1);
            const barWidth = 252 - BtnWidth
           const progress = ProgressRef.value.clientWidth/barWidth;
            emit('progress-changed', progress)
      }

        onMounted(() => {
            console.log(ProgressRef.value.clientWidth);
        })
        return {
            Ltime,
            Rtime,
            progress,
            ProgressRef,
            //style
            TranslatexStyle,
            onTouchStart,
            onTouchMove,
            onTouchEnd
        }
    }
}
</script>

<style lang="scss" scoped>
.progress-bar {
    height: 30px;
    width: 60%;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(66, 113, 90, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: #f2ecec;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 9px;
          left: 7px;
          box-sizing: border-box;
          width: 12px;
          height: 12px;
          border: 2px solid #fff;
          border-radius: 50%;
          background: rgb(200, 196, 196);
        }
        
      }
      .timer{
        position: absolute;
        right: -68px;
        bottom: -5px;
        font-size: x-small;
       }
    }
    
  }
</style>