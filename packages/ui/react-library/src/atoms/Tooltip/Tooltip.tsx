import React from 'react';
import './Tooltip.module.css';

type PropsLink = {
  text?: string;
  position?: string;
  children?: any;
};

export const Tooltip: React.FC<PropsLink> = ({ text, position, children, ...rest }) => {
  const [show, setShow] = React.useState(false);

  const pos = position ? position : 'below';

  const showBoxAbove = () => {
    if (pos !== 'above') return <></>
    return (
      <div className={show ? 'tooltip__box visible' : 'tooltip__box'}>
        <span className={pos === 'above' ? 'tooltip__box_arrow_above': ''} />
        <div className="tooltip__box_text">
          { text }
        </div>
      </div>
    )
  }

  const showBoxBelow = () => {
    if (pos !== 'below') return <></>
    return (
      <div className={show ? 'tooltip__box visible' : 'tooltip__box'}>
        <span className={pos === 'below' ? 'tooltip__box_arrow_below': ''} />
        <div className="tooltip__box_text">
          { text }
        </div>
      </div>
    )
  }

  return (
    <div className="tooltip">

      { showBoxAbove() }
      
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        {...rest}
      >
        {children}
      </div>

      { showBoxBelow() }

    </div>
  );
};
