import React from 'react';

import './BtnBackToTop.css';

import SvgArrowUp from '@Icons/SvgArrowUp';

const BtnBackToTop: React.FC = () => {
    return (
      <>
        <a id='back-top' className='btn-back-top' href='#top' >
            <SvgArrowUp width="40" height="40" stroke="#fff0" style={{display:"inline"}} />
        </a>
      </>
    );
};

export default BtnBackToTop;
