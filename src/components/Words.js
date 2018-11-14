export default {
	languagesAvailable: [],
	translate : function(key){
	    const language = localStorage.getItem("language");
	    const storage = JSON.parse(localStorage.getItem("storage-"+language));
	    if(Object.keys(storage).length){
	        if(storage.words[key] && storage.words[key].length){
	          	return storage.words[key];
	        }
	    }
	    return key;
	},
	translateAll : function(){
		setTimeout(function() {
			const language = localStorage.getItem("language");
		    const storage = JSON.parse(localStorage.getItem("storage-"+language));
		    if(Object.keys(storage).length && language.length){
		    	document.querySelectorAll('[jsb-word]').forEach(function(e){
			        const key = e.getAttribute('jsb-word');
			        if(storage.words[key]){
			          e.innerHTML = storage.words[key];
			          e.setAttribute('placeholder',storage.words[key]);
			        }
			    });
			   	document.querySelector('section').setAttribute('translated',language);
		    }
		},0);
	}
}