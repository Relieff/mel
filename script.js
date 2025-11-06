const music = document.getElementById('music');
const playPauseBtn = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const loopBtn = document.getElementById('loop');
const volumeSlider = document.getElementById('volume');
const albumCover = document.querySelector('.album-cover');
const container = document.querySelector('.container');
const musicBar = document.querySelector('.music-bar');
const letters = document.querySelectorAll('.letter');

// Volume
music.volume = volumeSlider.value;

// Play/Pause
playPauseBtn.addEventListener('click', () => {
    if(music.paused){ 
        music.play(); 
        playPauseBtn.innerHTML='<i class="fa-solid fa-pause"></i>'; 
        albumCover.style.animationPlayState='running'; 
    } else { 
        music.pause(); 
        playPauseBtn.innerHTML='<i class="fa-solid fa-play"></i>'; 
        albumCover.style.animationPlayState='paused'; 
    }
});

// Barra de progresso
music.addEventListener('timeupdate', ()=>{ progress.value = (music.currentTime/music.duration)*100; });
progress.addEventListener('input', ()=>{ music.currentTime = (progress.value/100)*music.duration; });

// Volume slider
volumeSlider.addEventListener('input', ()=>{ music.volume = volumeSlider.value; });

// Loop
loopBtn.addEventListener('click', ()=>{ music.loop = !music.loop; loopBtn.style.color = music.loop ? "yellow" : "white"; });

// Autoplay
window.addEventListener('load', ()=>{
    music.play().then(()=>{
        playPauseBtn.innerHTML='<i class="fa-solid fa-pause"></i>';
        albumCover.style.animationPlayState='running';
    }).catch(()=>{ console.log("Autoplay bloqueado."); });
});

