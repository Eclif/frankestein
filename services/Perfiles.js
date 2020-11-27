const ZModule = require("../z-server").ZModule;
var conf = require("./Config").Config.instance.getSync();
const urlPerfiles = conf.urlPerfiles.url;
const endPoint = urlPerfiles + "/Perfiles";
const soap = require('soap');

class Perfiles extends ZModule {
    static get instance() {
        if (!global.excelInstance) global.perfilesInstance = new Perfiles();
        return global.perfilesInstance;
    }

    getUsuario() {
        var url = endPoint + '?wsdl';
        var args = { login: 'plopez' };
        soap.createClientAsync(url).then((client) => {
            client.setEndpoint(endPoint);
            return client.getUsuarioAsync(args);
        }).then((result) => {
        });
    }

    async login(user, pwd, site) {
        var res = null;
        var url = endPoint + '?wsdl';
        var args = { login: user, pwd: pwd, codigoSistema: "CONCILIACION" };
        return new Promise((resolve, reject) => {      
            soap.createClient(url, (err, client) => {
                client.login(args, (err, result, body) => {
                    if (result.return) {
                        return resolve(result.return);
                    }
                })
            }, endPoint);
        });
    }

    async olvidaPass(user) {
        var res = false;
        var url = endPoint + '?wsdl';
        var args = { nombreUsuario: user, url: urlPerfiles, sistema: "/conciliacion/" };

        return new Promise((resolve, reject) => {
            soap.createClient(url, (err, client) => {
                client.olvidePass(args, (err, result, body) => {
                    if (!result) res = true;
                    resolve(res);
                })
            }, endPoint);
        });
    }

    async cambiaPwd(oldPwd, newPwd, token) {
        var res = false;
        var url = endPoint + '?wsdl';
        var args = { token: token, oldPwd: oldPwd, newPwd: newPwd };

        return new Promise((resolve, reject) => {
            soap.createClient(url, (err, client) => {
                client.cambiaPwd(args, (err, result, body) => {
                    if (!result) res = true;
                    resolve(res);
                })
            }, endPoint);
        });
    }


    async cambiaCargo(token, cargo) {
        var res = false;
        var url = endPoint + '?wsdl';
        var args = { token: token, cargo: cargo };

        return new Promise((resolve, reject) => {
            soap.createClient(url, (err, client) => {
                client.cambiaCargo(args, (err, result, body) => {
                    if (!result) res = true;
                    resolve(res);
                })
            }, endPoint);
        });
    }


    async cambiaInfoPersonal(token, nombres, apellidos, email) {
        var res = false;
        var url = endPoint + '?wsdl';
        var args = { token: token, nombres: nombres, apellidos: apellidos, email: email };

        return new Promise((resolve, reject) => {
            soap.createClient(url, (err, client) => {
                client.cambiaInfoPersonal(args, (err, result, body) => {
                    if (!result) res = true;
                    resolve(res);
                })
            }, endPoint);
        });
    }

    registraSistema(code, description) {
        var res = null;
        var url = endPoint + '?wsdl';
        var args = { codigoSistema: code, nombre: description };

        soap.createClientAsync(url)
            .then((client) => {
                client.setEndpoint(endPoint);
                return client.registraSistemaAsync(args);
            }).then((result) => {
                if (result) {
                    console.log("[Perfiles] Se registró CONCILIACION");
                    this.registraPrivilegios();
                }

            }).catch(error => { console.log("[Perfiles] no puede registrar sistema conciliacion", error) });
            
    }

    
    pruebaConexion(code, nombre) {
        return "funciona ok";
    }

    registraPrivilegios() {
        this.registraPrivilegio("CONCILIACION", "ADMIN", "Administrador Conciliacion");
    
    }

    registraPrivilegio(system, privilegio, description) {
        var res = null;
        var url = endPoint + '?wsdl';
        var args = { codigoSistema: system, codigoPrivilegio: privilegio, nombre: description };
        soap.createClientAsync(url)
            .then((client) => {
                client.setEndpoint(endPoint);
                return client.registraPrivilegioAsync(args);
            }).then((result) => {
                if (result[0]) {
                    res = result[0].return;
                }

            }).catch(error => {
                console.log(console.log("[Perfiles] no puede registrar privilegio: " + privilegio));
            });

        return res;
    }

}
exports.Perfiles = Perfiles