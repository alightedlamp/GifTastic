import $ from 'jquery';

$(document).ready(function() {
  // Default topics to display
  const topics = [
    'creative coding',
    'processing',
    'animation',
    'geometry',
    '3d animation',
    'art'
  ];
  const API_KEY = 'dxnqgDHxhaOtCCP8Y99crUdxaxQbpYX4';
  const BASE_URL = 'http://api.giphy.com/v1';

  // Default config
  const config = {
    searchTerm: topics[Math.floor(Math.random() * topics.length)], // Set init search to random results
    animate: false,
    sticker: false
  };

  const displayResults = function displayResults() {
    const params = {
      q: config.searchTerm,
      limit: 10,
      api_key: API_KEY
    };

    // Check config for current type selection and build URL accordingly
    let url;
    if (config.sticker) {
      url = BASE_URL + '/stickers/search?' + $.param(params);
    } else {
      url = BASE_URL + '/gifs/search?' + $.param(params);
    }

    $.get(url).done(response => {
      $('#results').empty();

      // Display the total number of results
      $('#stats').text(`Total results: ${response.pagination.total_count}`);

      // Iterate through response data and display gifs on page
      response.data.map(gif => {
        // Pick src image based on current animate config setting and set state accordingly
        let gifSrc;
        let gifState;
        if (config.animate) {
          gifSrc = gif.images.fixed_height.url;
          gifState = 'animate';
        } else {
          gifSrc = gif.images.fixed_height_still.url;
          gifState = 'still';
        }

        $('#results').append(`
        <div class="gif-container">
          <p>Rating: ${gif.rating.toUpperCase()}</p>
          <img
            class="gif"
            src="${gifSrc}"
            alt="${gif.title}"
            data-state="${gifState}"
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
    // Update global search term on button click
    config.searchTerm = $(this).text();
    displayResults();
  });

  // Toggle an individual gifs animate data attribute
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

  // Handle user input
  $('#user-input-form').on('submit', function(e) {
    e.preventDefault();
    const inputVal = $('#user-input')
      .val()
      .trim();

    // Validate user input and do not allow empty submissions
    if (inputVal) {
      topics.push(inputVal);
    } else {
      console.log('Input was blank!');
    }
    $('#user-input').val('');
    renderButtons();
  });

  const toggleAnimated = function toggleAnimated() {
    // Change checked value
    config.animate = !config.animate;
    // Adjust all elements in #results
    if (config.animate) {
      $('.gif').each(function() {
        $(this).attr('data-state', 'animate');
        $(this).attr('src', $(this).attr('data-animate'));
      });
    } else {
      $('.gif').each(function() {
        $(this).attr('data-state', 'still');
        $(this).attr('src', $(this).attr('data-still'));
      });
    }
  };
  const toggleType = function toggleType() {
    // Change checked value
    config.sticker = !config.sticker;
    // Re-render results
    displayResults();
  };
  $('#animated-switch').click(toggleAnimated);
  $('#type-switch').click(toggleType);

  renderButtons();
  displayResults(config.searchTerm);
});
