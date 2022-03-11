import * as React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

const Animation: React.FC = (props) => {
  
  return (
    <Box sx={{ width: "95%",ml:1 }} className="skeleton-wrapper">
        <div className='skleton-wrapper--inr'>
            <div className='skleton-wrapper-left'>
            <Skeleton sx={{height:"40px"}}  animation="wave" />
            </div>
            <div className='skleton-wrapper-center'>
            <Skeleton sx={{height:"40px"}}  animation="wave" />
            </div>
            <div className='skleton-wrapper-right'>
            <Skeleton sx={{height:"40px"}}  animation="wave" />
            </div>
        </div>
  </Box>

  );
};

export default Animation;
