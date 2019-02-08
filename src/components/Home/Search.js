import Component from 'Library/Component.js';

// Private methods declaration as Symbols (polyfill included in app.js)
const _afterRender = Symbol('afterRender');

/**
 * Search component class
 * Returns
 */
const Search_Initialisation = () => {

  'use strict';

  class Search extends Component {

    constructor(props) {

      super(props);
      this.state = {...props};
      this.children = null;
    }

    // private
    // All the code related to DOM interactions and controls go in here.
    // This is a separate PRIVATE call as these can be registered only after the DOM has been painted
    async [_afterRender]() {

      let self = this;

      // Event Delegation (better performance having one listener checking everything than multiple ones)
      // Normally we would like to have the event in a parent element so better performance as avoiding event bubbling.
      // Also works in dynamic scenarios.

      let timeout = null;

      document.addEventListener('keyup', function (event) {

        // Keyup event in _search input
        if (event.target.matches('input[name="_search"]') && !self.state.data.requesting) {

          let input = event.target;
          // keyword to search in iTunes API
          let keyword = input.value;

          // if term has at least two characters, then open a async request
          if(keyword.length >= self.state.data.minLength){

            // Add a delay of 0.5s to request to the API
            clearTimeout(timeout);
            timeout = setTimeout(function() {

              // Use new keyword and reset offset
              self.setState({keyword: keyword, offsetQuery: 0});
              self.itunesLookup(keyword);

            }, 450)

          }

        }

      }, false);

      document.addEventListener('click', function (event) {

        // Click load more button
        if (event.target.matches('.load-more-results')) {

          // Disable the button
          event.target.parentNode.classList.add("disabled");

          let increase = self.state.data.limitResults;
          if(self.state.data.offsetQuery === 0){
            increase = increase - 1;
          }

          // Set the new offset
          self.setState({offsetQuery: self.state.data.offsetQuery+increase});
          self.itunesLookup(self.state.data.keyword);

        }

        // Click change view
        if (event.target.matches('.search-view')) {

          // Toggle class "list" in s-carousel
          let scarousel = document.querySelector(self.state.data.elementResultsGrid);
          scarousel.classList.toggle("list");

        }

      }, false);

    }

    /**
     * Renders the component html Search
     */
    template(props) {

      const { heading } = props;

      //  If we use inline events we would need to ensure somehow a way to make it work in dynamic scenario
      //  onclick="document.componentRegistry[${self._id}].changeLoading();"

      let template = `
      <div class="mt--30">
        <form onsubmit="return false;">
          <div class="form-control"><input type="text" name="_search"
          class="w--100 p--15 b-none" placeholder="Find any album by typing artists, songs, or albums"
          autocomplete="off"></div>
        </form>
      </div>
    `;

      // This is a separate private call as these can be registered only after the DOM has been painted
      this[_afterRender]();

      return template;
    }

    /**
     * iTunes API look up
     * @param keyword
     * @returns {boolean}
     */
    itunesLookup(keyword) {

      let self = this;

      if(self.state.data.requesting) return false;

      self.setState({requesting:true});

      var xhr = new XMLHttpRequest();
      xhr.open("GET", "https://itunes.apple.com/search?term="
        +keyword+"&entity=album&attribute=albumTerm&attribute=artistTerm&offset="
        +this.state.data.offsetQuery+"&limit="
        +this.state.data.limitResults, true);
      xhr.onload = function (e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            self.itunesLookupResponse(xhr.responseText);
          } else {
            console.error(xhr.statusText);
          }
        }
      };
      xhr.onerror = function (e) {
        console.error(xhr.statusText);
        self.setState({requesting:false});
      };
      xhr.send(null);

    }

    /**
     * iTunes API response
     * @param response
     */
    itunesLookupResponse(response) {

      if(typeof response !== 'string' || !response ) {
        this.setState({requesting:false});
        return;
      }

      // Template Results
      const results = JSON.parse(response).results;
      this.templateAlbums(results);

      // Requesting state is false now
      this.setState({requesting:false});

    }

    /**
     * Template the response albums
     * @param results
     */
    templateAlbums(results) {

      if(!results) return;

      const resultsLength = results.resultCount || results.length;

      let elementResults = document.querySelector(this.state.data.elementResults);
      // Button load more
      let loadMoreButton = document.querySelector('.load-more');

      // Show no albums found if is a new query with no load more requests
      if (resultsLength === 0 && this.state.data.offsetQuery === 0) {
        elementResults.innerHTML = `<div>${this.state.data.noResultsMessage}</div>`;
        return;
      }

      // If a new query
      if (this.state.data.offsetQuery === 0) {

        elementResults.innerHTML = `
          ${this.templateToolBarAndResultsCount(false)}
          <div class="s-carousel-container mt--15">
            <div class="${this.state.data.classResultsGrid} pb--30" style="font-size:0;">
              ${this.templateLoopAlbums(results)}
              ${(resultsLength >= this.state.data.limitResults) ? this.templateLoadMoreButton() : ''}
            </div>
          </div>
        `;

      }
      else {

        // Append to the carousel grid insertbefore load button
        let elementResultsGrid = document.querySelector(this.state.data.elementResultsGrid);
        let elem = document.createElement('div');
        elem.innerHTML = this.templateLoopAlbums(results);
        elementResultsGrid.insertBefore(elem, loadMoreButton);

        // Hide the button if no more results left.
        if (resultsLength < this.state.data.limitResults && loadMoreButton)
          loadMoreButton.classList.add('hidden');

      }

      // Update totalResults count
      this.setState({totalResults: this.state.data.totalResults + resultsLength});
      this.renderSubTemplate(this.state.data.elementToolBarAndResultsCount, this.templateToolBarAndResultsCount(true));

      // Enable the button
      if(loadMoreButton)
        loadMoreButton.classList.remove("disabled");

    }

    /**
     * Template albums looping results
     * @param results
     * @returns {*}
     */
    templateLoopAlbums(results) {

      return `
        ${results.map((item, i) => `
          <span class="s-layout">
            <div class="s-layout-photo">
              <div class="s-layout-photo-p">
                <a href="${item.artistViewUrl}" class="s-layout-photo-p-a" aria-busy="false">
                  <div class="s-layout-photo-p-a--item">
                    <div class="s-layout-photo-p-a--item-o">
                      <div class="s-layout-photo-p-a--item-o-image" style="background-image: url(&quot;${item.artworkUrl100.replace('100x100','300x300')}&quot;);"></div>
                      <div class="s-layout-photo-p-a--item-o-effect"></div>
                    </div>
                    <div class="s-layout-photo-p-a--item-o-text">
                      <div class="s-layout-photo-p-a--item-o-text-headline to--e">${item.collectionName}</div>
                      <div class="s-layout-photo-p-a--item-o-text-subheadline to--e">${item.artistName}</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </span>
          `.trim()).join('')
        }
      `;

    }

    /**
     * Template load more button
     * @returns {string}
     */
    templateLoadMoreButton() {

      return '<div class="load-more [ plr--8 ]"><button class="load-more-results b--watermelon p--15 fs--15 c--white w--100">Load More</button></div>';

    }

    templateToolBarAndResultsCount(excludeContainer) {

      return `
        ${ !excludeContainer ? `<div class="search-toolbar [ d--f ]">` : ''}
          <div class="fg--1">
            Showing <strong class="c--brand">${this.state.data.totalResults}</strong> results.
          </div>
          <div class="">
            <button class="search-view b--ghost p--10">Change view</button>
          </div>
        ${ !excludeContainer ? `</div>` : ''}
        `;

    }

  }

  const INITIAL_STATE = {
    element: '.search',
    data: {
      requesting: false,
      elementResults: '.search-results',
      elementResultsGrid: '.s-carousel',
      elementToolBarAndResultsCount: '.search-toolbar',
      classResultsGrid: 's-carousel',
      minLength: 2,
      limitResults: 20,
      offsetQuery: 0,
      currentKeyword: '',
      totalResults: 0,
      noResultsMessage: 'No results found.'
    }
  };

  // Define the new element
  let search = new Search(INITIAL_STATE);
  search.render();

};

// Export Search Component
export default Search_Initialisation;