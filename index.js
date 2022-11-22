const soap = require("soap");
const xmlFormat = require("xml-formatter");
const countryData = require("country-data");


const liveUrlPrefix = 'https://wsbexpress.dhl.com/gbl';
const testUrlPrefix = 'https://wsbexpress.dhl.com/sndpt';
const liveExpressRateBookUrl = `${liveUrlPrefix}/expressRateBook?WSDL`;
const testExpressRateBookUrl = `${testUrlPrefix}/expressRateBook?WSDL`;

class DHL {

    constructor(auth, debug){
        this.auth = auth;
        this.debug = debug;
    }

    wsdlRequest(wsdlUrl, method, req) {
        return new Promise((resolve, reject) => {
            const res = {};
            soap.createClient(wsdlUrl, (err, client) => {
                if (this.auth.username === undefined) {
                    reject('No username specified');
                }
    
                if (this.auth.password === undefined) {
                    reject('No password specified');
                }
    
                const wsSecurity = new soap.WSSecurity(this.auth.username, this.auth.password)
                client.setSecurity(wsSecurity);
    
                client.on('response', responseXml => {
                    res.responseXml = responseXml;
                });
    
                let clientMethod = client[method];
                if (method === 'PickUpRequest') {
                    clientMethod = clientMethod.euExpressRateBook_providerServices_PickUpRequest_Port.PickUpRequest;
                }
    
                clientMethod(req, (err, response) => {
                    const requestXml = xmlFormat(client.lastRequest).replace(this.auth.password, '**********');
                    if (err) {
                        err.requestXml = requestXml;
                        reject(err);
                    } else {
                        res.requestXml = requestXml;
                        res.response = response;
                        resolve(res);
                    }
                });
            });
        });
    } 
    
    rateRequest(req) {
        return this.wsdlRequest(this.debug ? testExpressRateBookUrl : liveExpressRateBookUrl, 'getRateRequest', req);
    };
    
    requestPickup(req) {
        return this.wsdlRequest(`${(this.debug ? testUrlPrefix: liveUrlPrefix)}/requestPickup?WSDL`, 'PickUpRequest', req);
    };
    
    shipmentRequest(req) {
        return this.wsdlRequest(this.debug ? testExpressRateBookUrl : liveExpressRateBookUrl, 'createShipmentRequest', req);
    };
    
    trackingRequest(req) {
        return this.wsdlRequest(`${(this.debug ? testUrlPrefix : liveUrlPrefix)}/glDHLExpressTrack?WSDL`, 'trackShipmentRequest', req);
    };
    
    getIsoDateTime() {
        return (new Date).toISOString();
    };
    
    getIsoDateTimeGmt(dateParam) {
        const date = dateParam || new Date();
        const offset = date.getTimezoneOffset();
        const offsetAbs = Math.abs(offset);
        const offsetSign = offset / offsetAbs;
        const offsetSignChar = offsetSign < 0 ? '-' : '+';
        const offsetHoursAbs = Math.floor(offsetAbs / 60);
        const offsetMinutesAbs = offsetAbs % 60;
        let isoDateTime = `${date.getUTCFullYear()}-${(date.getUTCMonth()+1).toString().padStart(2, 0)}-${date.getUTCDate().toString().padStart(2,0)}T${date.getUTCHours().toString().padStart(2,0)}:${date.getUTCMinutes().toString().padStart(2,0)}:${date.getUTCSeconds().toString().padStart(2,0)}GMT${offsetSignChar}${offsetHoursAbs.toString().padStart(2,0)}:${offsetMinutesAbs.toString().padStart(2,0)}`;
        return isoDateTime;
    };
    
    getMessageReference() {
        return Array(32).fill(0).map(x => Math.random().toString(36).charAt(2)).join('');
    };
    
    countryToCode(country) {
        if (country === 'Vietnam') {
            country = 'Viet Nam';
        }
        return countryData.lookup.countries({name: country})[0].alpha2;
    };
    
}


module.exports = DHL;
