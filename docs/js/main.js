// --- Video sync logic ---
const videoTop = document.getElementById('videoTop');
const videoBottom = document.getElementById('videoBottom');
function togglePlay() {
  if (videoTop.paused) {
    videoTop.play();
    videoBottom.play();
  } else {
    videoTop.pause();
    videoBottom.pause();
  }
}

// --- Before/After slider ---
const sliderHandle = document.getElementById('sliderHandle');
const topWrapper = document.getElementById('topWrapper');
const sliderContainer = document.getElementById('sliderContainer');

let dragging = false;

sliderHandle.addEventListener('mousedown', () => dragging = true);
window.addEventListener('mouseup', () => dragging = false);
window.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const rect = sliderContainer.getBoundingClientRect();
  let x = e.clientX - rect.left;
  x = Math.max(0, Math.min(rect.width, x));
  const percent = (x / rect.width) * 100;
  topWrapper.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
  sliderHandle.style.left = `${percent}%`;
});

// Set initial position
window.addEventListener('load', () => {
  topWrapper.style.clipPath = 'inset(0 50% 0 0)';
  sliderHandle.style.left = '50%';
});

// --- Chart.js for RD curve ---
fetch('assets/rd_data.json')
  .then(r => r.json())
  .then(data => {
    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.ours.size,
        datasets: [
          {
            label: 'PSNR • Ours',
            data: data.ours.psnr,
            borderColor: 'green',
            tension: 0.3
          },
          {
            label: 'PSNR • H.264',
            data: data.h264.psnr,
            borderColor: 'blue',
            tension: 0.3
          },
          {
            label: 'PSNR • H.265',
            data: data.h265.psnr,
            borderColor: 'orange',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Rate–Distortion: PSNR vs. Size'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'File Size (KB)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'PSNR (dB)'
            }
          }
        }
      }
    });
  });