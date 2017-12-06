import $ from 'jquery';

$(document).ready(function() {
  // Default topics to display
  const topics = [
    'creative coding',
    'processing',
    'datamoshing',
    'glitch art',
    'animation',
    'geometry',
    '3d animation',
    'threejs',
    'optical illusion',
    'magic eye',
    'art'
  ];

  const API_KEY = 'dxnqgDHxhaOtCCP8Y99crUdxaxQbpYX4';
  const BASE_URL = 'http://api.giphy.com/v1';

  // Default config
  const config = {
    searchTerm: topics[Math.floor(Math.random() * topics.length)], // Set init search to random results
    animate: false,
    sticker: false,
    offset: 0,
    limit: 15,
    topics: topics
  };

  // Check if there are topics in localStorage, and if not, add the above array
  if (localStorage.getItem('topics') === null) {
    localStorage.setItem('topics', JSON.stringify(topics));
    config.topics = topics;
  } else {
    config.topics = JSON.parse(localStorage.getItem('topics'));
  }

  const displayResults = function displayResults() {
    const params = {
      q: config.searchTerm,
      limit: config.limit,
      offset: config.offset,
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
      $('#subheading').html(
        `<h2>${config.searchTerm} <span class="results-count">${
          response.pagination.total_count
        } results</span>`
      );

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
            <img
              class="gif"
              src="${gifSrc}"
              alt="${gif.title}"
              data-state="${gifState}"
              data-animate="${gif.images.fixed_height.url}" 
              data-still="${gif.images.fixed_height_still.url}"
            />
            <p class="rating"><strong>Rating: ${gif.rating.toUpperCase()}</strong></p>
          </div>
      `);
      });
    });
  };

  $('#buttons').on('click', 'span.topic-text', function(e) {
    e.preventDefault();
    // Update global search term on button click
    config.searchTerm = $(this).text();
    // Reset pagination value
    config.offset = 0;
    displayResults();
  });
  $('#buttons').on('click', 'span.remove-topic', function() {
    // Get the button text
    const topic = $(this)
      .parent()
      .find('span:eq(1)')
      .text()
      .trim();
    // Remove from topics and localstorage
    config.topics.splice(config.topics.indexOf(topic), 1);
    // Update in localStorage
    localStorage.setItem('topics', JSON.stringify(config.topics));

    // Remove from DOM
    $(this)
      .parent()
      .remove();
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

  const renderButtons = function renderButtons() {
    $('#buttons').html(
      config.topics.map(
        topic =>
          `<div class="btn btn-search">
            <span class="remove-topic"><i class="fa fa-times" aria-hidden="true"></i></span>
            <span class="topic-text">${topic}</span>
          </div>`
      )
    );
  };

  // Handle user input
  $('#user-input-form').on('submit', function(e) {
    e.preventDefault();
    const inputVal = $('#user-input')
      .val()
      .trim();

    // Validate user input and do not allow empty submissions
    if (inputVal) {
      topics.push(inputVal);
      localStorage.setItem('topics', JSON.stringify(topics));
      config.topics = JSON.parse(localStorage.getItem('topics'));
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
    // Swap the active tab
    $('#animated-switch div:nth-child(1)').toggleClass('active');
    $('#animated-switch div:nth-child(2)').toggleClass('active');
  };
  const toggleType = function toggleType() {
    // Change checked value
    config.sticker = !config.sticker;
    // Swap the tabs
    $('#type-switch div:nth-child(1)').toggleClass('active');
    $('#type-switch div:nth-child(2)').toggleClass('active');
    // Re-render results
    displayResults();
  };
  $('#animated-switch').click(toggleAnimated);
  $('#type-switch').click(toggleType);

  // Handle pagination
  $('#next').click(function() {
    config.offset += config.limit;
    if (config.offset > 0) {
      $('#previous').prop('disabled', false);
    }
    displayResults();
  });
  $('#previous').click(function() {
    config.offset -= config.limit;
    if (config.offset === 0) {
      $(this).prop('disabled', true);
    }
    displayResults();
  });

  renderButtons();
  displayResults();
});
