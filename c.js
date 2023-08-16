// // Variables
// let cocossd; // object detector
// let liveStatus;
// let objects = [];

// let video = document.querySelector("#video");
// let canvas = document.querySelector("#canvas"); 
// let ctx;
// let statusText = document.querySelector("#status");

// const WIDTH = 480;
// const HEIGHT = 360;

// const startBtn = document.querySelector("#startCam");
// const stopBtn = document.querySelector("#stopCam");
// const resultsText = document.querySelector("#results");

// // Initialize Camera & Model
// async function make() {
//     // turn video into live webcam (hidden)
//     statusText.innerHTML = "Setting up video stream... ⚙️";
//     await createVideoStream();

//     // create objectDetector
//     statusText.innerHTML = "Setting up ML model... ⚙️";
//     cocossd = await ml5.objectDetector('cocossd', startDetecting);

//     // create temporary canvas (CTX) for drawing
//     statusText.innerHTML = "Setting up canvas... ⚙️";
//     setCanvasContext(WIDTH, HEIGHT);
//     ctx = canvas.getContext('2d');
// }

// // Start & Stop Cameras
// const startCam = () => {
//     liveStatus = true;
//     statusText.innerHTML = "Starting... ⚙️";
//     startBtn.classList.add("disabled");
//     make();
// };

// const stopCam = () => {
//     statusText.innerHTML = "Stopping... ⚙️";
//     let stream = video.srcObject;
//     let tracks = stream.getTracks();

//     tracks.forEach((track) => track.stop());
//     video.removeAttribute("srcObject");

//     // Change button status
//     liveStatus = false;
//     statusText.innerHTML = "Offline ⚫";
//     resultsText.innerHTML = "😴";
//     startBtn.classList.remove("disabled");
//     stopBtn.classList.add("disabled");
// }

// // Object Detection Workflow
// async function startDetecting() { // callback for ml5.objectDetector
//     console.log("Model is ready.");
//     statusText.innerHTML = "Live 🔴";
//     stopBtn.classList.remove("disabled");
    
//     liveStatus = true;
//     while(liveStatus) {
//         await detect();
//     }
// }

// async function detect() {
//     await cocossd.detect(video, (err, results) => {
//         if (err) {
//             console.log(err);
//             return;
//         }

//         // update objects (used by draw) to hold results
//         objects = results;

//         draw();

//         if (results.length > 0) {
//             let text = objects[0].label;
//             for (let i = 0; i < objects.length; i += 1) {
//                 text += ", a ";
//                 text += objects[i].label;
//             }
//             resultsText.innerHTML = "😀 I see a " + text + "!";
//         } else {
//             resultsText.innerHTML = "😐 I don't see nuthing.";
//         }
//     });
// }


// // Re-draw the Temporary CTX
// // (Take snippets from real 'video' & add green boxes)
// async function draw() {
//     // clear screen
//     ctx.fillStyle = "black";
//     ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
//     ctx.drawImage(video, 0, 0);
//     for (let i = 0; i < objects.length; i += 1) {
        
//         ctx.font = "24px Arial";
//         ctx.fillStyle = "green";
//         ctx.fillText(objects[i].label, objects[i].x + 4, objects[i].y - 5);
        
//         ctx.beginPath();
//         ctx.rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
//         ctx.strokeStyle = "green";
//         ctx.stroke();
//         ctx.closePath();
//     }
// }

// // Helper Functions
// async function createVideoStream() {
//     // validate video element (access granted by user?)
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     video.srcObject = stream;
//     video.play();
// }

// function setCanvasContext(w, h) {
//     canvas.width = w;
//     canvas.height = h;
// }

// function pause() {
//     return new Promise(resolve => setTimeout(() => resolve(), 20));
// }

// WORKING 

// initialize video
// const video = document.querySelector("#video");
let cocossd; // object detector
let status;
let objects = [];
let video;
let canvas, ctx;
const width = 480;
const height = 360;

const startBtn = document.querySelector("#startCam");
const stopBtn = document.querySelector("#stopCam");

async function make() {
    // get video
    video = await h_getVideo();

    // get objectDetector
    cocossd = await ml5.objectDetector('cocossd', startDetecting);

    canvas = h_createCanvas(width, height);
    ctx = canvas.getContext('2d');
}

const startCam = () => {
    make();
    startBtn.classList.add("disabled");
    stopBtn.classList.remove("disabled");
};

async function startDetecting() { // callback for ml5.objectDetector
    console.log("Model is ready.");

    liveStatus = true;
    while(liveStatus) {
        await pause()
        detect();
    }
}

function pause() {
    return new Promise(resolve => setTimeout(() => resolve(), 10));
}

function detect() {
    // console.log("detect called:", count);
    cocossd.detect(video, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }

        // update objects (used by draw) to hold results
        objects = results;

        if (results) {
            draw();
        }
    });
}

function draw() {
    // clear screen
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    ctx.drawImage(video, 0, 0);
    for (let i = 0; i < objects.length; i += 1) {

        ctx.font = "16px Arial";
        ctx.fillStyle = "green";
        ctx.fillText(objects[i].label, objects[i].x + 4, objects[i].y + 16);

        ctx.beginPath();
        ctx.rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
        ctx.strokeStyle = "green"
        ctx.stroke();
        ctx.closePath();
    }
}

// Helper Functions
async function h_getVideo() {
    // const video = document.querySelector("#video");

    const videoElement = document.createElement('video');
    videoElement.setAttribute("style", "display: none;"); 
    videoElement.width = width;
    videoElement.height = height;
    document.body.appendChild(videoElement);

    // validate video element (access granted by user?)
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    videoElement.play();

    return videoElement;
}

function h_createCanvas(w, h) {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    document.body.appendChild(canvas);
    return canvas;
}









const stopCam = () => {
    let stream = video.srcObject;
    let tracks = stream.getTracks();

    tracks.forEach((track) => track.stop());
    video.removeAttribute("srcObject");

    // Change button status
    startBtn.classList.remove("disabled");
    stopBtn.classList.add("disabled");
}

