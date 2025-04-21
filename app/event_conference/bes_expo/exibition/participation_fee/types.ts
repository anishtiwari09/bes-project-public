export interface InputFieldType{
    value:string,
    isError?:boolean
    error:string
}

export type InputFieldTypeRecord = Record<string,InputFieldType>;
export type ApiPayload=Record<string,string>

export interface ApiResponse{
    status?:boolean
    message?:string
}

export interface CountryDataApiReponse{
name:{
    common:string
}
}