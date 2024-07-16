import { CHEMDOODLEEDITORTYPE } from "../drawing-tools/chemdoodle-editor-type.enum";

export interface IDoodleRequest {
    name: string;
    data: Array<string>;
    configuration: string;
}

export interface ICanvasConfiguration {
    height: number;
    width: number;
    editorMode: CHEMDOODLEEDITORTYPE;
}