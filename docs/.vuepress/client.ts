import { defineClientConfig } from 'vuepress/client'
import HomePage from './components/HomePage.vue'
import ShotPlaceholder from './components/ShotPlaceholder.vue'
import HomeLayout from './layouts/HomeLayout.vue'

function wrapDocTables() {
  if (typeof document === 'undefined') return
  const root = document.querySelector('[vp-content]')
  if (!root || root.querySelector('.home-page-root')) return

  root.querySelectorAll('table').forEach((table) => {
    if (table.parentElement?.classList.contains('fm-table-wrap')) return
    const wrap = document.createElement('div')
    wrap.className = 'fm-table-wrap'
    table.parentElement?.insertBefore(wrap, table)
    wrap.appendChild(table)
  })
}

function scheduleWrapDocTables() {
  if (typeof window === 'undefined') return
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => wrapDocTables())
    return
  }
  setTimeout(() => wrapDocTables(), 0)
}

export default defineClientConfig({
  enhance({ app, router }) {
    app.component('HomePage', HomePage)
    app.component('ShotPlaceholder', ShotPlaceholder)
    if (typeof window !== 'undefined') {
      router.afterEach(() => {
        scheduleWrapDocTables()
      })
    }
  },
  layouts: {
    HomeLayout,
  },
  setup() {
    scheduleWrapDocTables()
  },
})
