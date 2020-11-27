class CustomController extends ZCustomComponent {
	onThis_init() {
		this.edPwd.view.keyup(e => {
		    if (e.keyCode === 13 && this.edPwd.val.trim().length > 0) {
		        e.preventDefault();
		        this.onCmdLogin_click();
		    }
		});
	}
	onThis_activate() {
	    this.edPwd.val= "";
	    this.edPwd.view.focus();
	    this.mensajeBuscando.hide();
	    this.cmdLogin.disable();
	}
	onEdPwd_change() {
	    this.cmdLogin.setEnabled(this.edPwd.val.trim().length > 0);
	}
	onCmdLogin_click() {
	    this.mensajeBuscando.show();
        this.mensajeError.hide();
		zPost("login.seg", {site:app.site, pwd:this.edPwd.val, user:this.edUser.val}, (sesionUsuario) => {
            console.log("aquiestoy");
            this.mensajeError.hide();
		    this.mensajeBuscando.hide();
			this.triggerEvent("login");
			app.privilegios = sesionUsuario.privilegiosEnSistema;
			app.nombreUsuario = sesionUsuario.usuario.nombres + " " +sesionUsuario.usuario.apellidos;
			app.tienePermisoConfiguracion = sesionUsuario.tienePermisoConfiguracion;
			app.token = sesionUsuario.token;
		}, error => {
		    this.mensajeError.view.text(error);
		    this.mensajeBuscando.hide();
			this.mensajeError.show();
		});
	}

	onCmdOlvida_click() {
		this.showDialog("login/WEdOlvidaPass", {}, period => {

		});
	}
}