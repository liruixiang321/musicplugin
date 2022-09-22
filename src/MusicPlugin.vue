<template>
  <div class="VuePlayer">
    <transition name="slide-fade">
        <div class="Aplayer" v-show="Fullbody">

      <thumb-nail :playing="Playing" @toggle-playing="onTogglePlay()" :pic="list[CurrentSongIndex].pic"></thumb-nail>
      <div class="info">
        <span class="title">{{list[CurrentSongIndex].title}}</span>
        <span class="artist">{{list[CurrentSongIndex].artist}}</span>
      </div>
      <div class="shrink" @click="shrink">
        <span class="icon-shrink"></span>
      </div>
      <div class="control">
        <div class="last icon-last" @click="lastSong"></div>
        <div class="next icon-next" @click="nextSong"></div>
      </div>
      <lyric :lrc="list[CurrentSongIndex].lrc" class="lric" :playing="Playing" :currentTime="currentTime"></lyric>
      <progress-bar
        class="progrss-bar"
        :totalTime="duration"
        :currentTime="currentTime"
        @progress-changing="OnProgressChanging"
        @progress-changed="OnProgressChanged"
      ></progress-bar>
      <audio
        ref="audioRef"
        :src="list[CurrentSongIndex].src"
        @pause="pause"
        @canplay="ready"
        @error="error"
        @timeupdate="updateTime"
        @durationchange="updateDuration"
        @ended="end"
      ></audio>
         </div>
    
    </transition>
    <mini-player 
    :playing="Playing"
    :pic="list[CurrentSongIndex].pic"
    @toggle-playing="onTogglePlay"
    :Fullbody="Fullbody"
    @grow="grow"
    class="miniPlayer"
    > </mini-player>
  </div>
</template>

