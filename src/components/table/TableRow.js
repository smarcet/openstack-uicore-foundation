import React from 'react';

export default class TableRow extends React.Component {

    constructor(props) {
        super(props);

    }

    shouldDisplayAction(action) {
        let {id} = this.props;

        if (!action.hasOwnProperty('display')) {
            return true;
        } else {
            return action.display(id);
        }
    }

    render() {
        let {even, actions, id, children} = this.props;
        let canEdit = (actions.hasOwnProperty('edit') && this.shouldDisplayAction(actions.edit));
        let rowClass = even ? 'even' : 'odd';

        if (canEdit) {
            return (
                <tr role="row" className={rowClass + " can-edit"} onClick={actions.edit.onClick.bind(this, id)}>
                    {children}
                </tr>
            );
        } else {
            return (
                <tr role="row" className={rowClass}>
                    {children}
                </tr>
            );
        }
    }
};

