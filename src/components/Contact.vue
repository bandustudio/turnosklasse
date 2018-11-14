<template>
  <section class="hero">
    <div class="has-background-white">
      <div class="container has-text-left">
        <h2 class="title">
          <span jsb-word="contact">{{ 'contact' | translate }}</span>
        </h2>
      </div>
    </div>   
    <div class="hero-body">
      <div class="container">
        <h2 class="subtitle">
          [FORM]
        </h2>
      </div>
    </div>
  </section>
</template>

<script>
import helper from '@/components/Helper';
export default {
  name: 'Contact',
  data () {
    return {
      msg: 'Welcome to JetsBooking'
    }
  }
}
</script>
