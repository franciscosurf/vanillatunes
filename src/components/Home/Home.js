import Component from 'Library/Component.js';
import Search_Initialisation from 'Components/Home/Search.js'
// import Albums from 'Components/Search/Albums.js'

// Private methods declaration as Symbols (polyfill included in app.js)
const _afterRender = Symbol('afterRender');

/**
 * Home component class
 * Returns
 */
const Home_Initialisation = () => {

  'use strict';

  class Home extends Component {

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

      // After Home is init, we launch the search bar inside Home Component.
      Search_Initialisation();

      // Event Delegation (better performance having one listener checking everything than multiple ones)
      // Normally we would like to have the event in a parent element so better performance as avoiding event bubbling.
      // Also works in dynamic scenarios
      document.addEventListener('click', function (event) {

        return false;
        //if (event.target.matches('h1')) {
          // Run your code to open a modal,etc.
          //document.componentRegistry[self._id].changeLoading();
        //}

      }, false);

    }

    /**
     * Renders the component html Home
     */
    template(props) {

      const { heading } = props;

      //  If we use inline events we would need to ensure somehow a way to make it work in dynamic scenario
      //  onclick="document.componentRegistry[${self._id}].changeLoading();"

      let template = `
        <div class="search"></div>
        <div class="search-results"></div>
    `;

      // Add the children components...in children div element
      // <div class="children"></div>
      // <div>${self.children.map((child) => child.render()).join('')}</div>

      return template;
    }

    /**
     * After Home Component is rendered
     * we launch the Search
     */
    componentDidMount() {
      // This is a separate private call as these can be registered only after the DOM has been painted
      this[_afterRender]();
    }

  }

  const INITIAL_STATE = {
    element: '#app',
    data: {
      heading: ''
    }
  };

  // Define the new element
  let home = new Home(INITIAL_STATE);
  home.render();
};

// Export Home Component
export default Home_Initialisation;