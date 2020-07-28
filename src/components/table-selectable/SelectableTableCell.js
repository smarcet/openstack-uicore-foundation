import React from 'react';
import RawHTML from '../raw-html';

const SelectableTableCell = (props) => {
    let {children} = props;
	let value = '';
	if(children) {
	    if (React.isValidElement(children)) {
	        value = children;
        } else {
	        value = <RawHTML>{children.toString()}</RawHTML>
        }
    }

	return (
		<td {...props}>
            {value}
		</td>
	);
};

export default SelectableTableCell;
