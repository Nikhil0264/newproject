import express from 'express';
import cors from 'cors';
import { ENV } from './lib/env.js';
import path from 'path';
import { connectDB } from './lib/db.js';
import { serve } from 'inngest/express';
import { inngest } from './lib/inngest.js';
const app = express();
const __dirname = path.resolve();


app.use(express.json()) //this is local host hence origin is localhosturl but incase of deployment it should be frontend url
app.use(cors({origin:ENV.CLINT_URL,credentials:true}));
app.use("/api/inngest",serve({clint:inngest,functions}))


app.get("/books",(req,res)=>{
    res.status(200).json({msg:"success from book api"})
})

if(ENV.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,'../frontend/dist')))
    app.get("/{*any}",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    });
}


const startServer = async ()=>{
    try{
        await connectDB();
        app.listen(ENV.PORT,()=>{
            console.log(`server is listening on port ${ENV.PORT}...`)
        })
    }catch(error){
        console.error('Failed to start server:', error);
    }
}
startServer();
