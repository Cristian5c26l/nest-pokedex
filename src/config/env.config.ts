

// Funcion para mapear las variables de entorno del archivo .env a un objeto literal de TypeScript con propiedades environment, mongodb, etc
export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',// En caso de que no venga la informacion del ambiente, en la variable de entorno NODE:ENV, donde se esta corriendo la aplicacion de node, se asumirá que se está corriendo en desarrollo (dev). environment nos va a decir si ese esta corriendo la app en desarrollo, produccion o testing o staing
    mongodb: process.env.MONGODB, // no tiene valor por defecto porque la persona que levante esta aplicacion de nest debe tener una conexion a una base de datos mongo
    port: process.env.PORT || 3002,
    defaultLimit: +process.env.DEFAULT_LIMIT! || 7,

})