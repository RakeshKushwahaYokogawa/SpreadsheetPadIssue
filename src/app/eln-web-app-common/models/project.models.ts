export interface IProjectlist {
    id: string;
    name: string;
    createdBy:string;
    createdOn: Date;
    dueDate: any;
    taskList: string;
    collaborators: [];
    status: string;
    projectManager: string,
    projectOwner: string,
    priority: string,
    startDate: Date,
    daysLeft: number
}

export interface IProjectDetails {
    runningId: number;
    id: string;
    name: string;
    priority: number;
    createdBy: string;
    createdOn: string;
    dueDate: string
    status: any;
    projectManager: string,
    projectOwner: string,
    taskList: string;
    collaborators: any ;
    tags: any;
    objective: string,
    isPublic?: string
}

export interface IProjectDetailResponse {
    isSuccess: boolean,
    projectItem: IProjectDetails
}

export interface IProjectListConfig{
    currentPage?: number;
    pageSize?: number;
    sortColumn?: string;
    sortDirection?: string
}

export interface IStatus{
    id: number;
    statusName:string;
}

export interface IPriority{
    id: number;
    priorityName:string;
}