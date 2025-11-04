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
