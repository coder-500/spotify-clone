let songs
let currentAlbum


let lastPlayingData = {
    lastPlayingAlbum: 'data1',
    lastPlayingSong: 'data2'
}
let retrievedData

const cardContainer = document.querySelector('.card-container')
const card = document.querySelectorAll('.card')

cardContainer.addEventListener('mouseover', e => {
    const existCard = e.target.closest(".card")
    if (existCard) {
        existCard.querySelector('.play').classList.add('play-trigger')
    }
})
cardContainer.addEventListener('mouseout', e => {
    const existCard = e.target.closest(".card")
    if (existCard) {
        existCard.querySelector('.play').classList.remove('play-trigger')
    }
})


let currentAudio = new Audio()




// Display albums name, description, image dynamically
const displayAlbum = async () => {

    const data = await fetch(`/public/songs`)
    const response = await data.text()

    let div = document.createElement('div')
    div.innerHTML = response
    let anchors = div.getElementsByTagName('a')


    let albumName
    let allAlbums = []

    let anchorArr = Array.from(anchors)
    for (const ele of anchorArr) {
        if (ele.href.includes('/songs/')) {
            albumName = ele.href
            allAlbums.push(albumName.split('/').slice(-2)[0])

            //Get Metadata
            const infoData = await fetch(`${albumName}/info.json`)
            const infoResponse = await infoData.json()

            cardContainer.innerHTML += `<div data-album="${albumName.split('/').slice(-2)[0]}" class="card rounded">
            <div class="card-img">
                <img src="/public/songs/${infoResponse.album}/cover.jpeg" alt="playlist-img"
                    class="rounded pl-img">

                    <button title="play-button" type="button"
                    class="play first-song-play flex item-center justify-center pointer"><img src="../assets/play.svg"
                        alt="play-icon" class="card-play-icon"></button>
            </div>
                <div class="txt">
                    <h2 class="playlist-name">${infoResponse.heading}</h2>
                    <p class="desc">${infoResponse.description}</p>
                </div>
                
            </div>`
        }
    }

    return allAlbums

}

let coverImage

//Retrieve music from folder
const getMusic = async (album) => {
    currentAlbum = album
    const data = await fetch(`/public/songs/${album}`)
    const response = await data.text()
    let div = document.createElement('div')
    div.innerHTML = response
    let as = div.getElementsByTagName('a')
    let songs = []


    for (let i = 0; i < as.length; i++) {
        const ele = as[i];
        if (ele.href.endsWith('.mp3')) {
            songs.push(ele.href)

        }
        if (ele.href.endsWith('.jpeg')) {
            coverImage = ele.href
        }
    }

    return songs

}



// Load songs from diffrent albums

let currentSongIndex = 0 // a variable to store the current song index
let currentAlbumLoaded

const loadSongs = async (album) => {
    songs = await getMusic(`${album}`)

    currentAlbumLoaded = album

    //Add Audio card in sidebar
    document.querySelector('.audio-card-container').innerHTML = " "
    for (const song of songs) {
        addAudioCard(song, musicImg)
    }

    //Dynamically adding album image in audio card

    const currentlyPlayingSongInfo =
        `<div class="album-img">
                <img src="${coverImage}" alt="album cover"></img>
         </div>
         <h2>${decodeURI(album.split('/').splice(-1)[0])}</h2>`

    document.querySelector('.album-playing').innerHTML = " "
    document.querySelector('.album-playing').innerHTML = currentlyPlayingSongInfo

}

if (document.body.clientWidth >= 500) {

    document.querySelector('.collection').insertAdjacentHTML('beforebegin',
        `<div class="currently-playing-album flex item-center justify-space-btw bg-grey">
    <div class="album-playing flex item-center g-2"></div>
</div>`)
}
else {
    document.querySelector('.collection').insertAdjacentHTML('afterbegin',
        `<div class="currently-playing-album flex item-center justify-space-btw bg-grey">
<div class="album-playing flex item-center g-2"></div>
</div>`)
}


// Retrieve the song name in readable format
const songNameFormatter = (songs = undefined) => {
    let songName1, songName, song, artist

    if (songs == undefined) {
        songName1 = currentAudio.src.split(`/`)[currentAudio.src.split(`/`).length - 1]
        songName = decodeURI(songName1).split('-')
        song = songName.slice(0, -1).join(' ')
        artist = songName[songName.length - 1].replace('.mp3', ' ')
    }
    else {
        songName1 = songs.split(`/`)[songs.split(`/`).length - 1]
        songName = decodeURI(songName1).split('-')
        song = songName.slice(0, -1).join(' ')
        artist = songName[songName.length - 1].replace('.mp3', ' ')
    }

    return { song, artist }
}

