// --- Canvas Setup ---
const spaceCanvas = document.getElementById('spaceCanvas');
const sCtx = spaceCanvas.getContext('2d');

const card = document.getElementById('card');
const layers = [document.getElementById('layer1'), document.getElementById('layer2'), document.getElementById('layer3')];

const confettiCanvas = document.getElementById('confettiCanvas');
const ctx = confettiCanvas.getContext('2d');

const cardStarsCanvas = document.getElementById('cardStarsCanvas');
const cardCtx = cardStarsCanvas.getContext('2d');

function random(min,max){ return Math.random()*(max-min)+min; }

// --- Responsive Resize ---
function resizeCanvases() {
    spaceCanvas.width = window.innerWidth;
    spaceCanvas.height = window.innerHeight;

    const rect = card.getBoundingClientRect();
    confettiCanvas.width = rect.width;
    confettiCanvas.height = rect.height;
    cardStarsCanvas.width = rect.width;
    cardStarsCanvas.height = rect.height;
}
window.addEventListener('resize', resizeCanvases);
resizeCanvases();

// --- Space Background ---
let stars=[], nebula=[];
function createStars(count=400){
    for(let i=0;i<count;i++){
        stars.push({ x:random(0,spaceCanvas.width), y:random(0,spaceCanvas.height), r:random(0.5,2), alpha:random(0.2,1), speed:random(0.05,0.2) });
    }
}
function createNebula(count=6){
    for(let i=0;i<count;i++){
        nebula.push({ x:random(0,spaceCanvas.width), y:random(0,spaceCanvas.height), radius:random(150,300), color:`rgba(${Math.floor(random(50,150))},${Math.floor(random(50,150))},255,0.1)` });
    }
}
function drawSpace(){
    sCtx.clearRect(0,0,spaceCanvas.width,spaceCanvas.height);
    nebula.forEach(n=>{
        const grad = sCtx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.radius);
        grad.addColorStop(0,n.color); grad.addColorStop(1,'rgba(0,0,0,0)');
        sCtx.fillStyle = grad;
        sCtx.fillRect(0,0,spaceCanvas.width,spaceCanvas.height);
    });
    stars.forEach(s=>{
        sCtx.beginPath();
        sCtx.arc(s.x,s.y,s.r,0,Math.PI*2);
        sCtx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        sCtx.fill();
        s.alpha += (Math.random()*0.02-0.01); if(s.alpha>1)s.alpha=1; if(s.alpha<0.1)s.alpha=0.1;
        s.y -= s.speed; if(s.y<0)s.y=spaceCanvas.height;
    });
    requestAnimationFrame(drawSpace);
}
createStars(); createNebula(); drawSpace();

// --- Floating Stars Around Card ---
let starsFloating=[];
function createStarsFloating(count=120){
    for(let i=0;i<count;i++){
        starsFloating.push({ angle: random(0,Math.PI*2), radius: random(60,100), speed: random(0.002,0.008), r: random(2,4), alpha: random(0.5,1), alphaChange: random(0.001,0.005), layer: Math.floor(random(0,3)) });
    }
}
function drawStarsFloating(){
    ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    const cx = confettiCanvas.width/2;
    const cy = confettiCanvas.height/2;
    starsFloating.forEach(s=>{
        const effectiveRadius = s.radius + s.layer*10;
        const x = cx + Math.cos(s.angle)*effectiveRadius;
        const z = Math.sin(s.angle)*effectiveRadius;
        const perspectiveY = cy - z*0.5;
        const scale = 1 - s.layer*0.15;

        ctx.beginPath();
        ctx.arc(x,perspectiveY,s.r*scale,0,Math.PI*2);
        ctx.fillStyle = `rgba(255,215,0,${s.alpha})`;
        ctx.fill();

        s.angle += s.speed;
        s.alpha += (Math.random()*s.alphaChange - s.alphaChange/2);
        if(s.alpha>1)s.alpha=1; if(s.alpha<0.3)s.alpha=0.3;
    });
    requestAnimationFrame(drawStarsFloating);
}
createStarsFloating(); drawStarsFloating();

// --- Inner Stars ---
let innerStars=[];
for(let i=0;i<60;i++){
    innerStars.push({ x:Math.random()*cardStarsCanvas.width, y:Math.random()*cardStarsCanvas.height, r:random(1,3), alpha:random(0.3,0.8), speed:random(0.05,0.2) });
}
function drawStarsFloating(){
    ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);

    const topText = document.querySelector('.card-top h1');
    const bottomText = document.querySelector('.card-bottom h2');

    const topRect = topText.getBoundingClientRect();
    const bottomRect = bottomText.getBoundingClientRect();
    const cardTop = card.getBoundingClientRect().top;

    // กึ่งกลางช่องว่าง
    const spaceTop = topRect.bottom - cardTop;
    const spaceBottom = bottomRect.top - cardTop;
    const cy = spaceTop + (spaceBottom - spaceTop)/2;
    const cx = confettiCanvas.width/2;

    // คำนวณ min/max radius ให้ดาวกระจายตัวกันกว้าง
    const radiusMin = 30; // ระยะใกล้ข้อความ
    const radiusMax = (spaceBottom - spaceTop)/2 - 5 + 40; // เพิ่ม 40px ให้กระจายออกไปมากขึ้น

    starsFloating.forEach(s=>{
        // กำหนด radius แบบสุ่มแต่ละดวงเพื่อกระจาย
        const radius = Math.min(Math.max(s.radius + s.layer*5, radiusMin), radiusMax);

        // ตำแหน่งวงกลมสมบูรณ์
        const x = cx + Math.cos(s.angle) * radius;
        const z = Math.sin(s.angle) * radius;
        const perspectiveY = cy - z*0.3;
        const scale = 1 - s.layer*0.15;

        ctx.beginPath();
        ctx.arc(x, perspectiveY, s.r*scale, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,215,0,${s.alpha})`;
        ctx.fill();

        // ความเร็วหมุน
        const speedFactor = window.innerWidth < 768 ? 0.002 : 0.004;
        s.angle += speedFactor * (s.layer + 1);

        s.alpha += (Math.random()*s.alphaChange - s.alphaChange/2);
        if(s.alpha>1) s.alpha=1;
        if(s.alpha<0.3) s.alpha=0.3;
    });

    requestAnimationFrame(drawStarsFloating);
}



drawInnerStars();

// --- 3D Card Interaction ---
let currentX=0, currentY=0;
function rotateCard(clientX, clientY){
    const cx = window.innerWidth/2;
    const cy = window.innerHeight/2;
    const rotateY = (clientX-cx)/cx*15;
    const rotateX = -(clientY-cy)/cy*15;
    currentX += (rotateX-currentX)*0.1;
    currentY += (rotateY-currentY)*0.1;
    card.style.transform = `rotateY(${currentY}deg) rotateX(${currentX}deg) translateZ(20px)`;
    layers.forEach((layer,i)=>{
        const factor = (i+1)/4;
        const offsetX = currentY*factor;
        const offsetY = currentX*factor;
        const zTranslate = -20*i;
        layer.style.transform = `rotateY(${offsetX}deg) rotateX(${offsetY}deg) translateZ(${zTranslate}px)`;
    });
}
document.addEventListener('mousemove', e => rotateCard(e.clientX,e.clientY));
document.addEventListener('touchmove', e => { rotateCard(e.touches[0].clientX,e.touches[0].clientY); });
