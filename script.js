/*
* Script logic for Now Playing OBS Simple
* By Marc Robledo https://www.marcrobledo.com
* Sourcecode: https://github.com/marcrobledo/now-playing-obs-simple
* License:
*
* MIT License
* 
* Copyright (c) 2020-2026 Marc Robledo
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/


/* CONSTANTS */
const ASSETS_PATH='assets/';
const DEFAULT_DISC=ASSETS_PATH + 'discs/lp.png';
const COVER_FALLBACK=ASSETS_PATH + 'cover_default.jpg';
const JSON_FILE='./now_playing.json';
const REFRESH_INTERVAL=5000; //ms
const CHANGE_DISC_TRANSITION_DURATION=3000; //ms, must match your transitions duration in style.css










const currentSong={
	"status":"stopped",
	"path": "",
	"artist": "",
	"title": "",
	"album": "",
	"date": ""
};

const refreshImages=function(json){
	const realImagePath=(json.path? '/' + json.path.replace(/\\/g, '/').replace(/\/$/, '') + '/folder.jpg' : COVER_FALLBACK);


	if(document.getElementById('song-cover'))
		document.getElementById('song-cover').src=realImagePath; //compatible with OBS

	if(document.getElementById('wrapper-background')){
		document.getElementById('wrapper-background').style.backgroundImage='url("'+realImagePath+'")'; //compatible with OBS

		const customBackgroundPosition=Array.isArray(BACKGROUND_POSITIONS) && BACKGROUND_POSITIONS.find((specialPosition) => specialPosition.album.test(json.album));
		if(
			customBackgroundPosition &&
			(customBackgroundPosition.position === 'bottom' || customBackgroundPosition.position === 'top' || /^\d+%$/.test(customBackgroundPosition.position))
		){
			document.getElementById('wrapper-background').style.backgroundPosition='center '+customBackgroundPosition.position;
		}else{
			document.getElementById('wrapper-background').style.backgroundPosition='center';
		}
	}

	if(document.getElementById('song-disc')){
		const customDiscImage=SPECIAL_DISCS && SPECIAL_DISCS.find((specialDisc) => specialDisc.artist?.test(json.artist) || specialDisc.album?.test(json.album));
		document.getElementById('song-disc').src=customDiscImage? ASSETS_PATH + 'discs/' + customDiscImage.image+ '.png' : DEFAULT_DISC;
	}
}
const refreshTexts=function(json){
	if(document.getElementById('song-artist'))
		document.getElementById('song-artist').innerText=json.artist;

	if(document.getElementById('song-album'))
		document.getElementById('song-album').innerHTML=json.album
			.replace(/ \(?(CD1|Disc 1)\)?/i, ' <small>Disc 1</small>')
			.replace(/ \(?(CD2|Disc 2)\)?/i, ' <small>Disc 2</small>')
			.replace(/ \(?(CD3|Disc 3)\)?/i, ' <small>Disc 3</small>')
			.replace(/\(?(original soundtrack|ost)\)?/i, '<small>Original Soundtrack</small>')
			.replace(/(- )?\(?(original sound version)\)?/i, '<small>Original Sound Version</small>')
			.replace(/ UST/, ' <small>Original Sound Version</small>')
			.replace(/ \((.*?)\)/, ' <small>$1</small>');

	if(document.getElementById('song-title'))
		document.getElementById('song-title').innerText=json.title;
}
const refreshStatus=function(json){
	if(document.getElementById('container-status'))
		document.getElementById('container-status').className=json.status;
}






const xhr=new XMLHttpRequest();
xhr.onreadystatechange=function(){
	if(this.readyState===4 && (this.status===0 || this.status===200)){
		const response=JSON.parse(this.responseText);

		const albumChanged = currentSong.album !== response.album;
		const songChanged = currentSong.title !== response.title;
		const statusChanged = currentSong.status !== response.status;
		const isPlaying = response.status==='playing';
		const isPaused = response.status==='paused';
		const mustShow = isPlaying || isPaused;
		const wasHidden = currentSong.status!=='playing' && currentSong.status!=='paused';

		if(mustShow){
			document.getElementById('wrapper').className='show';
			document.getElementById('wrapper-background').className=!albumChanged || wasHidden? 'show' : '';
			document.getElementById('container-cover').className=!albumChanged || wasHidden? 'show' : '';
			document.getElementById('container-info').className=!albumChanged || wasHidden? 'show' : '';
			document.getElementById('song-disc').className=isPlaying && !albumChanged? 'spinning' : '';

			if(wasHidden){
				refreshImages(response);
				refreshTexts(response);	
				readJSON(CHANGE_DISC_TRANSITION_DURATION);

			}else if(albumChanged){
				readJSON(function(){
					refreshImages(currentSong);
					refreshTexts(currentSong);
					document.getElementById('container-cover').className='show';
					document.getElementById('container-info').className='show';
					document.getElementById('song-disc').className=isPlaying? 'spinning' : '';
				}, CHANGE_DISC_TRANSITION_DURATION);

			}else{
				refreshTexts(response);
				readJSON(REFRESH_INTERVAL);
			}
				
		}else{
			document.getElementById('wrapper').className=''
			document.getElementById('wrapper-background').className=''
			document.getElementById('container-cover').className=''
			document.getElementById('container-info').className=''
			document.getElementById('song-disc').className='';

			readJSON(wasHidden? REFRESH_INTERVAL : CHANGE_DISC_TRANSITION_DURATION);
		}

		refreshStatus(response);

		currentSong.status=response.status;
		currentSong.path=response.path;
		currentSong.artist=response.artist;
		currentSong.album=response.album;
		currentSong.title=response.title;
		currentSong.date=response.date;
	}
};

const readJSON=function(onBefore, wait){
	if(typeof onBefore==='function' && typeof wait==='number'){
		window.setTimeout(function(){
			onBefore();
			readJSON();
		}, wait);
	}else if(typeof onBefore==='number'){
		window.setTimeout(readJSON, onBefore);
	}else{
		xhr.open('GET', JSON_FILE, true);
		xhr.setRequestHeader('Accept', 'application/json');
		xhr.send();
	}
}



window.addEventListener('load', function(){
	document.getElementById('song-cover').addEventListener('error', function(){
		this.src=COVER_FALLBACK;
		document.getElementById('wrapper-background').style.backgroundImage='none';
	}, false);

	readJSON();
}, false);