<template>
  <section class="hero">
    <div class="has-background-white">
      <div class="container has-text-left">
        <h2 class="title">
          <span jsb-word="privacy">{{ 'privacy' | translate }}</span>
        </h2>
      </div>
    </div>  
    <div class="hero-body">
      <div class="container has-text-left">
        <p jsb-word="privacy-text">{{ 'privacy-text' | translate }}</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Privacy',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
