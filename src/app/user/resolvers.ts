import axios from "axios";
import { prismaClient } from "../../client/db";
import jwtService from "../../services/jwt";
interface GoogleTokenResult {
	iss?: string;
	nbf?: string;
	aud?: string;
	sub?: string;
	email: string;
	email_varified: string;
	azp?: string;
	name?: string;
	picture?: string;
	given_name?: string;
	family_name?: string;
	iat?: string;
	exp?: string;
	jit?: string;
	alg?: string;
	kid?: string;
	typ?: string;

}
const queries ={

    verifyGoogelToken: async (parent: any , {token}:{token: string})=>{
        const googleToken = token;
        const googelAuthUrl = new URL("https://oauth2.googleapis.com/tokeninfo");
        googelAuthUrl.searchParams.set('id_token',googleToken);

        const {data} = await axios.get<GoogleTokenResult>(googelAuthUrl.toString(),{
            responseType: "json",
        })
        console.log(data);

        const user = await prismaClient.user.findUnique({where:{email:data.email}});

        if(!user){
            await prismaClient.user.create({
                data:{
                    email: data.email,
                    firstName: data.given_name!,
                    lastName: data.family_name,
                    profileImageUrl: data.picture
                }
            })
        }


        const userInDb =  await prismaClient.user.findUnique({where:{email:data.email}});
        if(!userInDb){
            throw new Error('User with this email not found');
        }
        const Token = jwtService.getJwtToken(userInDb);
        return Token;
    }
}

export const resolvers ={queries}