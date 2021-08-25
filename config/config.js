//Configuracion de los puertos del servidor

process.env.PORT = process.env.PORT || 3000;

//Configuracion de la firma de los Tokens

process.env.SIGN = process.env.SIGN || 'secret';

//Configuracion de la expiracion de los tokens

process.env.EXP = process.env.EXP || 60 * 60 * 24 * 30;

//Configuracion del entorno de desarrollo o de produccion

process.env.ENV = process.env.ENV || 'dev';

//Configuracion de la base de datos

let URIDB;

if (process.env.ENV === 'dev') {
    URIDB = 'mongodb://localhost:27017/cafe';
} else {
    URIDB = 'mongodb+srv://geralt:impro123@cluster0.22tg2.mongodb.net/cafe';
}

process.env.MongoURI = URIDB;

//Configuracion de Google

process.env.CLIENT_ID = process.env.CLIENT_ID || '625335287082-fpu4j9q19nvfpr9fddbknve5ovgv4odf.apps.googleusercontent.com';