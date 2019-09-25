'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import Icon from 'kahlu/components/icon';

const messages = defineMessages({
  show: { id: 'column_header.show_settings', defaultMessage: 'Show settings' },
  hide: { id: 'column_header.hide_settings', defaultMessage: 'Hide settings' },
});

export default @injectIntl
class ColumnHeader extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    title: PropTypes.node,
    icon: PropTypes.string,
    active: PropTypes.bool,
    extraButton: PropTypes.node,
    children: PropTypes.node,
  };

  state = {
    collapsed: true,
    animating: false,
  };

  historyBack = () => {
    if (window.history && window.history.length === 1) {
      this.context.router.history.push('/home'); // homehack
    } else {
      this.context.router.history.goBack();
    }
  }

  handleToggleClick = (e) => {
    e.stopPropagation();
    this.setState({ collapsed: !this.state.collapsed, animating: true });
  }

  handleBackClick = () => {
    this.historyBack();
  }

  handleTransitionEnd = () => {
    this.setState({ animating: false });
  }

  render () {
    const { title, icon, active, children, extraButton, intl: { formatMessage } } = this.props;
    const { collapsed, animating } = this.state;

    const wrapperClassName = classNames('column-header__wrapper', {
      'active': active,
    });

    const buttonClassName = classNames('column-header', {
      'active': active,
    });

    const collapsibleClassName = classNames('column-header__collapsible', {
      'collapsed': collapsed,
      'animating': animating,
    });

    const collapsibleButtonClassName = classNames('column-header__button', {
      'active': !collapsed,
    });

    let extraContent, collapseButton;

    if (children) {
      extraContent = (
        <div key='extra-content' className='column-header__collapsible__extra'>
          {children}
        </div>
      );
    }

    const collapsedContent = [
      extraContent,
    ];

    if (children) {
      collapseButton = <button className={collapsibleButtonClassName} title={formatMessage(collapsed ? messages.show : messages.hide)} aria-label={formatMessage(collapsed ? messages.show : messages.hide)} aria-pressed={collapsed ? 'false' : 'true'} onClick={this.handleToggleClick}><Icon id='sliders' /></button>;
    }

    const hasTitle = icon && title;

    return (
      <div className={wrapperClassName}>
        <h1 className={buttonClassName}>
          {hasTitle && (
            <button>
              <Icon id={icon} fixedWidth className='column-header__icon' />
              {title}
            </button>
          )}

          <div className='column-header__buttons'>
            {extraButton}
            {collapseButton}
          </div>
        </h1>

        <div className={collapsibleClassName} tabIndex={collapsed ? -1 : null} onTransitionEnd={this.handleTransitionEnd}>
          <div className='column-header__collapsible-inner'>
            {(!collapsed || animating) && collapsedContent}
          </div>
        </div>
      </div>
    );
  }

}
