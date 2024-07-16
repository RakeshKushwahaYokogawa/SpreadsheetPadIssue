import { IHttpBaseResponse } from "./http-base-response.model";

export interface IHttpListResponse<T> extends IHttpBaseResponse {
    items: Array<T>;
}