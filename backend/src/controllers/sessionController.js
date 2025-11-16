
import Session from "../models/Session.js";
import { chatClint, streamClint } from "../lib/stream.js";

export async function createSession(req,res){
    try{
        const {problem,difficulty} = req.body;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;
        
        if(!problem || !difficulty){
            return res.status(400).json({msg:"Problem and difficulty are required"});
        }

        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(8)}`;
        const session = await Session.create({
            problem,
            difficulty,
            host:userId,
            callId,
        })

        await streamClint.video.call("default",callId).getOrCreate({
            data:{
                created_by_id:clerkId,
                custom:{problem,difficulty,sessionId:session._id.toString()},
            },
        });

        const channel = chatClint.channel("messaging",callId,{
            name:`${problem} Session`,
            created_by_id:clerkId,
            members:[clerkId],
        })

        await channel.create();
        res.status(201).json({session});
    }catch(error){
        console.log("Error creating session controller:",error);
        res.status(500).json({msg:"Internal server error"});
    }
};

export async function getActiveSessions(_,res){
    try{
        const sessions = await Session.find({status:"active"})
        .populate("host","name profilImage email clerkId")
        .sort({createdAt:-1})
        .limit(20);
        res.status(200).json({sessions});
    }catch(error){
        console.log("Error fetching active sessions:",error);
        res.status(500).json({msg:"Internal server error"});
    }
};

export async function getMyRecentSession(req,res){
    try{
        const userId = req.user._id;
        const sessions = await Session.find({
            status:"completed",
            $or:[{host:userId},{participant:userId}],
        })
        .sort({createdAt:-1})
        .limit(20);
        res.status(200).json({sessions});
    }catch(error){
        console.log("Error fetching my recent sessions:",error);
        res.status(500).json({msg:"Internal server error"});
    }
};

export async function getSessionById(req,res){
    try{
        const {id} = req.params;
        const session = await Session.findById(id)
        .populate("host","name profilImage email clerkId")
        .populate("participant","name profilImage email clerkId");
        if(!session){
            return res.status(404).json({msg:"Session not found"});
        };
        res.status(200).json({session});
    }catch(error){
        console.log("Error fetching session by id:",error);
        res.status(500).json({msg:"Internal server error"});
    }
};

export async function joinSession(req,res){
    try{
        const {id} = req.params;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;
        const session = await Session.findById(id);
        if(!session){
            return res.status(404).json({msg:"Session not found"});
        }
        if(session.participant) return res.status(400).json({msg:"Session already has a participant"});
        session.participant = userId;
        await session.save();

        const channel = chatClint.channel("messaging",session.callId);
        await channel.addMembers([clerkId]);

        res.status(200).json({session});
    }catch(error){
         console.log("Error joining session:",error);
        res.status(500).json({msg:"Internal server error"});
        
    }
};

export async function endSession(req,res){
    try{
        const {id} = req.params;
        const userId = req.user._id;
        const session = await Session.findById(id);

        if(!session){
            return res.status(404).json({msg:"Session not found"});
        }
        if(session.host.toString() !== userId.toString()){
            return res.status(403).json({msg:"Only the host can end the session"});
        }

        if(session.status==="completed"){
            return res.status(400).json({msg:"Session is already completed"});
        }
        session.status="completed";
        await session.save();

        const call = await streamClint.video.call("default",session.callId);
        await call.delete({hard:true});

        const channel = chatClint.channel("messaging",session.callId);
        await channel.delete();

        res.status(200).json({session,msg:"Session ended successfully"});
    }catch(error){
       console.log("Error ending session:",error);
        res.status(500).json({msg:"Internal server error"});
    }
};


