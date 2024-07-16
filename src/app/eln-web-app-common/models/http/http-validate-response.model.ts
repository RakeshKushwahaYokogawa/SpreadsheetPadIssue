import { IHttpBaseResponse } from "./http-base-response.model";

export interface IHttpValidateResponse extends IHttpBaseResponse {
    isValid: boolean;
    validationKey: string;
}