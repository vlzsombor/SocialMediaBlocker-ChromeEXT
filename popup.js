document.addEventListener('DOMContentLoaded', documentEvents  , false);
const readLocalStorage = async (key) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], function (result) {
        resolve(result[key]);
      });
    });
  };




function documentEvents() {
    
    document.getElementById('ok_btn').addEventListener('click', 
        function() {
            chrome.storage.local.remove("block_until");
            chrome.storage.local.remove("last_meditation_epoch");

            let meditation_duration_in_min = document.getElementById('meditation_duration_in_min');
            chrome.storage.local.set({meditation_duration_in_min: meditation_duration_in_min.value});
            
            let meditation_break_time_in_min = document.getElementById('meditation_break_time_in_min');
            chrome.storage.local.set({meditation_break_time_in_min: meditation_break_time_in_min.value});
            
            let youtube_url = document.getElementById('youtube_url');
            chrome.storage.local.set({youtube_url: youtube_url.value});
        });
    

    let meditation_duration_in_min = document.getElementById("meditation_duration_in_min")
    let meditation_break_time_in_min = document.getElementById("meditation_break_time_in_min")
    let youtube_url = document.getElementById("youtube_url")


    chrome.storage.local.get(["meditation_duration_in_min"], function (result) {

        if(result["meditation_duration_in_min"] == null ){
            return;
        }

        meditation_duration_in_min.value = result["meditation_duration_in_min"]
    });


    chrome.storage.local.get(["meditation_break_time_in_min"], function (result) {

        if(result["meditation_break_time_in_min"] == null ){
            return;
        }
        meditation_break_time_in_min.value = result["meditation_break_time_in_min"]
    });


    chrome.storage.local.get(["youtube_url"], function (result) {

        if(result["youtube_url"] == null ){
            return;
        }
        youtube_url.value = result["youtube_url"]
    });

}

