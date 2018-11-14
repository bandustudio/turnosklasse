<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          <span class="icon has-text-success">
            <i class="fa fa-bolt"></i>
          </span>
          <span jsb-word="not-found">{{ 'not-found' | translate }}</span>
        </h1>
        <p jsb-word="not-found-text">{{ 'not-found-text' | translate }}</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'NotFound',
  data () {
    return {
      msg: 'Welcome to JetsBooking'
    }
  }
}
</script>
