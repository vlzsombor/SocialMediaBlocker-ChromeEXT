const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const meditation_duration_in_sec = 6 * 60 + 5;
const meditation_timeout_duration = 1 * 60 * 60;

const readLocalStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function (result) {
      resolve(result[key]);
    });
  });
};
var timeInterval

const yourFunction = async () => {
  let last_meditation_epoch = await readLocalStorage("last_meditation_epoch");

  if (
    last_meditation_epoch != null &&
    Math.floor(Date.now() - last_meditation_epoch) / 1000 <
      meditation_timeout_duration
  ) {
    console.log("Less than 2 hours have passed. you dont have to meditate");
    console.log(
      "Last meditation epoch " +
        last_meditation_epoch.toString() +
        " date:" +
        new Date(last_meditation_epoch).toString()
    );
    console.log(
      "Next meditation date:" +
        new Date(
          last_meditation_epoch + meditation_timeout_duration * 1000
        ).toString()
    );

    return;
  }

  console.log("Execution: ")
  console.log(new Date())

  var block_until = await readLocalStorage("block_until");

  if (block_until == null) {
    console.log("Block until is being assigned:")
    var block_until = Date.now() + meditation_duration_in_sec * 1000;
    chrome.storage.local.set({ block_until: block_until });
  }
  console.log("Block until " + new Date(block_until) + " Epoch " + block_until.toString())

  document.head.innerHTML = generateSTYLES();
  document.body.innerHTML = generateHTML("all in");

  document.getElementById("skip-button").addEventListener("click", skip);
  document.getElementById("refresh-button").addEventListener("click", refresh);

  await new Promise((resolve) => {
    countdownTimer(block_until - Date.now());

    timeInterval = setInterval(() => {
      if (document.getElementById("demo") == null) {
        clearInterval(timeInterval);
        resolve();
      }

      var distance = block_until - Date.now();

      countdownTimer(distance);
      // If the count down is over, write some text

      if (distance < 0) {
        clearInterval(timeInterval);
        resolve();
      }
    }, 1000);
  });
  console.log("Finished")

  chrome.storage.local.set({ last_meditation_epoch: Date.now() }).then(() => {
    console.log("Value is set");
  });
  chrome.storage.local.remove("block_until");
  return;
};
async function main() {
  await yourFunction();
}

async function waitUntil(condition) {
  return await new Promise((resolve) => {
    const interval = setInterval(() => {
      if (condition) {
        resolve("foo");
        clearInterval(interval);
      }
    }, 1000);
  });
}
function skip(){
  location.reload();
  console.log("skip")
  clearInterval(timeInterval);
  chrome.storage.local.set({ last_meditation_epoch: Date.now() }).then(() => {
    console.log("Value is set");
  });
  chrome.storage.local.remove("block_until");
}
function refresh(){
  location.reload();
  console.log("refresh")
}
function countdownTimer(distance) {
  if (distance < 0) {
    //document.getElementById("demo").innerHTML = "EXPIRED";
    return;
  }

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Output the result in an element with id="demo"
  document.getElementById("demo").innerHTML =
    days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
}

main();

