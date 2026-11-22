import { clean, matchSecret, method, validId, validToken, sendWorkflow, report } from "./_shared.js";
export default async function handler(req,res){
  if(!method(req,res))return;
  const configured=process.env.CHECKIN_ADMIN_TOKEN;
  if(!configured||configured.length<24)return res.status(503).json({ok:false,message:"Staff access is not configured."});
  if(!matchSecret(configured,req.headers["x-staff-key"]))return res.status(401).json({ok:false,message:"Invalid staff access token."});
  const eventId=clean(req.body?.eventId,64);
  const ticket=clean(req.body?.ticket,100);
  if(!validId(eventId)||!validToken(ticket))return res.status(400).json({ok:false,message:"Invalid event or QR token."});
  try{
    const result=await sendWorkflow(process.env.N8N_CHECKIN_WEBHOOK_URL,{eventId,ticket});
    if(result.ok!==true||result.status!=="checked_in")return res.status(502).json({ok:false,message:"Check-in could not be confirmed."});
    return res.status(200).json({ok:true,status:"checked_in"});
  }catch(error){return report(res,error);}
}
