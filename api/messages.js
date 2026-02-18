<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Sulpak — ТЗ Генератор</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📋</text></svg>">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter','Segoe UI',-apple-system,sans-serif;background:#0a0f1a;color:#fff;height:100dvh;overflow:hidden}
  #app{max-width:520px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;background:#0E1621;position:relative}

  .header{background:#17212B;padding:14px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #1E2C3A;flex-shrink:0}
  .header-avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#E8452C,#FF6F20);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;flex-shrink:0;box-shadow:0 2px 12px rgba(232,69,44,0.3)}
  .header-info{flex:1}
  .header-title{font-weight:600;font-size:15px}
  .header-status{font-size:12px;color:#6B8A9E;margin-top:2px}

  .chat{flex:1;overflow-y:auto;padding:14px 14px 8px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}
  .chat::-webkit-scrollbar{width:4px}
  .chat::-webkit-scrollbar-thumb{background:#2A3F52;border-radius:4px}

  .msg{display:flex;animation:fadeIn 0.3s ease}
  .msg.user{justify-content:flex-end}
  .msg.bot{justify-content:flex-start}

  .bubble{max-width:85%;padding:10px 15px;font-size:14px;line-height:1.55;word-break:break-word}
  .bubble.bot{background:#182533;color:#E1E8ED;border-radius:16px 16px 16px 4px}
  .bubble.user{background:linear-gradient(135deg,#3B82C4,#2B6DA8);color:#fff;border-radius:16px 16px 4px 16px}
  .bubble p{margin:0 0 8px 0}.bubble p:last-child{margin:0}
  .bubble strong{color:#7EB8E0}
  .bubble em{color:#FFB74D;font-style:normal}

  .bubble-file{max-width:82%;border-radius:16px 16px 4px 16px;overflow:hidden;background:#1a3250}
  .bubble-file img{display:block;max-width:260px;max-height:200px;object-fit:cover;border-radius:12px 12px 0 0;cursor:pointer}
  .bubble-file-info{padding:8px 12px;display:flex;align-items:center;gap:8px}
  .bubble-file-icon{font-size:22px;flex-shrink:0}
  .bubble-file-meta{flex:1;min-width:0}
  .bubble-file-name{font-size:13px;color:#E1E8ED;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .bubble-file-size{font-size:11px;color:#6B8A9E;margin-top:1px}

  .typing-dots{display:flex;gap:4px;padding:8px 0;align-items:center}
  .typing-dots span{width:7px;height:7px;border-radius:50%;background:#6B8A7A;animation:bounce 1.2s ease-in-out infinite}
  .typing-dots span:nth-child(2){animation-delay:0.2s}
  .typing-dots span:nth-child(3){animation-delay:0.4s}

  .tz-result{animation:fadeIn 0.5s ease;background:#182533;border-radius:12px;padding:18px;margin-top:4px;border:1px solid #2A3F52}
  .tz-header{display:flex;align-items:center;gap:8px;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #2A3F52}
  .tz-header-dot{width:8px;height:8px;border-radius:50%;background:#4ADE80}
  .tz-header-text{font-size:12px;color:#6B8A9E;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
  .tz-content{font-size:12.5px;line-height:1.65;color:#C8D6E0;white-space:pre-wrap;word-break:break-word;font-family:'Cascadia Code','Fira Code','Courier New',monospace}

  .btn-copy{margin-top:14px;width:100%;padding:13px;border-radius:10px;border:none;background:linear-gradient(135deg,#E8452C,#FF6F20);color:#fff;font-weight:600;font-size:14px;cursor:pointer;transition:all 0.3s;font-family:inherit}
  .btn-copy:hover{opacity:0.9;transform:translateY(-1px)}
  .btn-copy.copied{background:linear-gradient(135deg,#2EAD4B,#3CC760)}

  .input-area{flex-shrink:0;background:#17212B;border-top:1px solid #1E2C3A;padding:10px 14px}
  .pending-files{display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap}
  .pending-file{display:flex;align-items:center;gap:6px;background:#1a2d42;border:1px solid #2A3F52;border-radius:10px;padding:4px 10px 4px 6px;font-size:12px;color:#7EB8E0;max-width:200px}
  .pending-file img{width:28px;height:28px;border-radius:4px;object-fit:cover}
  .pending-file-icon{font-size:18px}
  .pending-file-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}
  .pending-file-remove{cursor:pointer;color:#FF6B6B;font-size:14px;font-weight:700;margin-left:2px;padding:0 2px}

  .input-row{display:flex;gap:8px;align-items:center}
  .input-field{flex:1;padding:11px 16px;border-radius:22px;border:1px solid #2A3F52;background:#0E1621;color:#E1E8ED;font-size:14px;outline:none;font-family:inherit;transition:border-color 0.2s}
  .input-field:focus{border-color:#3B82C4}
  .input-field::placeholder{color:#4A6478}
  .btn-attach{width:44px;height:44px;border-radius:50%;border:none;background:transparent;color:#6B8A9E;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s}
  .btn-attach:hover{color:#7EB8E0;background:rgba(59,130,196,0.1)}
  .btn-send{width:44px;height:44px;border-radius:50%;border:none;background:#2A3F52;color:#fff;font-size:18px;cursor:default;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s}
  .btn-send.active{background:linear-gradient(135deg,#E8452C,#FF6F20);cursor:pointer}

  .lightbox{position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;animation:fadeIn 0.2s}
  .lightbox img{max-width:95%;max-height:90%;object-fit:contain;border-radius:8px}

  .error-msg{background:rgba(255,100,100,0.1);border:1px solid rgba(255,100,100,0.2);border-radius:12px;padding:12px;font-size:13px;color:#FF8A8A;line-height:1.4}

  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes bounce{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-6px);opacity:1}}
  @media(min-width:521px){body{background:#080c15}#app{box-shadow:0 0 60px rgba(0,0,0,0.5);border-left:1px solid #1a2535;border-right:1px solid #1a2535}}
</style>
</head>
<body>
<div id="app">
  <div class="header">
    <div class="header-avatar">S</div>
    <div class="header-info">
      <div class="header-title">Sulpak — ТЗ Генератор</div>
      <div class="header-status" id="status">AI бизнес-аналитик</div>
    </div>
  </div>
  <div class="chat" id="chat"></div>
  <div class="input-area" id="inputArea">
    <div class="input-row">
      <button class="btn-attach" id="btnAttach" title="Прикрепить файл / скриншот">📎</button>
      <input class="input-field" id="textInput" placeholder="Введите ответ..." autofocus>
      <button class="btn-send" id="btnSend">➤</button>
    </div>
  </div>
  <input type="file" id="fileInput" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.json,.xml" style="display:none">
</div>

<script>
// ===== CONFIG =====
// Всегда /api/messages — Vercel serverless function
const API_URL = '/api/messages';

// ===== SYSTEM PROMPT =====
const SYSTEM_PROMPT = `Ты — старший бизнес-аналитик компании Sulpak (крупнейшая казахстанская сеть электроники и бытовой техники). К тебе обращаются сотрудники из разных подразделений (логистика, коммерция, дистрибуция, розница, оптовый отдел, интернет-магазин) с запросами на IT-разработку.

ТВОЯ ЗАДАЧА: через диалог собрать информацию и сформировать развёрнутое Техническое Задание для IT-отдела.

═══ ПРАВИЛА ВЕДЕНИЯ ДИАЛОГА ═══

1. ЗАДАВАЙ ВОПРОСЫ ПО ОДНОМУ. Не засыпай пользователя списком вопросов. Один вопрос — один ответ. Иногда можно задать 2 связанных вопроса, но не больше.

2. НАЧИНАЙ С ОБЩЕГО, УГЛУБЛЯЙСЯ В ДЕТАЛИ:
   - Сначала: кто ты, из какого отдела, что за задача
   - Потом: какая проблема, что хочешь получить
   - Затем: кто пользователи, какие функции нужны
   - Дальше: интеграции, сценарии, ограничения
   - В конце: сроки, приоритет, кто принимает решение

3. АНАЛИЗИРУЙ ОТВЕТЫ И УТОЧНЯЙ:
   - Если ответ короткий или нечёткий — переспроси. Пример: пользователь написал "нужна выгрузка" → спроси "Выгрузка чего именно? Куда? В каком формате? Кто должен иметь доступ?"
   - Если ответ содержит противоречие — обрати внимание
   - Если пользователь упоминает что-то важное вскользь — разверни тему

4. ПОДТВЕРЖДАЙ ПОНИМАНИЕ: После важных ответов кратко переформулируй что ты понял. Пример: "Понял — сейчас менеджеры вручную вносят данные о возвратах в Excel, и вы хотите автоматизировать это через интеграцию с 1С. Верно?"

5. НЕ ЗАДАВАЙ ТЕХНИЧЕСКИЕ ВОПРОСЫ (какой язык программирования, какая БД). Ты собираешь бизнес-требования.

6. ЕСЛИ ПОЛЬЗОВАТЕЛЬ ПРИЛОЖИЛ ФАЙЛ/СКРИНШОТ — обязательно прокомментируй что ты на нём видишь и как это влияет на ТЗ. Задай уточняющие вопросы по содержимому файла.

7. НЕ ФАНТАЗИРУЙ. Если чего-то не знаешь — спроси. Не додумывай за пользователя.

8. БУДЬ ДРУЖЕЛЮБНЫМ но профессиональным. Ты эксперт, к которому пришли за помощью.

═══ КОГДА ДАННЫХ ДОСТАТОЧНО ═══

Когда ты собрал достаточно информации (обычно после 8-15 обменов сообщениями), скажи пользователю что готов сформировать ТЗ и спроси подтверждение. Если пользователь подтвердит — сформируй ТЗ.

═══ ФОРМАТ ИТОГОВОГО ТЗ ═══

Когда пользователь подтверждает готовность, выведи ТЗ строго в таком формате:

[ТЗ_НАЧАЛО]
(здесь полный текст ТЗ)
[ТЗ_КОНЕЦ]

Структура ТЗ:

1. ОБЩАЯ ИНФОРМАЦИЯ — название, заказчик, подразделение, дата, ЛПР
2. ОПИСАНИЕ ТЕКУЩЕЙ СИТУАЦИИ — развёрнуто опиши проблему на основе того что рассказал пользователь
3. ЦЕЛИ И ЗАДАЧИ ПРОЕКТА — переформулируй цель пользователя профессиональным языком, добавь измеримые критерии если возможно
4. ЦЕЛЕВАЯ АУДИТОРИЯ — кто пользователи, их роли, уровень, количество
5. ФУНКЦИОНАЛЬНЫЕ ТРЕБОВАНИЯ — пронумерованный список, каждый пункт развёрнуто
6. СЦЕНАРИИ ИСПОЛЬЗОВАНИЯ — пошагово: кто → что делает → что происходит → результат
7. ИНТЕГРАЦИИ — с какими системами, что именно передаётся, в каком направлении
8. ТРЕБОВАНИЯ К ОТЧЁТНОСТИ — если применимо
9. ОГРАНИЧЕНИЯ И ТРЕБОВАНИЯ — безопасность, производительность, юридические аспекты
10. РИСКИ И РЕКОМЕНДАЦИИ АНАЛИТИКА — на основе своего опыта опиши возможные риски и дай рекомендации. Это важнейший раздел! Примеры:
    - "Риск: при интеграции с 1С возможны задержки из-за устаревшей версии. Рекомендация: провести аудит версии 1С до начала разработки"
    - "Рекомендация: предусмотреть этап пилотного запуска на одном магазине перед масштабированием"
11. СРОКИ И ПРИОРИТЕТ
12. ПРИЛОЖЕНИЯ — упомяни все файлы/скриншоты что приложил пользователь
13. ОТКРЫТЫЕ ВОПРОСЫ — что требует дополнительного уточнения (если есть)

ВАЖНО для ТЗ:
- РАЗВОРАЧИВАЙ короткие ответы. "Нужна выгрузка" → подробно опиши какие данные, формат, фильтры, кто имеет доступ
- ПЕРЕФОРМУЛИРУЙ бытовой язык в профессиональный. "Чтоб не тормозило" → "Требование к производительности: время отклика системы не должно превышать 3 секунд при одновременной работе N пользователей"
- ДОБАВЛЯЙ РЕКОМЕНДАЦИИ на основе контекста Sulpak
- Каждый раздел должен быть содержательным, не формальным

═══ КОНТЕКСТ КОМПАНИИ ═══
Sulpak — крупнейший ритейлер электроники в Казахстане. Системы: 1С (ERP), сайт sulpak.kz, CRM, складской учёт, логистика доставки, корпоративный портал. Магазины по всему Казахстану.`;

// ===== STATE =====
const conversationHistory = [];
const uploadedFiles = [];
let pendingFiles = [];
let isProcessing = false;

const chat = document.getElementById('chat');
const inputArea = document.getElementById('inputArea');
const statusEl = document.getElementById('status');
const textInput = document.getElementById('textInput');
const btnSend = document.getElementById('btnSend');
const btnAttach = document.getElementById('btnAttach');
const fileInput = document.getElementById('fileInput');

function scrollDown(){setTimeout(()=>chat.scrollTop=chat.scrollHeight,60)}
function formatSize(b){if(b<1024)return b+' Б';if(b<1048576)return(b/1024).toFixed(1)+' КБ';return(b/1048576).toFixed(1)+' МБ'}
function isImageType(t){return t.startsWith('image/')}
function isPdfType(t){return t==='application/pdf'}
function getFileIcon(t){if(isImageType(t))return'🖼️';if(isPdfType(t))return'📄';if(t.includes('spreadsheet')||t.includes('excel')||t.includes('csv'))return'📊';if(t.includes('word')||t.includes('document'))return'📝';return'📁'}

function addBotMessage(html){
  const w=document.createElement('div');w.className='msg bot';
  const b=document.createElement('div');b.className='bubble bot';b.innerHTML=html;
  w.appendChild(b);chat.appendChild(w);scrollDown();
}
function addUserMessage(text){
  const w=document.createElement('div');w.className='msg user';
  const b=document.createElement('div');b.className='bubble user';b.textContent=text;
  w.appendChild(b);chat.appendChild(w);scrollDown();
}
function addFileMessage(file){
  const w=document.createElement('div');w.className='msg user';
  const b=document.createElement('div');b.className='bubble-file';
  if(file.isImage){const img=document.createElement('img');img.src='data:'+file.type+';base64,'+file.base64;img.onclick=()=>{const lb=document.createElement('div');lb.className='lightbox';lb.innerHTML=`<img src="${img.src}">`;lb.onclick=()=>lb.remove();document.body.appendChild(lb)};b.appendChild(img)}
  const info=document.createElement('div');info.className='bubble-file-info';
  info.innerHTML=`<span class="bubble-file-icon">${getFileIcon(file.type)}</span><div class="bubble-file-meta"><div class="bubble-file-name">${file.name}</div><div class="bubble-file-size">${formatSize(file.size)}</div></div>`;
  b.appendChild(info);w.appendChild(b);chat.appendChild(w);scrollDown();
}
function addErrorMessage(text){
  const w=document.createElement('div');w.className='msg bot';
  const d=document.createElement('div');d.className='error-msg';d.textContent=text;
  w.appendChild(d);chat.appendChild(w);scrollDown();
}
function showTyping(){
  isProcessing=true;statusEl.textContent='анализирует...';
  const w=document.createElement('div');w.className='msg bot';w.id='typing-indicator';
  w.innerHTML='<div class="bubble bot"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
  chat.appendChild(w);scrollDown();
}
function hideTyping(){
  isProcessing=false;statusEl.textContent='AI бизнес-аналитик';
  const el=document.getElementById('typing-indicator');if(el)el.remove();
}
function renderTZ(tzText){
  const r=document.createElement('div');r.className='tz-result';
  r.innerHTML=`<div class="tz-header"><div class="tz-header-dot"></div><span class="tz-header-text">Техническое задание сформировано</span></div><div class="tz-content" id="tzContent"></div><button class="btn-copy" id="btnCopy">📋 Скопировать ТЗ</button>`;
  chat.appendChild(r);
  document.getElementById('tzContent').textContent=tzText;
  document.getElementById('btnCopy').onclick=()=>{
    navigator.clipboard.writeText(tzText);
    const btn=document.getElementById('btnCopy');btn.textContent='✅ Скопировано!';btn.className='btn-copy copied';
    setTimeout(()=>{btn.textContent='📋 Скопировать ТЗ';btn.className='btn-copy'},2000);
  };
  scrollDown();
}
function formatBotText(text){
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/\n/g,'<br>');
}

// ===== FILES =====
btnAttach.onclick=()=>fileInput.click();
fileInput.onchange=(e)=>{
  Array.from(e.target.files).forEach(file=>{
    const reader=new FileReader();
    reader.onload=()=>{pendingFiles.push({name:file.name,size:file.size,type:file.type||'application/octet-stream',base64:reader.result.split(',')[1],isImage:isImageType(file.type)});renderPendingFiles()};
    reader.readAsDataURL(file);
  });
  fileInput.value='';
};
function renderPendingFiles(){
  let strip=document.getElementById('pendingStrip');
  if(!strip){strip=document.createElement('div');strip.className='pending-files';strip.id='pendingStrip';inputArea.insertBefore(strip,inputArea.querySelector('.input-row'))}
  strip.innerHTML='';
  pendingFiles.forEach((f,i)=>{
    const el=document.createElement('div');el.className='pending-file';
    el.innerHTML=(f.isImage?`<img src="data:${f.type};base64,${f.base64}">`:`<span class="pending-file-icon">${getFileIcon(f.type)}</span>`)+`<span class="pending-file-name">${f.name}</span><span class="pending-file-remove" data-i="${i}">×</span>`;
    strip.appendChild(el);
  });
  strip.querySelectorAll('.pending-file-remove').forEach(b=>b.onclick=(e)=>{pendingFiles.splice(+e.target.dataset.i,1);renderPendingFiles()});
  if(!pendingFiles.length&&strip)strip.remove();
  updateSendBtn();
}
function updateSendBtn(){btnSend.className=(textInput.value.trim()||pendingFiles.length)?'btn-send active':'btn-send'}
textInput.oninput=updateSendBtn;

function compressImage(base64,type){
  return new Promise(resolve=>{
    const img=new Image();
    img.onload=()=>{
      const MAX=1024;let w=img.width,h=img.height;
      if(w>MAX||h>MAX){if(w>h){h=Math.round(h*MAX/w);w=MAX}else{w=Math.round(w*MAX/h);h=MAX}}
      const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);
      resolve(c.toDataURL('image/jpeg',0.75).split(',')[1]);
    };
    img.onerror=()=>resolve(base64);
    img.src='data:'+type+';base64,'+base64;
  });
}

// ===== SEND =====
async function sendMessage(){
  const text=textInput.value.trim();
  if((!text&&!pendingFiles.length)||isProcessing)return;
  if(text)addUserMessage(text);
  textInput.value='';updateSendBtn();

  const files=[...pendingFiles];pendingFiles=[];
  const strip=document.getElementById('pendingStrip');if(strip)strip.remove();
  files.forEach(f=>{addFileMessage(f);uploadedFiles.push(f)});

  const userContent=[];
  for(const f of files.filter(f=>f.isImage)){
    const compressed=await compressImage(f.base64,f.type);
    userContent.push({type:"image",source:{type:"base64",media_type:"image/jpeg",data:compressed}});
    userContent.push({type:"text",text:`[Приложен скриншот: ${f.name}]`});
  }
  for(const f of files.filter(f=>isPdfType(f.type)&&f.size<4*1024*1024)){
    userContent.push({type:"document",source:{type:"base64",media_type:"application/pdf",data:f.base64}});
    userContent.push({type:"text",text:`[Приложен PDF: ${f.name}]`});
  }
  for(const f of files.filter(f=>!f.isImage&&!isPdfType(f.type))){
    try{const decoded=atob(f.base64).substring(0,5000);userContent.push({type:"text",text:`[Файл "${f.name}" (${f.type}):\n${decoded}]`})}
    catch{userContent.push({type:"text",text:`[Файл: ${f.name} (${formatSize(f.size)})]`})}
  }
  if(text)userContent.push({type:"text",text});
  if(!userContent.length)return;

  conversationHistory.push({role:"user",content:userContent.length===1&&userContent[0].type==="text"?userContent[0].text:userContent});

  showTyping();
  try{
    const res=await fetch(API_URL,{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,system:SYSTEM_PROMPT,messages:conversationHistory}),
    });
    const data=await res.json();
    hideTyping();
    if(data.error){addErrorMessage('Ошибка: '+(data.error.message||JSON.stringify(data.error)));conversationHistory.pop();return}
    const assistantText=data.content?.map(c=>c.type==="text"?c.text:"").filter(Boolean).join("\n")||"";
    if(!assistantText){addErrorMessage('Пустой ответ. Попробуйте ещё раз.');conversationHistory.pop();return}
    conversationHistory.push({role:"assistant",content:assistantText});

    const tzMatch=assistantText.match(/\[ТЗ_НАЧАЛО\]([\s\S]*?)\[ТЗ_КОНЕЦ\]/);
    if(tzMatch){
      const before=assistantText.split('[ТЗ_НАЧАЛО]')[0].trim();
      if(before)addBotMessage(formatBotText(before));
      renderTZ(tzMatch[1].trim());
      const after=assistantText.split('[ТЗ_КОНЕЦ]')[1]?.trim();
      if(after)addBotMessage(formatBotText(after));
    }else{addBotMessage(formatBotText(assistantText))}
  }catch(err){hideTyping();addErrorMessage('Ошибка соединения: '+err.message);conversationHistory.pop()}
}

btnSend.onclick=sendMessage;
textInput.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage()}};

// ===== INIT =====
setTimeout(async()=>{
  showTyping();
  try{
    const res=await fetch(API_URL,{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,system:SYSTEM_PROMPT,
        messages:[{role:"user",content:"[Система: пользователь только что открыл чат. Поприветствуй его и задай первый вопрос.]"}]}),
    });
    const data=await res.json();hideTyping();
    const text=data.content?.map(c=>c.type==="text"?c.text:"").filter(Boolean).join("")||"";
    if(text&&!data.error){
      conversationHistory.push({role:"user",content:"[Система: пользователь только что открыл чат. Поприветствуй его и задай первый вопрос.]"});
      conversationHistory.push({role:"assistant",content:text});
      addBotMessage(formatBotText(text));
    }else{addBotMessage(fallbackGreeting())}
  }catch{hideTyping();addBotMessage(fallbackGreeting())}
  textInput.focus();
},500);

function fallbackGreeting(){
  return 'Здравствуйте! Я — AI бизнес-аналитик Sulpak. Помогу сформировать Техническое Задание для IT-отдела.<br><br>Расскажите — <strong>как вас зовут</strong>, из какого вы <strong>подразделения</strong>, и <strong>кратко опишите задачу</strong>, с которой пришли?<br><br>📎 Можете прикрепить скриншоты или файлы — я их проанализирую.';
}
</script>
</body>
</html>
