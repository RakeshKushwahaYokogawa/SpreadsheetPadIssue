import { IHttpBaseResponse } from "./http-base-response.model";

export interface IHttpResponse extends IHttpBaseResponse {
    id: string;
}