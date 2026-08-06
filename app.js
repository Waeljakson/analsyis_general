const SUPABASE_URL="https://fpicgtldwfevdvpbxkjf.supabase.co";
const SUPABASE_KEY="sb_publishable_3C7eKHRkzE2T-OLOpfue4g_i3u4R7Ay";
const db=window.supabase?.createClient(SUPABASE_URL,SUPABASE_KEY);
const WHATSAPP_NUMBER="966582712620";
const LABELS={results_analysis:"باقة تحليل النتائج",guidance_records:"باقة السجلات الرقمية",all_access:"الباقة الشاملة",presentations:"منصة العروض التقديمية",program_ideas:"منصة أفكار البرامج"};
const PLATFORMS=[
 {code:"results_analysis",title:"تحليل النتائج التعليمية",desc:"تحليل ملفات Excel، مؤشرات التحصيل، ضعاف المواد، تقارير Word وPDF، وأرشفة التحليلات.",icon:"▥",className:"analysis",href:"analysis/index.html",available:true},
 {code:"guidance_records",title:"السجلات الرقمية للموجه الطلابي",desc:"نماذج رقمية للسجلات الإرشادية، دراسة الحالة، الزيارات، المقابلات، المواظبة والأرشفة.",icon:"▤",className:"records",href:"records/index.html",available:true},
 {code:"presentations",title:"العروض التقديمية",desc:"منصة لإعداد وإدارة العروض التقديمية المهنية للموجه الطلابي.",icon:"▰",className:"presentations",href:"#",available:false},
 {code:"program_ideas",title:"أفكار البرامج",desc:"مكتبة أفكار وبرامج توجيهية قابلة للتخصيص والتنفيذ داخل المدرسة.",icon:"✦",className:"ideas",href:"#",available:false}
];
const state={user:null,account:null,entitlements:[],pendingLogo:null,adminUsers:[],adminRequests:[],adminEntitlements:[]};
const el=Object.fromEntries([...document.querySelectorAll('[id]')].map(x=>[x.id,x]));
const $all=s=>[...document.querySelectorAll(s)];
function escapeHtml(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function clean(v){return String(v??"").replace(/\s+/g," ").trim()}
function nowActive(e){return e&&e.is_active!==false&&new Date(e.expires_at).getTime()>Date.now()}
function activeEntitlements(){return state.entitlements.filter(nowActive)}
function isAdmin(){return Boolean(state.account?.is_system_admin)}
function hasAllAccess(){return isAdmin()||activeEntitlements().some(e=>e.product_code==='all_access')}
function hasAccess(code){return isAdmin()||hasAllAccess()||activeEntitlements().some(e=>e.product_code===code)}
function hasPaidPackage(){return activeEntitlements().length>0||isAdmin()}
function platformLaunchKey(code){return `unified_platform_launch_${code}`}
function rememberPlatformLaunch(code){
  try{
    sessionStorage.setItem(platformLaunchKey(code),String(Date.now()));
    sessionStorage.setItem('unified_last_platform',code);
  }catch(_error){}
}
function clearPlatformLaunches(){
  try{
    Object.keys(sessionStorage).filter(k=>k.startsWith('unified_platform_launch_')).forEach(k=>sessionStorage.removeItem(k));
    sessionStorage.removeItem('unified_last_platform');
  }catch(_error){}
}
function launchPlatform(code,href){
  if(!hasAccess(code)&&hasPaidPackage()){showSubscription(code);return}
  rememberPlatformLaunch(code);
  window.location.href=`${href}${href.includes('?')?'&':'?'}from=portal`;
}
function formatDate(v){if(!v)return"—";const d=new Date(v);return Number.isNaN(d.getTime())?String(v):d.toLocaleDateString('ar-SA')}
function showStatus(node,msg,error=false){node.hidden=false;node.textContent=msg;node.classList.toggle('error',error)}
function hideStatus(node){if(node)node.hidden=true}
function toast(msg){el.toast.textContent=msg;el.toast.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.toast.hidden=true,3500)}
function openModal(id){document.getElementById(id).hidden=false;document.body.style.overflow='hidden'}
function closeModal(id){document.getElementById(id).hidden=true;document.body.style.overflow=''}
function setAuthBusy(b){el.signInButton.disabled=b;el.signUpButton.disabled=b;el.signInButton.textContent=b?'جارٍ التنفيذ...':'تسجيل الدخول'}
function initials(){const n=clean(state.account?.school_name||state.account?.full_name||'مدرسة');return n.charAt(0)||'م'}
async function imageToDataUrl(file){if(!file)return null;if(file.size>2*1024*1024)throw new Error('حجم الشعار يجب ألا يتجاوز 2 ميجابايت.');return await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}
async function loadAccount(){
 let{data,error}=await db.from('premium_accounts').select('user_id,full_name,email,school_name,school_logo_data,is_system_admin,is_active').eq('user_id',state.user.id).maybeSingle();
 if(error)throw error;if(!data){await new Promise(r=>setTimeout(r,500));({data,error}=await db.from('premium_accounts').select('user_id,full_name,email,school_name,school_logo_data,is_system_admin,is_active').eq('user_id',state.user.id).single());if(error)throw error}
 state.account=data;
 const{data:ents,error:e}=await db.from('premium_entitlements').select('id,user_id,product_code,billing_period,started_at,expires_at,is_active').eq('user_id',state.user.id).order('expires_at',{ascending:false});if(e)throw e;state.entitlements=ents||[];
}
function planSummary(){
 if(isAdmin())return{title:'مدير النظام',details:'صلاحية كاملة لجميع المنصات والباقات.',chips:['جميع المنصات']};
 const active=activeEntitlements();const all=active.find(e=>e.product_code==='all_access');
 if(all)return{title:'الباقة الشاملة',details:`${all.billing_period==='monthly'?'اشتراك شهري':'اشتراك سنوي'} — سارية حتى ${formatDate(all.expires_at)}`,chips:['تحليل النتائج','السجلات الرقمية','كل المنصات القادمة']};
 if(!active.length)return{title:'حساب تجريبي',details:'لا توجد باقة مدفوعة نشطة. يمكنك استعراض المنصات المتاحة بصورة تجريبية قبل الاشتراك.',chips:['تجربة محدودة']};
 const chips=active.map(e=>LABELS[e.product_code]||e.product_code);return{title:chips.join(' + '),details:active.map(e=>`${LABELS[e.product_code]||e.product_code}: حتى ${formatDate(e.expires_at)}`).join(' — '),chips};
}
function renderIdentity(){
 const school=state.account?.school_name||'أضف اسم المدرسة';const name=state.account?.full_name||state.user?.email||'مستخدم';const logo=state.pendingLogo||state.account?.school_logo_data;
 el.headerSchoolName.textContent=school;el.headerUserName.textContent=name;el.profileFullName.value=state.account?.full_name||'';el.schoolProfileName.value=state.account?.school_name||'';
 [ [el.headerSchoolLogo,el.headerLogoPlaceholder],[el.schoolLogoPreview,el.profileLogoPlaceholder] ].forEach(([img,ph])=>{if(logo){img.src=logo;img.hidden=false;ph.hidden=true}else{img.hidden=true;ph.hidden=false;if(ph===el.headerLogoPlaceholder)ph.textContent=initials()}});
 const p=planSummary();el.headerPlanName.textContent=p.title;el.headerPlanExpiry.textContent=p.details;el.currentPackageTitle.textContent=p.title;el.currentPackageDetails.textContent=p.details;el.activePackageChips.innerHTML=p.chips.map(c=>`<span class="package-chip">${escapeHtml(c)}</span>`).join('');
 el.openAdminButton.hidden=!isAdmin();
 el.accessExplanation.textContent=hasPaidPackage()?'تظهر المنصات المشمولة في باقتك فقط بحالة مفعّلة، وباقي المنصات تكون غير نشطة.':'الحساب التجريبي يسمح بتجربة محدودة. بعد الاشتراك ستظل المنصة غير المشمولة مقفلة.';
 renderPlatforms();
}
function platformStatus(p){
 if(!p.available)return{mode:'coming',label:'قريبًا',meta:'قيد التطوير',button:'ستتاح لاحقًا'};
 if(hasAccess(p.code)){
   const e=activeEntitlements().find(x=>x.product_code===p.code)||activeEntitlements().find(x=>x.product_code==='all_access');
   return{mode:'active',label:'مفعّلة',meta:isAdmin()?'متاحة لمدير النظام':e?`سارية حتى ${formatDate(e.expires_at)}`:'متاحة',button:'دخول المنصة'};
 }
 if(!hasPaidPackage())return{mode:'trial',label:'تجربة محدودة',meta:'الحفظ والطباعة غير متاحين',button:'دخول التجربة'};
 return{mode:'locked',label:'غير مفعّلة',meta:'هذه المنصة غير مشمولة في باقتك',button:'الباقة غير نشطة'};
}
function renderPlatforms(){
 el.platformGrid.innerHTML=PLATFORMS.map(p=>{const s=platformStatus(p);const usable=s.mode==='active'||s.mode==='trial';const action=usable?`<button class="primary-button" type="button" data-launch-platform="${p.code}" data-platform-href="${p.href}">${s.button}</button>`:`<button class="locked-button secondary-button" type="button" ${s.mode==='locked'?`data-request-locked="${p.code}"`:''} ${s.mode==='coming'?'disabled':''}>${s.button}</button>`;return `<article class="platform-card ${p.className} ${s.mode}"><div class="platform-top"><div class="platform-icon">${p.icon}</div><span class="status-badge">${s.label}</span></div><h3>${p.title}</h3><p>${p.desc}</p><div class="platform-meta">${s.meta}</div>${action}</article>`}).join('');
 $all('[data-launch-platform]').forEach(b=>b.onclick=()=>launchPlatform(b.dataset.launchPlatform,b.dataset.platformHref));
 $all('[data-request-locked]').forEach(b=>b.onclick=()=>showSubscription(b.dataset.requestLocked));
}
async function applySession(session){
 state.user=session?.user||null;state.account=null;state.entitlements=[];state.pendingLogo=null;
 if(!state.user){clearPlatformLaunches();el.loginPage.hidden=false;el.portalShell.hidden=true;return}
 try{
   await loadAccount();
   if(state.account?.is_active===false)throw new Error('هذا الحساب موقوف. تواصل مع مدير النظام.');
   // تسجيل الدخول ينتهي دائمًا في لوحة اختيار المنصات، ولا يتم فتح أي منصة تلقائيًا.
   clearPlatformLaunches();
   el.loginPage.hidden=true;el.portalShell.hidden=false;renderIdentity();handleNotice();
 }catch(err){showStatus(el.loginStatus,err.message||'تعذر تحميل الحساب.',true);el.loginPage.hidden=false;el.portalShell.hidden=true}
}
function handleNotice(){
 const n=new URLSearchParams(location.search).get('notice');
 if(n==='package_locked'){el.portalNotice.hidden=false;el.portalNotice.textContent='المنصة التي حاولت فتحها غير مشمولة في باقتك الحالية. اختر منصة مفعّلة أو اطلب ترقية الباقة.';history.replaceState({},'',location.pathname);return}
 if(n==='choose_platform'){el.portalNotice.hidden=false;el.portalNotice.textContent='تم توجيهك إلى بوابة المنصات. اختر بنفسك المنصة المفعّلة التي تريد الدخول إليها.';history.replaceState({},'',location.pathname);return}
 el.portalNotice.hidden=true
}
async function signIn(){const email=clean(el.authEmail.value),password=el.authPassword.value;if(!email||!password)return showStatus(el.loginStatus,'أدخل البريد الإلكتروني وكلمة المرور.',true);setAuthBusy(true);try{const{data,error}=await db.auth.signInWithPassword({email,password});if(error)throw error;await applySession(data.session)}catch(e){showStatus(el.loginStatus,e.message||'تعذر تسجيل الدخول.',true)}finally{setAuthBusy(false)}}
async function signUp(){const email=clean(el.authEmail.value),password=el.authPassword.value,full_name=clean(el.authFullName.value);if(!email||password.length<6||!full_name)return showStatus(el.loginStatus,'اكتب الاسم والبريد وكلمة مرور من 6 أحرف على الأقل.',true);setAuthBusy(true);try{const{data,error}=await db.auth.signUp({email,password,options:{data:{full_name}}});if(error)throw error;if(data.session)await applySession(data.session);else showStatus(el.loginStatus,'تم إنشاء الحساب. راجع بريدك لتأكيد الحساب ثم سجّل الدخول.')}catch(e){showStatus(el.loginStatus,e.message||'تعذر إنشاء الحساب.',true)}finally{setAuthBusy(false)}}
async function signOut(){clearPlatformLaunches();await db.auth.signOut();await applySession(null)}
async function saveProfile(){const school=clean(el.schoolProfileName.value),name=clean(el.profileFullName.value);if(!school)return showStatus(el.profileStatus,'اكتب اسم المدرسة.',true);el.saveSchoolProfileButton.disabled=true;try{const logo=state.pendingLogo||state.account?.school_logo_data||null;const{data,error}=await db.rpc('premium_update_school_profile',{p_full_name:name||state.user.email,p_school_name:school,p_school_logo_data:logo});if(error)throw error;state.account={...state.account,...data};state.pendingLogo=null;renderIdentity();showStatus(el.profileStatus,'تم حفظ اسم المدرسة والشعار.')}catch(e){showStatus(el.profileStatus,e.message||'تعذر حفظ البيانات.',true)}finally{el.saveSchoolProfileButton.disabled=false}}
function selectedPlan(){const product=$all('input[name="productCode"]').find(x=>x.checked)?.value||'results_analysis';const period=$all('input[name="billingPeriod"]').find(x=>x.checked)?.value||'monthly';const comprehensive=product==='all_access';const amount=comprehensive?(period==='monthly'?50:300):(period==='monthly'?10:50);return{product,period,amount,label:LABELS[product]}}
function updatePlan(){const p=selectedPlan();el.selectedPlanName.textContent=`${p.label} — ${p.period==='monthly'?'شهري':'سنوي'}`;el.selectedPlanPrice.textContent=`${p.amount} ريال${p.amount===10?'ات':''}`;const msg=[`السلام عليكم، أرغب في طلب تفعيل ${p.label}.`,`المدة: ${p.period==='monthly'?'شهرية':'سنوية'} — ${p.amount} ريال.`,`الاسم: ${state.account?.full_name||state.user?.email||''}`,`المدرسة: ${state.account?.school_name||'غير محددة'}`,`البريد: ${state.user?.email||''}`].join('\n');el.whatsappActivationLink.href=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;el.sendActivationRequestButton.disabled=!el.whatsappConfirmed.checked}
function showSubscription(product){if(product)$all('input[name="productCode"]').forEach(x=>x.checked=x.value===product);el.whatsappConfirmed.checked=false;hideStatus(el.subscriptionStatus);updatePlan();openModal('subscriptionModal')}
async function requestActivation(){const p=selectedPlan();if(!el.whatsappConfirmed.checked)return;el.sendActivationRequestButton.disabled=true;try{const note=`طلب من البوابة الموحدة — ${p.label} — ${p.period==='monthly'?'شهري':'سنوي'} — تم التواصل عبر واتساب على 00966582712620، والتفعيل مشروط باستكمال التواصل.`;const{error}=await db.rpc('premium_request_package_subscription',{p_product_code:p.product,p_billing_period:p.period,p_user_note:note});if(error)throw error;showStatus(el.subscriptionStatus,'تم إرسال طلب التفعيل إلى مدير النظام. لن يتم التفعيل إلا بعد مراجعة التواصل عبر واتساب.');toast('تم إرسال طلب التفعيل')}catch(e){showStatus(el.subscriptionStatus,e.message||'تعذر إرسال الطلب.',true)}finally{updatePlan()}}
async function loadAdmin(){if(!isAdmin())return;showStatus(el.adminStatus,'جارٍ تحميل البيانات...');const[rr,ur,er]=await Promise.all([db.from('premium_subscription_requests').select('id,user_id,product_code,amount_sar,billing_period,status,user_note,requested_at').eq('status','pending').order('requested_at',{ascending:true}),db.from('premium_accounts').select('user_id,full_name,email,school_name,is_system_admin,is_active,created_at').order('created_at',{ascending:false}),db.from('premium_entitlements').select('user_id,product_code,billing_period,expires_at,is_active').order('expires_at',{ascending:false})]);const error=rr.error||ur.error||er.error;if(error)return showStatus(el.adminStatus,error.message,true);state.adminRequests=rr.data||[];state.adminUsers=ur.data||[];state.adminEntitlements=er.data||[];hideStatus(el.adminStatus);renderAdmin()}
function renderAdmin(){const userMap=Object.fromEntries(state.adminUsers.map(u=>[u.user_id,u]));el.adminRequestsList.innerHTML=state.adminRequests.length?state.adminRequests.map(r=>{const u=userMap[r.user_id]||{};return `<article class="admin-item"><div class="admin-item-head"><div><h4>${escapeHtml(LABELS[r.product_code]||r.product_code)}</h4><p>${escapeHtml(u.school_name||u.full_name||'مستخدم')} — ${escapeHtml(u.email||'')}</p></div><span>${r.billing_period==='monthly'?'شهري':'سنوي'} · ${Number(r.amount_sar).toFixed(0)} ريال</span></div><p>${escapeHtml(r.user_note||'')}</p><div class="actions"><button class="primary-button" data-approve="${r.id}">تفعيل الباقة</button><button class="danger-button" data-reject="${r.id}">رفض</button></div></article>`}).join(''):'<div class="status-box">لا توجد طلبات معلقة.</div>';
 const now=Date.now();el.adminUsersList.innerHTML=state.adminUsers.map(u=>{const active=state.adminEntitlements.filter(e=>e.user_id===u.user_id&&e.is_active!==false&&new Date(e.expires_at).getTime()>now);const packages=u.is_system_admin?['مدير النظام — جميع الباقات']:active.length?active.map(e=>`${LABELS[e.product_code]||e.product_code} حتى ${formatDate(e.expires_at)}`):['لا توجد باقة نشطة'];const self=u.user_id===state.user.id;return `<article class="admin-item"><div class="admin-item-head"><div><h4>${escapeHtml(u.school_name||u.full_name||'مستخدم')}</h4><p>${escapeHtml(u.email||'')}</p></div><span>${u.is_system_admin?'مدير':'مستخدم'}</span></div><p>${packages.map(escapeHtml).join('<br>')}</p><div class="actions">${u.is_system_admin?`<button class="danger-button" data-admin-role="false" data-user-id="${u.user_id}" ${self?'disabled':''}>إلغاء صلاحية المدير</button>`:`<button class="secondary-button" data-admin-role="true" data-user-id="${u.user_id}">تعيين مدير</button>`}</div></article>`}).join('');
 $all('[data-approve]').forEach(b=>b.onclick=()=>approve(b.dataset.approve));$all('[data-reject]').forEach(b=>b.onclick=()=>rejectReq(b.dataset.reject));$all('[data-admin-role]').forEach(b=>b.onclick=()=>setAdmin(b.dataset.userId,b.dataset.adminRole==='true'))}