const generateHTML = (pageName) => {
  return `

   <div id="clouds">
      <div class="cloud x1"></div>
      <div class="cloud x1_5"></div>
      <div class="cloud x2"></div>
      <div class="cloud x3"></div>
      <div class="cloud x4"></div>
      <div class="cloud x5"></div>
  </div>
  <div class='c'>

      <div class='_1'>Two hours passed since the last meditation.</div>
      <div class='_1'>Time to meditate:</div>

      <div id="demo" class='_404'/>
      <hr>
      <div class='_2'>STUDYING > ${pageName}</div>
        <hr>
      <br>

  </div>


      <div><iframe width="560" height="315" 
      src="https://www.youtube.com/embed/MCgTDLtxJzQ"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen></iframe></div>
     
     
     
     <h1>
      <button id="refresh-button" href="#" onClick="window.location.reload();" class="btn btn-info btn-lg" />
        <span class="glyphicon glyphicon-refresh"></span> Refresh
    </h1>
    <h1>
    <button id="skip-button" href="#" class="btn btn-info btn-lg" />
      <span class="glyphicon glyphicon-refresh"></span> Skip for now
    </h1>
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
   `;
};
const generateSTYLES = () => {
  return `
  
  
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
  
  <style>@import url(https://fonts.googleapis.com/css?family=opensans:500);

  p {
    text-align: center;
    font-size: 60px;
    margin-top: 0px;
  }

  body {
    background: #33cc99;
    color: #fff;
    font-family: "Open Sans", sans-serif;
    max-height: 700px;
    overflow: hidden;
  }
  .c {
    text-align: center;
    display: block;
    position: relative;
    width: 80%;
    margin: 100px auto;
  }
  ._404 {
    color: black;

    font-size: 220px;
    position: relative;
    display: inline-block;
    z-index: 2;
    height: 250px;
    letter-spacing: 15px;
  }
  ._1 {
    color: black;

    text-align: center;
    display: block;
    position: relative;
    letter-spacing: 12px;
    font-size: 4em;
    line-height: 80%;
  }
  ._2 {
    text-align: center;
    display: block;
    position: relative;
    font-size: 20px;
  }
  .text {
    font-size: 70px;
    text-align: center;
    position: relative;
    display: inline-block;
    margin: 19px 0px 0px 0px;
    /* top: 256.301px; */
    z-index: 3;
    width: 100%;
    line-height: 1.2em;
    display: inline-block;
  }
  
 
  .right {
    float: right;
    width: 60%;
  }
  
  hr {
    padding: 0;
    border: none;
    border-top: 5px solid #fff;
    color: #fff;
    text-align: center;
    margin: 0px auto;
    width: 420px;
    height: 10px;
    z-index: -10;
  }
  
  hr:after {
    display: inline-block;
    position: relative;
    top: -0.75em;
    font-size: 2em;
    padding: 0 0.2em;
    background: #33cc99;
  }
  
  .cloud {
    width: 350px;
    height: 120px;
  
    background: #fff;
    background: linear-gradient(top, #fff 100%);
    background: -webkit-linear-gradient(top, #fff 100%);
    background: -moz-linear-gradient(top, #fff 100%);
    background: -ms-linear-gradient(top, #fff 100%);
    background: -o-linear-gradient(top, #fff 100%);
  
    border-radius: 100px;
    -webkit-border-radius: 100px;
    -moz-border-radius: 100px;
  
    position: absolute;
    margin: 120px auto 20px;
    z-index: -1;
    transition: ease 1s;
  }
  
  .cloud:after,
  .cloud:before {
    content: "";
    position: absolute;
    background: #fff;
    z-index: -1;
  }
  
  .cloud:after {
    width: 100px;
    height: 100px;
    top: -50px;
    left: 50px;
  
    border-radius: 100px;
    -webkit-border-radius: 100px;
    -moz-border-radius: 100px;
  }
  
  .cloud:before {
    width: 180px;
    height: 180px;
    top: -90px;
    right: 50px;
  
    border-radius: 200px;
    -webkit-border-radius: 200px;
    -moz-border-radius: 200px;
  }
  
  .x1 {
    top: -50px;
    left: 100px;
    -webkit-transform: scale(0.3);
    -moz-transform: scale(0.3);
    transform: scale(0.3);
    opacity: 0.9;
    -webkit-animation: moveclouds 15s linear infinite;
    -moz-animation: moveclouds 15s linear infinite;
    -o-animation: moveclouds 15s linear infinite;
  }
  
  .x1_5 {
    top: -80px;
    left: 250px;
    -webkit-transform: scale(0.3);
    -moz-transform: scale(0.3);
    transform: scale(0.3);
    -webkit-animation: moveclouds 17s linear infinite;
    -moz-animation: moveclouds 17s linear infinite;
    -o-animation: moveclouds 17s linear infinite;
  }
  
  .x2 {
    left: 250px;
    top: 30px;
    -webkit-transform: scale(0.6);
    -moz-transform: scale(0.6);
    transform: scale(0.6);
    opacity: 0.6;
    -webkit-animation: moveclouds 25s linear infinite;
    -moz-animation: moveclouds 25s linear infinite;
    -o-animation: moveclouds 25s linear infinite;
  }
  
  .x3 {
    left: 250px;
    bottom: -70px;
  
    -webkit-transform: scale(0.6);
    -moz-transform: scale(0.6);
    transform: scale(0.6);
    opacity: 0.8;
  
    -webkit-animation: moveclouds 25s linear infinite;
    -moz-animation: moveclouds 25s linear infinite;
    -o-animation: moveclouds 25s linear infinite;
  }
  
  .x4 {
    left: 470px;
    botttom: 20px;
  
    -webkit-transform: scale(0.75);
    -moz-transform: scale(0.75);
    transform: scale(0.75);
    opacity: 0.75;
  
    -webkit-animation: moveclouds 18s linear infinite;
    -moz-animation: moveclouds 18s linear infinite;
    -o-animation: moveclouds 18s linear infinite;
  }
  
  .x5 {
    left: 200px;
    top: 300px;
  
    -webkit-transform: scale(0.5);
    -moz-transform: scale(0.5);
    transform: scale(0.5);
    opacity: 0.8;
  
    -webkit-animation: moveclouds 20s linear infinite;
    -moz-animation: moveclouds 20s linear infinite;
    -o-animation: moveclouds 20s linear infinite;
  }
  
  @-webkit-keyframes moveclouds {
    0% {
      margin-left: 1000px;
    }
    100% {
      margin-left: -1000px;
    }
  }
  @-moz-keyframes moveclouds {
    0% {
      margin-left: 1000px;
    }
    100% {
      margin-left: -1000px;
    }
  }
  @-o-keyframes moveclouds {
    0% {
      margin-left: 1000px;
    }
    100% {
      margin-left: -1000px;
    }
  }
   </style>`;
};


