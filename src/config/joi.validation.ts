import * as Joi from "joi";// Hacer la exportacion por defecto del paquete Joi asi, ya que de otro modo, no funcionará en javascript


// Asegurarme de que tengamos el objeto exactamente como se espera (literalmente, asegurarse de que se tenga un objeto que tenga de forma obligatoria la propiedad "MONGODB", y que tenga las propiedades PORT y DEFAULT_LIMIT con valores numericos. En estas dos ultimas, si no vienen, tendrán como valor por defecto 3005 y 6, respectivamente)
export const JoiValidationSchema = Joi.object({
    MONGODB: Joi.required(),
    PORT: Joi.number().default(3005),
    DEFAULT_LIMIT: Joi.number().default(6),
})