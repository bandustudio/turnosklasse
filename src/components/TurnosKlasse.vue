<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container">

        <article v-if="announcement" :class="'message ' + announcement.type">
          <div class="message-body">
            <span v-html="announcement.message"></span>
          </div>
        </article>        

        <div class="columns is-fullhd">
          <div class="column is-9">
            <div class="app__search revealer has-text-left" :class="{ 'apply' : !loading }">
              <h2 class="has-text-white">Seleccioná tu vehículo</h2>
              <div class="columns flight-type">
                <div class="column">
                  <div class="button is-large" flight-type="roundtrip" :class="{ 'is-white' : search['flight-type'] != 'roundtrip' }" @click="setFlightType">Autos</div>
                  <div class="button is-large" flight-type="oneway" :class="{ 'is-white' : search['flight-type'] != 'oneway' }" @click="setFlightType">Vans</div>
                </div>
              </div>
              <div class="columns airports">
                <div class="column is-half">
                  <div class="button is-large is-white is-fullwidth">
                    <span class="icon">
                      <img src="/static/img/plane_icon.svg">
                    </span>
                    <ul class="is-pulled-left has-text-left">
                    <li><span>Automóviles</span></li>
                    <li>
                      <span v-if="search.departure" class="has-text-info" v-html="search.departure"></span>
                      <!--span v-else class="has-text-grey"></span-->
                    </li>
                    </ul>
                  </div>
                  <v-select ref="departure" v-model="search.departure" maxHeight="inherit" placeholder="Elija" :selected="search.departure" :filterable="false" :options="$root.departures" @search="$root.searchDeparture" @input="setDeparture">
                    <template slot="no-options">
                      Elija modelo
                    </template>                
                    <template slot="option" slot-scope="option">
                      <div class="d-center">
                        <strong>{{ option.city }}, {{ option.state }}</strong> {{ option.country }}<br>
                        ({{ option.airport_code }}) {{ option.airport }}
                      </div>
                    </template>
                    <template slot="selected-option" scope="option">
                      <div class="selected d-center">
                        <!-- {{ option.city }} ({{ option.airport_code }}) -->
                      </div>
                    </template>                  
                  </v-select>                
                </div>
                <div class="column is-half">
                  <div class="button is-large is-white is-fullwidth">
                    <span class="icon">
                      <img src="/static/img/plane_icon.svg">
                    </span>
                    <ul class="is-pulled-left has-text-left">
                    <li><span>Sucursales</span></li>
                    <li>
                      <span v-if="search.arrival" class="has-text-info" v-html="search.arrival"></span>
                      <!--span v-else class="has-text-grey" jsb-word="search-origin-placeholder"></span-->
                    </li>
                    </ul>
                  </div>
                  <v-select ref="arrival" v-model="search.arrival" maxHeight="inherit" placeholder="Elija 2" :filterable="false" :options="$root.arrivals" @search="$root.searchArrival" @input="setReturn">
                    <template slot="no-options" jsb-word="search-origin-placeholder">
                      {{ 'search-origin-placeholder' }}
                    </template>                
                    <template slot="option" slot-scope="option">
                      <div class="d-center">
                        <strong>{{ option.city }}, {{ option.state }}</strong> {{ option.country }}<br>
                        ({{ option.airport_code }}) {{ option.airport }}
                      </div>
                    </template>
                    <template slot="selected-option" scope="option">
                      <div class="selected d-center">
                        <!-- {{ option.city }} ({{ option.airport_code }}) -->
                      </div>
                    </template>    
                  </v-select>
                </div>
              </div>
              <div class="columns">
                <div class="column is-one-quarter departure-date">
                  <div class="button is-large is-white is-fullwidth" @click="showDepartDate">
                    <span class="icon">
                      <img src="/static/img/calendar_icon.png">
                    </span>
                    <ul class="is-pulled-left has-text-left">
                    <li><span jsb-word="search-departure-date"></span></li>
                    <li>
                    <span v-if="search['departure-date']" class="has-text-info" v-html="search['departure-date']"></span>
                    <span v-else class="has-text-grey" jsb-word="search-depart-placeholder"></span>
                    </li>
                    </ul>
                  </div>
                  <vue-datepicker-local :local="$root.local" v-model="search['departure-date']"></vue-datepicker-local>
                  <!--datepicker ref="departdate" :disabledDates="disabledDates" @selected="setDepartDate"></datepicker-->
                </div>
                <div class="column is-one-quarter return-date">
                  <div class="button is-large is-white is-fullwidth" @click="showReturnDate">
                    <span class="icon">
                      <img src="/static/img/calendar_icon.png">
                    </span>
                    <ul class="is-pulled-left has-text-left">
                    <li><span jsb-word="search-return-date"></span></li>
                    <li>
                    <span v-if="search['return-date']" class="has-text-info" v-html="search['return-date']"></span>
                    <span v-else class="has-text-grey" jsb-word="search-depart-placeholder"></span>
                    </li>
                    </ul>
                  </div>
                  <vue-datepicker-local :local="$root.local" v-model="search['return-date']"></vue-datepicker-local>
                  <!--datepicker ref="returndate" :disabledDates="disabledDates" @selected="setReturnDate"></datepicker-->
                </div>
                <div class="column is-one-quarter">
                  <div class="button is-large is-white is-fullwidth" @click="showPassengers">
                    <span class="icon">
                      <img src="/static/img/pasengers_icon.png">
                    </span>
                    <ul class="is-pulled-left has-text-left">
                    <li><span jsb-word="search-passengers"></span></li>
                    <li><span class="has-text-info" v-html="passengersText"></span></li>
                    </ul>
                  </div>
                  <passengerpicker :class="{ 'is-active' : passengersToggle }" v-bind="search.passengers" @passengerchanged="handlePassengersUpdate($event)" @click="showPassengers"></passengerpicker>
                </div>
                <div class="column is-one-quarter category">
                  <div class="button is-large is-white is-fullwidth" @click="showCategory">
                    <span class="icon">
                      <img src="/static/img/category_icon.svg">
                    </span>
                    <ul class="is-pulled-left has-text-left">
                    <li>
                      <span jsb-word="search-category"></span>
                    </li>
                    <li>
                      <span v-if="search.category" class="has-text-info" v-html="search.category"></span>
                      <span v-else class="has-text-grey" jsb-word="search-category-placeholder"></span>
                    </li>
                    </ul>
                  </div>
                  <v-select v-model="search.category"  maxHeight="inherit" :options="flights.categories">
                    <template slot="no-options" jsb-word="search-category-placeholder">
                    </template>                
                    <template slot="option" slot-scope="option">
                      <div class="d-center">
                        <strong>{{ option.label }}</strong>
                      </div>
                    </template>
                    <template slot="selected-option" scope="option">
                      <div class="selected d-center">
                        {{ option.label }}
                      </div>
                    </template>                       
                  </v-select>
                </div>
              </div>
              <div class="columns">
                <div class="column has-text-left">
                  <button class="button is-expanded" @click="submit" :disabled="!canShowResults">Solicitar turno</button>
                  </router-link>
                </div>
              </div>            
            </div>
          </div>
          <div v-for="ad in ads" class="column has-text-centered">
            <a :href="ad.url" target="_blank">
              <img class="ad" :src="ad.image" />
            </a>
          </div>
        </div>
      </div>
      <div class="container offers">
        <div class="columns">
          <div class="column has-text-left">
            <h1 class="has-text-info" jsb-word="dayly-offers">{{ 'dayly-offers' }}</h1>
          </div>
        </div>
        <div class="columns is-multiline">
          <div v-for="offer in offers" class="column is-3">
            <a class="offer" :href="offer.url" target="_blank">
              <div class="bg-inline" :style="'background-image:url(' + offer.image + ')'">
              </div>
              <div class="has-text-left">
                <h1 class="has-text-info" v-html="offer.title"></h1>
                <h6 class="has-text-dark" v-html="offer.subtitle"></h6>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import qs from 'qs';
