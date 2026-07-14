<template>
  <figure class="shot-ph">
    <div class="shot-ph__media" :style="{ aspectRatio }">
      <img
        v-show="!missing"
        class="shot-ph__img"
        :src="src"
        :alt="title"
        loading="lazy"
        @error="missing = true"
        @load="missing = false"
      />
      <div v-if="missing" class="shot-ph__empty">
        <strong>{{ title }}</strong>
        <p>{{ hint }}</p>
        <code>{{ filename }}</code>
        <span class="shot-ph__size">建议 {{ size }}</span>
      </div>
    </div>
    <figcaption v-if="caption" class="shot-ph__cap">{{ caption }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vuepress/client'

const props = withDefaults(
  defineProps<{
    id: string
    title: string
    filename: string
    hint?: string
    size?: string
    aspectRatio?: string
    caption?: string
  }>(),
  {
    hint: '请将真实界面截图放到 docs/.vuepress/public/shots/ 并保持文件名一致',
    size: '1920×1080',
    aspectRatio: '16 / 9',
  },
)

const missing = ref(false)
const src = computed(() => withBase(`/shots/${props.filename}`))
</script>

<style scoped>
.shot-ph {
  margin: 0;
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

.shot-ph__media {
  position: relative;
  width: 100%;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(91, 140, 255, 0.12), rgba(34, 211, 197, 0.08)),
    repeating-linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.03) 0,
      rgba(255, 255, 255, 0.03) 8px,
      transparent 8px,
      transparent 16px
    );
}

.shot-ph__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.shot-ph__empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  color: rgba(244, 247, 255, 0.86);
}

.shot-ph__badge {
  display: inline-flex;
  padding: 4px 10px;
  border: 1px solid rgba(91, 140, 255, 0.45);
  background: rgba(91, 140, 255, 0.15);
  color: #9dbcff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.shot-ph__empty strong {
  font-size: 18px;
  font-weight: 700;
}

.shot-ph__empty p {
  margin: 0;
  max-width: 36rem;
  font-size: 13px;
  line-height: 1.55;
  color: rgba(244, 247, 255, 0.62);
}

.shot-ph__empty code {
  font-size: 12px;
  color: #7ff0e4;
  background: rgba(0, 0, 0, 0.28);
  padding: 4px 8px;
}

.shot-ph__size {
  font-size: 11px;
  color: rgba(244, 247, 255, 0.45);
}

.shot-ph__cap {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  font-size: 12px;
  color: rgba(244, 247, 255, 0.6);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.25);
}

.shot-ph__id {
  flex-shrink: 0;
  padding: 2px 8px;
  border: 1px solid rgba(91, 140, 255, 0.4);
  color: #9dbcff;
  font-weight: 700;
  letter-spacing: 0.04em;
}
</style>
