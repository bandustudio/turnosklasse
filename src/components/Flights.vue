<template>
  <section class="hero flights">
    <div v-if="current.status === 'departure' || current.status === 'return'" class="search has-background-white revealer" :class="{ 'apply' : !loading }">
      <div class="container has-text-left">
        <div class="field">
          <div class="control">
            <label class="radio">
              <input v-model="search['flight-type']" value="roundtrip" type="radio">
              <span jsb-word="search-roundtrip">{{ 'search-roundtrip' |  translate }}</span>
            </label>
            <label class="radio">
              <input v-model="search['flight-type']" value="oneway" type="radio">
              <span jsb-word="search-oneway">{{ 'search-oneway' |  translate }}</span>
            </label>
          </div>
        </div>
        <div class="columns">
          <div class="column is-4 city">
            <v-select ref="departure" v-model="selected.departure" :options="$root.departures" maxHeight="inherit" :filterable="false" @search="$root.searchDeparture" @input="setDeparture" label="city">
              <template slot="no-options" jsb-word="search-origin-placeholder">
                {{ 'search-origin-placeholder' | translate }}
              </template>             
              <template slot="option" slot-scope="option">
                <div class="d-center">
                  <strong>{{ option.city }}, {{ option.state }}</strong> {{ option.country }}<br>
                  ({{ option.airport_code }}) {{ option.airport }}
                </div>
              </template>
              <template slot="selected-option" scope="option">
                <div class="selected d-center">
                  {{ option.city }}, {{ option.state }} {{ option.country }}
                </div>
              </template>
            </v-select>
          </div>
          <div class="column is-4 city">
            <v-select ref="arrival" v-model="selected.arrival"  maxHeight="inherit" :options="$root.arrivals" :filterable="false" @search="$root.searchArrival" @input="setReturn" label="city">
              <template slot="no-options" jsb-word="search-origin-placeholder">
                {{ 'search-origin-placeholder' | translate }}
              </template>                
              <template slot="option" slot-scope="option">
                <div class="d-center">
                  <strong>{{ option.city }}, {{ option.state }}</strong> {{ option.country }}<br>
                  ({{ option.airport_code }}) {{ option.airport }}
                </div>
              </template>
              <template slot="selected-option" scope="option">
                <div class="selected d-center">
                  {{ option.city }}, {{ option.state }} {{ option.country }}
                </div>
              </template>    
            </v-select>
          </div>
          <div class="column is-2 flights-calendar">
            <vue-datepicker-local :local="$root.local" v-model="search['departure-date']"></vue-datepicker-local>
          </div>
          <div v-if="search['flight-type']==='roundtrip'" class="column is-2 flights-calendar">
            <vue-datepicker-local :local="$root.local" v-model="search['return-date']"></vue-datepicker-local>
          </div>
        </div>
        <div class="columns info">
          <div class="column">
            <span v-html="getFilterText('passengers')"></span>,
            <span v-html="getFilterText('operator')"></span>,
            <span v-html="getFilterText('aircraft')"></span>,
            <span v-html="getFilterText('category')"></span> 
            <a href="#" @click="showSearchOptions">
              <span jsb-word="flights-filters-show-options">{{ 'flights-filters-show-options' | translate }}</span>
              <span v-if="showFullSearch">⌃</span>
              <span v-else>⌄</span>
            </a>
          </div>
        </div>
        <div v-show="showFullSearch" class="columns fullsearch">
          <div class="column is-2 passengers">
            <label class="has-text-weight-semibold" jsb-word="search-adults">{{ 'search-adults' | translate }}</label>
            <v-select v-model="search.passengers.adults" maxHeight="inherit" :options="[1,2,3,4,5,6,7,8,9]"></v-select>
          </div>
          <div class="column is-2 passengers">
            <label class="has-text-weight-semibold" jsb-word="search-children">{{ 'search-children' | translate }}</label>
            <v-select v-model="search.passengers.children" maxHeight="inherit" :options="[1,2,3,4,5,6,7,8,9]"></v-select>
          </div>
          <div class="column is-2 passengers">
            <label class="has-text-weight-semibold"  maxHeight="inherit"jsb-word="search-infants">{{ 'search-infants' | translate }}</label>
            <v-select v-model="search.passengers.infants" maxHeight="inherit" :options="[1,2,3,4,5,6,7,8,9]"></v-select>
          </div>
          <div class="column is-3 category">
            <label class="has-text-weight-semibold" jsb-word="search-category">{{ 'search-category' | translate }}</label>
            <v-select v-model="selected.category"  maxHeight="inherit" :options="flights.categories">
              <template slot="no-options" jsb-word="search-category-placeholder">
              </template>                
              <template slot="option" slot-scope="option">
                <div class="d-center">
                  <strong>{{ option.label | translate }}</strong>
                </div>
              </template>
              <template slot="selected-option" scope="option">
                <div class="selected d-center">
                  {{ option.label | translate }}
                </div>
              </template>                       
            </v-select>
          </div>
        </div>
      </div>
    </div>      
    <div class="hero-body revealer lower" :class="{ 'apply' : !loading }">
      <div class="container">
        
        <!-- purchases -->

        <article v-if="purchase.departure.departure" class="message is-success">
          <div class="message-body has-text-left">
            <div class="">
              <h3 jsb-word="flights-selected-departure"><strong>{{ 'flights-selected-departure' | translate }}</strong></h3>
            </div>
            <div class="columns is-mobile">
              <div class="column is-9">
                <div class="columns">
                  <div class="column is-6">
                    <!--span class="has-text-warning" v-html="index"></span-->
                    <span class="has-text-black" v-html="calcFlightTime(purchase.departure.departure_date)"></span> -
                    <span class="has-text-black" v-html="calcFlightTime(purchase.departure.arrival_date)"></span><br>
                    <div class="columns is-mobile">
                      <div class="column is-4 operator-logo">
                        <img v-if="purchase.departure.operator" :src="purchase.departure.operator.logo" />
                      </div>
                      <div class="column">
                        <p>
                          <span v-if="purchase.departure.operator" class="has-text-black" v-html="purchase.departure.operator.company_name"></span><br>
                          <span v-if="purchase.departure.aircraft" class="has-text-black" v-html="purchase.departure.aircraft.brand"></span> 
                          <span v-if="purchase.departure.aircraft" class="has-text-black" v-html="purchase.departure.aircraft.model"></span> 
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="column is-6">
                    <span class="has-text-black" jsb-word="flights-duration">{{ 'flights-duration' | translate }}</span>: 
                    <span class="has-text-black" v-html="calcFlightDuration(purchase.departure.departure_date,purchase.departure.arrival_date)"></span>
                    <span v-if="purchase.departure.stops && purchase.departure.stops.length">
                      <span v-html="purchase.departure.stops.length" class="has-text-info"></span>
                      <span v-if="purchase.departure.stops.length === 1" v-html="$options.filters.translate('flights-stop')" class="has-text-info"></span>
                      <span v-else v-html="$options.filters.translate('flights-stops')" class="has-text-info"></span>
                    </span>
                    <span v-else>
                      <span v-html="$options.filters.translate('flights-no-stops')" class="has-text-success"></span>
                    </span><br>
                    <p>
                      <span v-if="purchase.departure.departure" class="has-text-grey" v-html="purchase.departure.departure.airport.code"></span> - 
                      <span v-if="purchase.departure.arrival" class="has-text-grey" v-html="purchase.departure.arrival.airport.code"></span> 
                    </p>
                  </div>
                </div>
              </div>
              <div class="column has-text-right">
                <span>
                  <span v-html="purchase.departure.departure_date"></span>
                </span><br>
                <span><img src="/static/img/category_icon.svg" width="20"></span>
                <span>
                  <span class="is-size-6" v-html="purchase.departure.currency"></span> 
                  <span class="is-size-6" v-html="purchase.departure.price"></span> 
                </span><br>
                <span class="" jsb-word="flights-price-per-seat">{{ 'flights-price-per-seat' | translate }}</span>
              </div>
            </div>
          </div>
        </article>        

        <article v-if="purchase.return.departure" class="message is-success">
          <div class="message-body has-text-left">
            <div class="">
              <h3 jsb-word="flights-selected-return"><strong>{{ 'flights-selected-return' | translate }}</strong></h3>
            </div>
            <div class="columns is-mobile">
              <div class="column is-9">
                <div class="columns">
                  <div class="column is-6">
                    <!--span class="has-text-warning" v-html="index"></span-->
                    <span class="has-text-black" v-html="calcFlightTime(purchase.return.departure_date)"></span> -
                    <span class="has-text-black" v-html="calcFlightTime(purchase.return.arrival_date)"></span><br>
                    <div class="columns is-mobile">
                      <div class="column is-4 operator-logo">
                        <img v-if="purchase.return.operator" :src="purchase.return.operator.logo" />
                      </div>
                      <div class="column">
                        <p>
                          <span v-if="purchase.return.operator" class="has-text-black" v-html="purchase.return.operator.company_name"></span><br>
                          <span v-if="purchase.return.aircraft" class="has-text-black" v-html="purchase.return.aircraft.brand"></span> 
                          <span v-if="purchase.return.aircraft" class="has-text-black" v-html="purchase.return.aircraft.model"></span> 
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="column is-6">
                    <span class="has-text-black" jsb-word="flights-duration">{{ 'flights-duration' | translate }}</span>: 
                    <span class="has-text-black" v-html="calcFlightDuration(purchase.return.departure_date,purchase.return.arrival_date)"></span>
                    <span v-if="purchase.return.stops && purchase.return.stops.length">
                      <span v-html="purchase.return.stops.length" class="has-text-info"></span>
                      <span v-if="purchase.return.stops.length === 1" v-html="$options.filters.translate('flights-stop')" class="has-text-info"></span>
                      <span v-else v-html="$options.filters.translate('flights-stops')" class="has-text-info"></span>
                    </span>
                    <span v-else>
                      <span v-html="$options.filters.translate('flights-no-stops')" class="has-text-success"></span>
                    </span><br>
                    <p>
                      <span v-if="purchase.return.departure" class="has-text-grey" v-html="purchase.return.departure.airport.code"></span> - 
                      <span v-if="purchase.return.arrival" class="has-text-grey" v-html="purchase.return.arrival.airport.code"></span> 
                    </p>
                  </div>
                </div>
              </div>
              <div class="column has-text-right">
                <span>
                  <span v-html="purchase.return.departure_date"></span>
                </span><br>

                <span><img src="/static/img/category_icon.svg" width="20"></span>
                <span>
                  <span class="is-size-6" v-html="purchase.return.currency"></span> 
                  <span class="is-size-6" v-html="purchase.return.price"></span> 
                </span><br>
                <span class="" jsb-word="flights-price-per-seat">{{ 'flights-price-per-seat' | translate }}</span>
              </div>
            </div>
          </div>
        </article>   
        
        <div v-if="current.status === 'departure' || current.status === 'return'">
          <div class="has-text-left">
            <h3 class="has-text-info">
              <span v-if="current.status === 'departure'">
                <span jsb-word="flights-select-departure">{{ 'flights-select-departure' | translate }}</span> 
                <span v-html="selected.arrival.city"></span>
              </span>
              <span v-if="current.status === 'return'">
                <span jsb-word="flights-select-return">{{ 'flights-select-return' | translate }}</span>   
                <span v-html="selected.departure.city"></span>
              </span>
            </h3>
            <p>
              <span jsb-word="flights-departure-legend">{{ 'flights-departure-legend' | translate }}</span>
            </p>
          </div>
          <div class="columns filters">
            <div class="column is-3">
              <!-- filters -->
              <div class="columns">
                <div class="column has-text-left">
                  <span jsb-word="flights-filters">{{ 'flights-filters' | translate }}</span>
                </div>
                <div class="column has-text-right">
                  <a href="#" @click="clearFilters" jsb-word="flights-clear">{{ 'flights-clear' | translate }}</a>
                </div>
              </div>
              <ul class="has-text-left">
                <li>
                  <h6 class="has-text-black" jsb-word="flights-stops">{{ 'flights-stops' | translate }}</h6>
                </li>
                <li v-for="(stop,index) in flights.stops">
                  <input type="checkbox" v-model="filters.stops" :value="stop.stops" :id="'stops'+index" />
                  <label v-if="stop.stops > 0" :for="'stops'+index" class="has-text-dark">
                    <span v-html="stop.stops"></span>
                    <span v-if="stop.stops === 1" :jsb-word="'flights-stop'">{{ 'flights-stop' | translate }}</span>
                    <span v-else :jsb-word="'flights-stops'">{{ 'flights-stops' | translate }}</span>
                  </label>
                  <label v-else :for="'stops'+index" class="has-text-dark has-text-weight-semibold is-size-7">
                    <span :jsb-word="'flights-no-stops'">{{ 'flights-no-stops' | translate }}</span>
                  </label>
                </li>              
              </ul>
              <ul class="has-text-left">
                <li>
                  <h6 class="has-text-black" jsb-word="flights-filter-operator">{{ 'flights-filter-operator' | translate }}</h6>
                </li>
                <li v-for="(operator,index) in flights.operator">
                  <input type="checkbox" v-model="filters.operator" :value="operator.company_name" :id="'operator'+index" />
                  <label :for="'operator'+index" class="has-text-dark">
                    <span v-html="operator.company_name"></span>
                  </label>
                </li>
              </ul>
              <ul class="has-text-left">
                <li>
                  <h6 class="has-text-black" jsb-word="flights-filter-aircraft">{{ 'flights-filter-aircraft' | translate }}</h6>
                </li>              
                <li v-for="(aircraft,index) in flights.aircraft">
                  <input type="checkbox" v-model="filters.aircraft" :value="aircraft.brand + ' ' + aircraft.model" :id="'aircraft'+index" />
                  <label :for="'aircraft'+index" class="has-text-dark">
                    <span v-html="aircraft.brand"></span> 
                    <span v-html="aircraft.model"></span>
                  </label>
                </li>
              </ul>
              <hr>
              <div class="has-text-left">
                <h6 class="range--title" jsb-word="flights-filters-price"></h6>
                <vue-slider ref="slider" v-model="filters.price" v-bind="ranger"></vue-slider>
              </div>
            </div>
            <div class="column">
              <!-- flights list for selection -->
              <div class="results has-text-left">
                <!--pre v-html="current.status"></pre-->
                <!--pre v-html="options[current.status]"></pre-->
                <div v-for="(services,key) in options[current.status]">
                  <pre class="flights-section" :jsb-word="'flights-' + key" :class="key">{{ 'flights-' + key | translate }}</pre>
                  <div v-for="(flights,service) in services" v-if="service" class="service" :class="service">
                    <!-- flight option -->
                    <div v-for="(flight,index) in flights" v-if="filteredFlights(flight,service)" class="flight" :class="{ 'is-hidden' : !showFullFlights && (index > 0) }">
                      <!--pre v-html="flight.aircraft"></pre-->
                      <!--pre v-html="index"></pre-->
                      <div class="columns is-mobile">
                        <div class="column is-9">
                          <div class="columns">
                            <div class="column is-6">
                              <!--span class="has-text-warning" v-html="index"></span-->
                              <span class="has-text-black" v-html="calcFlightTime(flight.departure_date)"></span> -
                              <span class="has-text-black" v-html="calcFlightTime(flight.arrival_date)"></span><br>
                              <div class="columns is-mobile">
                                <div class="column is-4 operator-logo">
                                  <img v-if="flight.operator" :src="flight.operator.logo" />
                                </div>
                                <div class="column">
                                  <p>
                                    <span v-if="flight.operator.company_name" class="has-text-black" v-html="flight.operator.company_name"></span><br>
                                    <span v-if="flight.aircraft.brand" class="has-text-black" v-html="flight.aircraft.brand"></span> 
                                    <span v-if="flight.aircraft.brand" class="has-text-black" v-html="flight.aircraft.model"></span> 
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div class="column is-6">
                              <span class="has-text-black" jsb-word="flights-duration">{{ 'flights-duration' | translate }}</span>: 
                              <span class="has-text-black" v-html="calcFlightDuration(flight.departure_date,flight.arrival_date)"></span>
                              <span v-if="flight.stops && flight.stops.length">
                                <span v-html="flight.stops.length" class="has-text-info"></span>
                                <span v-if="flight.stops.length === 1" v-html="$options.filters.translate('flights-stop')" class="has-text-info"></span>
                                <span v-else v-html="$options.filters.translate('flights-stops')" class="has-text-info"></span>
                              </span>
                              <span v-else>
                                <span v-html="$options.filters.translate('flights-no-stops')" class="has-text-success"></span>
                              </span><br>
                              <p>
                                <span class="has-text-grey" v-html="flight.departure.airport.code"></span> - 
                                <span class="has-text-grey" v-html="flight.arrival.airport.code"></span> 
                              </p>
                            </div>
                          </div>
                        </div>
                        <div class="column has-text-right">
                          <span><img src="/static/img/category_icon.svg" width="20"></span>
                          <span>
                            <span class="is-size-5" v-html="flight.currency"></span> 
                            <span class="is-size-5" v-html="flight.price"></span> 
                          </span><br>
                          <span class="" jsb-word="flights-price-per-seat">{{ 'flights-price-per-seat' | translate }}</span>
                        </div>
                      </div>
                      <div class="columns is-mobile">
                        <div class="column has-text-left is-3">
                          <strong class="button is-white"><span class="has-text-info is-size-6" :jsb-word="service">{{ service | translate }}</span></strong>
                        </div>
                        <div class="column has-text-right">
                          <span class="button is-white has-text-danger" v-if="flight.promo_message" v-html="flight.promo_message"></span>
                          <a href="#" @click="selectFlight(flight)" class="button">{{ 'flights-select' | translate }}</a>
                        </div>
                      </div>

                      <div v-if="index === 0 && flights.length > 1" class="more-options">
                        <div v-if="selected.category === '' || selected.category === 'categories_all' || selected.category === service" class="has-text-right" @click="showFlightsOptions(service)">
                          <a  href="javascript:void(0)">
                            <span v-if="!showFullFlights" jsb-word="show">{{ 'show' | translate }}</span> 
                            <span v-else jsb-word="hide">{{ 'hide' | translate }}</span> 
                            <span v-html="flights.length - 1"></span> 
                            <span jsb-word="flights-options">{{ 'flights-options' | translate }}</span> 
                            <span v-if="!showFullFlights">⌄</span>
                            <span v-else>⌃</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--pre v-html="services"></pre>
                  <div v-if="services.length === 0">
                    <div class="notification es-success">
                        <span>No results</span> 
                    </div>
                  </div-->                
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="has-text-left">
          <pre v-html="current"></pre>
          <!--pre v-html="search"></pre-->
          <!--pre v-html="options"></pre-->
          <!--pre v-html="filters"></pre-->
          <!--pre v-html="selected"></pre-->
        </div>
      </div>
    </div>
    <div class="splash bg-inline shadower" :class="{ 'apply' : !loading }">
      <div class="container has-text-centered">
        <img src="/static/img/isologo_jetsbooking.png" />
        <p jsb-word="search-loading-legend">{{ 'search-loading-legend' | translate }}</p>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import qs from 'qs';
