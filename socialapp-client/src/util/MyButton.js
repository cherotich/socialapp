import React from 'react'
import Tooltip  from '@material-ui/core/Tooltip'
import IconButton  from '@material-ui/core/IconButton'

const MyButton=({children,onClick,btnClassName,tip,tipClassName}) => (

    <Tooltip title={tip} className={tipClassName} placement="top">
        <IconButton onClick={onClick} className={btnClassName}>
            {children}
        </IconButton>
    </Tooltip>

);
export default MyButton;