export default {
	getHeadProp: function(key){
		return document.querySelector('meta[property="' + key + '"]').getAttribute('content') || "";
	},
	callApi: function(key){
		return this.getHeadProp(key);
	}
}