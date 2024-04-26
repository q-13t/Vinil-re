# Vinil-re

Is a recreation of [Groove Music](https://en.wikipedia.org/wiki/Groove_Music) with some additonal / removed features. It is a new attempt to recreate Groove Music after original [Vinil](https://github.com/q-13t/vinil). It is a React-based music player with Tauri integration.

## Getting Started

- Install npm packages `npm install`
- Build the app `npm run tauri build`
    (It should automatically detect your system and build the app for you)
- Run the app from folder  `src-tauri\target\release\Vinil-re.exe`

## Overview
### Audio Visualizator

https://github.com/q-13t/Vinil-re/assets/105020553/4ac7e0d0-b0f5-492f-996b-650bfc0ef7a9


* The music used for demonstration is  [Xplosn - Undercover](https://soundcloud.com/xplosn/undercover-free-dl?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing). All rights reserved.

* If no sound is playing navigate to [Audio Visualizer](https://youtu.be/LVJJR_IH5Mo) folder.

___
### Two layouts
>As List
>
https://github.com/q-13t/Vinil-re/assets/105020553/718dade2-4b45-4685-9591-1b14fe788142

As Grid

https://github.com/q-13t/Vinil-re/assets/105020553/0afb4704-cd9e-4572-bbdb-cfc5ee7708cb

### Fast searching and sorting

https://github.com/q-13t/Vinil-re/assets/105020553/dd27464a-7d8b-4438-823a-9b912b3fb4b3


### History and Play queue

https://github.com/q-13t/Vinil-re/assets/105020553/d93e1456-a910-4475-a3d1-abe4fe94e548

- Dynamic creation of history and current play queue
- Click on song to play it next

### Playlists

https://github.com/q-13t/Vinil-re/assets/105020553/f2bba983-6428-4ed2-92b9-7e6642bcd4d6

- Ease of creation / alteration
- Drag and drop support for song rearrangement 

* Note: All playlist names should be unique, otherwise newest playlist will override older.

### File System
#### Adding Folders

https://github.com/q-13t/Vinil-re/assets/105020553/7a27711b-44a6-460b-a827-fdfe16e81858

- Adding and removing folders is super easy

#### Active file watcher

https://github.com/q-13t/Vinil-re/assets/105020553/bf01ef32-1ef3-4119-afa0-ec403bc950ff

- Automatic detection of changes in musical files.
- Songs will be automatically added or removed from general playlist
- If any song is removed - songs in playlist will remain, but wouldn't be able to be played.

## Licensing
This project is licensed under the MIT License. See the LICENSE file for details.

## Any contributions and/or suggestions are welcomed
