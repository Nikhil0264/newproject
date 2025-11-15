import {StreamChat} from 'stream-chat';
import { ENV } from './env.js';

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    throw new Error("Stream API key and secret must be provided");
}

export const chatClint = StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser = async(userData)=>{
    try{
        await chatClint.upsertUser(userData);
        console.log('stream user upserted successfully',userData);    ;

    }catch(error){
        console.error("Error upserting Stream user:",error);
    }
}



export const deleteStreamUser = async(userId)=>{
    try{
        await chatClint.deleteUser(userId);
        console.log('stream user deleted successfully');

    }catch(error){
        console.error("Error upserting Stream user:",error);
    }
}