<script>
import { ref, watch,nextTick } from "vue";
import ThumbNail from "./components/thumbnail.vue";
import Lyric from "./components/lyric.vue";
import progressBar from "./components/progressBar.vue";
import miniPlayer from "./components/mini-player/mini-player.vue";
// import useCanvas from "./useCanvans.js";
export default {
  name:'MusicPlugin',
  components: {
    ThumbNail,
    Lyric,
    progressBar,
    miniPlayer,
  },
  props: {
    music: {
      type: Object,
      default: () => {
        return {
          title: "晴天",
          artist: "周杰伦",
          src:
            "http://antiserver.kuwo.cn/anti.s?useless=/resource/&format=mp3&rid=MUSIC_228908&response=res&type=convert_url",
          pic:
            "http://img4.kuwo.cn/star/starheads/120/4/80a74b254395e7d786fdc3f68703377_0.jpg",
          lrc:
            "[00:0.0]\u6674\u5929 - \u5468\u6770\u4f26 (Jay Chou)\r\n[00:7.34]\u8bcd\uff1a\u5468\u6770\u4f26\r\n[00:14.69]\u66f2\uff1a\u5468\u6770\u4f26\r\n[00:22.04]\u7f16\u66f2\uff1a\u5468\u6770\u4f26\r\n[00:29.39]\u6545\u4e8b\u7684\u5c0f\u9ec4\u82b1\r\n[00:32.64]\u4ece\u51fa\u751f\u90a3\u5e74\u5c31\u98d8\u7740\r\n[00:36.19]\u7ae5\u5e74\u7684\u8361\u79cb\u5343\r\n[00:39.93]\u968f\u8bb0\u5fc6\u4e00\u76f4\u6643\u5230\u73b0\u5728\r\n[00:42.99]Re So So Si Do Si La \r\n[00:46.11]So La Si Si Si Si La Si La So \r\n[00:49.79]\u5439\u7740\u524d\u594f\u671b\u7740\u5929\u7a7a\r\n[00:53.35]\u6211\u60f3\u8d77\u82b1\u74e3\u8bd5\u7740\u6389\u843d\r\n[00:56.78]\u4e3a\u4f60\u7fd8\u8bfe\u7684\u90a3\u4e00\u5929\r\n[00:59.03]\u82b1\u843d\u7684\u90a3\u4e00\u5929\r\n[01:01.08]\u6559\u5ba4\u7684\u90a3\u4e00\u95f4\r\n[01:03.68]\u6211\u600e\u4e48\u770b\u4e0d\u89c1\r\n[01:06.7]\u6d88\u5931\u7684\u4e0b\u96e8\u5929\r\n[01:09.52]\u6211\u597d\u60f3\u518d\u6dcb\u4e00\u904d\r\n[01:16.58]\u6ca1\u60f3\u5230\u5931\u53bb\u7684\u52c7\u6c14\u6211\u8fd8\u7559\u7740\r\n[01:26.88]\u597d\u60f3\u518d\u95ee\u4e00\u904d\r\n[01:29.78]\u4f60\u4f1a\u7b49\u5f85\u8fd8\u662f\u79bb\u5f00\r\n[01:41.23]\u522e\u98ce\u8fd9\u5929\u6211\u8bd5\u8fc7\u63e1\u7740\u4f60\u624b\r\n[01:50.7]\u4f46\u504f\u504f\u96e8\u6e10\u6e10\u5927\u5230\u6211\u770b\u4f60\u4e0d\u89c1\r\n[01:64.73]\u8fd8\u8981\u591a\u4e45\u6211\u624d\u80fd\u5728\u4f60\u8eab\u8fb9\r\n[01:75.67]\u7b49\u5230\u653e\u6674\u7684\u90a3\u5929\u4e5f\u8bb8\u6211\u4f1a\u6bd4\u8f83\u597d\u4e00\u70b9\r\n[01:87.93]\u4ece\u524d\u4ece\u524d\u6709\u4e2a\u4eba\u7231\u4f60\u5f88\u4e45\r\n[01:97.5]\u4f46\u504f\u504f\u98ce\u6e10\u6e10\u628a\u8ddd\u79bb\u5439\u5f97\u597d\u8fdc\r\n[02:11.23]\u597d\u4e0d\u5bb9\u6613\u53c8\u80fd\u518d\u591a\u7231\u4e00\u5929\r\n[02:22.25]\u4f46\u6545\u4e8b\u7684\u6700\u540e\u4f60\u597d\u50cf\u8fd8\u662f\u8bf4\u4e86\u62dc\u62dc\r\n[02:58.33]\u4e3a\u4f60\u7fd8\u8bfe\u7684\u90a3\u4e00\u5929\r\n[02:61.25]\u82b1\u843d\u7684\u90a3\u4e00\u5929\r\n[02:64.38]\u6559\u5ba4\u7684\u90a3\u4e00\u95f4\r\n[02:67.18]\u6211\u600e\u4e48\u770b\u4e0d\u89c1\r\n[02:70.08]\u6d88\u5931\u7684\u4e0b\u96e8\u5929\r\n[02:72.9]\u6211\u597d\u60f3\u518d\u6dcb\u4e00\u904d\r\n[02:79.97]\u6ca1\u60f3\u5230\u5931\u53bb\u7684\u52c7\u6c14\u6211\u8fd8\u7559\u7740\r\n[02:90.88]\u597d\u60f3\u518d\u95ee\u4e00\u904d\r\n[02:93.28]\u4f60\u4f1a\u7b49\u5f85\u8fd8\u662f\u79bb\u5f00\r\n[03:04.62]\u522e\u98ce\u8fd9\u5929\u6211\u8bd5\u8fc7\u63e1\u7740\u4f60\u624b\r\n[03:14.08]\u4f46\u504f\u504f\u96e8\u6e10\u6e10\u5927\u5230\u6211\u770b\u4f60\u4e0d\u89c1\r\n[03:28.12]\u8fd8\u8981\u591a\u4e45\u6211\u624d\u80fd\u5728\u4f60\u8eab\u8fb9\r\n[03:39.15]\u7b49\u5230\u653e\u6674\u7684\u90a3\u5929\u4e5f\u8bb8\u6211\u4f1a\u6bd4\u8f83\u597d\u4e00\u70b9\r\n[03:51.52]\u4ece\u524d\u4ece\u524d\u6709\u4e2a\u4eba\u7231\u4f60\u5f88\u4e45\r\n[03:61.72]\u504f\u504f\u98ce\u6e10\u6e10\u628a\u8ddd\u79bb\u5439\u5f97\u597d\u8fdc\r\n[03:74.62]\u597d\u4e0d\u5bb9\u6613\u53c8\u80fd\u518d\u591a\u7231\u4e00\u5929\r\n[03:85.12]\u4f46\u6545\u4e8b\u7684\u6700\u540e\u4f60\u597d\u50cf\u8fd8\u662f\u8bf4\u4e86\u62dc\u62dc\r\n[03:99.37]\u522e\u98ce\u8fd9\u5929\u6211\u8bd5\u8fc7\u63e1\u7740\u4f60\u624b\r\n[04:03.42]\u4f46\u504f\u504f\u96e8\u6e10\u6e10\u5927\u5230\u6211\u770b\u4f60\u4e0d\u89c1\r\n[04:09.07]\u8fd8\u8981\u591a\u4e45\u6211\u624d\u80fd\u591f\u5728\u4f60\u8eab\u8fb9\r\n[04:14.98]\u7b49\u5230\u653e\u6674\u90a3\u5929\u4e5f\u8bb8\u6211\u4f1a\u6bd4\u8f83\u597d\u4e00\u70b9\r\n[04:21.43]\u4ece\u524d\u4ece\u524d\u6709\u4e2a\u4eba\u7231\u4f60\u5f88\u4e45\r\n[04:26.43]\u4f46\u504f\u504f\u96e8\u6e10\u6e10\u628a\u8ddd\u79bb\u5439\u5f97\u597d\u8fdc\r\n[04:32.15]\u597d\u4e0d\u5bb9\u6613\u53c8\u80fd\u518d\u591a\u7231\u4e00\u5929\r\n[04:37.98]\u4f46\u6545\u4e8b\u7684\u6700\u540e\u4f60\u597d\u50cf\u8fd8\u662f\u8bf4\u4e86\u62dc"
        };
      }
    },
    list:Array
  },
  setup(props) {
    const Playing = ref(false);
    const audioRef = ref(null);
    const currentTime = ref(0);
    const duration = ref(0);
    const progressChanging = ref(false);
    const CurrentSongIndex = ref(0);
    const Ready = ref(false);
    const Fullbody = ref(false);//是否展开
    
    watch(Playing,async newValue => {
      await nextTick();
      const audioEle = audioRef.value;
      console.log(newValue);
      if (newValue) {
         audioEle.play();
      } else {
        audioEle.pause();
      }
    });

    function onTogglePlay() {
      Playing.value = !Playing.value;
    }

    function loop() {
      const audioEl = audioRef.value;
      audioEl.currentTime = 0;
      currentTime.value = 0;
      // audioEl.play()
      Playing.value = true;
    }
    function pause() {
      console.log('----pause----')
      Playing.value = false;
    }

    function end() {
      // Playing.value = true
      console.log('---end---')
      loop();
    }

    function updateTime(e) {
      if (!progressChanging.value) {
        currentTime.value = e.target.currentTime;
      }
    }
    function updateDuration(e) {
      duration.value = e.target.duration;
    }
    function OnProgressChanging(progress) {
      progressChanging.value = true;
      // console.log(currentTime.value,progress)
      currentTime.value = progress * duration.value;
    }
    function OnProgressChanged(progress) {
      progressChanging.value = false;
      audioRef.value.currentTime = currentTime.value =
        progress * duration.value;
    }

    function lastSong(){
        console.log('----上一首-----')
        if(CurrentSongIndex.value==0){
            CurrentSongIndex.value = props.list.length-1;
        }else
        CurrentSongIndex.value--;

    }
    function nextSong(){
        console.log('----下一首-----')
        if(CurrentSongIndex.value==props.list.length-1){
            CurrentSongIndex.value = 0;
        }else
        CurrentSongIndex.value++;

        
    }
    function ready(){
      console.log('---canplay---')
      Ready.value = true;
      
      audioRef.value.play().then(()=>{
        Playing.value = true;
      }).catch(()=>{
        Playing.value = false
      });
    } 

    function error(){
      return Playing.value = false
    }
    function shrink(){
      console.log('缩小')
      Fullbody.value = false
    }

    function grow(){
      console.log('变大')
      Fullbody.value = true
    }
    // function OnProgressEnd(){
    //     pro
    // }
    return {
      // data
      Playing,
      audioRef,
      currentTime,
      duration,
      CurrentSongIndex,
      Fullbody,
      // function
      onTogglePlay,
      updateTime,
      end,
      pause,
      error,
      updateDuration,
      OnProgressChanging,
      OnProgressChanged,
      nextSong,lastSong,
      ready,
      shrink,
      grow
      // computed
    };
  }
};
</script>

