import QRCode from "qrcode";
import { validToken } from "./_shared.js";
export default async function handler(req,res){
  if(req.method!=="GET"){res.setHeader("Allow","GET");return res.status(405).end();}
  const token=typeof req.query.token==="string"?req.query.token:"";
  if(!validToken(token))return res.status(400).send("Invalid ticket token.");
  try{
    const svg=await QRCode.toString(token,{type:"svg",errorCorrectionLevel:"M",margin:2,width:360});
    res.setHeader("Content-Type","image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control","private, no-store");
    res.setHeader("X-Content-Type-Options","nosniff");
    return res.status(200).send(svg);
  }catch(error){return res.status(500).send("Cannot create QR image.");}
}
