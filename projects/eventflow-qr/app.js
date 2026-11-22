const registrationForm = document.querySelector("#register-form");
const checkinForm = document.querySelector("#checkin-form");
const scannerToggle = document.querySelector("#scan-toggle");
const scanVideo = document.querySelector("#scan-video");
let stream = null;
let scanning = false;

function status(id, message, error = false) {
  const el = document.querySelector("#" + id);
  el.textContent = message;
  el.classList.toggle("error", error);
}
function formValue(form, key) { return String(new FormData(form).get(key) ?? "").trim(); }
async function postJSON(path, body, headers = {}) {
  const response = await fetch(path, {
    method:"POST",
    headers:{"Content-Type":"application/json", ...headers},
    body:JSON.stringify(body)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.ok === false) throw new Error(payload.message || "Request failed (" + response.status + ").");
  return payload;
}
registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = registrationForm.querySelector('button[type="submit"]');
  button.disabled = true;
  document.querySelector("#ticket-card").classList.add("hidden");
  status("register-status","Registering…");
  try {
    const body = {
      eventId:formValue(registrationForm,"eventId"),
      name:formValue(registrationForm,"name"),
      email:formValue(registrationForm,"email"),
      consent:registrationForm.elements.consent.checked
    };
    const result = await postJSON("/api/register",body);
    if (!result.ticket) throw new Error("Registration did not return a ticket.");
    document.querySelector("#ticket-token").textContent = result.ticket;
    document.querySelector("#ticket-image").src = "/api/qr?token=" + encodeURIComponent(result.ticket);
    document.querySelector("#ticket-card").classList.remove("hidden");
    status("register-status","Registration successful. Your QR ticket is ready.");
  } catch(error) { status("register-status",error.message,true); }
  finally { button.disabled = false; }
});
checkinForm.addEventListener("submit",async event => {
  event.preventDefault();
  const button = checkinForm.querySelector('button[type="submit"]');
  button.disabled=true; status("checkin-status","Validating ticket…");
  try{
    const body={eventId:formValue(checkinForm,"eventId"), ticket:formValue(checkinForm,"ticket")};
    const staffKey=formValue(checkinForm,"staffKey");
    const response=await postJSON("/api/checkin",body,{"x-staff-key":staffKey});
    status("checkin-status",response.status==="checked_in"?"Check-in recorded successfully.":(response.message||"Check-in recorded."));
  }catch(error){status("checkin-status",error.message,true);}
  finally{button.disabled=false;}
});
function stopScanner(){
  scanning=false;
  if(stream){stream.getTracks().forEach(track=>track.stop());stream=null;}
  scanVideo.srcObject=null;scanVideo.classList.add("hidden");
  scannerToggle.textContent="Start QR camera scanner";
}
scannerToggle.addEventListener("click",async()=>{
  if(scanning){stopScanner();return;}
  if(!("BarcodeDetector" in window)||!navigator.mediaDevices?.getUserMedia){
    status("checkin-status","Camera QR scanning is unsupported here. Enter the token manually.",true);return;
  }
  try{
    const detector=new BarcodeDetector({formats:["qr_code"]});
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false});
    scanVideo.srcObject=stream;await scanVideo.play();
    scanning=true;scanVideo.classList.remove("hidden");scannerToggle.textContent="Stop camera";
    status("checkin-status","Point your camera at a QR ticket.");
    const scan=async()=>{
      if(!scanning)return;
      try{
        const codes=await detector.detect(scanVideo);
        if(codes.length){
          const token=String(codes[0].rawValue??"").trim();
          if(/^[0-9a-fA-F-]{36}$/.test(token)){
            document.querySelector("#checkin-ticket").value=token;
            stopScanner();status("checkin-status","QR detected. Confirm check-in to submit.");return;
          }
        }
      }catch(e){/* transient frame decode failure */}
      if(scanning)requestAnimationFrame(scan);
    };
    requestAnimationFrame(scan);
  }catch(error){stopScanner();status("checkin-status","Could not access the camera. Use manual entry.",true);}
});
window.addEventListener("pagehide",stopScanner);
