import React from 'react';
import PropTypes from 'prop-types';

class SelectableTableHeading extends React.Component {

	constructor (props) {
		super(props);
		this.handleSort = this.handleSort.bind(this);
	}

	getSortClass() {

		if (!this.props.sortable) return null;

		switch(this.props.sortDir) {
			case 1:
				return 'sorting_asc';
			case -1:
				return 'sorting_desc';
			default:
				return this.props.sortable ? 'sorting' : null
		}
	}

	handleSort(e) {
		e.preventDefault();
		if(!this.props.hasOwnProperty('onSort') || !this.props.sortable) return;

		this.props.onSort(
			this.props.columnIndex,
			this.props.columnKey,
			this.props.sortDir ? this.props.sortDir*-1 : 1,
			this.props.sortFunc
		);
	}

	render () {
		return (
			<th onClick={this.handleSort}
				className={this.getSortClass()}
				width={this.props.width}
				>
				{this.props.children}
			</th>
		);	
	}
	
}

SelectableTableHeading.propTypes = {
	onSort: PropTypes.func,
	sortDir: PropTypes.number,
	columnIndex: PropTypes.number,
	columnKey: PropTypes.any,
	sortable: PropTypes.bool,
	sortFunc: PropTypes.func
};

export default SelectableTableHeading;