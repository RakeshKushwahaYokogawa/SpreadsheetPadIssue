import { IHttpBaseResponse } from "./http-base-response.model";

export interface IHttpDataResponse<T> extends IHttpBaseResponse {
    data: T;
}