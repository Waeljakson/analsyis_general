const SUPABASE_URL="https://fpicgtldwfevdvpbxkjf.supabase.co",SUPABASE_KEY="sb_publishable_3C7eKHRkzE2T-OLOpfue4g_i3u4R7Ay";const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);const $=s=>document.querySelector(s);let audience='boys',allMessages=[],visible=[],shown=0,favorites=new Set(JSON.parse(localStorage.getItem('message_favorites')||'[]'));
const stages={lower_primary:'الابتدائية الدنيا',upper_primary:'الابتدائية العليا',middle:'المتوسطة',secondary:'الثانوية'};
const categories={
'achievement':['التفوق العام','النجاح','تحسن المستوى','التميز في مادة','المشاركة الصفية','الالتزام بالواجبات','القراءة المتميزة','القيادة الطلابية','المبادرة الإيجابية','الانضباط المتميز'],
'absence':['غياب يوم واحد','غياب يومين','غياب أكثر من يومين','غياب متكرر','غياب دون عذر','غياب قبل الإجازة','غياب بعد الإجازة','غياب يوم الاختبار','غياب عن برنامج علاجي','تحسن الانتظام'],
'late':['التأخر الصباحي','تكرار التأخر','التأخر عن الاصطفاف','التأخر عن الاختبار','الخروج المبكر','عدم الالتزام بوقت الانصراف','أثر السهر','متابعة وقت الخروج من المنزل','التأخر بعد تنبيه سابق','تحسن الانضباط'],
'academic':['انخفاض التحصيل','ضعف مادة محددة','عدم إنجاز الواجب','عدم تسليم مشروع','ضعف المشاركة','الحاجة لخطة علاجية','تشتت الانتباه','ضعف القراءة','ضعف الكتابة','ضعف المهارات الأساسية'],
'exams':['قرب الاختبارات','تنظيم المذاكرة','تجنب السهر','تقليل استخدام الجوال','تهيئة مكان هادئ','قلق الاختبار','الحضور المبكر','إحضار الأدوات','نتيجة منخفضة','دعم ما بعد الإخفاق'],
'behavior':['حسن السلوك','عدم الالتزام بالتعليمات','مقاطعة المعلم','إثارة الفوضى','ألفاظ غير مناسبة','العبث بالممتلكات','مخالفة الزي','استخدام الجوال','الخروج من الفصل','تحسن السلوك'],
'relationships':['احترام المعلمين','احترام الزملاء','التعاون','التنمر','المشاجرة','العزلة','تكوين الصداقات','حل الخلاف','الاعتذار','تقبل الاختلاف'],
'digital':['الأمن الرقمي','حماية الخصوصية','التصوير دون إذن','الاستخدام المفرط للألعاب','مواقع التواصل','الشائعات الإلكترونية','كلمات المرور','المحتوى غير المناسب','التنمر الإلكتروني','التوازن الرقمي'],
'health':['النوم الصحي','التغذية الصحية','النظافة الشخصية','النشاط البدني','الإجهاد','الصداع المتكرر','العناية بالبصر','وجبة الإفطار','شرب الماء','الوقاية من العدوى'],
'psychology':['القلق','الخجل','العزلة','ضعف الدافعية','الحزن الملحوظ','التوتر','ضعف الثقة بالنفس','الخوف من المدرسة','صعوبة التكيف','الضغط الدراسي'],
'family':['الحوار الأسري','المتابعة المنزلية','تنظيم الوقت','تعزيز المسؤولية','عدم المقارنة','التشجيع المتوازن','متابعة الأصدقاء','القدوة الحسنة','الاستقلالية','التواصل مع المدرسة'],
'meetings':['دعوة لمقابلة','طلب تواصل','متابعة توصية','اجتماع ولي الأمر','إفادة عن حالة','شكر على التعاون','تنبيه أول','تنبيه ثان','إشعار متابعة','إغلاق حالة بعد التحسن'],
'activities':['المشاركة في نشاط','موهبة فنية','موهبة رياضية','مسابقة علمية','عمل تطوعي','إذاعة مدرسية','نادي طلابي','مبادرة مجتمعية','رحلة تعليمية','تكريم مشاركة'],
'values':['الصدق','الأمانة','الاحترام','المسؤولية','الانتماء','التعاون','الرحمة','الانضباط','المحافظة على الممتلكات','احترام الأنظمة'],
'career':['اختيار التخصص','الميول المهنية','البحث عن الجامعات','متطلبات القبول','التخطيط للمستقبل','السيرة الذاتية','المقابلة الشخصية','المنح الدراسية','التخصصات الواعدة','القرار المهني'],
'aptitude':['الاستعداد المبكر للقدرات','التسجيل في القدرات','القسم الكمي','القسم اللفظي','الاختبارات التجريبية','إدارة وقت القدرات','انخفاض درجة القدرات','تحسن درجة القدرات','إعادة اختبار القدرات','خطة رفع درجة القدرات'],
'achievement_test':['الاستعداد للتحصيلي','خطة مراجعة التحصيلي','رياضيات التحصيلي','فيزياء التحصيلي','كيمياء التحصيلي','أحياء التحصيلي','حل النماذج','انخفاض درجة التحصيلي','تحسن درجة التحصيلي','قرب موعد التحصيلي']};
const labels={achievement:'التفوق والنجاح',absence:'الغياب',late:'التأخر والانضباط',academic:'التحصيل الدراسي',exams:'الاختبارات',behavior:'السلوك',relationships:'العلاقات',digital:'التوعية الرقمية',health:'الصحة',psychology:'الصحة النفسية',family:'التوعية الأسرية',meetings:'التواصل والاجتماعات',activities:'الأنشطة والموهبة',values:'القيم',career:'التوجيه الجامعي والمهني',aptitude:'القدرات',achievement_test:'التحصيلي'};
const contexts=['تنبيه أول','متابعة بعد التواصل','طلب تعاون الأسرة','توضيح الأثر','تعزيز التحسن'];
function pron(){return audience==='girls'?{student:'الطالبة',child:'ابنتكم',her:'ها',him:'ها',support:'دعمها',follow:'متابعتها'}:{student:'الطالب',child:'ابنكم',her:'ه',him:'ه',support:'دعمه',follow:'متابعته'}}
function stageAdvice(stage){return {lower_primary:'مع مراعاة التعزيز الإيجابي والروتين اليومي المبسط.',upper_primary:'مع تعزيز المسؤولية تدريجيًا والمتابعة اليومية المتوازنة.',middle:'مع الحوار الهادئ ووضع خطوات واضحة قابلة للمتابعة.',secondary:'مع إشراك الطالب في الخطة وتعزيز مسؤوليته عن مستقبله الدراسي.'}[stage]}
function buildText(cat,topic,context,stage,tone){const p=pron(),name='[الاسم]',cls='[الصف]';let core='';if(cat==='achievement')core=`يسرنا إبلاغكم بتميز ${p.student} ${name} في ${topic}، ونثمّن تعاونكم و${p.follow}.`;else if(cat==='absence')core=`لوحظ ${topic} لدى ${p.student} ${name}، ونأمل الاطمئنان عليه والتواصل مع المدرسة ودعم انتظامه حفاظًا على تحصيله.`;else if(cat==='late')core=`لوحظ ${topic} لدى ${p.student} ${name}، ونأمل تعاونكم في تعزيز الحضور والانضباط؛ لما لذلك من أثر مباشر في بداية يومه الدراسي.`;else if(cat==='aptitude')core=`نأمل دعم ${p.student} ${name} في ${topic}، والالتزام بخطة تدريب منتظمة مع تحليل الأخطاء وقياس التحسن.`;else if(cat==='achievement_test')core=`نأمل متابعة ${p.student} ${name} في ${topic}، وفق خطة مراجعة متدرجة تجمع بين الفهم وحل الأسئلة وقياس الإنجاز.`;else if(cat==='meetings')core=`نأمل تواصلكم مع الموجه الطلابي بشأن ${topic} لـ${p.student} ${name} في ${cls}، بهدف توحيد المتابعة بين الأسرة والمدرسة.`;else if(cat==='achievement'||context==='تعزيز التحسن')core=`نثمّن التحسن الملحوظ لدى ${p.student} ${name} في ${topic}، ونأمل استمرار الدعم والمتابعة.`;else core=`نود إشعاركم بملاحظة تتعلق بـ${topic} لدى ${p.student} ${name}، ونأمل تعاونكم في ${p.support} ومتابعة التحسن خلال الفترة القادمة.`;let c={"تنبيه أول":'هذه رسالة متابعة أولية هدفها الوقاية والدعم المبكر.',"متابعة بعد التواصل":'نقدّر تعاونكم السابق، ونأمل استمرار المتابعة حتى استقرار التحسن.',"طلب تعاون الأسرة":'تعاون الأسرة والمدرسة يسهم في تحقيق نتيجة أفضل وأكثر استدامة.',"توضيح الأثر":'استمرار الموقف قد يؤثر في التحصيل والانضباط والتكيف المدرسي.',"تعزيز التحسن":'نثمّن التحسن ونأمل المحافظة عليه وتعزيزه.'}[context];return tone==='formal'?`ولي أمر ${p.student} ${name} المحترم، ${core} ${c}`:`أسرة ${p.student} ${name} الكريمة، ${core} ${c} ${stageAdvice(stage)}`}
function generate(){let id=0,out=[];for(const [cat,topics] of Object.entries(categories))for(const topic of topics)for(const context of contexts)for(const stage of Object.keys(stages)){if((cat==='aptitude'||cat==='achievement_test'||cat==='career')&&stage!=='secondary')continue;for(const tone of ['friendly','formal'])out.push({id:`m${++id}`,cat,topic,context,stage,tone,text:buildText(cat,topic,context,stage,tone)});}return out}
function personalized(t){const p=pron();return t.replaceAll('[الاسم]',$('#studentName').value.trim()||p.student).replaceAll('[الصف]',$('#className').value.trim()||'الصف').concat($('#schoolName').value.trim()?`\n${$('#schoolName').value.trim()}`:'').concat($('#counselorName').value.trim()?`\nالموجه الطلابي: ${$('#counselorName').value.trim()}`:'')}
function filter(){const q=$('#searchInput').value.trim(),st=$('#stageFilter').value,cat=$('#categoryFilter').value,tone=$('#toneFilter').value,fav=$('#favoritesOnly').classList.contains('active');visible=allMessages.filter(m=>(st==='all'||m.stage===st)&&(cat==='all'||m.cat===cat)&&(tone==='all'||m.tone===tone)&&(!q||`${m.topic} ${labels[m.cat]} ${m.text}`.includes(q))&&(!fav||favorites.has(m.id)));shown=0;renderMore(true)}
function card(m){const isFav=favorites.has(m.id);return `<article class="card"><div class="card-top"><div><strong>${m.topic}</strong><div class="tags"><span class="tag">${labels[m.cat]}</span><span class="tag">${stages[m.stage]}</span><span class="tag">${m.tone==='friendly'?'ودية':'رسمية'}</span></div></div><button class="fav" data-fav="${m.id}">${isFav?'★':'☆'}</button></div><div class="message" id="txt-${m.id}">${personalized(m.text)}</div><div class="actions"><button class="copy" data-copy="${m.id}">نسخ الرسالة</button><button class="whatsapp" data-wa="${m.id}">فتح واتساب</button></div></article>`}
function renderMore(reset=false){if(reset)$('#cards').innerHTML='';const batch=visible.slice(shown,shown+60);$('#cards').insertAdjacentHTML('beforeend',batch.map(card).join(''));shown+=batch.length;$('#loadMore').hidden=shown>=visible.length;$('#resultsInfo').textContent=`عرض ${shown.toLocaleString('ar-SA')} من ${visible.length.toLocaleString('ar-SA')} رسالة`;bindCards()}
function bindCards(){document.querySelectorAll('[data-copy]').forEach(b=>b.onclick=async()=>{await navigator.clipboard.writeText(personalized(allMessages.find(x=>x.id===b.dataset.copy).text));toast('تم نسخ الرسالة')});document.querySelectorAll('[data-wa]').forEach(b=>b.onclick=()=>{const t=personalized(allMessages.find(x=>x.id===b.dataset.wa).text);open(`https://wa.me/?text=${encodeURIComponent(t)}`,'_blank')});document.querySelectorAll('[data-fav]').forEach(b=>b.onclick=()=>{favorites.has(b.dataset.fav)?favorites.delete(b.dataset.fav):favorites.add(b.dataset.fav);localStorage.setItem('message_favorites',JSON.stringify([...favorites]));filter()})}
function toast(t){$('#toast').textContent=t;$('#toast').hidden=false;setTimeout(()=>$('#toast').hidden=true,2200)}

