// 1) Video Slider Logic
const clipper = document.getElementById('clipper');
const handle  = document.getElementById('handle');
const container = document.getElementById('videoSlider');

let dragging = false;
handle.addEventListener('mousedown', _=> dragging = true);
document.addEventListener('mouseup',   _=> dragging = false);
document.addEventListener('mousemove', e => {
  if(!dragging) return;
  const rect = container.getBoundingClientRect();
  let x = e.clientX - rect.left;
  x = Math.max(0, Math.min(rect.width, x));
  const pct = x / rect.width * 100;
  clipper.style.width = pct + '%';
  handle.style.left  = `calc(${pct}% - 1px)`;
});
// Sync play/pause
const vidTop    = document.getElementById('vidTop');
const vidBottom = document.getElementById('vidBottom');
function togglePlay(){
  if(vidTop.paused) { vidTop.play(); vidBottom.play(); }
  else              { vidTop.pause(); vidBottom.pause(); }
}

// 2) RD Curves with Chart.js
fetch('assets/rd_data.json')
  .then(r=>r.json())
  .then(data=>{
    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.ours.size,
        datasets: [
          {
            label: 'PSNR • Ours', data: data.ours.psnr, fill:false
          },
          {
            label: 'PSNR • H.264', data: data.h264.psnr, fill:false
          },
          {
            label: 'PSNR • H.265', data: data.h265.psnr, fill:false
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display:true, text:'File Size (KB)' } },
          y: { title: { display:true, text:'PSNR (dB)'    } }
        },
        plugins: {
          title: { display:true, text:'Rate–Distortion: PSNR vs. Size' },
          tooltip: { mode:'index', intersect:false }
        }
      }
    });
  });