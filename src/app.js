import $ from 'jquery';

$(document).ready(function() {
  const topics = [
    'creative coding',
    'processing',
    'animation',
    'geometry',
    '3d animation'
  ];
  const API_KEY = 'dxnqgDHxhaOtCCP8Y99crUdxaxQbpYX4';
  const BASE_URL = 'http://api.giphy.com/v1';

  const displayResults = function displayResults(searchTerm) {
    // Check if rating
    // Check if limit
    // Check if sticker - if so, adjust url
    const params = {
      q: searchTerm,
      limit: 10,
      api_key: API_KEY
    };
    const url = BASE_URL + '/gifs/search?' + $.param(params);

    $.get(url).done(response => {
      console.log(response);
      $('#results').empty();

      response.data.map(gif => {
        $('#results').append(`
        <div class="gif-container">
          <p>Rating: ${gif.rating.toUpperCase()}</p>
          <img
            class="gif"
            src="${gif.images.fixed_height_still.url}"
            alt="${gif.title}"
            data-state="still"
            data-animate="${gif.images.fixed_height.url}" 
            data-still="${gif.images.fixed_height_still.url}"
          />
        </div>
      `);
      });
    });
  };

  const renderButtons = function renderButtons() {
    $('#buttons').html(
      topics.map(topic => `<button class="btn btn-default">${topic}</button>`)
    );
  };

  $('#buttons').on('click', 'button', function(e) {
    e.preventDefault();
    // Hit the API
    const searchTerm = $(this).text();
    displayResults(searchTerm);
  });

  $('#results').on('click', 'img.gif', function() {
    let state = $(this).attr('data-state');

    if (state === 'still') {
      $(this).attr('data-state', 'animate');
      $(this).attr('src', $(this).attr('data-animate'));
    } else {
      $(this).attr('data-state', 'still');
      $(this).attr('src', $(this).attr('data-still'));
    }
  });

  $('#user-input-form').on('submit', function(e) {
    e.preventDefault();
    topics.push(
      $('#user-input')
        .val()
        .trim()
    );
    $('#user-input').val('');
    renderButtons();
  });

  renderButtons();
  displayResults(topics[0]);
});
