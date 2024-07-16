export interface ISelectListItem {
    id?: number;
    key?: string;
    value: string;
}

export interface ICreateResponseModel {
    isSuccess: boolean;
    id: string;
    message: string;
}

export interface ICalculationDataModel {
    key: string;
    value: string;
    selected: boolean;
}

export interface ICreateResponseModel {
    isSuccess: boolean;
    id: string;
    message: string;
}

export interface IListResponseModel<T> {
    isSuccess: boolean;
    message: string;
    items: Array<T>;
}