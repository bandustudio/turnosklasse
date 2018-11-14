<template>
  <section class="hero">
    <div class="has-background-white">
      <div class="container has-text-left">
        <h2 class="title">
          <span jsb-word="terms">{{ 'terms' | translate }}</span>
        </h2>
      </div>
    </div>
    <div class="hero-body">
      <div class="container has-text-left">
        <p jsb-word="terms-text">{{ 'terms-text' | translate }}</p>
      </div>
    </div>
  </section>
</template>

<script>

import helper from '@/components/Helper';

export default {
  name: 'Terms',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
