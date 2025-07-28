import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';

@Module({
    providers: [AxiosAdapter],// Se consigue que AxiosAdapter sea inyectable en algun componente (como el servicio) de este modulo CommonModule siempre y cuando AxiosAdapter ocupe el decorador @Injectable, y, ademas, que se registre como un provider. Como AxiosAdapter tiene @Injectable, entonces, puede ser un provider
    exports: [AxiosAdapter],// para que AxiosAdapter sea accesible desde otros modulos, es decir, se pueda inyectar a componentes de otros modulos
})
export class CommonModule {}
