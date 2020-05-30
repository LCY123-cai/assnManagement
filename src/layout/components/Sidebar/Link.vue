<template>
  <!-- eslint-disable vue/require-component-is -->
  <!-- 缺少:is="true"，但是不知道有什么影响 -->
  <component v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    linkProps(url) {
      if (this.$validate.isExternal(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to: url
      }
    }
  }
}
</script>
