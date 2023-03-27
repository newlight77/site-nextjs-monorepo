import React, { FunctionComponent, Fragment, ReactNode } from 'react';
import { MetaTags } from 'blog-model';
import Meta from '../meta';

import styles from './layout.module.css';

type Props = {
  metaTags: MetaTags;
  children: ReactNode;
};
const Layout: FunctionComponent<Props> = ({ metaTags, children }) => {
  return (
    <Fragment>
      <Meta tags={metaTags} />
      <div className={styles.layout}>
        <main>{children}</main>
      </div>
    </Fragment>
  );
};

export default Layout;