const musicImg = "../assets/music.svg"

// Add audio in the library section
const addAudioCard = (songs, img = musicImg) => {
    let { song, artist } = songNameFormatter(songs)

    let audioCard = `
    <li class="audio-card flex item-center justify-space-btw rounded pointer">
    <div class="songs flex item-center g-2">
        <img src="${img}" alt="Cover-image">
        <div class="song-info">
            <h3>${song}</h3>
            <p>${artist}</p>
        </div>
    </div>
    <div class="playing-gif"> 
    </div>

    
    
</li>`

    document.querySelector('.audio-card-container').innerHTML += audioCard



}



const play = document.getElementById('play')
const prev = document.getElementById('prev')
const next = document.getElementById('next')
const sidebarPlay = document.querySelector('.sidebar-play-button>img')
let check = false

//Toggle the play/pause
const togglePlay = async (clickedCard = undefined) => {

    handleSongInfo()
    // playingGif(clickedCard)
    if (currentAudio.paused) {
        await currentAudio.play()
        play.src = '../assets/pause.svg'
        play.parentElement.title = 'Pause'
        sidebarPlay.src = '../assets/pause.svg'
        sidebarPlay.parentElement.title = 'Pause'
        check = true
    }
    else {
        currentAudio.pause()
        play.src = '../assets/play.svg'
        play.parentElement.title = 'Play'
        sidebarPlay.src = '../assets/play.svg'
        sidebarPlay.parentElement.title = 'Play'
        check = false
    }


}


//toggle play gif

// TODO: Fix it so that the GIF works consistently
const playingGif = async (clickedCard) => {
    if (!check) {
        // Array.from(document.querySelector('.audio-card-container').children).forEach(ele => {
        //     ele.lastElementChild.innerHTML = ' '
        // })
        let songIndex = songs.indexOf(lastPlayingData.lastPlayingSong)
        console.log(songIndex);
        clickedCard.lastElementChild.innerHTML = '<img src="../assets/playing.gif" alt="playing icon">'

        // console.log(currentSongIndex)
        // console.log(Array.from(document.querySelector('.audio-card-container').children)[0]);
    }
    else {
        Array.from(document.querySelector('.audio-card-container').children)[currentSongIndex].lastElementChild.innerHTML = ' '
    }

}

const previousSong = () => {
    let index = songs.indexOf(currentAudio.src)
    if (index > 0) {
        currentAudio.src = songs[index - 1]
        togglePlay()
    }
    else {
        currentAudio.src = songs[songs.length - 1]
        togglePlay()
    }
}

const nextSong = () => {
    let index = songs.indexOf(currentAudio.src)
    if (index < songs.length - 1) {
        currentAudio.src = songs[index + 1]
        togglePlay()
    }
    else {
        currentAudio.src = songs[0]
        togglePlay()
    }
}


const seekCircle = document.querySelector('.seek-circle')
const seekBar = document.querySelector('.seek')

let sInfoP = document.createElement('p')
sInfoP.classList.add('sliding-header')

const handleSongInfo = (img = musicImg) => {

    //Loading last played song and album from localstorage
    lastPlayingData.lastPlayingAlbum = currentAlbumLoaded
    lastPlayingData.lastPlayingSong = currentAudio.src
    localStorage.setItem("lastData", JSON.stringify(lastPlayingData))

    sInfoP.remove()

    //Update time
    currentAudio.addEventListener('timeupdate', () => {

        if (currentAudio.currentTime == currentAudio.duration) {
            play.src = '../assets/play.svg'
            play.parentElement.title = 'Play'
            currentAudio.currentTime = 0
            nextSong()
        }


        document.querySelector('.progress').innerHTML = secondsToMinSec(currentAudio.currentTime)
        document.querySelector('.duration').innerHTML = secondsToMinSec(currentAudio.duration)

        seekCircle.style.left = `${(currentAudio.currentTime / currentAudio.duration) * 100}%`
        seekBar.style.width = `${(currentAudio.currentTime / currentAudio.duration) * 100}%`

    })



    // set image
    const songPlaying = document.querySelector('.song-playing').children
    songPlaying[0].firstElementChild.src = img

    //Display song info in progress bar
    let { song, artist } = songNameFormatter()
    songPlaying[1].firstElementChild.innerHTML = song
    songPlaying[1].lastElementChild.innerHTML = artist


    // Slide song name and artist

    sInfoP.innerHTML = `${song} - ${artist}`
    if (document.body.clientWidth <= 1325) {
        document.querySelector('.sName').style.display = "none"
        document.querySelector('.sArtist').style.display = "none"

        document.querySelector('.playbar-song-info').style.width = `${8}rem`
        document.querySelector('.playbar-song-info').prepend(sInfoP)
    }
    window.addEventListener('resize', () => {
        if (document.body.clientWidth <= 1325) {
            document.querySelector('.sName').style.display = "none"
            document.querySelector('.sArtist').style.display = "none"

            document.querySelector('.playbar-song-info').style.width = `${8}rem`
            document.querySelector('.playbar-song-info').prepend(sInfoP)
        }
        if (document.body.clientWidth >= 1325) {
            sInfoP.remove()
            document.querySelector('.sName').style.display = "block"
            document.querySelector('.sArtist').style.display = "block"
        }
    })

}


