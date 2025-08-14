# Audio File Tools Pro

"Audio File Tools Pro" is a web application designed to simplify the creation and conversion of audio file names, particularly useful for musicians, sound designers, and developers working with sample libraries. It offers two main functionalities: **Name Creator** and **Name Converter**.

## Table of Contents

- [Features](#features)
- [Name Creator](#name-creator)
  - [Input Pattern](#input-pattern)
  - [Piano Keyboard](#piano-keyboard)
  - [Controls](#controls)
  - [Supported Input Formats](#supported-input-formats)
- [Name Converter](#name-converter)
  - [Input Area](#input-area)
  - [Controls](#controls-1)
- [How to Use](#how-to-use)

## Features

- **Intuitive Interface:** Easily switch between creation and conversion modes.
- **Note Range Generation:** Create sequential file names for musical notes within a specified range.
- **Interactive Piano Keyboard:** Visually select and deselect notes to include/exclude from generated lists.
- **Enharmonic Shift:** Toggle between sharp (#) and flat (♭) note notation.
- **Octave Transposition:** Shift the generated note range up or down by octaves.
- **Smart File Renaming:** Automatically remove existing `_RR` suffixes and reorganize sequences in imported file names.
- **MIDI Number Prefixing:** Optionally add 3-digit MIDI numbers to converted file names.
- **Copy & Download:** Quickly copy generated/converted names to clipboard or download as a text file.

## Name Creator

This tab helps you generate consistent file names for audio samples based on musical notes and instrument/sound details.

### Input Pattern

Enter your desired note range and instrument/sound name in the format:
`[StartNote]-[EndNote]-[InstrumentName]`

**Examples:**
- `C3-C4-Bass`
- `C#3-F4-Strings-Stac`

You can also use comma-separated or concatenated notes, though the range format is generally recommended for efficiency with many notes.

### Piano Keyboard

An interactive piano keyboard allows you to visually select or deselect individual notes (e.g., C, C#, D, D#).
- **Click a key:** Toggles its active/disabled state.
- **Active keys:** Will be included in the generated file names.
- **Disabled keys:** Will be excluded from the generated file names.

### Controls

- **Use Flat Notes (♭) Toggle:** Switch this on to generate note names using flats (e.g., Db, Eb) instead of sharps (C#, D#).
- **Transpose Buttons:**
  - `▼`: Decrease the octave of the generated notes by one.
  - `▲`: Increase the octave of the generated notes by one.
- **Copy Button:** Copies all generated file names to your clipboard.
- **Download Button:** Downloads all generated file names as a `.txt` file.

### Supported Input Formats

- `C3-C4-Bass-Pizz`: Standard range with dash
- `C3,D3,E3-MySound`: Comma-separated notes
- `C3C4D4E4-Instrument`: Concatenated notes
- `C#3-F4-Strings-Stac`: Sharps supported; toggle flats for Db/Eb/etc.

## Name Converter

This tab helps you clean up and reformat existing audio file names, especially those from various sample libraries.

### Input Area

Paste your audio file names here, one per line. The application automatically removes existing `_RR` (Round Robin) suffixes and reorganizes sequences.

**Example Input:**
76_Dist_Cra_0836-B6-V127-1JS5.wav
76_Dist_Cra_0836-B6-V127-2JS5.wav
77_Dist_Cra_0837-C7-V127-1AB2.wav

### Controls

- **Add Midi Number Toggle:** Optionally prefixes the converted file names with their corresponding 3-digit MIDI numbers.
- **Copy Button:** Copies all converted file names to your clipboard.
- **Download Button:** Downloads all converted file names as a `.txt` file.

## How to Use

1. Open the application and select the **Name Creator** or **Name Converter** tab based on your needs.
2. For **Name Creator**, input your note range and instrument name, select notes on the piano keyboard, and use the controls as needed.
3. For **Name Converter**, paste your audio file names, optionally toggle the MIDI number prefix, and then copy or download the converted names.
4. Utilize the copy and download features to integrate the generated or converted file names into your projects efficiently.

By following these steps and exploring the features of Audio File Tools Pro, you can streamline your audio file naming process, enhancing your productivity and organization in music production and sound design tasks. 