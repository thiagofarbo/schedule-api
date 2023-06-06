export interface UserData{
    name: string,
    email: string,
    password: string,
}

export interface UserDataUpdate{
    name: string,
    oldPassword: string,
    newPassword: string,
    avatar?: FileUpload,
    user_id: string
}

export interface FileUpload{
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    buffer: Buffer,
    size: number
}