import './App.css';
import './Common.css';

import { useEffect, useRef, useState } from 'react';

function App() {
  
  let timeoutId;

  const [idx, changeIdx] = useState(0);
  const [rotateImage, setRotateImage] = useState(true);
  const [triggerSlideshow, setTriggerSlideShow] = useState(false);
  const [freezeSlideShow, setFreezeSlideShow] = useState(false);
  const pickerRef = useRef([]);

  console.log('pickerRef:',pickerRef);

  const slides = [
    {image: "img1.jpg", alt: "tree", info: "I can give you rain and my shadow ", link: "Take me"},
    {image: "img2.jpg", alt: "heart", info: "Think with me", link: "Love Everyone"},
    {image: "img3.jpeg", alt: "lens", info: "I can show you everything big", link: "Zoom in"},
    {image: "img4.jpg", alt: "mushroom", info: "I am very healthy", link: "Eat it"},
    {image: "img5.jpg", alt: "sunrise", info: "I am one of the sources of all lives in the world", link: "Wake up"},
  ];

  // const slideStatus = `Showing ${idx+1} of ${slides.length} carousel item`;

  const setIdx = (val, doFocus=false) => {
    let id;
    if (val >= slides.length) {
      id = 0;
    } else if(val<0) {
      id = slides.length - 1;
    } else {
      id = val;
    }
    changeIdx(id);
    console.log('doFocus:',doFocus);
    if(doFocus) {
      pickerRef.current[id].focus();
    }
  }

  // handlers

  const handlePrevious = (e, doFocus=false) => {
    console.log('focus in previous:',doFocus);
    setFreezeSlideShow(true);
    setRotateImage(false)
    setIdx(idx-1, doFocus);
  }
  const handleNext = (e, doFocus=false) => {
    setFreezeSlideShow(true);
    setRotateImage(false)
    setIdx(idx+1, doFocus);
  }
  const handlePickers = (index) => {
    setFreezeSlideShow(true);
    setRotateImage(false)
    setIdx(index)
  }
  const handleTabListKeyDown = (e) => {
    
    switch (e.code) {
      case "ArrowLeft":{
        handlePrevious(e, true);
        break;
      }
      case "ArrowRight": {
        handleNext(e, true);
        break;
      }  
      default:
        break;
    }
  }
  const handlePlayStop = () => {
    setFreezeSlideShow(!freezeSlideShow);
    setRotateImage(!rotateImage);
  }
  const handleMouseEnter = () => {
    if(!freezeSlideShow) {
      console.log('slide show paused',);
      setTriggerSlideShow(false);
    }
  }
  const handleMouseLeave = () => {
    if(!freezeSlideShow) {
      console.log('slide show resumed',);
      setTriggerSlideShow(true);
    }
  }

  // slide status
  const getSlideStatus = (index) => {
    return `Showing ${index+1} of ${slides.length} carousel item`;
  }
  
  // UseEffect hooks
  useEffect(() => {
    setTriggerSlideShow(!freezeSlideShow);
    console.log('TriggerSlideshow:',!freezeSlideShow);
  }, [freezeSlideShow])

  useEffect(() => {
    if(!triggerSlideshow) {
      console.log('Clearing interval');
      timeoutId && clearInterval(timeoutId);
    }
  }, [triggerSlideshow])

  useEffect(() => {
    setTriggerSlideShow(true);
  }, [])

  useEffect(() => {
    if(triggerSlideshow) {
      timeoutId = setTimeout(() => {
        setIdx(idx+1);
      }, 4000);
    }
    return () => {
      clearInterval(timeoutId);
    }
  }, [idx, triggerSlideshow])

  return (
    <div className="carousel-container" aria-aria-labelledby="carousel-header" >
        <h1 class="carousel-header">Popular shows and Episodes</h1>
        <div 
          class="inner"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseEnter}
          onBlur={handleMouseLeave}
        >
          <div class="controls">
            <button 
              class="rotation" 
              onClick={handlePlayStop}
              aria-label={rotateImage ? 'Stop carousel rotation' : 'play Carousel Rotation'}
            >
              <img src={`/images/${rotateImage ? 'pause' : 'play'}.svg`} />
            </button>
            <button class="previous" aria-label="previous" onClick={handlePrevious}><img src="/images/previous.svg" /></button>
            <button class="next" aria-label="next" onClick={handleNext}><img src="/images/next.svg" /></button>
            <div class="pickers" role="tablist">
              {
                slides.map((slide, index) => {
                  return (
                    <button 
                      class={(index===idx) ? 'activePicker' : ''} 
                      onClick={() => handlePickers(index)}
                      onKeyDown={handleTabListKeyDown}
                      role="tab"
                      aria-controls={`item${index+1}`}
                      aria-selected={(index===idx) ? true : false}
                      tabIndex={(index===idx) ? 0 : -1}
                      ref={el => pickerRef.current[index] = el}
                    ></button>
                  );
                })
              }
            </div>
          </div>
          <ul id="carousel-items" role="presentation" aria-live={triggerSlideshow ? "polite" : "false"}>
            {
              slides.map(
                (slide, index) => {
                  return (
                    <li 
                      class={(index===idx) ? 'activeSlide' : ''}
                      id={`item${index+1}`}
                      role="tabPanel"
                    >
                      <h2 class="carousel-status">
                        {getSlideStatus(index)}
                      </h2>
                      <img id="myImg" src={`/images/${slide.image}`} alt={slide.alt} />
                      <h2 id="headingText" class="info">{slide.info}</h2>
                      <button>{slide.link}</button>
                    </li>
                  )
                }
              )
            }
          </ul>
        </div>
    </div>
  );
}

export default App;
