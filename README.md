# Vinil-re

Is a recreation of [Groove Music](https://en.wikipedia.org/wiki/Groove_Music) with some additonal / removed features. It is a new attempt to recreate Groove Music after original [Vinil](https://github.com/q-13t/vinil). It is a React-based music player with Tauri integration.

## Getting Started

- Install npm packages `npm install`
- Build the app `npm run tauri build`
    (It should automatically detect your system and build the app for you)
- Run the app from folder  `src-tauri\target\release\Vinil-re.exe`

## Overview
### Audio Visualizator
<video controls   src="https://youtu.be/oeWEJs2I5DE" style="width: 100%; height: 100px" autoplay ></video>

* The music used for demonstration is  [Xplosn - Undercover](https://soundcloud.com/xplosn/undercover-free-dl?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing). All rights reserved.

* If no sound is playing navigate to [Audio Visualizer](https://youtu.be/LVJJR_IH5Mo) folder.

___
### Two layouts
<div style="display: flex; flex-direction: row; gap: 10px;">
<div style="width:50%; max-width: 50%;">
    <span style="font-size: 20px;">As List</span>
    <video controls   src="https://youtu.be/LVJJR_IH5Mo"  autoplay></video>
</div>
<div style="width:50%; max-width: 50%;">
    <span style="font-size: 20px;">As Grid</span>
    <video controls   src="https://youtu.be/P0gcTncj8Js" autoplay></video>
</div>
</div>

### Fast searching and sorting

<video controls src="https://youtu.be/7ziwlt2l1EU" style="width: 100%; height: 100%" autoplay ></video>

### History and Play queue

<video controls src="https://youtu.be/lSgcjzFJuUo" style="width: 100%; height: 100%" autoplay ></video>


- Dynamic creation of history and current play queue
- Click on song to play it next

### Playlists
<video controls src="https://youtu.be/BnFEm3ccPfE" style="width: 100%; height: 100%" autoplay ></video>

- Ease of creation / alteration
- Drag and drop support for song rearrangement 

* Note: All playlist names should be unique, otherwise newest playlist will override older.

### File System
#### Adding Folders
<video controls src="https://youtu.be/R2xJ3877Cg0" style="width: 100%; height: 100%" autoplay ></video>

- Adding and removing folders is super easy

#### Active file watcher
<video controls src="https://youtu.be/QAowrfH--F0" style="width: 100%; height: 100%" autoplay ></video>

- Automatic detection of changes in musical files.
- Songs will be automatically added or removed from general playlist
- If any song is removed - songs in playlist will remain, but wouldn't be able to be played.

## Licensing
This project is licensed under the MIT License. See the LICENSE file for details.

## Any contributions and/or suggestions are welcomed