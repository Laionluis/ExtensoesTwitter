
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
          innerDiv2.classList.add('css-901oao', 'r-18jsvk2', 'r-37j5jr', 'r-a023e6', 'r-b88u0q', 'r-rjixqe', 'r-bcqeeo', 'r-qvutc0');
  
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
            console.log(closestVideo);
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
