import React, { FunctionComponent, Fragment, useState, useEffect } from 'react';

import styles from './paginator.module.css';

type Props = {
  skip: number;
  range: number[];
  handlePaginationChange: (number: number) => any;
};

export const Paginator: FunctionComponent<Props> = ({
  skip,
  range,
  handlePaginationChange
}) => {
  skip = skip ? skip : 0;

  const [page, setPageNumber] = useState(1);

  useEffect(() => {
    return setPageNumber(skip);
  }, [skip]);

  const moveToNextPage = () => {
    if (page > 1) {
      handlePaginationChange(page - 1);
      return setPageNumber(page - 1);
    }

    return null;
  };

  const moveToPreviousPage = () => {
    if (page < range[range.length - 1]) {
      handlePaginationChange(page + 1);
      return setPageNumber(page + 1);
    }

    return null;
  };

  const moveToPage = (pageNumber: number) => {
    handlePaginationChange(pageNumber);
    return setPageNumber(pageNumber);
  };

  const renderPageIndicators = (num: number, index: number) => (
    <span
      className={`${styles.paginator__page_number} ${num === page ? styles.paginator__page_number__selected : ''}`}
      key={index}
      onClick={() => moveToPage(num)}
    >
      {num}
    </span>
  );

  return (
    <Fragment>
      <div className={styles.paginator}>
        {range.length > 1 ? (
          <button className={styles.paginator__button} onClick={moveToNextPage}>
            <span className={`${styles.paginator__button_indicator} left`}>
              {'<'}
            </span>{' '}
            {/* <span className={styles.paginator__button_label}> Previous </span> */}
          </button>
        ) : null}

        {range.map(renderPageIndicators)}

        {range.length > 1 ? (
          <button
            className={styles.paginator__button}
            onClick={moveToPreviousPage}
          >
            {/* <span className={styles.paginator__button_label}> Next</span>{' '} */}
            <span className={`${styles.paginator__button_indicator} right`}>
              {'>'}
            </span>
          </button>
        ) : null}
      </div>
    </Fragment>
  );
};
