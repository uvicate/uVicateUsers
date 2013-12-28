(function(App, window){
	"use strict";
	var Module = function(App){
		this.a = App;

		var t = this;
		this.getUserData(function(r){
			t.render_personalinfo(r);

			t.fill_menu_helper();
			t.main_btn_func();
			t.main_mnu_func();
			t.build_menu();
			t.logout_init();

			t.a.loaded = true;

			if(t.a._url.match(/(backend)/gi) == null && t.a._url.match(/(login)/gi) === null){
				window.Application.loadCategory(t.a._url);
			}
		});
	};

	Module.prototype.logout_init = function() {
		var elm = document.getElementById('logout');
		elm._t = this;
		elm.addEventListener('click', function(){
			this._t.logout(function(){
				location.reload();
			});
		}, false);
	};

	Module.prototype.logout = function(callback) {
		var j = {
			url: this.a._data.rest+'Members/',
			mode: 'DELETE',
			div: undefined,
			cache: true,
			response: 'object',
			headerValue: 'application/json'
		}

		jso_wipe();
		new Vi(j).ajax(callback);
	};

	Module.prototype.getUserData = function(callback) {
		callback = (typeof callback === 'function') ? callback : function(){};

		jso_dump();

		var id = getCookie(this.a._data.id);
		$.oajax({
			url: this.a._data.rest+'Users/'+id,
			jso_provider: "uvicate",
			jso_allowia: true,
			jso_scopes: ["profile"],
			dataType: 'json',
			success: function(data) {
				callback(data);
			}
		});
	};

	Module.prototype.render_personalinfo = function(data) {
		this.a._user = data;

		var holder = document.getElementById('signed-in-as');
		var t = data.fullname
		holder.innerHTML = '';
		holder.appendChild(document.createTextNode(t));

		var img = Application.getGravatarImg(data.basic.email, 40);
		var imgholder = document.getElementById('image-signed-in');
		imgholder.src = img;
	};

	Module.prototype.fill_menu_helper = function() {
		var helper = document.getElementById('menu-helper');
		helper.innerHTML = '';

		var btn = document.createElement('button');
		btn.id = 'main-menu-btn';
		btn.className = 'btn btn-default';
		helper.appendChild(btn);

		var i = document.createElement('i');
		i.className = 'glyphicon glyphicon-home';
		btn.appendChild(i);

		var s = document.createElement('span');
		s.setAttribute('data-ltag', 'dashboard');
		var t = this.a.current.getText('dashboard');
		s.appendChild(document.createTextNode(' '+t));
		btn.appendChild(s);
	};

	Module.prototype.main_btn_func = function() {
		var btn = document.getElementById('main-menu-btn');
		btn._t = this;
		btn._target = document.getElementById('main-menu-holder');
		btn.onmouseover = function(){
			$(this._target).addClass('anim-menu-active');
			$(this._target).addClass('a-b');
		};
	};

	Module.prototype.main_mnu_func = function() {
		var menu = document.getElementById('main-menu-holder');
		menu._t = this;

		$(menu).mouseleave(function(){
			$(this).removeClass('anim-menu-active');
			$(this).removeClass('a-b');
		})
	};

	Module.prototype.build_menu = function() {
		var categories = this.a._data.modules;
		var container = document.getElementById('main-menu');

		var banned = ['login', 'backend'];
		for(var c in categories){
			if(categories.hasOwnProperty(c) && banned.indexOf(c) < 0){
				var elm = document.createElement('li');
				var a = document.createElement('a');
				a.setAttribute('data-module', c);
				elm.appendChild(a);

				var t = this.a.current.getText(c);

				var icon = document.createElement('i');
				if(categories[c].hasOwnProperty('i'))
					icon.className = categories[c].i;

				a.appendChild(icon);


				a.addEventListener('click', function(){
					var cat = this.getAttribute('data-module');
					window.Application.loadCategory(cat);
				}, false);

				var span = document.createElement('span');
				span.setAttribute('data-ltag', c);
				span.appendChild(document.createTextNode(' '+t));
				a.appendChild(span);

				container.appendChild(elm);
			}
		}
	};

	function getCookie(c_name){
		var c_value = document.cookie;
		var c_start = c_value.indexOf(" " + c_name + "=");
		if (c_start == -1){
			c_start = c_value.indexOf(c_name + "=");
		}
		
		if (c_start == -1){
			c_value = null;
		}else {
			c_start = c_value.indexOf("=", c_start) + 1;
			var c_end = c_value.indexOf(";", c_start);
			if (c_end == -1){
				c_end = c_value.length;
			}
			c_value = unescape(c_value.substring(c_start,c_end));
		}
		
		return c_value;
	}

	var m = new Module(App);
})(App, window);