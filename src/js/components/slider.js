// personal keys
const PRIV_KEY = 'ef6eb321a94191b82923327f5bd9050d7dcc6e07';
const PUBLIC_KEY = '69b1e51d47c3910fc25030118d434e0c';

const getComics = () => {

  // get a new ts every request                                                                                    
  let ts = new Date().getTime();
  const hash = CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString();
  
//   const seriesID = 2029 // Iron Man; 

const url = "https://gateway.marvel.com:443/v1/public/series/2029/comics?format=comic&formatType=comic&title=Iron%20Man"
  $.getJSON(url, {
    ts: ts,
    apikey: PUBLIC_KEY,
    hash: hash
    })
    .done(function(response) {
      const comics = response.data.results;
      
      for (let i=0; i<10; i++) {
        let srcPath = comics[i].thumbnail.path;
        let subPath = 'image_not_available';
        if(!(srcPath.includes(subPath))) {
          $('#slider').append(
            '<img class="slick-img" src="' + comics[i].thumbnail.path + '.jpg" />'
          ); 
        };
      }
      initSlider();
    })
    .fail(function(err){
      console.log(err);
    });
};

getComics();



// Set up Slick Slider
const initSlider = () => {
  $('#slider').slick({
    dots: false,
    arrows: false,
    infinite: true,
    draggable: true,
    speed: 3000,
    slidesToShow: 2,
    slidesToScroll: 2,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      }
    ]
  });
};


