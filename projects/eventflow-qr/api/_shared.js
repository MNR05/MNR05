import { randomUUID, timingSafeEqual } from "node:crypto";
export function method(req,res,expected="POST"){
  if(req.method!==expected){res.setHeader("Allow",expected);res.status(405).json({ok:false,message:"Method not allowed"});return false;}
  res.setHeader("Cache-Control","no-store");
  return true;
}
export function clean(value,limit=120){return typeof value==="string"?value.trim().slice(0,limit+1):"";}
export const validId = value => /^[a-zA-Z0-9_-]{2,64}$/.test(value);
export const validToken = value => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
export const makeToken = () => randomUUID();
export function matchSecret(expected,provided){
  if(!expected||!provided)return false;
  const a=Buffer.from(String(expected));const b=Buffer.from(String(provided));
  return a.length===b.length&&timingSafeEqual(a,b);
}
export async function sendWorkflow(url,data){
  if(!url||!/^https:\/\//.test(url))throw new Error("Workflow endpoint is not configured with HTTPS.");
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),12000);
  try{
    const reply=await fetch(url,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data),signal:controller.signal});
    let result={};try{result=await reply.json()}catch{}
    if(!reply.ok||result.ok===false){
      const e=new Error(result.message||"Workflow rejected the request.");
      e.status=reply.status>=400&&reply.status<500?reply.status:502;throw e;
    }
    return result;
  }finally{clearTimeout(timer);}
}
export function report(res,error){
  const status=error.status||503;
  // Avoid leaking backend URLs, authentication or internal error details.
  const message=status<500?(error.message||"Request rejected"):"Service temporarily unavailable.";
  return res.status(status).json({ok:false,message});
}
