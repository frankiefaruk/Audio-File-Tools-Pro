// audioFileCreator.js
export class AudioFileCreator {
  constructor() {
    this.SHARP_NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    this.FLAT_NOTES = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
    this.octaveOffset = 0;
    this.disabledNotes = new Set();
    this.generatedFilenames = []; // Store generated filenames for copy/download
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupPianoKeys();
    this.generatePreview();
  }

  noteToMIDI(note) {
    if (!note || typeof note !== 'string') return null;
    
    const match = note.match(/([A-G][#b]?)(\d+)/);
    if (!match) return null;
    
    const [, name, octave] = match;
    let noteIndex = this.SHARP_NOTES.indexOf(name);
    if (noteIndex === -1) {
      noteIndex = this.FLAT_NOTES.indexOf(name);
    }
    if (noteIndex === -1) return null;
    
    return parseInt(octave) * 12 + noteIndex + 12; // Adjusted for MIDI 0 = C-1
  }

  midiToNote(midi, useFlats = false) {
    const octave = Math.floor(midi / 12) - 1; // Adjusted for MIDI 0 = C-1
    const noteIndex = midi % 12;
    const noteName = useFlats ? this.FLAT_NOTES[noteIndex] : this.SHARP_NOTES[noteIndex];
    return `${noteName}${octave}`;
  }

  setupPianoKeys() {
    // Click toggles disable state
    document.querySelectorAll('.piano .key').forEach(key => {
      key.addEventListener('click', (e) => {
        const note = e.currentTarget.getAttribute('data-note');
        const isDisabled = e.currentTarget.classList.contains('disabled');
        
        if (isDisabled) {
          this.disabledNotes.delete(note);
          e.currentTarget.classList.remove('disabled');
          e.currentTarget.setAttribute('aria-pressed', 'true');
        } else {
          this.disabledNotes.add(note);
          e.currentTarget.classList.add('disabled');
          e.currentTarget.setAttribute('aria-pressed', 'false');
        }
        
        this.generatePreview();
      });
    });
  }

  parseInput(input) {
    if (!input.trim()) return { notes: [], baseName: '' };

    // Standard range format
    const rangeMatch = input.trim().match(/^([A-G][#b]?\d+)\s*-\s*([A-G][#b]?\d+)\s*-\s*(.+)$/i);
    if (rangeMatch) {
      const [, startNote, endNote, baseName] = rangeMatch;
      return this.generateRange(startNote.toUpperCase(), endNote.toUpperCase(), baseName.trim());
    }

    return { notes: [], baseName: '' };
  }

  generateRange(startNote, endNote, baseName) {
    const startMidi = this.noteToMIDI(startNote);
    const endMidi = this.noteToMIDI(endNote);

    if (startMidi === null || endMidi === null || startMidi > endMidi) {
      return { notes: [], baseName: '' };
    }

    const notes = [];
    for (let midi = startMidi; midi <= endMidi; midi++) {
      const note = this.midiToNote(midi);
      notes.push(note);
    }

    return { notes, baseName };
  }

  generatePreview() {
    const input = document.getElementById('inputField').value;
    const preview = document.getElementById('preview');
    const noteCount = document.getElementById('noteCount');

    if (!input.trim()) {
      preview.innerHTML = ''; // Changed this line to be blank
      noteCount.textContent = '0 notes';
      this.generatedFilenames = []; // Clear stored filenames
      return;
    }

    const { notes, baseName } = this.parseInput(input);

    if (notes.length === 0) {
      preview.innerHTML = '<div class="text-red-400 text-center py-8">Enter a range like C3-C4-Bass</div>';
      noteCount.textContent = '0 notes';
      this.generatedFilenames = []; // Clear stored filenames
      return;
    }

    const useFlats = document.getElementById('enharmonicShift').checked;
    const offset = this.octaveOffset * 12;
    const output = [];

    notes.forEach(note => {
      const originalMidi = this.noteToMIDI(note);
      if (originalMidi !== null) {
        const transposedMidi = originalMidi + offset;
        const transposedNote = this.midiToNote(transposedMidi, useFlats);
        const noteName = transposedNote.replace(/\d+$/, '');
        
        // Check if the base note name (e.g., "C", "C#") is disabled
        const baseNotePartMatch = note.match(/^[A-G][#b]?/);
        const baseNotePart = baseNotePartMatch ? baseNotePartMatch[0] : null;

        if (baseNotePart && !this.disabledNotes.has(baseNotePart)) {
          const paddedMidi = String(transposedMidi).padStart(3, '0');
          const fileName = baseName 
            ? `${paddedMidi}-${transposedNote}-${baseName}`
            : `${paddedMidi}-${transposedNote}`;
          output.push(fileName);
        }
      }
    });

    this.generatedFilenames = output; // Store the generated filenames

    const disabledCount = notes.length - output.length;
    preview.innerHTML = output.length > 0 
      ? output.map(line => `<div class="hover:bg-gray-800 px-2 py-1 rounded transition-colors">${line}</div>`).join('')
      : '<div class="text-gray-400 text-center py-8">All notes disabled for this range</div>';
    
    noteCount.textContent = `${output.length} notes${disabledCount > 0 ? ` (${disabledCount} disabled)` : ''}`;
  }

  bindEvents() {
    // Input field
    document.getElementById('inputField').addEventListener('input', () => {
      this.generatePreview();
    });

    // Enharmonic shift toggle
    document.getElementById('enharmonicShift').addEventListener('change', () => {
      this.generatePreview();
    });

    // Transpose buttons
    document.getElementById('octaveUp').addEventListener('click', () => {
      this.octaveOffset++;
      document.getElementById('transposeValue').textContent = this.octaveOffset > 0 ? `+${this.octaveOffset}` : this.octaveOffset.toString();
      this.generatePreview();
    });

    document.getElementById('octaveDown').addEventListener('click', () => {
      this.octaveOffset--;
      document.getElementById('transposeValue').textContent = this.octaveOffset > 0 ? `+${this.octaveOffset}` : this.octaveOffset.toString();
      this.generatePreview();
    });

    // Copy and download buttons
    document.getElementById('copyButton').addEventListener('click', () => {
      const textToCopy = this.generatedFilenames.join('\n'); // Use the stored array
      if (textToCopy.length > 0) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          document.getElementById('status').innerHTML = '✅ Copied to clipboard!';
          document.getElementById('status').className = 'status-message status-success fade-in';
          setTimeout(() => {
            document.getElementById('status').classList.add('hidden');
          }, 2000);
        }).catch(() => {
          document.getElementById('status').innerHTML = '❌ Failed to copy!';
          document.getElementById('status').className = 'status-message status-warning fade-in';
          setTimeout(() => {
            document.getElementById('status').classList.add('hidden');
          }, 2000);
        });
      }
    });

    document.getElementById('downloadButton').addEventListener('click', () => {
      const textToDownload = this.generatedFilenames.join('\n'); // Use the stored array
      if (textToDownload.length > 0) {
        const blob = new Blob([textToDownload], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement('a'), { href: url, download: 'audio-files.txt' });
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
        document.getElementById('status').innerHTML = '✅ Downloaded!';
        document.getElementById('status').className = 'status-message status-success fade-in';
        setTimeout(() => {
          document.getElementById('status').classList.add('hidden');
        }, 2000);
      }
    });
  }
}