import axios, { AxiosInstance } from "axios";
import { HttpAdapter } from "../interfaces/http-adapter.interface";
import { Injectable } from "@nestjs/common";


@Injectable()
export class AxiosAdapter implements HttpAdapter {
    
    private axios: AxiosInstance = axios;

    async get<T>(url: string): Promise<T> {
        try {
            const { data } = await this.axios.get<T>(url);
            return data;
        } catch (error) {
            
            throw new Error('This is an error - Check Logs');// error manejado por el lado de nest como un error interno de servidor, siempre y cuando get de instancia de AxiosAdapter se ejecute en la Exception Zone (que incluye los controladores)
        }
    }
    
}