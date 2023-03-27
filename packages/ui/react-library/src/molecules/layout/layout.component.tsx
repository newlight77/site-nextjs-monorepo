import React, { FunctionComponent, Fragment, ReactNode } from 'react';
import { MetaTags } from 'blog-model';
import { Meta } from '../meta/meta.component';

import styles from './layout.module.css';

type Props = {
  metaTags: MetaTags;
  children: ReactNode;
};

export const Layout: FunctionComponent<Props> = ({ metaTags, children }) => {
  return (
    <Fragment>
      <Meta tags={metaTags} />
      <div className={styles.layout}>
        <main>{children}</main>
      </div>
    </Fragment>
  );
};
