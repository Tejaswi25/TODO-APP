import React, { Component } from 'react';
import * as myConstClass from './constants';
import moment from 'moment/moment.js'
import AppTasksArrange from './AppTasksArrange';


const SORT_AS_TYPES = {
    ASC: 'ASC',
    DESC: 'DESC'
}

const COLUMN_NAMES = {
    summary: 'title',
    priority: 'priority',
    createdAt: 'createdAt',
    dueDate: 'dueDate'
}

class AppTasksTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tasksList: [],
            groupBy: 'none',
            searchWord: '',
            activeStatus: '',
            selectedIndex: undefined,
            selectedTask: {
                title: '',
                description: '',
                dueDate: '',
                priority: '',
                createdAt: '',
                id: '',
                currentState: ''
            },
            tableHeader: '',
            sortFor: {
                type: '',
                sortAs: ''
            },
            columnSortElements: {
                title: '',
                priority: '',
                createdAt: '',
                dueDate: ''
            }
        }
    }

    saveModalDetails = (item) => {
        const selectedIndex = this.state.selectedIndex;
        let tasksList = this.state.tasksList;
        tasksList[selectedIndex] = item;
        this.setFilteredList({ ...this.state, tasksList: this.getAllTasksList(tasksList) })
    }

    getAllTasksList = (tasksList) => {
        return tasksList.filter(task => task.groupName === undefined)
    }


    componentWillReceiveProps(props) {
        this.setFilteredList(props)
    }


    setFilteredList(props) {
        const filterdList = this.getFilterdTasksList(props);
        this.setState({ ...this.state, ...props, tasksList: filterdList }, () => {
        })
    }


    componentWillMount() {
        this.setState({
            tableHeader: this.getTableHeader()
        })
    }


    getFilterdTasksList = ({ tasksList, groupBy, searchWord, activeStatus }) => {
        const lowerCaseSearchWord = searchWord.toLowerCase()
        let filterdList = tasksList
        if (activeStatus !== 'all') {
            filterdList = tasksList.filter(this.checkCurrentStatus, activeStatus);
        }

        filterdList = filterdList.filter(this.checkSearchWord, lowerCaseSearchWord);

        switch (groupBy) {
            case myConstClass.GROUP_BY_TASKS.none:
                return filterdList;

            case myConstClass.GROUP_BY_TASKS.priority:
                return this.groupBy(filterdList, COLUMN_NAMES.priority);

            case myConstClass.GROUP_BY_TASKS.createdOn:
                return this.groupBy(filterdList, COLUMN_NAMES.createdAt, 'date');

            case myConstClass.GROUP_BY_TASKS.pendingOn:
                return this.groupBy(filterdList, COLUMN_NAMES.dueDate, 'date');

        }
        return filterdList;
    }


    groupBy(list, keyVal, type = '') {
        const map = new Map();
        let res = [];
        list.forEach((item) => {
            let key;
            if (type) {
                const taskDate = new Date(item[keyVal])
                key = moment(taskDate).format('YYYY-MM-DD')
            } else {
                key = item[keyVal]
            }
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });

        let index = 0;

        map.forEach(function (val, key) {
            res.push({ id: new Date().getTime() + index, groupName: key }, ...val);
            index++;
        });
        return res;
    }

    checkCurrentStatus(task) {
        return task.currentState === this
    }

    checkSearchWord(task) {
        return task.title.toLowerCase().includes(this) || task.description.toLowerCase().includes(this)
    }

    replaceModalItem(index) {
        const selectedTask = this.state.tasksList[index]
        this.setState.bind(this)({
            selectedIndex: index,
            selectedTask: selectedTask
        }, () => {
        });

    }


    removeTask = (index) => {
        let tasksList = this.state.tasksList
        if (window.confirm('Are you want to delete?')) {
            tasksList.splice(index, 1)
            this.setState({
                tasksList
            })
        }
    }


    handleSorting = (sortFor) => {
        let sortForObj = {
            type: '',
            sortAs: ''
        }
        
        sortForObj = this.getSortForObj(sortFor)
        const allTasksList = this.getAllTasksList(this.state.tasksList)
        const sortedTasksList = this.getSortedTasksList(sortForObj, allTasksList)

        this.setFilteredList({ ...this.state, tasksList: sortedTasksList })
        this.setState({
            sortFor: sortForObj
        }, () => {
            this.setState({
                tableHeader: this.getTableHeader()
            })
        })
        
    }


    getSortedTasksList = (sortForObj, allTasksList) => {
        const sortedList = this.sortByProperty(allTasksList, sortForObj.type, sortForObj.sortAs)
        return sortedList
    }


    sortByProperty(array, property, order = SORT_AS_TYPES.ASC) {

        if (property === COLUMN_NAMES.priority) {
            const sortedList = []

            let group = array.reduce(function(a, e) {
                let estKey = e[property];
                (a[estKey] ? a[estKey] : (a[estKey] = null || [])).push(e);
                return a;
              }, {});

            if (order === SORT_AS_TYPES.ASC) {
                if (group[myConstClass.APPTASK_PRIORITY.high]) {
                    sortedList.push(...group[myConstClass.APPTASK_PRIORITY.high])
                }
                if (group[myConstClass.APPTASK_PRIORITY.medium]) {
                    sortedList.push(...group[myConstClass.APPTASK_PRIORITY.medium])
                }
                if (group[myConstClass.APPTASK_PRIORITY.low]) {
                    sortedList.push(...group[myConstClass.APPTASK_PRIORITY.low])
                }
                if (group[myConstClass.APPTASK_PRIORITY.none]) {
                    sortedList.push(...group[myConstClass.APPTASK_PRIORITY.none])
                }
            } else {
                if (group[myConstClass.APPTASK_PRIORITY.none]) {
                    sortedList.push(...group[myConstClass.APPTASK_PRIORITY.none])
                }
                if (group[myConstClass.APPTASK_PRIORITY.low]) {
                    sortedList.push(...group[myConstClass.APPTASK_PRIORITY.low])
                }
                if (group[myConstClass.APPTASK_PRIORITY.medium]) {
                    sortedList.push(...group[myConstClass.APPTASK_PRIORITY.medium])
                }
                if (group[myConstClass.APPTASK_PRIORITY.high]) {
                    sortedList.push(...group[myConstClass.APPTASK_PRIORITY.high])
                }
            }
            return sortedList

        } else if (property === COLUMN_NAMES.createdAt || property === property.dueDate) { 
            if (order === SORT_AS_TYPES.ASC) {
                const descArrList = array.sort((a, b) => new Date(b[property]) - new Date(a[property]))
                return descArrList.reverse()
            } else {
                return array.sort((a, b) => new Date(b[property]) - new Date(a[property]))
            }


            
        } else {
            return array.sort((a, b) => order === SORT_AS_TYPES.ASC ?
                a[property] > b[property] ? 1 : a[property] < b[property] ? -1 : 0
                : a[property] > b[property] ? -1 : a[property] < b[property] ? 1 : 0
            )
        }
        
    }

    getSortForObj = (type) => {
        const sortFor = {
            type: '',
            sortAs: ''
        }
        if (this.state.sortFor.type !== type) {
            sortFor['sortAs'] = SORT_AS_TYPES.ASC
        } else {
            sortFor['sortAs'] = (this.state.sortFor.sortAs === SORT_AS_TYPES.ASC) ? SORT_AS_TYPES.DESC : SORT_AS_TYPES.ASC
        }
        sortFor['type'] = type
        return sortFor
    }

    updateCurrentStatus = (index) => {
        let tasksList = this.state.tasksList
        let currentStatus = tasksList[index]['currentState']

        if (currentStatus === myConstClass.TASK_STATUS.pending) {
            tasksList[index]['currentState'] = myConstClass.TASK_STATUS.completed
        } else {
            tasksList[index]['currentState'] = myConstClass.TASK_STATUS.pending
        }

        this.setState.bind(this)({
            tasksList
        }, () => {
            this.setFilteredList(this.state)
        })
    }

    getTableElements = (tasksList) => {
        return tasksList.map((task, index) => {
            if (task.groupName) {
                return (
                    <tr key={task.id}>
                        <td className="text-center" colSpan="6"><b><u>{task.groupName.toUpperCase()}</u></b></td>
                    </tr>
                )
            }

            let statusButton;

            if (task.currentState === myConstClass.TASK_STATUS.pending) {
                statusButton = <button title="Update Status" className="btn btn-success mr-2" onClick={() => this.updateCurrentStatus(index)} >Done</button>
            } else {
                statusButton = <button title="Update Status" className="btn btn-info mr-2" onClick={() => this.updateCurrentStatus(index)}>Re-Open</button>
            }

            return (
                
                <tr key={task.id} className={task.currentState}>
                    <td>{task.title}</td>
                    <td>{task.priority}</td>
                    <td>{moment(new Date(task.createdAt)).format('YYYY-MM-DD')}</td>
                    <td>{moment(new Date(task.dueDate)).format('YYYY-MM-DD')}</td>
                    <td>
                        <button title="Edit" className="btn btn-primary mr-2" data-toggle="modal" data-target="#updateTaskModal"
                            onClick={() => this.replaceModalItem(index)}><i className="fa fa-edit"></i></button>
                        {statusButton}
                        <button title="Delete" className="btn btn-danger" onClick={() => this.removeTask(index)}><i className="fa fa-trash"></i></button>
                    </td>
                </tr>
            )
        })
    }


    getTableHeader = () => {
        const defaultSortElement = <i className="fa fa-sort"></i>
        const sortElementObj = {
            title: defaultSortElement,
            priority: defaultSortElement,
            createdAt: defaultSortElement,
            dueDate: defaultSortElement
        }

        if (this.state.sortFor.type) {
            sortElementObj[this.state.sortFor.type] = (this.state.sortFor.sortAs === SORT_AS_TYPES.ASC) ? <i className="fa fa-sort-desc"></i> : <i className="fa fa-sort-asc"></i>
        }
        return (
            <tr>
                <th>Summary <button className="btn btn-primary pull-right" onClick={() => this.handleSorting(COLUMN_NAMES.summary)}>{ sortElementObj.title }</button></th>
                <th>Priority <button className="btn btn-primary pull-right" onClick={() => this.handleSorting(COLUMN_NAMES.priority)}>{ sortElementObj.priority }</button></th>
                <th>Created On <button className="btn btn-primary pull-right" onClick={() => this.handleSorting(COLUMN_NAMES.createdAt)}>{ sortElementObj.createdAt }</button></th>
                <th>Due Date <button className="btn btn-primary pull-right" onClick={() => this.handleSorting(COLUMN_NAMES.dueDate)}>{ sortElementObj.dueDate }</button></th>
                <th className="action">Actions</th>
            </tr>
        )
    }





    render() {
        const { tasksList } = this.state
        let tasksListElement;


        const tableElements = this.getTableElements(tasksList)

        return (
            <React.Fragment>
                <div className="table-responsive">
                    <table className="tasks-list table table-bordered">
                        <thead>
                            {this.state.tableHeader}
                        </thead>
                        <tbody>
                            {tableElements}
                        </tbody>
                    </table>
                 </div> 
                <AppTasksArrange {...this.state.selectedTask} modalId="updateTaskModal" saveModalDetails={this.saveModalDetails} />
            </React.Fragment>

        );
    }
}

export default AppTasksTable;