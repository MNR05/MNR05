import { clean, makeToken, method, validId, sendWorkflow, report } from "./_shared.js";
export default async function handler(req,res){
  if(!method(req,res))return;
  const body=req.body||{};
  const eventId=clean(body.eventId,64);
  const name=clean(body.name,120);
  const email=clean(body.email,254).toLowerCase();
  if(!validId(eventId)||name.length<2||name.length>120||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||body.consent!==true){
    return res.status(400).json({ok:false,message:"Provide an event ID, a name, a valid email and consent."});
  }
  const ticket=makeToken();
  try{
    const result=await sendWorkflow(process.env.N8N_REGISTER_WEBHOOK_URL,{eventId,name,email,consent:true,ticket});
    if(result.ticket!==ticket||result.ok!==true)return res.status(502).json({ok:false,message:"Registration could not be confirmed."});
    return res.status(201).json({ok:true,ticket});
  }catch(error){return report(res,error);}
}
