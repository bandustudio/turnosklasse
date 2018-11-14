import Vue from 'vue'
import axios from 'axios';
import Router from 'vue-router'
import moment from 'moment';
import helper from '@/components/Helper';
import words from '@/components/Words'
import JetsBooking from '@/components/JetsBooking'
import Flights from '@/components/Flights'
import Terms from '@/components/Terms'
import Privacy from '@/components/Privacy'
import Offers from '@/components/Offers'
import Contact from '@/components/Contact'
import NotFound from '@/components/NotFound'
import { snackbar } from '@/components/Snackbar';

Vue.use(Router)

if (typeof localStorage === 'object') {
    try {
        localStorage.setItem('attempt', 1);
        localStorage.removeItem('attempt');
    } catch (e) {
        Storage.prototype._setItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function () {};
        alert("Error", 'You need to enable local storage on your browser settings in order to run this application.','error');
    }
}

const now = moment().utc().format();
const lifespan = moment().utc().add(3, 'hours').format();

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'JetsBooking',
      component: JetsBooking
    },
    {
      path: '/flights',
      name: 'Flights',
      component: Flights
    },
    {
      path: '/terms',
      name: 'Terms',
      component: Terms
    },
    {
      path: '/privacy',
      name: 'Privacy',
      component: Privacy
    },    
    {
      path: '/offers',
      name: 'Offers',
      component: Offers
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]  
});

document.addEventListener('DOMContentLoaded', () => {

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {

        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }

  // Modals

  var rootEl = document.documentElement;
  var $modals = getAll('.modal');
  var $modalButtons = getAll('.modal-button');
  var $modalCloses = getAll('.modal-background, .modal-close, .modal .delete, .modal-card-foot .button');

  if ($modalButtons.length > 0) {
    $modalButtons.forEach(function ($el) {
      $el.addEventListener('click', function () {
        var target = $el.dataset.target;
        openModal(target);
      });
    });
  }

  if ($modalCloses.length > 0) {
    $modalCloses.forEach(function ($el) {
      $el.addEventListener('click', function () {
        closeModals();
      });
    });
  }

  function getAll(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
  }

  function openModal(target) {
    var $target = document.getElementById(target);
    rootEl.classList.add('is-clipped');
    $target.classList.add('is-active');
  }

  function closeModals() {
    rootEl.classList.remove('is-clipped');
    $modals.forEach(function ($el) {
      $el.classList.remove('is-active');
    });
  }

  document.addEventListener('keydown', function (event) {
    var e = event || window.event;
    if (e.keyCode === 27) {
      closeModals();
      closeDropdowns();
    }
  });
});

window.onerror = function(msg, url, line, col, error) {
   // Note that col & error are new to the HTML 5 spec and may not be 
   // supported in every browser.  It worked for me in Chrome.
   var extra = !col ? '' : '\ncolumn: ' + col;
   extra += !error ? '' : '\nerror: ' + error;

   // You can view the information in an alert to see things working like this:
   alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);

   // TODO: Report this error via ajax so you can keep track
   //       of what pages have JS issues

   var suppressErrorAlert = true;
   // If you return true, then error alerts (like in older versions of 
   // Internet Explorer) will be suppressed.
   return suppressErrorAlert;
};

function preload(language){
  localStorage.setItem('language',language);
  return axios.get(helper.callApi('apiurl') + 'storage-' + language +'.json').then((res) => {
    res.data.lastUpdate = moment().utc().format();
    localStorage.setItem('storage-'+language,JSON.stringify(res.data));
    return res.data;
  });
}

router.beforeEach((to, from, next) => {
  var storedLanguage = localStorage.getItem('language') || navigator.language || navigator.userLanguage; 
  var language = storedLanguage.split('-')[0];
  var storage = localStorage.getItem('storage-'+language);
  var fresh = false;
  var diff = -1;
  if(storage){
    storage = JSON.parse(storage);
    var issued = moment(storage.lastUpdate).utc().format();
    if(storage.lifespan){
      var then = moment().subtract(storage.lifespan.split(' ')[0],storage.lifespan.split(' ')[1]).utc().format();
    } else {
      var then = moment().subtract(10,'minutes').utc().format();
    }
    var fresh = issued > then;
  }
  if (storage && fresh > 0) {
    console.log("🙎 storage is fresh")
    next()
  } else {
    console.log("🙏 update storage")
    preload(language).then(() => {
      next()
    })
  }
});

router.afterEach(function (to, from, next) {
  setTimeout(function() {
    document.querySelector('.navbar-menu').classList.remove('is-active');
    document.querySelector('.navbar-burger').classList.remove('is-active');
    document.querySelectorAll('.modal').forEach((modal) => {
      modal.classList.remove('is-active');
    });

    window.scrollTo(0, 0);
  }, 500);

  document.querySelector('html').classList = [];
  document.querySelector('html').classList.add(to.name);
  words.translateAll();
});

export default router;