export interface IDoodle {
    id: string;
    name: string;
    createdAt: string;
    lastModifiedAt: string;
    data?: Array<string>;
    configuration: string;
}

export interface IDoodleState {
    doodleList: Array<IDoodle>;
    doodle: IDoodle;
}