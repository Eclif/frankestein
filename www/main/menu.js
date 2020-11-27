class CustomController extends ZCustomComponent {
    onThis_init() {
    //   this.lblNombreUsuario.view.text(window.app.sesion.usuario.nombre);
     //   console.log(window.app.sesion)
    }
    onOpLogout_click() {
            this.triggerEvent("logout");
    }

    onCmdPlanillaRecaudacion_click(){
        this.mainLoader.load("./planilla/planilla");
    }
    onCmdConciliacion_click() {
        this.mainLoader.load("./canales/Conciliacion");
    }
    
    onCmdPosBoleteria_click(){
        this.mainLoader.load("./canales/Posboleteria");
    }

    onCmdAutoServicio_click(){
        this.mainLoader.load("./canales/Autoservicio");
    }

    onCmdPosVerifone_click(){
        this.mainLoader.load("./canales/Posverifone");
    }

    onCmdPosOAC_click(){
        this.mainLoader.load("./canales/Posoac");
    }
    
    onCmdCartolasTbk_click() {
        this.mainLoader.load("./cargas/cartolaTkb");
    }


    onCmdButton_click() {
        this.mainLoader.load("./carpeta1/buttons");
    }

    onCmdCard_click() {
        this.mainLoader.load("./carpeta1/cards");
    }

    onCmdColors_click() {
        this.mainLoader.load("./carpeta1/colors");
    }

    onCmdBorder_click() {
        this.mainLoader.load("./carpeta1/border");
    }

    onCmdAnimations_click() {
        this.mainLoader.load("./carpeta1/animations");
    }

    onCmdOtros_click() {
        this.mainLoader.load("./carpeta1/otros");
    }

    onCmdTablas_click() {
        this.mainLoader.load("./carpeta1/tablas");
    }

    onCmdHome_click() {
        this.mainLoader.load("./Home");
    }
    onCmdCambiarPwd_click() {
        this.showDialog("login/WCambiarPwd");
    }


    
    onVistaLoader_volver() {
        this.mainLoader.pop();
    }

    onMenutoggle_click() {
        this.menutoggle.toggleclass
    }

}