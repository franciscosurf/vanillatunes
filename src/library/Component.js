/**
 * A vanilla JS helper for craeing state-based components
 * @type {{}}
 */

'use strict';

document.componentRegistry = { };
document.nextId = 0;

/**
 * Component class to extend from when creating new components.
 * By default it sets a render method.
 */
class Component {

  /**
   * Constructor
   * @param props
   */
  constructor(props) {

    if (!props.element) throw 'Component: You did not provide an element to make into a component.';

    // Component Registry for event handling
    this._id = ++document.nextId;
    document.componentRegistry[this._id] = this;

    // State handler
    this.state = {
      element: props.element,
      data: props.data || null
    };

    // Use like this.componentDidMount() everywhere if need to run something
    // when the Component has been loaded.
    this.componentDidMount = this.componentDidMount.bind(this);
    // Use like this.componentWillUnmount() everywhere if need to run something
    // when leaving the page, refreshing, etc.
    this.componentWillUnmount = this.componentWillUnmount.bind(this);

    // Execute our componentDidMount when DOMContentLoaded completed.
    document.addEventListener('DOMContentLoaded', () => this.componentDidMount());
    // Evento que se ejecuta antes de abandonar la página, justo antes de que se ejecute window.onunload.
    // El documento aún está visible y el evento aún se puede cancelar.
    window.onbeforeunload = () => this.componentWillUnmount();
  }

  /**
   * Adds the setState() method
   * @param props
   */
  setState(props) {

    for (let key in props) {
      if (props.hasOwnProperty(key)) {
        this.state.data[key] = props[key];
      }
    }

    // Re-render after state updated
    //this.render();
  }

  /**
   * Gets if exists a property in state
   * @param property
   * @returns {*}
   */
  getStateProperty(property) {

    if(!this.state.data) return;

    if (this.state.data.hasOwnProperty(property)) {
      return this.state.data[property];
    }
    else{
      return -1;
    }

  }

  /**
   * The template to be rendered
   * @param props
   * @returns {null}
   */
  template(props) {

    let template = `
      <div>Hello</div>
    `;

    return template ? template : null;
  }

  /**
   * Render a template into the DOM
   * @returns {Element}
   */
  render() {

    const { element, data } = this.state;

    // Make sure there's a template
    if (!this.template) throw 'ComponentJS: No template was provided';

    // If element is an element, use it.
    // If it's a selector, get it.
    let _element = typeof element === 'string'
                      ? document.querySelector(element)
                      : element;

    if (!element) return;

    // Get the template, data will be passed as props to the template
    let _template = typeof this.template === 'function'
                        ? this.template(data)
                        : this.template;

    // array indexOf === -1 true if index value is not found.
    if (['string' , 'number'].indexOf(typeof _template) === -1) return;

    // Render the template into the element
    if (_element.innerHTML === _template) return; // if they're the same, do nothing
    _element.innerHTML = _template; // else update with new template

    // Dispatch a render event -> https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
    if (typeof window.CustomEvent === 'function') {
      let event = new window.CustomEvent('render', {
        bubbles: true
      });
      _element.dispatchEvent(event);
    }

    // Return the _element for use elsewhere
    return _element;
  }

  /**
   * Render a template within a element
   * @param _subElement
   * @param _subTemplate
   */
  renderSubTemplate(_subElement, _subTemplate) {

    if (!_subTemplate) throw 'ComponentJS: No subTemplate was provided';

    if (!_subElement) throw 'ComponentJS: No subElement was provided';

    let subElement = document.querySelector(_subElement);
    subElement.innerHTML = _subTemplate;

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }
} // Component class

// return Component
export default Component;