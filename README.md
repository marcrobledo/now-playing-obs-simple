# Now Playing OBS Simple
A simple OBS browser-source overlay that shows your currently playing [foobar2000](https://www.foobar2000.org) song and album cover in a stylish way.

<!-- https://raw.githubusercontent.com////path/to/video.mp4 -->

## Requirements
- [OBS](https://obsproject.com/)
- [foobar2000](https://www.foobar2000.org)
- [foo_nowplaying2 component](https://github.com/foxx1337/foo_nowplaying2)
- add a `folder.jpg` that represents the album covers in each album folder

## Installation
1. Download from [Releases](https://github.com/marcrobledo/now-playing-obs-simple/releases) and unzip anywhere
1. Install [foo_nowplaying2](https://github.com/foxx1337/foo_nowplaying2) component in foobar2000
2. Set up `foo_nowplaying2` in foobar2000:
   - File: path to `now-playing-obs-simple/now_playing.json`
   - Events: check *On New Track*, *On Pause* and *On Stop*, uncheck *On Every Second*
   - Code:
     ```
{$crlf()
"status":
$if(%ispaused%,"paused",
$if(%isplaying%,"playing", "stopped")
),$crlf()
"path": "$replace($replace($directory_path(%path%),\,\\),",\")",$crlf()
"artist": "$replace($replace(%artist%,\,\\),",\")",$crlf()
"title": "$replace($replace(%title%,\,\\),",\")",$crlf()
"album": "$replace($replace(%album%,\,\\),",\")",$crlf()
"date": "%date%"$crlf()
}
```
3. Add a Browser source to your OBS pointing to `now-playing-obs-simple/now_playing.html`
   - set its height to 512 and its width to around 1720 (change it at your needs)

## Customization
- `style.css` contains the stylesheet if you want to make any changes
- `custom_images` contains data if you want to specify custom cover background positions or custom LP discs images for certain albums