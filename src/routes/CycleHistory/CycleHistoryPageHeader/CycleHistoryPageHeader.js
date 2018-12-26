import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import { isEmpty } from 'javascript-utils/lib/utils';
import { DEFAULT_DATE_FORMAT } from 'constants/index';
import PageHeader from 'components/PageHeader';

const CycleHistoryPageHeader = ({
  cycleHistoryFilters, currentEtlStatus, cycleHistoryDate
}) => {
  let state = '';
  let headerText = `${__APP_TITLE__} - ETL Cycle History`;

  if (currentEtlStatus === 'FAILED') {
    state = 'error';
    headerText += ' (FAILED)';
  } else if (currentEtlStatus === 'PAUSED') {
    state = 'warning';
    headerText += ' (PAUSED)';
  } else if (cycleHistoryFilters.active === 0) {
    state = 'error';
    headerText += ' (INACTIVE)';
  } else if (!isEmpty(cycleHistoryDate)) {
    state = 'error';
    headerText += ` (${moment(cycleHistoryDate, DEFAULT_DATE_FORMAT)
      .format('MMM D, YYYY')})`;
  }

  return (
    <PageHeader headerText={headerText} state={state} />
  );
};

CycleHistoryPageHeader.propTypes = {
  cycleHistoryFilters: PropTypes.object.isRequired,
  currentEtlStatus: PropTypes.string.isRequired,
  cycleHistoryDate: PropTypes.string.isRequired
};

export default CycleHistoryPageHeader;
