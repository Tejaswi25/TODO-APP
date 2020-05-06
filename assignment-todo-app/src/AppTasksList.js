import React, { Component } from 'react';
import * as myConstClass from './constants';
import AppTasksTable from './AppTable';

class AppTasksList extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            tasksList: [],
            groupBy: 'none',
            searchWord: '',
            activeStatus: 'all'
        }
    }

    updateGroupByVal = (event) => {
        this.setState({
            groupBy: event.target.value
        })
    }

    searchTaskByVal = (event) => {
        this.setState({
            searchWord: event.target.value
        })
    }


    componentDidMount() {
        const { list } = this.props;

        this.setState({
            tasksList: list
        })
    }


    updateActiveStatus = (selectedStatus) => {
        let navTabsElement = document.getElementById('statusTabs')
        var matchedElements = navTabsElement.getElementsByClassName('nav-link');
        for (var i=0; i<matchedElements.length; i++) {
            matchedElements[i].classList.remove('active');
        }

        let element = document.getElementById(selectedStatus+'Tab');
        element.classList.add("active");

        this.setState({
            activeStatus: selectedStatus
        })
    }


    render() {

        return (
            <div className="mt-3">
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-4 col-md-3 col-lg-3 col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="groupBy">Group By</label>
                                    <select className="form-control" value={this.state.groupBy} onChange={this.updateGroupByVal}>
                                        <option value='none'>None</option>
                                        <option value={myConstClass.GROUP_BY_TASKS.createdOn}>Created On</option>
                                        <option value={myConstClass.GROUP_BY_TASKS.pendingOn}>Pending On</option>
                                        <option value='priority'>Priority</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-8 col-md-9 col-lg-9 col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="search">Search</label>
                                    <input type="text" className="form-control" placeholder="Search Tasks" onChange={this.searchTaskByVal} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ul className="nav nav-tabs" id="statusTabs">
                    <li className="nav-item">
                        <a className="nav-link all active" id="allTab" onClick={() => this.updateActiveStatus('all')} >All</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link pending" id="pendingTab" onClick={() => this.updateActiveStatus('pending')} >Pending</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link completed" id="completedTab" onClick={() => this.updateActiveStatus('completed')} >Completed</a>
                    </li>
                </ul>

                <div className="row">
                    <div className="col-12">
                    
                        <AppTasksTable {...this.state} />
                    </div>

                </div>
            </div>
        );
    }
}

export default AppTasksList;