// Estrelas
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const stars = []; const numStars = 250;
function random(min,max){return Math.random()*(max-min)+min;}
function Star(){ 
    this.x=random(0,width); 
    this.y=random(0,height); 
    this.radius=random(1,3); 
    this.alpha=random(0.3,1); 
    this.alphaChange=random(0.002,0.008); 
    this.speedY=random(0.1,0.5); 
    this.type=Math.random()<0.6?'blink':'fall'; 
}
Star.prototype.draw=function(){ ctx.beginPath(); ctx.arc(this.x,this.y,this.radius,0,Math.PI*2); ctx.fillStyle=`rgba(255,255,150,${this.alpha})`; ctx.fill();}
Star.prototype.update=function(){ 
    if(this.type==='blink'){ this.alpha+=this.alphaChange;if(this.alpha<=0.3||this.alpha>=1)this.alphaChange*=-1; } 
    else{ this.y+=this.speedY; this.alpha+=this.alphaChange;if(this.alpha<=0.3||this.alpha>=1)this.alphaChange*=-1; if(this.y>height)this.y=0; } 
}
function initStars(){ for(let i=0;i<numStars;i++) stars.push(new Star()); }
function animateStars(){ ctx.clearRect(0,0,width,height); stars.forEach(s=>{ s.update(); s.draw(); }); requestAnimationFrame(animateStars); }
function resizeCanvas(){ width=canvas.width=window.innerWidth; height=canvas.height=window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
initStars(); animateStars(); resizeCanvas();

// Scroll - primeira seção + cartas
window.addEventListener('scroll', () => {
    letters.forEach(letter => {
        const rect = letter.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Ponto em que o fade começa (quando 70% do capítulo já passou da tela)
        const startFade = windowHeight * 0.2;  
        const endFade = -rect.height * 0.3;    

        if (rect.top < startFade && rect.bottom > endFade) {
            // Opacidade decresce suavemente conforme o topo sobe
            const opacity = Math.max(0, Math.min(1, (rect.bottom - endFade) / (windowHeight - endFade)));
            letter.style.opacity = opacity;
            letter.style.transform = `scale(${0.95 + opacity * 0.05})`;
        } else if (rect.bottom <= endFade) {
            // Já passou totalmente
            letter.style.opacity = 0;
        } else {
            // Totalmente visível
            letter.style.opacity = 1;
            letter.style.transform = "scale(1)";
        }
    });
});

const openModalBtn = document.getElementById('open-modal');
const finalModal = document.getElementById('final-modal');
const closeModalBtn = document.getElementById('close-modal');

// Mostrar botão quando chegar no penúltimo capítulo
const chapters = document.querySelectorAll('.letter'); // todos os capítulos

window.addEventListener('scroll', () => {
    const penultimate = chapters[chapters.length - 2]; // penúltimo capítulo
    const scrollY = window.scrollY + window.innerHeight;

    if(scrollY > penultimate.offsetTop + 100){
        openModalBtn.classList.add('show');
    } else {
        openModalBtn.classList.remove('show');
    }
});

// Abrir modal
openModalBtn.addEventListener('click', () => {
    finalModal.style.display = 'flex';
});

// Fechar modal
closeModalBtn.addEventListener('click', () => {
    finalModal.style.display = 'none';
});

// Fechar modal clicando fora do conteúdo
finalModal.addEventListener('click', (e) => {
    if(e.target === finalModal){
        finalModal.style.display = 'none';
    }
});

// Ao clicar na seta, rola suavemente até a parte 2
document.querySelector('.go-next-section').addEventListener('click', () => {
    document.getElementById('parte2').scrollIntoView({ behavior: 'smooth' });
});

let isTransitionAllowed = false;

window.addEventListener('scroll', () => {
    const parte1Height = document.getElementById('parte1').offsetHeight;
    
    if (!isTransitionAllowed && window.scrollY > parte1Height - window.innerHeight) {
        window.scrollTo(0, parte1Height - window.innerHeight);
    }
});

const goNextBtn = document.querySelector('.go-next-section');
goNextBtn.addEventListener('click', () => {
    isTransitionAllowed = true;
    document.getElementById('parte2').scrollIntoView({ behavior: 'smooth' });
});


parte2.addEventListener('mouseleave', () => {
    document.body.style.overflowY = 'auto'; // libera scroll novamente se quiser
});

document.querySelector('.go-next-section').addEventListener('click', () => {
    const parte2Top = parte2.offsetTop;

    let start = window.scrollY;
    let distance = parte2Top - start;
    let duration = 1500; // 1.5s, aumenta para mais lento
    let startTime = null;

    function scrollStep(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = timestamp - startTime;
        let percent = Math.min(progress / duration, 1);
        window.scrollTo(0, start + distance * percent);
        if (percent < 1) requestAnimationFrame(scrollStep);
    }

    requestAnimationFrame(scrollStep);
});

document.querySelector('.go-next-section').addEventListener('click', () => {
    const parte2Top = parte2.offsetTop;
    const start = window.scrollY;
    const distance = parte2Top - start;
    const duration = 1500; // duração da rolagem em ms
    let startTime = null;

    function scrollStep(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percent = Math.min(progress / duration, 1);

        // Scroll suave
        window.scrollTo(0, start + distance * percent);

        // Background vertical (preto -> rosa)
        const black = [0,0,0];
        const pink = [255,105,180]; // #ff69b4
        const color = black.map((c,i) => Math.round(c + (pink[i] - c) * percent));
        document.body.style.background = `rgb(${color[0]},${color[1]},${color[2]})`;

        if (percent < 1) {
            requestAnimationFrame(scrollStep);
        } else {
            // Depois de chegar na parte2, aplica degrade horizontal
            parte2.style.background = "linear-gradient(to right, #ff69b4, #000)";
        }
    }

    requestAnimationFrame(scrollStep);
});

window.addEventListener('scroll', () => {
    const parte2Top = parte2.offsetTop;
    const scrollY = window.scrollY + window.innerHeight / 2; // centro da tela

    stars.forEach(star => {
        if(scrollY >= parte2Top){
            // Quando estiver na segunda parte, aumenta o brilho
            star.currentAlpha = Math.min(star.alpha * 1.5, 1);
        } else {
            // Volta ao brilho normal
            star.currentAlpha = star.alpha;
        }
    });
});

// No draw da estrela, substitua:
Star.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    // usa currentAlpha em vez de alpha
    ctx.fillStyle = `rgba(255,255,150,${this.currentAlpha || this.alpha})`;
    ctx.fill();
}