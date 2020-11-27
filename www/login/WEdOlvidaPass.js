class CustomController extends ZCustomComponent {
    onThis_init(options) {
        this.options = options;
    }
	onCmdCancel_click() {
		this.cancel();
	}	
	onCmdOk_click() {
		zPost("olvidaPass.admin", {user:this.edUsuario.val.trim()}, (ret) => {
          //  this.triggerEvent("olvidaPass");
            if(ret){
                this.mensajeError.hide();
                this.mensajeExito.view.text("Correo enviado correctamente");
                this.mensajeExito.show();
            }else{
                this.mensajeExito.hide();
                this.mensajeError.view.text("Error Login inválido");
                this.mensajeError.show();
            }
		}, error => {
		});


    }
}