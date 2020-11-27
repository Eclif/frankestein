const ZModule = require("../z-server").ZModule;
const SQLServer = require('./SQLServer').SQLServer;
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuidv4');
const nodemailer = require("nodemailer");
const smtpConfig = require("./Config").Config.instance.getConfig().smtp;
const cnfPwd = require("./Config").Config.instance.getConfig().configPassword;
let moment = require('moment-timezone');
const perfiles = require('./Perfiles').Perfiles.instance;
var conf = require("./Config").Config.instance.getSync();

//const log = require('simple-node-logger').createSimpleLogger('logs/administracion/'+moment().format('MM-DD-YYYY')+'.log');


const adminConfig = require("./Config").Config.instance.getConfig().adminDefault;
let general = require("./Config").Config.instance.getConfig().general;

class Seguridad extends ZModule {
    constructor() {
        super();
        this._transport = nodemailer.createTransport(smtpConfig);
    }
    static get instance() {
        if (!global.seguridadInstance) global.seguridadInstance = new Seguridad();
        return global.seguridadInstance;
    }

    encript(pwd) {
        return new Promise((onOk, onError) => {
            bcrypt.hash(pwd, 8, (err, hash) => {
                if (err) onError(err);
                else onOk(hash);
            });
        });
    }

    compareWithEncripted(pwd, hash) {
        return bcrypt.compare(pwd, hash);
    }

    async getOzService(){
        return {
            ozConciliacion:conf.ozRestServices.url
        }
	}

    async login(site, pwd,user) {
        try {
            /*if (!site) throw "No site provided";
            var s = Object.values(conf.sites).find(s => s.url == site.url);
            if (!s) throw "No site found at url '" + site.url + "'";
            */
            let ret = await perfiles.login(user, pwd, "CONCILIACION");
            if (ret.estadoOK == false) {
                throw ret.mensaje;
            }
          
            let sesionUsuario = ret.sesionUsuario;
            let privs = sesionUsuario.privilegiosEnSistema;
            sesionUsuario.tienePermisoConfiguracion=true;
            /*if(privs.includes("ADMIN") || privs.includes("CONFIG_MINZ") ){
                sesionUsuario.tienePermisoConfiguracion=true;
            }else{
                sesionUsuario.tienePermisoConfiguracion=false;
            }*/

           return sesionUsuario;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async validatePwd(pwd){
        var regex = new RegExp('/^(?=.*[a-z]){'+cnfPwd.cantidadMinusculas+'}(?=.*[A-Z]){'+cnfPwd.cantidadMayusculas+'}(?=.*\d){'+cnfPwd.cantidadNum+'}(?=.*['+cnfPwd.listadoCaracteresEsp+']){'+cnfPwd.minCaracteresEspeciales+'}([A-Za-z\d'+cnfPwd.listadoCaracteresEsp+']){'+cnfPwd.minLarge+','+cnfPwd.maxLarge+'}$/');
      return regex.test(pwd);
    }

    async generaTokenRecuperacion(email) {
        let tokenRecuperacion;
        let usuario = await this._getUsuarioPorEmail(email);
        if (!usuario) throw "No se encontró ningún usuario con la identificación o dirección de correo indicado";
        if(usuario.ACTIVO=='N')throw "El usuario se encuentra inactivo en el sistema.";
        try {
            tokenRecuperacion = await this._creaTokenRecuperacion(usuario.EMAIL);
        } catch(error) {
            throw "No se puede crear el token de recuperación:" + error.toString();
        }
        try {
            let url = general.urlSitioCorreo + "?recupera=" + tokenRecuperacion;
            
            await this._sendMail(usuario.EMAIL, "Recuperación de Contraseña en Sistema", null, 
                "<html><body><hr />" +
                "<p><b>Sr(a). " + usuario.NOMBRES + ":</b></p>" +
                "<p>Se ha solicitado la creación de una nueva contraseña en el Sistema asociada a esta dirección de correo electrónico. Si usted no lo ha solicitado, sólo ignore este mensaje.</p>" + 
                "<p>Su identificación de usuario (login) en el sistema es <b>" + usuario.EMAIL + "</b></p>" +
                "<p>Para crear su nueva contraseña, por favor haga click en <a href='" + url + "'>este enlace</a></p>" +
                "<hr /><p><i>Este es un correo automático del Sistema, por favor no lo responda.</i></p></body></html>"
            );                
        } catch(error) {
            throw "No se puede enviar el correo al nuevo usuario:" + error.toString();
        }
    } 

    _sendMail(to, subject, text, html) {
        
        return new Promise((onOk, onError) => {
            let message = {
                from:smtpConfig.from,
                subject:subject,
                to:to,
                text:text,
                html:html
            }
            this._transport.sendMail(message, (err, info) => {

                if (err) onError(err);
                onOk(info);
            });
        })
    }

}

exports.Seguridad = Seguridad;