
import { computed, ref, watch } from 'vue'

export default function useCd(props) {
  const cdRef = ref(null)
  const cdImageRef = ref(null)
  const cdCls = computed(() => {
    return props.playing ? 'playing' : 'pause'
  })

  watch(()=>props.playing, (newPlaying) => {
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  function syncTransform(wrapper, inner) {
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform)
  }

  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}
