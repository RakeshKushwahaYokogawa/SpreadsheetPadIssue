export interface IInventoryEquipmentStateModel {
    categoryId: string,
    filterKey: string,
    selectedEquipments: string[],
    categories: IEquipmentCategoryModel[],
    equipments: IEquipmentModel[],
    equipmentReserves: IEquipmentReserveModel[]
}

export interface IEquipmentCategoryModel {
    categoryId: number,
    name: string
}

export interface IEquipmentModel {
    calibrationDataUrl: [],
    categoryId: number,
    categoryName: string,
    description: string,
    installationLocation: string,
    equipmentCustomFields: IEquipmentCustomFieldModel[],
    equipmentId: string,
    inventoryCode: string,
    lastCalibrationDate: string,
    lastModifiedOn: string,
    name: string,
    nextCalibrationDate: string,
    registrationDate: string,
    status: string,
    vendor: string
}

export interface IEquipmentCustomFieldModel {
    id: number,
    label: string,
    value: string
}

export interface IEquipmentReserveModel {
    description?: string,
    endTime: string,
    endTimeZone?: string,
    installationLocation?: string,
    inventoryItemId: string,
    isAllDay: boolean,
    location?: string,
    name?: string,
    recurrenceException?: string,
    recurrenceId?: string,
    recurrenceRule?: string,
    reserveId: string,
    startTime: string,
    startTimeZone?: string,
    subject: string,
    createdBy?: string,
    createdOn?: string,
    updatedBy?: string,
    updatedOn?: string,

    isDraft?: boolean,
    isUpdate?: boolean,
    isDelete?: boolean
}


export interface IInventoryInstrumentStateModel {
    categoryId: string,
    filterKey: string,
    selectedInstruments: string[],
    categories: ICategoryModel[],
    instruments: IInstrumentModel[],
    instrumentReserves: IInstrumentReserveModel[]
}

export interface ICategoryModel {
    categoryId: number,
    name: string
}
export interface IInstrumentModel {
    calibrationDataUrl: [],
    categoryId: number,
    categoryName: string,
    description: string,
    installationLocation: string,
    instrumentCustomFields: IInstrumentCustomFieldModel[],
    instrumentId: string,
    inventoryCode: string,
    lastCalibrationDate: string,
    lastModifiedOn: string,
    name: string,
    nextCalibrationDate: string,
    registrationDate: string,
    status: string,
    vendor: string
}

export interface IInstrumentCustomFieldModel {
    id: number,
    label: string,
    value: string
}

export interface IInstrumentReserveModel {
    description?: string,
    endTime: string,
    endTimeZone?: string,
    installationLocation?: string,
    inventoryItemId: string,
    isAllDay: boolean,
    location?: string,
    name?: string,
    recurrenceException?: string,
    recurrenceId?: string,
    recurrenceRule?: string,
    reserveId: string,
    startTime: string,
    startTimeZone?: string,
    subject: string,
    createdBy?: string,
    createdOn?: string,
    updatedBy?: string,
    updatedOn?: string,

    isDraft?: boolean,
    isUpdate?: boolean,
    isDelete?: boolean
}



export interface IInventoryReagentStateModel {
    categoryId: string,
    filterKey: string,
    selectedReagents: string[],
    categories: ICategoryModel[],
    reagents: IReagentModel[]
}

export interface IReagentModel {
    availableQuantity: number,
    availableQuantityUnit: string,
    casNumber: number,
    categoryId: number,
    categoryName: string,
    description: string,
    expiryDate: string,
    inventoryCode: string,
    isMsdsFile: boolean,
    lastModifiedOn: string,
    msdsDataUrl: string,
    name: string,
    openingDate: string,
    reagentCustomFields: IReagentCustomFieldModel[],
    reagentId: string,
    registrationDate: string,
    source: string,
    storageLocation: string,
    supplier: string
}

export interface IReagentCustomFieldModel {
    id: number,
    label: string,
    value: string
}

export interface IInventorySampleStateModel {
    categoryId: string,
    filterKey: string,
    selectedSamples: string[],
    categories: ICategoryModel[],
    samples: ISampleModel[]
}

export interface ISampleModel {
    availableQuantity: number,
    availableQuantityUnit: string,
    casNumber: number,
    categoryId: number,
    categoryName: string,
    description: string,
    expiryDate: string,
    inventoryCode: string,
    isMsdsFile: boolean,
    lastModifiedOn: string,
    msdsDataUrl: string,
    name: string,
    openingDate: string,
    sampleCustomFields: ISampleCustomFieldModel[],
    sampleId: string,
    registrationDate: string,
    source: string,
    storageLocation: string,
    supplier: string
}

export interface IReagentFormDataModel {
    name: string,
    reagentId: string,
    reserveId: string,
    id: string,
    categoryName: string,
    location: string,
    totalQuantity: string,
    expiryDate: string,
    unit: string,
    reserveOn: string,
    quantity: string,
    reservedQuantity: string,
    isDeleted: boolean
}

export interface ISampleFormDataModel {
    name: string,
    sampleId: string,
    reserveId: string,
    id: string,
    categoryName: string,
    location: string,
    totalQuantity: string,
    expiryDate: string,
    unit: string,
    reserveOn: string,
    quantity: string,
    reservedQuantity: string,
    isDeleted: boolean
}

export interface ISampleCustomFieldModel {
    id: number,
    label: string,
    value: string
}