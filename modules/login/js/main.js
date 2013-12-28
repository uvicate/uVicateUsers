(function(App){
	"use strict";
	var Module = function(App){
		this.initialFunctionality();
		this.a = App;
		var t = this;
	}

	Module.prototype.initialFunctionality = function() {
		var btn = document.getElementById('login-button');

		btn._t = this;
		btn.addEventListener('click', function(e){
			this._t.sendRequest();
		}, false);
	};

	Module.prototype.sendRequest = function(){
		var btn = document.getElementById('login-button');
		btn.setAttribute('disabled', 'disabled');

		var t = this;
		this.verifyIdentity(function(r){
			btn.removeAttribute('disabled');
			t.handleServerResponse(r);
		});
	}

	Module.prototype.handleServerResponse = function(r) {
		if(r.success === true){
			//User is redirected to the backend of the platform.
			Application.loadCategory('backend');
		}else{
			//Error is shown to user
			/*var e = document.getElementById('errors');
			e.style.display = 'block';*/
		}
	};

	Module.prototype.verifyAccess = function(callback) {
		$.oajax({
			url: this.a._data.rest+'Members/',
			jso_provider: "uvicate",
			jso_allowia: false,
			jso_scopes: ["profile"],
			dataType: 'json',
			success: function(data) {
				callback(data);
			}
		});
	};

	Module.prototype.verifyIdentity = function(callback) {
		jso_ensureTokens({
			"uvicate": []
		});

		jso_dump();

		$.oajax({
			url: this.a._data.rest+'Members/',
			jso_provider: "uvicate",
			jso_allowia: true,
			jso_scopes: ["profile"],
			dataType: 'json',
			success: function(data) {
				callback(data);
			}
		});
	};

	var i = new Module(App);
})(App);