#!/usr/bin/env node
import fs from 'node:fs';
import format from 'xml-formatter';
import auth from './auth.js';
import {getIsoDateTime, testRequestPickup} from './index.js';

const req = {
    PickUpShipment: {
        ShipmentInfo: {
            ServiceType: 'U',
            Billing: {
                ShipperAccountNumber: auth.accountNumber,
                ShippingPaymentType: 'S',
            },
            UnitOfMeasurement: 'SI',
        },
        PickupTimestamp: getIsoDateTime(),
        InternationalDetail: {
            Commodities: {
                Description: 'Computer Parts',
            },
        },
        Ship: {
            Shipper: {
                Contact: {
                    PersonName: 'Topaz',
                    CompanyName: 'DHL Express',
                    PhoneNumber: '+31 6 53464291',
                    EmailAddress: 'Topaz.Test@dhl.com',
                    MobilePhoneNumber: '+31 6 53464291',
                },
                Address: {
                    StreetLines: 'GloWS',
                    City: 'Eindhoven',
                    PostalCode: '5657 ES',
                    CountryCode: 'NL',
                },
            },
            Recipient: {
                Contact: {
                    PersonName: 'Jack Jones',
                    CompanyName: 'J and J Company',
                    PhoneNumber: '+44 25 77884444',
                    EmailAddress: 'jack@jjcompany.com',
                    MobilePhoneNumber: '+44 5 88648666',
                },
                Address: {
                    StreetLines: 'Penny lane',
                    City: 'Liverpool',
                    PostalCode: 'AA21 9AA',
                    CountryCode: 'GB',
                },
            },
        },
        Packages: {
            RequestedPackages: {
                attributes: {
                    number: 1,
                },
                Weight: 12.0,
                Dimensions: {
                    Length: 70,
                    Width: 21,
                    Height: 44,
                },
                CustomerReferences: 'My-PU-Call-1',
            },
        },
    },
};

const res = await testRequestPickup(auth, req);
console.log(JSON.stringify(res.response, null, 4));
fs.writeFileSync('requestPickup.request.xml', format(res.requestXml));
fs.writeFileSync('requestPickup.response.xml', res.responseXml);
