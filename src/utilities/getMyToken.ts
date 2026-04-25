"use server"
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export default async function getMyToken(){
try{
   const decodedtoken= 
         (await cookies()).get('next-auth.session-token')?.value||
         (await cookies()).get('__Secure-next-auth.session-token')?.value;
         if(!decodedtoken)return null

         const token= 
         await decode({
            token:decodedtoken,
            secret:process.env.NEXTAUTH_SECRET!
         })
   return token?.token||null;

}
catch{
   return null
}
}