import _ from 'lodash';
import helper from '@/components/Helper';
import { snackbar } from '@/components/Snackbar';

export default {
  name: 'TurnosKlasse',
  data () {
    return {
      time: new Date(),
      announcement:{},
      loading:true,
      ads:{},
      offers:{},
      canShowResults:false,
      passengersToggle:false,
      passengersText:'',
      current:{
        status:'departure',
        url:null
      },
      purchase: {
        departure:{},
        return:{}
      },
      flights: {
        departures : [],
        arrivals : [],
        categories : []
      },
      search: {
        'flight-type': 'roundtrip',
        departure:null,
        arrival:null,
        'departure-date':null,
        'return-date':null,
        category:'categories_all',
        passengers: {
          adults:1,
          children:0,
          infants:0
        }
      },    
      texts:{},      
      disabledDates: {
        to: new Date()
        //from: new Date(2016, 0, 26)
      }
    }
  },  
  mounted: function(){
    var self = this;
    var storage = JSON.parse(localStorage.getItem('storage'));

    if(storage){
      this.handleStorageUpdate(storage);
      this.announcement = storage.announcement;
    }

    this.$root.$on('storagechanged',() => this.handleStorageUpdate(this.storage));

    setTimeout(() => this.handlePassengersUpdate(this.search.passengers), 500);
    setTimeout(() => self.loading = false, 700);    
  },
  watch: {
    search: {
      handler: function(search, oldSearch) {
        this.handleSearchUpdate(search)
      },
      immediate: true,
      deep: true
    }
  },
  methods : {
    handleStorageUpdate: function(storage){
      console.log("updating storage from home")
      this.offers = storage.offers.collection;
      this.ads = storage.ads.collection.slice(1);
    },
    handleSearchUpdate: function(search){
      this.canShowResults = false;

      if(search.departure && search.arrival && search.departure === search.arrival){
        snackbar.show('same-departure-arrival-warning');
      }

      if(this.search['departure-date']){
        this.search['departure-date'] = moment(this.search['departure-date']).format('MM/DD/YY');
      }

      if(this.search['return-date']){
        this.search['return-date'] = moment(this.search['return-date']).format('MM/DD/YY');
      }

      if( search.departure && 
          search.arrival && 
          search['departure-date'] && 
          search.departure != search.arrival &&
          (search.passengers.adults || search.passengers.children || search.passengers.infants)){
        if(search['flight-type'] === 'roundtrip' && !search['return-date']) {
          snackbar.show('search-input-return-date')
        } else {
          this.canShowResults = true;
        }
      }
    },
    handlePassengersUpdate: function(passengers) {
      var info = [];
      var text = '';
      for(var i in passengers){
        const qty = passengers[i];
        if(qty){
          var word = i;
          word = qty == 1 ? word.replace('res','r').replace('ren','').replace('s','') : word ;
          info.push([qty,word].join(' '));
        }
      }
      if(info.length){
        text = info.join(',');
        text = text.length > 23 ? text.substr(0,23) + '…' : text;
      } else {
        text = 'search-passengers-placeholder';
      }
      this.search.passengers = passengers;
      this.passengersText = text;
    },
    setFlightType : function({type, target}){
        this.search['flight-type'] = (target.getAttribute("flight-type") == 'roundtrip' ? 'roundtrip' : 'oneway');
        document.querySelectorAll('[flight-type]').forEach(function(button){
          button.style.zIndex = 1;
        });
        target.style.zIndex = 2;
    },
    setDeparture: function(departure){
      if(typeof departure == 'object'){
        var val = departure && departure.airport_code ? departure.airport_code : null;
        localStorage.setItem('departure', JSON.stringify(departure));
        this.search.departure = val;
      }
    },
    setReturn: function(arrival){
      if(typeof arrival == 'object'){
        var val = arrival && arrival.airport_code ? arrival.airport_code : null;
        localStorage.setItem('arrival', JSON.stringify(arrival));
        this.search.arrival = val;
      }
    },
    showDepartDate: function({type,target}){
      document.querySelector(".departure-date input").click();
    },
    showReturnDate: function({type,target}){
      document.querySelector(".return-date input").click();
    },
    showPassengers: function(){
      this.passengersToggle = !this.passengersToggle;
      //document.getElementById('passengers').classList.toggle('is-active');
    },
    showCategory: function(){
    },
    calcFlightDuration: function (d1,d2) {
      return [moment(d2).diff(d1,"hours") + 'hs',moment(d2).diff(d1,"minutes")%60 + 'm'].join(' ')
    },
    calcFlightTime: function (d) {
      return moment(d).format('hh:mm a')
    },
    resumeFlight: function(){
      
      var current = JSON.parse(localStorage.getItem('current'));
      console.log(current)
      this.$router.push(current.url);
    },
    deleteFlight: function(){
      localStorage.removeItem('current');
      localStorage.removeItem('purchase');
      this.purchase = {departure:{},return:{}};
      this.current = {status:'departure',url:null};
    },
    submit : function({type, target}){
      this.$router.push('/flights?'+qs.stringify(this.search));
    }
  }
}
</script>
