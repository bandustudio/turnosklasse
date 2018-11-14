export default  {
	props:['adults','children','infants'],
	data: function() {
    	return {
        	mutableAdults: this.adults,
        	mutableChildren: this.children,
        	mutableInfants: this.infants
        }
   	},	
	methods: {
	    // a computed getter
	    increment: function (what) {
			if(this[what] < 99){
	      		this[what]++;
	      	}
	    },
	    decrement: function (what) {
			if(this[what] > 0){
				this[what]--;
			}
	    }
	},
    watch: {
        mutableAdults: {
            handler: function() {
              	this.$emit('passengerchanged', {adults:this.mutableAdults,children:this.mutableChildren,infants:this.mutableInfants});
          	},
           	deep: true
        },
        mutableChildren: {
            handler: function() {
              	this.$emit('passengerchanged', {adults:this.mutableAdults,children:this.mutableChildren,infants:this.mutableInfants});
          	},
           	deep: true
        },
        mutableInfants: {
            handler: function() {
              	this.$emit('passengerchanged', {adults:this.mutableAdults,children:this.mutableChildren,infants:this.mutableInfants});
          	},
           	deep: true
        }
    },
	template: `
		<div class="passengerpicker">
			<div class="row">
				<span class="lab" jsb-word="search-adults"></span>
				<span class="rem bg-inline" @click="decrement('mutableAdults')"></span>
				<span class="val">{{ mutableAdults }}</span>
				<span class="add bg-inline" @click="increment('mutableAdults')"></span>
			</div>
			<div class="row">
				<span class="lab" jsb-word="search-children"></span>
				<span class="rem bg-inline" @click="decrement('mutableChildren')"></span>
				<span class="val">{{ mutableChildren }}</span>
				<span class="add bg-inline" @click="increment('mutableChildren')"></span>
			</div>
			<div class="row">
				<span class="lab" jsb-word="search-infants"></span>
				<span class="rem bg-inline" @click="decrement('mutableInfants')"></span>
				<span class="val">{{ mutableInfants }}</span>
				<span class="add bg-inline" @click="increment('mutableInfants')"></span>
			</div>
		</div>
		`
}