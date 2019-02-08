import Component from 'Library/Component.js';

// Private methods declaration as Symbols (polyfill included in app.js)
const _afterRender = Symbol('afterRender');

/**
 * Header component class
 * Returns
 */
const Header_Initialisation = () => {

  'use strict';

  class Header extends Component {

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
      // Also works in dynamic scenarios
      document.addEventListener('click', function (event) {

        if (event.target.matches('h1')) {
          // Run your code to open a modal,etc.
          //document.componentRegistry[self._id].changeLoading();
        }

        if (event.target.matches('.close')) {
          // Run your code to close a modal, etc.
        }

      }, false);

    }

    // public
    testMethod() {
      //this.setState({ heading: "test!" });
    }

    /**
     * Renders the component html Header
     */
    template(props) {

      const { heading } = props;

      //  If we use inline events we would need to ensure somehow a way to make it work in dynamic scenario
      //  onclick="document.componentRegistry[${self._id}].changeLoading();"

      let template = `
        <nav class="p--15">
          <div class="container--wide">
            <div class="row">
              <h1 class="ta--c m--0">${heading}</h1>
            </div>
          </div>
        </nav>
      `;

      // Add the children components...in children div element
      //<div>${self.children.map((child) => child.render()).join('')}</div>

      // This is a separate private call as these can be registered only after the DOM has been painted
      //self[_afterRender]();

      return template;
    }
  }

  const INITIAL_STATE = {
    element: '.header',
    data: {
      heading: 'Vanilla Tunes'
    }
  };

  // Define the new element
  let header = new Header(INITIAL_STATE);
  header.render();

};

// Export Header Component
export default Header_Initialisation;