const PROJECT_REF='fpicgtldwfevdvpbxkjf';
const AUTH_STORAGE_KEY=`sb-${PROJECT_REF}-auth-token`;

function withTimeout(promise,ms,code){
  let timer;
  const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error(code)),ms)});
  return Promise.race([promise,timeout]).finally(()=>clearTimeout(timer));
}

function readStoredSession(){
  const keys=[AUTH_STORAGE_KEY,...Object.keys(localStorage).filter(k=>k.startsWith('sb-')&&k.endsWith('-auth-token')&&k!==AUTH_STORAGE_KEY)];
  for(const key of keys){
    try{
      const raw=localStorage.getItem(key);
      if(!raw)continue;
      const parsed=JSON.parse(raw);
      const session=parsed?.currentSession||parsed?.session||parsed;
      if(session?.access_token&&session?.user?.id)return session;
    }catch(error){console.warn('تعذر قراءة جلسة محفوظة',error)}
  }
  return null;
}

async function resolveSession(){
  const stored=readStoredSession();
  if(stored)return stored;
  const result=await withTimeout(db.auth.getSession(),7000,'session_timeout');
  return result?.data?.session||null;
}

async function restRequest(path,{session,method='GET',body}={}){
  if(!session?.access_token)throw new Error('not_authenticated');
  const response=await withTimeout(fetch(`${SUPABASE_URL}${path}`,{
    method,
    headers:{
      apikey:SUPABASE_KEY,
      Authorization:`Bearer ${session.access_token}`,
      'Content-Type':'application/json',
      Accept:'application/json'
    },
    body
  }),10000,'subscription_timeout');
  if(!response.ok){
    const details=await response.text().catch(()=>'');
    throw new Error(`subscription_check_failed_${response.status}:${details}`);
  }
  return response.json();
}

