<template>
  <section class="hero">
    <div class="has-background-white">
      <div class="container has-text-left">
        <h2 class="title">
          <span jsb-word="offers">{{ 'offers' | translate }}</span>
        </h2>
      </div>
    </div>   
    <div class="hero-body">
      <div class="container offers">
        <div class="columns">
          <div class="column has-text-left">
            <h1 class="has-text-info" jsb-word="dayly-offers">{{ 'dayly-offers' | translate }}</h1>
          </div>
        </div>
        <div class="columns is-multiline">
          <div v-for="offer in offers" class="column is-4">
            <a class="offer large" :href="offer.url" target="_blank">
              <div class="bg-inline" :style="'background-image:url(' + offer.image + ')'">
                <img src="/static/img/logo-white.svg" width="50" />
                <h1 class="has-text-white is-size-4" v-html="offer.title"></h1>
                <h6 class="has-text-white is-size-6" v-html="offer.subtitle"></h6>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import helper from '@/components/Helper';
export default {
  name: 'Offers',
  mounted: function(){
    var language = localStorage.getItem('language');
    var storage = JSON.parse(localStorage.getItem('storage-'+language));
    if(storage){
      this.offers = storage.offers.collection;
    }
  },  
  data () {
    return {
      offers:{},
      msg: 'Welcome to JetsBooking'
    }
  }
}
</script>
