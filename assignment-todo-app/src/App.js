import React, { Component } from 'react';
import './App.css';
import AppTasksArrange from './AppTasksArrange';
import AppTasksList from './AppTasksList';
import * as myConstClass from './constants';
import './Styles.css'

class App extends Component {

  constructor(props) {
      super(props);

      this.state = {
          tasksList: [{
              id: 1,
              currentState: myConstClass.TASK_STATUS.completed,
              title: 'test application',
              description: 'desp',
              createdAt: 'Mon May 02 2020 15:17:36 GMT+0530 (India Standard Time)',
              dueDate: 'Mon May 04 2020 15:17:36 GMT+0530 (India Standard Time)',
              priority: myConstClass.APPTASK_PRIORITY.high
          },
          {
              id: 2,
              currentState: myConstClass.TASK_STATUS.completed,
              title: 'test2',
              description: 'description of test',
              createdAt: 'Mon  May 03 2020 15:17:36 GMT+0530 (India Standard Time)',
              dueDate: 'Mon May 05 2020 15:17:36 GMT+0530 (India Standard Time)',
              priority: myConstClass.APPTASK_PRIORITY.medium
          },
          {
              id: 3,
              currentState:myConstClass.TASK_STATUS.pending,
              title: 'test3',
              description: 'description',
              createdAt: 'Mon May 04 2020 15:17:36 GMT+0530 (India Standard Time)',
              dueDate: 'Mon May 03 2020 15:17:36 GMT+0530 (India Standard Time)',
              priority: myConstClass.APPTASK_PRIORITY.low
          }
          ],
          taskDetails: {
              title: '',
              description: '',
              dueDate: new Date(),
              priority: '',
              createdAt: '',
              id: '',
              currentState: 'pending'
          }
      }
  }

  replaceModalItem() {
      this.setState({
          taskDetails: {
              title: '',
              description: '',
              dueDate: new Date(),
              priority: 'none',
              createdAt: '',
              id: '',
              currentState: 'pending'
          }
      })
  }

  addTaskDetails = (item) => {
      let tasksList = this.state.tasksList;
      let currentDate = new Date()
      item.id = currentDate.getTime() + Math.random();
      item.createdAt = currentDate
      tasksList.unshift(item)
      this.setState({ tasksList: tasksList })
  }

  render() {
      return (
          <div>
              <div className="row">
                  <div className="col-9">
                      <h1>TODO APPLICATION</h1>
                  </div>
                  <div className="col-3 mt-3">
                      <button className="pull-right btn btn-primary" onClick={() => this.replaceModalItem()} title="Create Task" data-toggle="modal" data-target="#addTaskModal"
                      >+</button>
                  </div>
              </div>

              <AppTasksList list={this.state.tasksList} />

              <AppTasksArrange {...this.state.taskDetails} modalId="addTaskModal" addTaskDetails={this.addTaskDetails} />
          </div>
      );
    }
  };
export default App;
