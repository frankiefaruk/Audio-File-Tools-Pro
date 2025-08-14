// main.js
import { AudioFileCreator } from './audioFileCreator.js';
import { AudioFileConverter } from './audioFileConverter.js';

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new AudioFileCreator();
  new AudioFileConverter();
  
  // Tab manager
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.tab-content,.tab-button').forEach(el => el.classList.remove('active'));
      const tab = btn.dataset.tab;
      document.getElementById(tab).classList.add('active');
      btn.classList.add('active');
    };
  });
});