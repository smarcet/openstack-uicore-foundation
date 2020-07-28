import React from 'react';

export default class SelectableActionsTableCell extends React.Component {

    constructor(props) {
        super(props);

        this.handleAction = this.handleAction.bind(this);
        this.shouldDisplayAction = this.shouldDisplayAction.bind(this);

    }

    shouldDisplayAction(action) {
        let {id} = this.props;

        if (!action.hasOwnProperty('display')) {
            return true;
        } else {
            return action.display(id);
        }
    }

    handleAction(action, id, ev) {
        ev.stopPropagation();
        ev.preventDefault();

        action(id);
    }

    render() {
        let {actions, id} = this.props;
        return (
            <td className="actions" key="actions">
                {actions.hasOwnProperty('delete') && this.shouldDisplayAction(actions.delete)  &&
                    <a href="" data-tip="delete" onClick={this.handleAction.bind(this, actions.delete.onClick, id)} >
                        <i className="fa fa-trash-o delete-icon"></i>
                    </a>
                }
                {actions.hasOwnProperty('custom') && actions.custom.map(a =>
                    this.shouldDisplayAction(a) &&
                    <a href="" data-tip={a.tooltip} key={'custom_' + a.name} onClick={this.handleAction.bind(this, a.onClick, id)}>
                        {a.icon}
                    </a>
                )}
            </td>
        );
    }
};