import helper from '@/components/Helper';
import words from '@/components/Words';
export default {
  name: 'Flights',
  data () {
    return {
      loading:true,
      current:{
        status:'departure',
        url:null
      },
      showFullFlights:false,
      showFullSearch:false,
      options:{
        departure:{},
        return:{}
      },
      ranger: {
        min:200,
        max:25000,
        //interval:100,
        formatter:'{value}USD'
      },
      selected: {
        select:'departure',
        category:null,
        passengers:null,
        departure:[],
        arrival:[],
        stops:[],
        info: ''        
      },
      purchase: {
        departure:{},
        return:{}
      },
      flights: {
        departures : [],
        arrivals : [],
        category : [],
        stops:[],
        operator:[],
        aircraft:[]
      }, 
      filters: {
        price: [200,25000],
        'stops-max':99,
        duration:{},
        stops:[],
        category:[],
        operator:[],
        aircraft:[]
      },
      search: {
        'flight-type': 'roundtrip',
        departure:null,
        arrival:null,
        'departure-date':null,
        'return-date':null,
        category:null,
        passengers: {
          adults:1,
          children:0,
          infants:0
        }
      }
    }
  },  
  created : function(){
    var self = this;
    var language = localStorage.getItem('language');
    var purchase = localStorage.getItem('purchase');
    var current = localStorage.getItem('current');
    var storage = JSON.parse(localStorage.getItem('storage-'+language));

    if(storage){
      this.flights = storage.flights;
    }

    if(current){
      this.current = JSON.parse(current);
    }

    if(purchase){
      this.purchase = JSON.parse(purchase);
    }

    var decoded = qs.parse(qs.stringify(this.$route.query))
    if(decoded.departure){

      this.search = decoded;
      this.handleSearchUpdate(decoded)

      if(decoded.category){
        this.selected.category = decoded.category
      }

      this.selected.departure = JSON.parse(localStorage.getItem('departure'));
      this.selected.arrival = JSON.parse(localStorage.getItem('arrival'));
    }    
  },
  watch: {
    '$route.query'() {
      var search = qs.parse(qs.stringify(this.$route.query));
      this.handleSearchUpdate(search)
    },
    search: {
      handler: function(search, oldSearch) {
        if(search.departure && search['departure-date']){
          this.$router.push('/flights?'+qs.stringify(search));
        }
      },
      immediate: true,
      deep: true      
    }
  },
  methods: {
    filteredFlights: function(flight,service){
      var filter_category = false;
      var filter_price = false;
      var filter_aircraft = true;
      var filter_operator = true;
      var filter_stops = true;

      if(this.selected.category === '' || this.selected.category === 'categories_all' || this.selected.category === service || !this.selected.category){
        filter_category = true;
      }

      if(flight.price >= this.filters.price[0] && 
        flight.price <= this.filters.price[1]){
        filter_price = true;
      }

      if(this.filters.stops.length){
        filter_stops = false;
        if(_.indexOf(this.filters.stops,flight.stops.length) > -1){
          filter_stops = true;
        }
      }

      if(this.filters.operator.length){
        filter_operator = false;
        if(_.indexOf(this.filters.operator,flight.operator.company_name) > -1){
          filter_operator = true;
        }
      }

      if(this.filters.aircraft.length){
        filter_aircraft = false;
        var aircraft = [flight.aircraft.brand,flight.aircraft.model].join(' ')
        if(_.indexOf(this.filters.aircraft,[flight.aircraft.brand,flight.aircraft.model].join(' ')) > -1){
          filter_aircraft = true;
        }
      }

      return filter_category && filter_stops && filter_price && filter_operator && filter_aircraft;
    },
    toggleMassive: function(branch){
    },
    selectFlight: function(flight){
      var purchase = JSON.parse(localStorage.getItem('purchase'))||[]
      this.purchase[this.current.status] = flight;
      localStorage.setItem('purchase', JSON.stringify(this.purchase));

      if(this.current.status === 'return'){
        this.current.status = 'confirm';
      }

      if(this.current.status === 'departure' && this.search['flight-type'] === 'roundtrip'){
        this.current.status = 'return';
      }

      this.current.url = [this.$route.path,'?',qs.stringify(this.$route.query)].join('');
      localStorage.setItem('current',JSON.stringify(this.current));
    },
    calcFlightDuration: function (d1,d2) {
      return [moment(d2).diff(d1,"hours") + 'hs',moment(d2).diff(d1,"minutes")%60 + 'm'].join(' ')
    },
    calcFlightTime: function (d) {
      return moment(d).format('hh:mm a')
    },
    clearFilters: function(){
      this.filters = {
        price: [this.filters.price_min,this.filters.price_max],
        'stops-max':99,
        duration:{},
        stops:[],
        operator:[],
        aircraft:[]
      }
    },
    getFilterText: function(aspect){
      if(aspect === 'passengers'){
        var passengers = 0;
        var text = '';
        _([this.search.passengers.adults,this.search.passengers.children,this.search.passengers.infants]).forEach((passenger,key) => {
          if(passenger){
            passengers+=parseInt(passenger);
          }
        })
        text = [passengers,words.translate(passengers === 1 ? 'search-passenger' : 'search-passengers')].join(' ')
        this.selected.passengers = text;
        return text;
      }
      if(aspect === 'operator'){
        if(this.filters.operator.length){
          return this.filters.operator.join(',')
        } else {
          return words.translate('flights-filters-all-operators');
        }
      }      
      if(aspect === 'aircraft'){
        if(this.filters.aircraft.length){
          return this.filters.aircraft.join(',')
        } else {
          return words.translate('flights-filters-all-aircraft');
        }
      }  
      if(aspect === 'category'){
        if(this.selected.category.length){
          return words.translate(this.selected.category);
        } else {
          return words.translate('categories_all');
        }
      }            
    },
    showSearchOptions: function(){
      this.showFullSearch = !this.showFullSearch;
    },
    showFlightsOptions: function(service){
      console.log(service)
      this.showFullFlights = !this.showFullFlights;
    },
    handleFilterUpdate: function(data){
      var pmax = 0;
      var pmin = 0;
      var tot = 0;
      this.flights.operator = [];
      this.flights.aircraft = [];
      this.flights.stops = [];

      _(data[this.current.status]).forEach((options, option) => {
        _(options).forEach((flights, service) => {
          _(flights).forEach((flight, index) => {
            tot++
            if( !pmax || flight.price > pmax){
              this.ranger.max = flight.price
              pmax = flight.price
            }
            if( !pmin || flight.price < pmin){
              this.ranger.min = flight.price 
              pmin = flight.price
            }
            if(_.find(this.flights.operator, {company_name:flight.operator.company_name}) === undefined){
              this.flights.operator.push(flight.operator);
            }
            if(_.find(this.flights.aircraft, {brand:flight.aircraft.brand,model:flight.aircraft.model}) === undefined){
              this.flights.aircraft.push(flight.aircraft);
            }
            if(_.find(this.flights.stops, {stops:flight.stops.length}) === undefined){
              this.flights.stops.push({key:(flight.stops.length > 2 ? 'flight-stops' : 'flights-no-stops'),stops:flight.stops.length});
            }
          });
        });
      });

      console.log("total:"+tot)
      if(tot){
        this.filters.price_min = pmin;
        this.filters.price_max = pmax;
        this.filters.price = [pmin,pmax];
      }
    },
    handleSearchUpdate: function(search){
      var self = this;
      this.loading = true;
      var data = JSON.parse(JSON.stringify(this.search));
      console.log("search flighs:")
      console.log(data);
      axios.get( helper.callApi('apiurl') + 'search.json', data )
        .then((res) => {
          self.handleFilterUpdate(res.data);
          self.options = res.data;
          setTimeout(() => self.loading = false, 500);
        });
    },
    setDeparture: function(departure){
      if(typeof departure == 'object'){
        var val = departure && departure.airport_code ? departure.airport_code : null;
        localStorage.setItem('departure', JSON.stringify(departure));
        this.search.departure = val;
        this.selected.departure = departure;
      }
    },
    setReturn: function(arrival){
      if(typeof arrival == 'object'){
        var val = arrival && arrival.airport_code ? arrival.airport_code : null;
        localStorage.setItem('arrival', JSON.stringify(arrival));
        this.search.arrival = val;
        this.selected.arrival = arrival;
      }
    },
    setDepartureDate: function(date){
      console.log(date)
    }
  }
}
</script>