<style lang="scss" scoped>
  @import url('./scss/varabal.scss');
.VuePlayer{
  position: absolute;
  z-index: 10;
  // left: 0;
  // bottom: 0;
  // width: 100px;
  // height: 100px;
  .slide-fade-enter-active {
    transition: all 1s ease-out;
  }
  
  .slide-fade-leave-active {
    transition: all 1s cubic-bezier(1, 0.5, 0.8, 1);
  }
  
  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translate3d(-50%,-50%,0);
    opacity: 0;
    scale: 0.5;
  }
  
  .Aplayer {
  width: 400px;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(2px);
  color: #080808;
  border-radius: 20px;
  padding: 10px;
  position: relative;
  box-shadow: 1px 1px 2px 1px rgba(112,112,112,0.3);

  .info {
    position: absolute;
    top: 0;
    left: 100px;
    .title {
      font-size: 1rem;
    }
    .artist {
      margin-left: 5px;
      font-size: 0.875rem;
      color: rgba(55, 55, 55, 0.699);
    }
  }
  .lric {
    position: relative;
    top: -68px;
    left: 95px;
  }
  .progress-bar {
    position: absolute;
    bottom: 4px;
    right: 72px;
  }
  .control {
    display: flex;
    justify-content: space-between;
    width: 63%;
    position: absolute;
    font-size: 30px;
    bottom: 40px;
    left: 119px;
    z-index: 10;
  }
  .shrink{
    position: absolute;
    right: 10px;
    top: 10px;
    color: #81899b;
    font-size: medium;
  }
}
.miniPlayer{
  position: absolute;
  top: 10px;
  left: 0;
  z-index: -1;
}
}

</style>