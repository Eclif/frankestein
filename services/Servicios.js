const ZModule = require("../z-server").ZModule;
const SQLServer = require('./SQLServer').SQLServer;
const axios = require("axios");
const querystring = require('querystring');
let moment = require('moment-timezone');
const sqlSesion = require("./Config").Config.instance.getConfig().smtp;
let fs = require('fs');
const sqlTLMINVAS = require("./Config").Config.instance.getConfig().sqlTLMINVAS;
const urlINVASQA = require("./Config").Config.instance.getConfig().urlINVASQA; //sqlSesionQA
const urlINVAS = require("./Config").Config.instance.getConfig().urlINVAS;

class Servicios extends ZModule {
    constructor() {
        super();

    }
    static get instance() {
        if (!global.serviciosInstance) global.serviciosInstance = new Servicios();
        return global.serviciosInstance;
    }
    async createLogFile() {

        log.warn('SERVICIOS!');
    }

}
exports.Servicios = Servicios;