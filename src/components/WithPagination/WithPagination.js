/**
 * HOC to provide pager pagination functionality.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getDisplayName } from 'javascript-utils/lib/react';

export const withPagination = (WrappedComponent) => {
  class WithPagination extends Component {
    static propTypes = {
      firstPageClassName: PropTypes.string,
      lastPageClassName: PropTypes.string,
      previousPageClassName: PropTypes.string,
      nextPageClassName: PropTypes.string,
      internalPageClassName: PropTypes.string,
      activePageClassName: PropTypes.string,
      disabledPageClassName: PropTypes.string,
      firstPageLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      lastPageLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      prevPageLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.node]),
      nextPageLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.node]),
      maxButtonCount: PropTypes.number,
      currentPage: PropTypes.number.isRequired,
      totalPages: PropTypes.number.isRequired,
      onButtonClick: PropTypes.func.isRequired
    };

    static defaultProps = {
      firstPageClassName: 'first',
      lastPageClassName: 'last',
      previousPageClassName: 'previous',
      nextPageClassName: 'next',
      internalPageClassName: 'internal',
      activePageClassName: 'active',
      disabledPageClassName: 'disabled',
      firstPageLabel: 'First',
      lastPageLabel: 'Last',
      prevPageLabel: '\u00ab',
      nextPageLabel: '\u00bb',
      maxButtonCount: 5
    };

    constructor(props) {
      super(props);
      this.buttonIndex = 0; // Used to assign a unique key to each button
    }

    getCurrentPage() {
      return this.props.currentPage - 1;
    }

    /**
     * Returns the begin and end pages that need to be displayed.
     *
     * @returns {Array}
     */
    getPageRange() {
      const { totalPages, maxButtonCount } = this.props;
      const currentPage = this.getCurrentPage();

      let beginPage = Math.max(0, currentPage - (maxButtonCount / 2));
      let endPage = beginPage + (maxButtonCount - 1);

      if (endPage >= totalPages) {
        endPage = totalPages - 1;
        beginPage = Math.max(0, endPage - (maxButtonCount + 1));
      }

      return [beginPage, endPage];
    }

    /**
     * Creates a page button.
     *
     * @param {String} label - The text label for the button
     * @param {Number} page - The page number
     * @param {String} className - The CSS class for the page button
     * @param {Boolean} disabled - Whether this page button is disabled
     * @param {Boolean} active - Whether this page button is active
     * @return {Object} - Object containing button information
     */
    createPageButton(label, page, className, disabled, active) {
      const { disabledPageClassName, activePageClassName } = this.props;

      let normalizedClassName = className;
      if (disabled || active) {
        normalizedClassName += ' ';
        normalizedClassName += (disabled ? disabledPageClassName : activePageClassName);
      }

      return {
        key: (++this.buttonIndex),
        name: `${(page + 1)}`,
        label,
        className: normalizedClassName,
        active,
        disabled
      };
    }

    /**
     * Creates the page buttons.
     *
     * @return {Array} - Array of object containing button information.
     */
    createPageButtons() {
      const {
        firstPageLabel,
        lastPageLabel,
        prevPageLabel,
        nextPageLabel,
        firstPageClassName,
        lastPageClassName,
        previousPageClassName,
        nextPageClassName,
        internalPageClassName,
        totalPages
      } = this.props;

      const currentPage = this.getCurrentPage();

      if (totalPages <= 1) {
        return [];
      }

      const pageRange = this.getPageRange();
      const beginPage = pageRange[0];
      const endPage = pageRange[1];
      const buttons = [];

      // First page
      if (firstPageLabel) {
        buttons.push(this.createPageButton(firstPageLabel, 0, firstPageClassName, currentPage <= 0, false));
      }

      // Prev page
      if (prevPageLabel) {
        let menuItemPage = currentPage - 1;
        if (menuItemPage < 0) {
          menuItemPage = 0;
        }

        buttons.push(this.createPageButton(
          prevPageLabel,
          menuItemPage,
          previousPageClassName,
          currentPage <= 0,
          false
        ));
      }

      // Internal pages
      for (let i = beginPage; i <= endPage; ++i) {
        buttons.push(this.createPageButton(i + 1, i, internalPageClassName, false, i === currentPage));
      }

      // Next page
      if (nextPageLabel) {
        let menuItemPage = currentPage + 1;
        if (menuItemPage >= totalPages - 1) {
          menuItemPage = totalPages - 1;
        }

        buttons.push(this.createPageButton(
          nextPageLabel,
          menuItemPage,
          nextPageClassName,
          currentPage >= totalPages - 1,
          false
        ));
      }

      // Last page
      if (lastPageLabel) {
        buttons.push(this.createPageButton(
          lastPageLabel,
          totalPages - 1,
          lastPageClassName,
          currentPage >= totalPages - 1,
          false
        ));
      }

      // Reset the page buttons
      this.buttonIndex = 0;

      return buttons;
    }

    render() {
      if (this.props.totalPages > 1) {
        return (
          <WrappedComponent
            {...this.props}
            buttons={this.createPageButtons()}
          />
        );
      }

      return null;
    }
  }

  WithPagination.displayName = `WithPagination(${getDisplayName(WrappedComponent)})`;

  return WithPagination;
};
