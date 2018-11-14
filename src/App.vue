<template>
  <div id="app">

    <!-- navbar -->
    <nav class="navbar is-transparent" v-show="$parent.ready">
      <div class="container">
        <div class="navbar-brand">
          <router-link class="navbar-item" to="/">
            <span class="is-uppercase has-text-weight-bold">Klasse</span> 
            <span>&nbsp;</span>
            <span>·</span>
            <span>&nbsp;</span>
            <span class="is-capitalize">Cigliutti Guerini</span> 
          </router-link>
          <div class="navbar-burger burger" data-target="navbarExampleTransparentExample">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id="navbarExampleTransparentExample" class="navbar-menu">
          <div class="navbar-start">
            <router-link class="navbar-item" to="/">Turnos</router-link>
            <router-link class="navbar-item" to="/ofertas">Ofertas</router-link>
            <a href="#" class="navbar-item modal-button" data-target="modal-contact">Contacto</a>        
          </div>

          <div class="navbar-end">
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link" href="#"></a>
            </div>
          </div>
        </div>
      </div>
    </nav>
    

    <!-- template -->
    <keep-alive>
      <transition>
        <router-view/>
      </transition>
    </keep-alive>
    

    <!-- footer -->
    <div class="footer" v-show="$parent.ready">  
      <div class="container">  
        <hr>
        <h4>
          <span class="is-size-6" jsb-word="footer-title"></span>
        </h4>
        <div class="columns">
          <div class="column">
            <h1><i class="bg-inline flag-arg"></i></h1>
            <span>(+54) 11 5218-4851</span>
          </div>
          <div class="column">
            <h1><i class="bg-inline flag-arg"></i></h1>
            <span>(+54) 11 5218-4851</span>
          </div>
          <div class="column">
            <h1><i class="bg-inline flag-arg"></i></h1>
            <span>(+54) 11 5218-4851</span>
          </div>
          <div class="column">
            <h1>
              <i class="bg-inline flag-arg"></i>
            </h1>
            <span>(+54) 11 5218-4851</span>
          </div>
        </div>

        <div class="columns">
          <div class="column has-text-left">
            <strong>Jetsbooking</strong>
            <p><router-link to="/contact" jsb-word="contact"></router-link></p>
            <p><router-link to="/announce-flight" jsb-word="announce-flight"></router-link></p>
          </div>
          <div class="column has-text-left">
            <strong jsb-word="about"></strong>
            <p><router-link to="privacy" jsb-word="privacy"></router-link></p>
            <p><router-link to="terms" jsb-word="terms"></router-link></p>
          </div>
          <div class="column has-text-left">
            <strong jsb-word="social-networks"></strong>
            <p>
              <a href="https://facebook.com/jetsbooking.com" target="_blank">
                <span class="icon"><i class="fa fa-facebook"></i></span> /jetsbooking.com
              </a>
            </p>
            <p>
              <a href="https://instagram.com/jetsbooking" target="_blank">
                <span class="icon"><i class="fa fa-instagram"></i></span> @jetsbooking
              </a>
            </p>
          </div>
        </div>
        <div class="has-text-center is-size-6">
          <span class="">2018 <span jsb-word="copyright"></span></span>
        </div>
      </div>
    </div>
    
    <!-- modals -->

    <div id="modal-contact" class="modal">
      <div class="modal-background"></div>
      <div class="modal-card has-background-white">
        <button class="delete" aria-label="close"></button>
        <div class="section">
          <div class="has-text-centered">
            <figure class="image jetsbooking-image">
              <img src="/static/img/logo_jetsbooking.svg" />
            </figure>
            <h4>“Changing the way you fly”</h4>
          </div>
          <div class="has-text-centered modal-actions">
            <a class="button is-fullwidth facebook" jsb-word="signin-facebook"></a>
            <a class="button is-fullwidth linkedin" jsb-word="signin-linkedin"></a>
            <div class="is-divider" data-content="OR"></div>
            <a class="button  is-fullwidth modal-button" data-target="modal-signup" jsb-word="signin-email"></a>
            <span class="is-size-6">
              <span jsb-word="havnt-an-account"></span>
              <a href="#" class="modal-button" data-target="modal-signup" jsb-word="signup-email"></a>
            </span>
            <hr>
            <span class="is-size-7">
              <span jsb-word="accept-terms-app"></span>
              <router-link to="/terms" jsb-word="terms"></router-link>
            </span>
          </div>
        </div>
      </div>
    </div> 
  </div>
</template>

<script>

import helper from './components/Helper';

export default {
  name: 'app'
}

</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
