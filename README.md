# DHL Lib

library to track, rate, ship or pickup something via DHL Express

## Install

`npm i @kronsi/dhl`


## Example Usage

```js

import fs from 'node:fs';
import format from 'xml-formatter';
import {getIsoDateTimeGmt, testRateRequest, testShipmentRequest, testRequestPickup} from './index.js';

const auth = {
    username: 'your username',
    password: 'your pw',
    accountNumber: 000000000,
}

//rate request
const reqRate = {
    ClientDetail: {
    },
    RequestedShipment: {
        DropOffType: 'REQUEST_COURIER',
        Ship: {
            Shipper: {
                StreetLines: 'Sender Address Line',
                City: 'Sender Address City',
                PostalCode: 'Sender Address ZipCode',
                CountryCode: 'Sender Address Country',
            },
            Recipient: {
                StreetLines: 'Recipient Address Line',
                City: 'Recipient Address City',
                PostalCode: 'Recipient Address ZipCode',
                CountryCode: 'Recipient Address Country',
            },
        },
        Packages: {
            RequestedPackages: {
                attributes: {
                    number: 1,
                },
                Weight: {
                    Value: 1,
                },
                Dimensions: {
                    Length: 12,
                    Width: 12,
                    Height: 12,
                },
            },
        },
        ShipTimestamp: getIsoDateTimeGmt(),
        UnitOfMeasurement: 'SI',
        Content: 'NON_DOCUMENTS',
        DeclaredValue: 100,
        DeclaredValueCurrecyCode: 'EUR',        
        Account: auth.accountNumber,
    },
};

const resRate = await testRateRequest(auth, reqRate);
console.log(JSON.stringify(resRate, null, 4));
fs.writeFileSync('rateRequest.response.xml', resRate.responseXml);
fs.writeFileSync('rateRequest.request.xml', format(resRate.requestXml));

//shipment request
const reqShipment = {
    RequestedShipment: {
        ShipmentInfo: {
            DropOffType: 'REQUEST_COURIER',
            ServiceType: 'I',
            Account: auth.accountNumber,
            Currency: 'EUR',
            UnitOfMeasurement: 'SI',
            PackagesCount: 1,
            LabelType: 'PDF',
            LabelTemplate: 'ECOM26_84_001',
        },
        ShipTimestamp: getIsoDateTimeGmt(),
        PickupLocationCloseTime: '23:59',
        SpecialPickupInstruction: 'fragile items',
        //PickupLocation: 'west wing 3rd Floor',
        PaymentInfo: 'DAP',
        InternationalDetail: {
            Commodities: {
                NumberOfPieces: 1,
                Description: 'ppps sd',
                CountryOfManufacture: 'DE',
                Quantity: 1,
                UnitPrice: 10,
                CustomsValue: 1,
            },            
            Content: 'DOCUMENTS',
        },
        Ship: {
            Shipper: {
                Contact: {
                    PersonName: 'Sender Name',
                    CompanyName: 'Sender Company',
                    PhoneNumber: 'Sender Phone',
                    EmailAddress: 'Sender Email',
                },
                Address: {
                    StreetLines: 'Sender Address Line',
                    City: 'Sender Address City',
                    PostalCode: 'Sender Address ZipCode',
                    CountryCode: 'Sender Address Country',
                },
            },
            Recipient: {
                Contact: {
                    PersonName: 'Recipient Name',
                    CompanyName: 'Recipient Company',
                    PhoneNumber: 'Recipient Phone',
                    EmailAddress: 'Recipient Email',
                },
                Address: {
                    StreetLines: 'Recipient Address Line',
                    City: 'Recipient Address City',
                    PostalCode: 'Recipient Address ZipCode',
                    CountryCode: 'Recipient Address Country',
                },
            },
        },
        Packages: {
            RequestedPackages: {
                attributes: {
                    number: 1
                },
                InsuredValue: 10,
                Weight: 1,
                Dimensions: {
                    Length: 12,
                    Width: 12,
                    Height: 12,
                },
                CustomerReferences: 'TEST',
            },
        },
    },
};

const resShipment = await testShipmentRequest(auth, reqShipment);
console.log(JSON.stringify(resShipment.response, null, 4));
fs.writeFileSync('shipmentRequest.request.xml', format(resShipment.requestXml));
fs.writeFileSync('shipmentRequest.response.xml', resShipment.responseXml);
const graphicImage = Buffer.from(resShipment.response.LabelImage.GraphicImage, 'base64');
fs.writeFileSync('shipmentRequest.response.pdf', graphicImage);


//pickup
const reqPickup = {
    PickUpShipment: {
        ShipmentInfo: {
            ServiceType: 'U',
            Billing: {
                ShipperAccountNumber: auth.accountNumber,
                ShippingPaymentType: 'S',
            },
            UnitOfMeasurement: 'SI',
        },
        PickupTimestamp: getIsoDateTimeGmt(),
        InternationalDetail: {
            Commodities: {
                Description: 'Computer Parts',
            },
        },
        Ship: {
            Shipper: {
                Contact: {
                    PersonName: 'Sender Name',
                    CompanyName: 'Sender Company',
                    PhoneNumber: 'Sender Phone',
                    EmailAddress: 'Sender Email',
                    MobilePhoneNumber: 'Sender Mobile',
                },
                Address: {
                    StreetLines: 'Sender Address Line',
                    City: 'Sender Address City',
                    PostalCode: 'Sender Address ZipCode',
                    CountryCode: 'Sender Address Country',
                },
            },
            Recipient: {
                Contact: {
                    PersonName: 'Recipient Name',
                    CompanyName: 'Recipient Company',
                    PhoneNumber: 'Recipient Phone',                    
                },
                Address: {
                    StreetLines: 'Recipient Address Line',
                    City: 'Recipient Address City',
                    PostalCode: 'Recipient Address ZipCode',
                    CountryCode: 'Recipient Address Country',
                },
            },
        },
        Packages: {
            RequestedPackages: {
                attributes: {
                    number: 1,
                },
                Weight: 1.0,
                Dimensions: {
                    Length: 12,
                    Width: 12,
                    Height: 12,
                },
                CustomerReferences: 'My-PU-Call-1',
            },
        },
    },
};

const resPickup = await testRequestPickup(auth, reqPickup);
console.log(JSON.stringify(resPickup.response, null, 4));
fs.writeFileSync('requestPickup.request.xml', format(resPickup.requestXml));
fs.writeFileSync('requestPickup.response.xml', resPickup.responseXml);

```

## Credits

Originally forked from [mondalaci](https://github.com/mondalaci/dhl-node).