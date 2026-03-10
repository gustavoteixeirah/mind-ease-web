import { stackServerApp } from "@/stack/server";

export async function getCurrentUserId(){ 
    const user = await stackServerApp.getUser();
    return user ? user.id : null;
}