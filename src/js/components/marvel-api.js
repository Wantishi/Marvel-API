
// personal keys
const PRIV_KEY = 'ef6eb321a94191b82923327f5bd9050d7dcc6e07';
const PUBLIC_KEY = '69b1e51d47c3910fc25030118d434e0c';

function iAmIronMan() {

  // get a new ts every request                                                                                    
  let ts = new Date().getTime();
  const hash = CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString();
  
  const characterId = 1009368 // Iron Man; 

  const url = 'https://gateway.marvel.com:443/v1/public/characters/1009368';

  $.getJSON(url, {
    ts: ts,
    apikey: PUBLIC_KEY,
    hash: hash
    })
    .done(function(response) {
      const results = response.data.results[0];
      $('#description').html(results.description);
      $('#hero').attr("src", results.thumbnail.path + '/detail.jpg');
    })
    .fail(function(err){
      console.log(err);
    });
};

iAmIronMan();