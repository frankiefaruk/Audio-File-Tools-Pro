// audioFileConverter.js
export class AudioFileConverter {
  constructor() {
    this.convertedFilenames = []; // Store converted filenames for copy/download
    this.init();
  }

  init() {
    this.bindEvents();
    this.processFiles();
  }

  /* Helper: Convert MIDI note to padded 3-digit string */
  midiToPadded(midi) {
    return String(midi).padStart(3, '0');
  }

  /* Helper: Extract note and octave from file base name */
  extractNoteFromFilename(filename) {
    // Look for pattern like `-A#4-`, `-F#5-`, `-C4-`, etc.
    const match = filename.match(/-([A-G][#b]?\d+)-/);
    return match ? match[1] : null;
  }

  /* Helper: Convert natural name to MIDI number */
  noteToMIDI(note) {
    const sharpNotes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    const flatNotes  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
    
    const match = note.match(/^([A-G][#b]?)(\d+)$/);
    if (!match) return null;
    
    const [, name, octaveStr] = match;
    const octave = parseInt(octaveStr, 10);
    
    let idx = sharpNotes.indexOf(name);
    if (idx === -1) idx = flatNotes.indexOf(name);
    if (idx === -1) return null;
    
    return (octave + 1) * 12 + idx; // MIDI 0 = C-1
  }

  /* Core conversion with optional MIDI prefix */
  processFilenames(lines, addMidi = false) {
    const groupedFiles = new Map();
    const result = [];

    lines.forEach(filename => {
      filename = filename.trim();
      if (!filename) return;

      // Remove extension
      const extMatch = filename.match(/\.(wav|aif|mp3|flac|aiff)$/i);
      const ext = extMatch ? extMatch[0] : '';
      let base = ext ? filename.slice(0, -ext.length) : filename;

      // Remove existing _RR suffix
      const rrMatch = base.match(/_RR\d+$/);
      let baseNoRR = rrMatch ? base.slice(0, -rrMatch[0].length) : base;

      // Determine sorting group
      const uniquePartMatch = baseNoRR.match(/-[A-Z0-9]+$/);
      let coreBase = baseNoRR;
      
      if (uniquePartMatch) {
        coreBase = baseNoRR.slice(0, -uniquePartMatch[0].length);
      }

      // Group
      if (!groupedFiles.has(coreBase)) groupedFiles.set(coreBase, []);
      groupedFiles.get(coreBase).push({ original: filename, coreBase, baseNoRR });
    });

    // Rebuild names
    groupedFiles.forEach(files => {
      files.sort((a, b) => a.original.localeCompare(b.original));
      files.forEach((file, index) => {
        let newName = `${file.coreBase}_RR${index + 1}`;

        // Optional: prepend MIDI
        if (addMidi) {
          const noteFound = this.extractNoteFromFilename(file.baseNoRR);
          if (noteFound) {
            const midi = this.noteToMIDI(noteFound);
            if (midi !== null) {
              newName = `${this.midiToPadded(midi)}_${newName}`;
            }
          }
        }
        result.push(newName);
      });
    });

    return result;
  }

  processFiles() {
    const input = document.getElementById('converterInput').value;
    const preview = document.getElementById('converterPreview');
    const fileCount = document.getElementById('converterFileCount');
    const addMidi = document.getElementById('addMidiNumber').checked;

    if (!input.trim()) {
      preview.innerHTML = '';
      fileCount.textContent = '0 files';
      this.hideConverterStatus();
      this.convertedFilenames = []; // Clear stored filenames
      return;
    }

    const lines = input.split('\n').filter(l => l.trim());
    const converted = this.processFilenames(lines, addMidi);
    this.convertedFilenames = converted; // Store the converted filenames

    if (converted.length === 0) {
      preview.innerHTML = '<div class="text-yellow-400 text-center py-8">⚠️ No valid audio files found</div>';
      fileCount.textContent = '0 files';
      return;
    }

    preview.innerHTML = converted.map(l =>
      `<div class="hover:bg-gray-800 px-2 py-1 rounded transition-colors">${l}</div>`
    ).join('');

    fileCount.textContent = `${converted.length} file${converted.length !== 1 ? 's' : ''}`;
    this.hideConverterStatus();
  }

  shownConverterStatus(message, type = 'success') {
    const status = document.getElementById('converterStatus');
    status.textContent = message;
    status.className = `status-message status-${type} fade-in`;
    status.classList.remove('hidden');
    setTimeout(() => this.hideConverterStatus(), 2000);
  }

  hideConverterStatus() {
    const status = document.getElementById('converterStatus');
    status.textContent = '';
    status.className = 'status-message fade-out';
    status.classList.add('hidden');
  }

  bindEvents() {
    // Input textarea
    document.getElementById('converterInput').addEventListener('input', () => this.processFiles());

    // Add Midi toggle
    document.getElementById('addMidiNumber').addEventListener('change', () => this.processFiles());

    // Copy
    document.getElementById('converterCopyButton').addEventListener('click', () => {
      const textToCopy = this.convertedFilenames.join('\n'); // Use the stored array
      if (!textToCopy) {
        this.shownConverterStatus('No content to copy', 'warning');
        return;
      }
      navigator.clipboard.writeText(textToCopy)
        .then(() => this.shownConverterStatus('✅ Copied!', 'success'))
        .catch(() => this.shownConverterStatus('❌ Failed to copy', 'warning'));
    });

    // Download
    document.getElementById('converterDownloadButton').addEventListener('click', () => {
      const textToDownload = this.convertedFilenames.join('\n'); // Use the stored array
      if (!textToDownload) {
        this.shownConverterStatus('No content to download', 'warning');
        return;
      }
      const blob = new Blob([textToDownload], { type: 'text/plain' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      document.body.appendChild(a);
      a.href     = url;
      a.download = 'converted-audio-files.txt';
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      this.shownConverterStatus('✅ Downloaded!', 'success');
    });
  }
}