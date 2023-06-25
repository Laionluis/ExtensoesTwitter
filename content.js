if (typeof browser === "undefined") {
  var browser = chrome;
}

document.addEventListener('contextmenu', event => {
  const element = document.querySelector('[role="menuitem"]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Create the outermost <div> element with the "role" and "tabindex" attributes
        let downloadBtn = document.getElementById('btn-download-video');
        if(!downloadBtn)
        {
          const outerDiv = document.createElement('div');
          outerDiv.setAttribute('role', 'menuitem');
          outerDiv.setAttribute('tabindex', '0');
          outerDiv.setAttribute('id', 'btn-download-video');
          outerDiv.classList.add('css-1dbjc4n', 'r-1loqt21', 'r-18u37iz', 'r-1ny4l3l', 'r-ymttw5', 'r-1f1sjgu', 'r-o7ynqc', 'r-6416eg', 'r-13qz1uu');
  
          // Create the nested <div> elements
          const innerDiv1 = document.createElement('div');
          innerDiv1.classList.add('css-1dbjc4n', 'r-16y2uox', 'r-1wbh5a2');
  
          const innerDiv2 = document.createElement('div');
          var classListDiv2 = element.parentElement.children[0].children[0].children[0].classList.value;
          if(!classListDiv2)
            classListDiv2 = 'css-901oao r-18jsvk2 r-37j5jr r-a023e6 r-b88u0q r-rjixqe r-bcqeeo r-qvutc0';
          innerDiv2.classList.value = classListDiv2; // add(classListDiv2);
  
          // Create the <span> element with the inner text
          const span = document.createElement('span');
          span.classList.add('css-901oao', 'css-16my406', 'r-poiln3', 'r-bcqeeo', 'r-qvutc0');
          span.innerText = 'Download Video';
  
          // Append the elements together in the correct order
          innerDiv2.appendChild(span);
          innerDiv1.appendChild(innerDiv2);
          outerDiv.appendChild(innerDiv1);
  
          // Add the element to the page
         
          element.parentElement.appendChild(outerDiv);
          outerDiv.addEventListener('click', function() {
            var closestVideo = outerDiv.closest('[data-testid="videoPlayer"]').querySelector('video');
            var tweet = outerDiv.closest('[data-testid="tweet"]');           
            var videoSource = closestVideo.src;           
            downloadVideoObject(tweet, 'article', videoSource);
          });
        }
     
        observer.unobserve(entry.target);
      }
    });
  });

  if (element) {
    observer.observe(element);
  } else {
    console.log('Element not found!');
  }

});

function getTweetId(tweet, selector) {
  const re = /(?:https:\/\/[A-z.]*\/\w*\/status\/)(\d*)(?:\/?\w*)/g
  return getTweetData(tweet, selector, re)
}

function getTweetData(tweet, selector, re) {
  if (selector === '.tweet') {
      return tweet.data("tweet-id")
  } else if (selector === 'article') {
      for (const element of tweet.querySelectorAll('a')) {
          const match = re.exec(element.href)
          if (match) {
              return match[1]
          }
      }
  } else if (selector === modalCalss) {
      const match = re.exec(window.location.href)
      if (match) {
          return match[1]
      }
  }
}

function downloadVideoObject(tweet, tweetSelector, videoSource) {

  processBlobVideo(getTweetId(tweet, tweetSelector), getCookie("ct0"));
}

async function processBlobVideo(id, token) {
  var pageUrl = "https://api.twitter.com/1.1/statuses/show.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&trim_user=false&include_ext_media_color=true&id=" + id;
  var url = await getMp4Url(pageUrl, token);  
  browser.runtime.sendMessage({
    type: 'video',
    url: url,
    id: id  
})
}

function getCookie(cname) {
  var name = cname + "="
  var decodedCookie = decodeURIComponent(document.cookie)
  var ca = decodedCookie.split(';')
  for (var i = 0; i < ca.length; i++) {
      var c = ca[i]
      while (c.charAt(0) == ' ') {
          c = c.substring(1)
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length)
      }
  }
  return ""
}

async function getMp4Url(url, token) {
  try {
    const init = {
      origin: 'https://mobile.twitter.com',
      headers: {
        "Accept": '*/*',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:62.0) Gecko/20100101 Firefox/62.0",
        "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
        "x-csrf-token": token,
      },
      credentials: 'include',
      referrer: 'https://mobile.twitter.com'
    };

    const response = await fetch(url, init);
    if (response.status === 200) {
      const json = await response.json();
      let mp4Variants = (json.extended_entities || json.quoted_status.extended_entities).media[0].video_info.variants.filter(variant => variant.content_type === 'video/mp4');
      mp4Variants = mp4Variants.sort((a, b) => (b.bitrate - a.bitrate));

      let url = '';
      if (mp4Variants.length) {
        url = mp4Variants[0].url;
      }
      return url;
    } else {
      throw {
        status: response.status,
        statusText: response.statusText
      };
    }
  } catch (err) {
    throw {
      error: err
    };
  }
}
