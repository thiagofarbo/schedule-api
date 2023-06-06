import { prisma } from "../database/prisma";
import { UserData } from "../interfaces/UserData";

class UserRepository{

    async create({name, email, password}: UserData){
        const result = await prisma.user.create({
            data: {
                name,
                email,
                password
            }
        });
        return result;
    }

    async findUserByEmail(email: string){
        const result = await prisma.user.findUnique({
            where:{
                email
            },
        });
        return result;
    }

    async findUserById(userId: string){
        const result = await prisma.user.findUnique({
            where:{
                id: userId
            },
        });
        return result;
    }


    async update(name: string,  avatar: string, userId: string){
        const result = await prisma.user.update({
            where:{
                id: userId
            },
            data :{
                name,
                avatar
            }
        });
        return result;
    }

    async updatePassword(newPassword: string, userId: string){
        const result = await prisma.user.update({
            where:{
                id: userId
            },
            data :{
                password: newPassword,
              
            }
        });
        return result;
    }
}

export {UserRepository}