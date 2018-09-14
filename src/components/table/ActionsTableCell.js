import React from 'react';

export default class ActionsTableCell extends React.Component {

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
        let {actions, id} = this.props;
        return (
            <td className="actions" key="actions">
                {actions.hasOwnProperty('delete') && this.shouldDisplayAction(actions.delete)  &&
                    <a href="" onClick={actions.delete.onClick.bind(this, id)} >
                        <i className="fa fa-trash-o delete-icon"></i>
                    </a>
                }
                {'custom' in actions && actions.custom.map(a =>
                    this.shouldDisplayAction(a, id) &&
                    <a href="" key={'custom_' + a.name} onClick={a.onClick.bind(this, id)}>
                        {a.icon}
                    </a>
                )}
            </td>
        );
    }
};
