import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,GoogleAuthProvider,signInWithPopup,signInWithRedirect,getRedirectResult,onAuthStateChanged,signOut} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore,doc,getDoc,setDoc,onSnapshot} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
const config={apiKey:'AIzaSyB8Ki8JdzFiS9ftx-5TROrD4p_a2j26igo',authDomain:'mylife-dashboard-2f23a.firebaseapp.com',projectId:'mylife-dashboard-2f23a',storageBucket:'mylife-dashboard-2f23a.firebasestorage.app',messagingSenderId:'297871175015',appId:'1:297871175015:web:af14b1e3e92414b12c13c2'};
const gate=document.getElementById('cloudGate'),message=document.getElementById('gateMessage'),login=document.getElementById('googleLogin'),status=document.getElementById('cloudStatus');
let auth,db,ref,unsub,ready=false,queue=Promise.resolve(),localEdits=0,remoteStamp='';
function indicator(text,kind=''){status.textContent=text;status.className=kind;}
function errorText(e){const c=e?.code||'';if(c.includes('unauthorized-domain'))return 'Dit domein is niet toegestaan. Controleer Firebase Authentication → Authorized domains.';if(c.includes('permission-denied'))return 'Geen toegang tot Firestore. Controleer de gepubliceerde beveiligingsregels.';if(c.includes('popup-blocked'))return 'Safari blokkeerde het inlogvenster. Sta pop-ups toe of probeer opnieuw.';return e?.message||'Onbekende fout';}
try{
const app=initializeApp(config);auth=getAuth(app);db=getFirestore(app);
login.disabled=false;
login.addEventListener('click',async()=>{login.disabled=true;message.textContent='Google-login openen...';try{await signInWithPopup(auth,new GoogleAuthProvider())}catch(e){message.textContent=errorText(e);login.disabled=false;indicator('● Inloggen mislukt','bad')}});
getRedirectResult(auth).catch(e=>{message.textContent=errorText(e)});
onAuthStateChanged(auth,async user=>{
  if(unsub){unsub();unsub=null}ready=false;ref=null;localEdits=0;
  if(!user){gate.style.display='flex';login.disabled=false;message.textContent='Log in met Google om je gegevens te synchroniseren.';indicator('● Niet ingelogd','wait');return}
  gate.style.display='flex';message.textContent='Je gegevens veilig laden...';indicator('● Laden...','wait');
  ref=doc(db,'users',user.uid,'app','main');
  try{
    const snapshot=await getDoc(ref);
    if(snapshot.exists()){
      const data=snapshot.data().data;
      if(!Array.isArray(data?.tasks)||!Array.isArray(data?.sessions))throw new Error('De opgeslagen gegevens hebben een onverwacht formaat.');
      window.myLifeCloudApply(data);
    }else{
      // On first login the seed study plan is created exactly once.
      const seedData=JSON.parse(document.getElementById('seed').textContent);
      const copy=x=>JSON.parse(JSON.stringify(x));
      const initial={tasks:copy(seedData.tasks),blocks:copy(seedData.blocks),deadlines:copy(seedData.deadlines),exams:copy(seedData.exams),sessions:[],goal:5,focusMinutes:50,breakMinutes:10,reminders:true,created:new Date().toISOString()};
      await setDoc(ref,{data:initial,updatedAt:Date.now()});window.myLifeCloudApply(initial);
    }
    ready=true;gate.style.display='none';indicator('● Alles opgeslagen');
    unsub=onSnapshot(ref,snap=>{
      if(!snap.exists()||!ready||localEdits>0)return;
      const updated=snap.data();if(updated.updatedAt===remoteStamp)return;
      remoteStamp=updated.updatedAt;
      if(updated.data)window.myLifeCloudApply(updated.data);
      indicator('● Gesynchroniseerd');
    },e=>indicator('● '+errorText(e),'bad'));
  }catch(e){message.textContent='Laden mislukt: '+errorText(e);indicator('● Verbinding mislukt','bad');login.disabled=true;
    const retry=document.createElement('button');retry.className='btn secondary';retry.textContent='Opnieuw proberen';retry.onclick=()=>location.reload();gate.querySelector('.gateCard').append(retry);
  }
});
window.myLifeCloud={save(data){if(!ready||!ref){indicator('● Niet verbonden','bad');return}localEdits++;indicator('● Opslaan...','wait');const target=ref;queue=queue.catch(()=>{}).then(async()=>{try{const stamp=Date.now()+Math.random();await setDoc(target,{data,updatedAt:stamp});remoteStamp=stamp;localEdits--;if(localEdits===0)indicator('● Alles opgeslagen');}catch(e){localEdits--;indicator('● Opslaan mislukt','bad');console.error('MyLife synchronisatie:',e);alert('Opslaan mislukt: '+errorText(e)+'\nMaak een JSON-back-up via Instellingen als de verbinding blijft falen.')}});}};
}catch(e){message.textContent='Firebase kon niet worden gestart: '+errorText(e);indicator('● Configuratiefout','bad')}