const volHandler = (sliderVal) => {
    currentAudio.volume = sliderVal
    if (sliderVal >= 0.70) {
        document.querySelector('.volume-button>button>img').src = "../assets/volume.svg"
    }
    else if (sliderVal >= 0.35 && sliderVal < 0.70) {
        document.querySelector('.volume-button>button>img').src = "../assets/volume2.svg"
    }
    else if (sliderVal > 0 && sliderVal < 0.35) {
        document.querySelector('.volume-button>button>img').src = "../assets/volume3.svg"
    }
    else {
        document.querySelector('.volume-button>button>img').src = "../assets/volume4.svg"
    }
}

const main = async () => {

    const albums = await displayAlbum()
    await loadSongs(albums[0])

    //default audio and album
    if (localStorage.getItem("lastData")) {
        retrievedData = JSON.parse(localStorage.getItem("lastData"))
        loadSongs(retrievedData.lastPlayingAlbum)
        currentAudio.src = retrievedData.lastPlayingSong
    }
    else {
        currentAudio.src = songs[0]

        lastPlayingData.lastPlayingAlbum = albums[0]
        lastPlayingData.lastPlayingSong = currentAudio.src

        localStorage.setItem("lastData", JSON.stringify(lastPlayingData))
    }
    handleSongInfo()

    // Load songs from each album
    Array.from(document.getElementsByClassName('card')).forEach(ele => {
        ele.addEventListener('click', async (e) => {
            await loadSongs(e.currentTarget.dataset.album)
            document.querySelector('.left').style.transform = `translateX(${0}%)`
            document.querySelector('.cross').style.opacity = 1
        })
    })

    //Play first song of the album on click album button
    document.querySelectorAll('.first-song-play').forEach((ele) => {
        ele.addEventListener('click', (e) => {
            // if (!check) {
            currentAudio.src = songs[0]
            togglePlay()
            // }
            // else {
            //     togglePlay()
            // }
        })

    })

    {
        document.querySelector('.sidebar-play-button').addEventListener('click', (e) => {
            if (!check) {
                currentAudio.src = songs[0]
                togglePlay()
            }
            else {
                togglePlay()
            }
        })
    }


    // Play Audio from audio card
    document.querySelector('.audio-card-container').addEventListener('click', e => {
        if (e.target.closest('.audio-card')) {
            const clickedAudioCard = e.target.closest('.audio-card'); // Get the closest audio-card element
            const songIndex = Array.from(clickedAudioCard.parentNode.children).indexOf(clickedAudioCard); // Get the song index
            currentSongIndex = songIndex;
            currentAudio.src = songs[songIndex];
            // playingGif()

            togglePlay(clickedAudioCard);
        }
    })



    // Toggle play/pause
    play.addEventListener('click', () => {
        togglePlay()

    })

    // Previous song

    prev.addEventListener('click', () => {
        previousSong()
    })

    // Next song
    next.addEventListener('click', () => {
        nextSong()
    })



    // Seek bar 

    const seekBarContainer = document.querySelector('.seek-bar-container');

    // Add a touchstart event listener to initialize the seekbar
    seekBarContainer.addEventListener('touchstart', e => {
        // Prevent the default behavior of scrolling the page
        e.preventDefault();
        // Get the left and right boundaries of the seekbar
        const left = e.currentTarget.getBoundingClientRect().left;
        const right = e.currentTarget.getBoundingClientRect().right;
        // Get the x coordinate of the touch point
        const x = Math.min(Math.max(e.touches[0].clientX, left), right);
        // Calculate the percentage of the seekbar
        const percent = ((x - left) / e.currentTarget.getBoundingClientRect().width) * 100;
        // Set the current time and the seekbar styles
        currentAudio.currentTime = `${(percent / 100) * currentAudio.duration}`;
        seekCircle.style.left = `${percent}%`;
        seekBar.style.width = `${percent}%`;
    });

    // Add a touchmove event listener to update the seekbar
    seekBarContainer.addEventListener('touchmove', e => {
        // Prevent the default behavior of scrolling the page
        e.preventDefault();
        // Get the left and right boundaries of the seekbar
        const left = e.currentTarget.getBoundingClientRect().left;
        const right = e.currentTarget.getBoundingClientRect().right;
        // Get the x coordinate of the touch point
        const x = Math.min(Math.max(e.touches[0].clientX, left), right);
        // Calculate the percentage of the seekbar
        const percent = ((x - left) / e.currentTarget.getBoundingClientRect().width) * 100;
        // Set the current time and the seekbar styles
        currentAudio.currentTime = `${(percent / 100) * currentAudio.duration}`;
        seekCircle.style.left = `${percent}%`;
        seekBar.style.width = `${percent}%`;
    });




    seekBarContainer.addEventListener('mousemove', e => {

        if (e.buttons === 1) {
            const left = e.currentTarget.getBoundingClientRect().left
            const right = e.currentTarget.getBoundingClientRect().right
            const x = Math.min(Math.max(e.clientX, left), right);
            const percent = ((x - left) / e.currentTarget.getBoundingClientRect().width) * 100
            currentAudio.currentTime = `${(percent / 100) * currentAudio.duration}`;
            seekCircle.style.left = `${percent}%`
            seekBar.style.width = `${percent}%`

        }



    })


    // Toggle Menu
    window.addEventListener('resize', () => {
        if (document.body.clientWidth > 1200) {
            document.querySelector('.left').style.transform = `translateX(${0}%)`
        }
    })

    document.querySelector('.hamburger').addEventListener('click', (e) => {
        e.currentTarget.style.opacity = 0
        document.querySelector('.left').style.transform = `translateX(${0}%)`
        document.querySelector('.cross').style.opacity = 1
    })

    document.querySelector('.cross').addEventListener('click', e => {
        e.currentTarget.style.opacity = 0
        document.querySelector('.left').style.transform = `translateX(${-100}%)`
        document.querySelector('.hamburger').style.opacity = 1
    })

    // Reimagined time/duration

    let div = document.createElement("div")
    div.classList.add("new-time")
    div.innerHTML = "<- ->/<- ->"

    if (document.body.clientWidth <= 700) {
        document.querySelector('.progress-bar').append(div)
        currentAudio.addEventListener('timeupdate', () => {
            div.innerHTML = secondsToMinSec(currentAudio.currentTime) + '/' + secondsToMinSec(currentAudio.duration)
        })

        cardContainer.addEventListener('mouseover', e => {
            const existCard = e.target.closest(".card")
            if (existCard) {
                existCard.querySelector('.play').classList.remove('play-trigger')
            }
        })
    }
    window.addEventListener('resize', () => {
        if (document.body.clientWidth <= 700) {
            document.querySelector('.progress-bar').append(div)
            currentAudio.addEventListener('timeupdate', () => {
                div.innerHTML = secondsToMinSec(currentAudio.currentTime) + '/' + secondsToMinSec(currentAudio.duration)
            })



            cardContainer.addEventListener('mouseover', e => {
                const existCard = e.target.closest(".card")
                if (existCard) {
                    existCard.querySelector('.play').classList.remove('play-trigger')
                }
            })
        }
        if (document.body.clientWidth >= 700) {
            div.remove()
        }
    })



    //Volume Handler
    const vol = document.querySelector('#vol')
    let sliderVal = parseInt(vol.value) / 100
    document.querySelector('#vol').addEventListener('change', e => {
        sliderVal = parseInt(vol.value) / 100
        volHandler(sliderVal)
    })

    document.querySelector('.vol-control-btn').addEventListener('click', e => {
        if (sliderVal > 0) {

            sliderVal = 0
            vol.value = 0
            volHandler(sliderVal)
        }

        else {

            sliderVal = 1
            vol.value = 100
            volHandler(sliderVal)
        }
    })





}
main()




function secondsToMinSec(seconds) {
    // check if the input is a valid number
    if (isNaN(seconds)) {
        return "<- ->";
    }
    // calculate the minutes and seconds
    let minutes = Math.floor(seconds / 60);
    let secondsRemainder = Math.floor(seconds % 60)
    // pad the seconds with a leading zero if needed
    let secondsString = secondsRemainder < 10 ? "0" + secondsRemainder : secondsRemainder;
    // return the formatted string
    return minutes + ":" + secondsString;
}
