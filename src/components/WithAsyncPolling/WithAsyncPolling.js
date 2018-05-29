/**
 * HOC component to provide async polling functionality
 * to React components.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { documentHiddenPropertyName } from 'javascript-utils/lib/device';

// Property used to detect if the browser window is active
const documentHiddenProperty = documentHiddenPropertyName();

export const withAsyncPolling = (WrappedComponent) => {
  class WithAsyncPolling extends Component {
    static propTypes = {
      intervalDuration: PropTypes.number,
      onInterval: PropTypes.func.isRequired
    };

    static defaultProps = {
      intervalDuration: 15000
    };

    constructor() {
      super();
      this.startPolling = this.startPolling.bind(this);
      this.stopPolling = this.stopPolling.bind(this);
      this.onInterval = this.onInterval.bind(this);
    }

    /**
     * Start polling when the component mounts.
     */
    componentDidMount() {
      if (this.props.intervalDuration > 0) {
        this.startPolling();
      }
    }

    /**
     * Update refresh interval.
     */
    componentDidUpdate(prevProps) {
      if (this.props.intervalDuration !== prevProps.intervalDuration) {
        this.stopPolling();
        if (this.props.intervalDuration > 0) {
          this.startPolling();
        }
      }
    }

    /**
     * Stop polling when the component unmounts.
     */
    componentWillUnmount() {
      this.stopPolling();
    }

    /**
     * Callback function call by setInterval
     */
    onInterval() {
      if (documentHiddenProperty === null || !document[documentHiddenProperty]) {
        return this.props.onInterval(this.getProps());
      }

      return Promise.resolve();
    }

    /**
     * Returns all the props available.
     */
    getProps() {
      return {
        ...this.props,
        startPolling: this.startPolling,
        stopPolling: this.stopPolling,
        isPolling: !!this.interval
      };
    }

    /**
     * This function starts the polling and can only
     * be called once while a polling is active.
     */
    startPolling() {
      if (this.interval) {
        return;
      }

      this.keepPolling = true;
      this.asyncInterval(this.props.intervalDuration, this.onInterval);
    }

    /**
     * Stops the polling by removing the setTimeout interval.
     */
    stopPolling() {
      this.keepPolling = false;
      if (this.interval) {
        clearTimeout(this.interval);
        this.interval = null;
      }
    }

    /**
     * Executes the logic to execute the onInterval
     * callback every X seconds.
     *
     * @param {Number} intervalDuration
     * @param {Function} fn
     */
    asyncInterval(intervalDuration, fn) {
      // Pass props to the onInterval callback
      const promise = fn(this.getProps());

      const asyncTimeout = () => setTimeout(() => {
        this.asyncInterval(intervalDuration, fn);
      }, intervalDuration);

      const assignNextInterval = () => {
        if (!this.keepPolling) {
          this.stopPolling();
          return;
        }

        this.interval = asyncTimeout();
      };

      Promise.resolve(promise)
        .then(assignNextInterval)
        .catch(assignNextInterval);
    }

    render() {
      const props = this.getProps();
      return <WrappedComponent {...props} />;
    }
  }

  return WithAsyncPolling;
};