async function approve(id){const{error}=await db.rpc('premium_admin_activate_package_request',{p_request_id:id,p_admin_note:'تم التفعيل من البوابة الموحدة'});if(error)return showStatus(el.adminStatus,error.message,true);toast('تم تفعيل الباقة');await loadAdmin();await loadAccount();renderIdentity()}
async function rejectReq(id){const{error}=await db.rpc('premium_admin_reject_request',{p_request_id:id,p_admin_note:'تم رفض الطلب من البوابة الموحدة'});if(error)return showStatus(el.adminStatus,error.message,true);toast('تم رفض الطلب');await loadAdmin()}
async function setAdmin(userId,makeAdmin){if(!confirm(makeAdmin?'تعيين هذا الحساب مديرًا للنظام؟':'إلغاء صلاحية المدير؟'))return;const{error}=await db.rpc('premium_admin_set_role',{p_user_id:userId,p_is_admin:makeAdmin});if(error)return showStatus(el.adminStatus,error.message,true);toast(makeAdmin?'تم تعيين مدير':'تم إلغاء صلاحية المدير');await loadAdmin()}
function bind(){el.signInButton.onclick=signIn;el.signUpButton.onclick=signUp;el.authPassword.addEventListener('keydown',e=>{if(e.key==='Enter')signIn()});el.signOutButton.onclick=signOut;el.openProfileButton.onclick=()=>openModal('profileModal');el.openSubscriptionButton.onclick=()=>showSubscription();el.openAdminButton.onclick=async()=>{openModal('adminModal');await loadAdmin()};el.schoolLogoInput.onchange=async()=>{try{state.pendingLogo=await imageToDataUrl(el.schoolLogoInput.files?.[0]);renderIdentity()}catch(e){showStatus(el.profileStatus,e.message,true)}};el.saveSchoolProfileButton.onclick=saveProfile;$all('[data-close-modal]').forEach(b=>b.onclick=()=>closeModal(b.dataset.closeModal));$all('.modal').forEach(m=>m.onclick=e=>{if(e.target===m)closeModal(m.id)});$all('input[name="productCode"],input[name="billingPeriod"]').forEach(x=>x.onchange=updatePlan);el.whatsappConfirmed.onchange=updatePlan;el.sendActivationRequestButton.onclick=requestActivation;$all('[data-quick-plan]').forEach(b=>b.onclick=()=>showSubscription(b.dataset.quickPlan));$all('[data-admin-tab]').forEach(b=>b.onclick=()=>{$all('[data-admin-tab]').forEach(x=>x.classList.toggle('active',x===b));el.adminRequestsPanel.hidden=b.dataset.adminTab!=='requests';el.adminUsersPanel.hidden=b.dataset.adminTab!=='users'});document.addEventListener('keydown',e=>{if(e.key==='Escape')$all('.modal:not([hidden])').forEach(m=>closeModal(m.id))})}
async function init(){bind();if(!db)return showStatus(el.loginStatus,'تعذر تحميل الاتصال بقاعدة البيانات.',true);const{data}=await db.auth.getSession();await applySession(data.session);db.auth.onAuthStateChange((_e,s)=>setTimeout(()=>applySession(s),0))}init();