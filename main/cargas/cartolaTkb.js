class CustomController extends ZCustomComponent {

  onThis_init(options) {
    $('select').selectpicker();
    this.refresca();
  }
  refresca() {
    this.cargaCartolaDia();
  }

  async cargaCartolaDia() {
    let urlOz = await zPost("getOzService.seg");
    let urlServicio = urlOz.ozConciliacion+ "/getDataServer";
    console.log("urlServicio: ", urlServicio);
    let params = [];

   await zPost(urlServicio, { metodo: "getCartolaDia", params: params }, dataset => {
      console.log("cargaCartolaDia OK");
    })

  }
}

