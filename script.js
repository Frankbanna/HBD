// ----------- Space Background -----------
const spaceCanvas = document.getElementById('spaceCanvas');
const sCtx = spaceCanvas.getContext('2d');
spaceCanvas.width = window.innerWidth;
spaceCanvas.height = window.innerHeight;

let stars = [];
let nebula = [];

function random(min,max){ return Math.random()*(max-min)+min; }

function createStars(count=400){
    for(let i=0;i<count;i++){
        stars.push({
            x: Math.random()*spaceCanvas.width,
            y: Math.random()*spaceCanvas.height,
            r: random(0.5,2),
            alpha: Math.random(),
            speed: random(0.05,0.2)
        });
    }
}

function createNebula(count=6){
    for(let i=0;i<count;i++){
        nebula.push({
            x: random(0,spaceCanvas.width),
            y: random(0,spaceCanvas.height),
            radius: random(150,300),
            color: `rgba(${Math.floor(random(50,150))}, ${Math.floor(random(50,150))}, 255, 0.1)`
        });
    }
}

function drawSpace(){
    sCtx.clearRect(0,0,spaceCanvas.width,spaceCanvas.height);

    nebula.forEach(n=>{
        let gradient = sCtx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.radius);
        gradient.addColorStop(0,n.color);
        gradient.addColorStop(1,'rgba(0,0,0,0)');
        sCtx.fillStyle = gradient;
        sCtx.fillRect(0,0,spaceCanvas.width, spaceCanvas.height);
    });

    stars.forEach(s=>{
        sCtx.beginPath();
        sCtx.arc(s.x,s.y,s.r,0,Math.PI*2);
        sCtx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        sCtx.fill();

        s.alpha += (Math.random()*0.02 - 0.01);
        if(s.alpha<0.1)s.alpha=0.1;
        if(s.alpha>1)s.alpha=1;

        s.y -= s.speed;
        if(s.y<0)s.y=spaceCanvas.height;
    });

    requestAnimationFrame(drawSpace);
}

createStars();
createNebula();
drawSpace();

// ----------- ดาวทอง 3D โคจรรอบการ์ด -----------
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let starsFloating = [];

function createStarsFloating(count=120){
    for(let i=0;i<count;i++){
        starsFloating.push({
            angle: random(0, Math.PI*2),
            radius: random(60, 200),
            speed: random(0.002, 0.008),
            r: random(2,4),
            alpha: random(0.5,1),
            alphaChange: random(0.001,0.005),
            layer: Math.floor(random(0,3))
        });
    }
}

function drawStarsFloating(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    const cardRect = document.getElementById('card').getBoundingClientRect();
    const cx = cardRect.left + cardRect.width/2;
    const cy = cardRect.top + cardRect.height/2;

    starsFloating.forEach(s=>{
        let offsetZ = s.layer * 10; 
        const x = cx + Math.cos(s.angle) * s.radius;
        const y = cy + Math.sin(s.angle) * s.radius - offsetZ;

        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,215,0,${s.alpha})`;
        ctx.fill();

        s.angle += s.speed;
        s.alpha += (Math.random()*s.alphaChange - s.alphaChange/2);
        if(s.alpha>1) s.alpha=1;
        if(s.alpha<0.3) s.alpha=0.3;
    });

    requestAnimationFrame(drawStarsFloating);
}

createStarsFloating();
drawStarsFloating();

// ----------- Card 3D multiple layers -----------
const card = document.getElementById('card');
const layers = [
    document.getElementById('layer1'),
    document.getElementById('layer2'),
    document.getElementById('layer3')
];

document.addEventListener('mousemove',(e)=>{
    const cx = window.innerWidth/2;
    const cy = window.innerHeight/2;
    const rotateY = (e.clientX-cx)/cx*15;
    const rotateX = -(e.clientY-cy)/cy*15;

    card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(20px)`;

    layers.forEach((layer,i)=>{
        const factor = (i+1)/4;
        const offsetX = rotateY*factor;
        const offsetY = rotateX*factor;
        const zTranslate = -20*i;
        layer.style.transform = `rotateY(${offsetX}deg) rotateX(${offsetY}deg) translateZ(${zTranslate}px)`;
    });
});

// ----------- ดาวเล็กภายในการ์ด -----------
const cardStarsCanvas = document.getElementById('cardStarsCanvas');
const cardCtx = cardStarsCanvas.getContext('2d');
cardStarsCanvas.width = card.offsetWidth;
cardStarsCanvas.height = card.offsetHeight;

let innerStars = [];
for(let i=0;i<60;i++){
    innerStars.push({
        x: Math.random()*cardStarsCanvas.width,
        y: Math.random()*cardStarsCanvas.height,
        r: Math.random()*2 + 1,
        alpha: Math.random()*0.5 + 0.3,
        speed: Math.random()*0.2 + 0.05
    });
}

function drawInnerStars(){
    cardCtx.clearRect(0,0,cardStarsCanvas.width, cardStarsCanvas.height);
    innerStars.forEach(s=>{
        cardCtx.beginPath();
        cardCtx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        cardCtx.fillStyle = `rgba(255,255,200,${s.alpha})`;
        cardCtx.fill();

        s.alpha += (Math.random()*0.02 - 0.01);
        if(s.alpha<0.2) s.alpha=0.2;
        if(s.alpha>0.8) s.alpha=0.8;

        s.y += s.speed;
        if(s.y > cardStarsCanvas.height) s.y = 0;
    });
    requestAnimationFrame(drawInnerStars);
}

drawInnerStars();