function showGateError(message){
  $('#loading').hidden=false;
  $('#loading').innerHTML=`<h2>تعذر التحقق من الاشتراك</h2><p>${message}</p><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button id="retryAccessCheck" class="btn" type="button">إعادة المحاولة</button><a href="../index.html" class="btn">العودة إلى البوابة</a></div>`;
  $('#retryAccessCheck')?.addEventListener('click',()=>location.reload());
}

async function loadAnnualAccess(session){
  const annual=await restRequest('/rest/v1/rpc/premium_has_annual_access',{
    session,
    method:'POST',
    body:'{}'
  });
  let account=null;
  try{
    const rows=await restRequest(`/rest/v1/premium_accounts?select=is_system_admin,presentation_audience_type&user_id=eq.${encodeURIComponent(session.user.id)}&limit=1`,{session});
    account=Array.isArray(rows)?rows[0]||null:rows;
  }catch(error){
    console.warn('تعذر تحميل نوع الجمهور، سيتم استخدام الإعداد الافتراضي',error);
  }
  return {annual:annual===true,account};
}

async function init(){
  const session=await resolveSession();
  if(!session){
    location.replace('../index.html?notice=login_required');
    return;
  }
  const {annual,account}=await loadAnnualAccess(session);
  $('#loading').hidden=true;
  if(!annual){
    $('#locked').hidden=false;
    return;
  }
  audience=account?.presentation_audience_type==='girls'?'girls':'boys';
  $('#audienceBadge').textContent=audience==='girls'?'نسخة الطالبات':'نسخة الطلاب';
  allMessages=generate();
  $('#totalCount').textContent=allMessages.length.toLocaleString('ar-SA');
  $('#categoryCount').textContent=Object.keys(categories).length;
  $('#categoryFilter').innerHTML+=Object.entries(labels).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');
  $('#app').hidden=false;
  ['searchInput','stageFilter','categoryFilter','toneFilter'].forEach(id=>$('#'+id).addEventListener(id==='searchInput'?'input':'change',filter));
  ['studentName','className','schoolName','counselorName'].forEach(id=>$('#'+id).addEventListener('input',()=>renderMore(true)));
  $('#favoritesOnly').onclick=()=>{$('#favoritesOnly').classList.toggle('active');filter()};
  $('#loadMore').onclick=()=>renderMore();
  filter();
}

init().catch(error=>{
  console.error(error);
  const message=error.message==='session_timeout'
    ?'استغرقت جلسة الدخول وقتًا أطول من المعتاد. ارجع إلى البوابة وسجّل الدخول ثم افتح المكتبة مرة أخرى.'
    :error.message==='subscription_timeout'
      ?'تعذر الوصول إلى خدمة الاشتراكات خلال المهلة المحددة. اضغط إعادة المحاولة.'
      :'حدث خطأ أثناء قراءة الاشتراك. اضغط إعادة المحاولة أو ارجع إلى البوابة.';
  showGateError(message);
});