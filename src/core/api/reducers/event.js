import { ActionTypes } from "../constants/ActionTypes";
import moment from 'moment';


const initialState = {
  event: {
    name: '',
     id: null,
     isProject: null,
     description: '',
     location: '',
     isPrivate: null,
     startDate: '',
     endDate: '',
     isLimitedMember: null,
     maximumNumberOfMembers: null,
     eventMembers: [],
     eventAdmins: [],
     tasks : [],
     selectedTask : undefined,
     images: [],
     creator: {
       email: '',
       phoneNumber: null
     },
     categories: [],
  },
  status: 'idle',
  adminContent: "event",
  membersStatus: 'success',
     status: 'idle',

  //filters applied
  filter: {
    name: null,
    dateMin: null,
    dateMax: null,
    isPrivate: null,
    isProject: null,
    membersCountMin: null,
    membersCountMax: null,
    categories: null,
    pageNumber:1,
    pageSize:15
  },
  //Array of events which is returned byd back
  filteredEvents: [],
  shouldSendSearchRequest: true,
  loading:true
};

const event = ( state = initialState, {type, payload }) => {
  console.log("herher", payload);
  switch (type) {
    case ActionTypes.GET_EVENT_REQUEST:
      return {
        ...state,
        status: 'loading'
      };

    case ActionTypes.GET_EVENT_REQUEST_SUCCESS:
      return {
        ...state,
        event: payload.data,
        status: 'success'
      };

    case ActionTypes.GET_EVENT_REQUEST_FAILURE:
      return {
        ...state,
        status: 'error'
      };

    case ActionTypes.ADD_TASK:
            return {
                ...state,
                event: {
                  ...state.event,
                tasks : [...state.event.tasks, payload.task],
              }
            }
    case ActionTypes.REMOVE_TASK:
            return {
              ...state,
                event:{
                  ...state.event,
                  tasks : state.event.tasks.filter(({id}) => id != payload.id),
                  selectedTask : undefined
                }
            }
    case ActionTypes.EDIT_TASK:
            return {
              ...state,
                event:{
                  ...state.event,
                  tasks : state.event.tasks.map((task) => {
                    if(task.id == payload.id){
                        return {
                            ...task,
                            name : payload.name
                        }
                    } else {
                        return {
                            ...task
                        }
                    }
                }),
                selectedTask : {
                    ...state.event.selectedTask,
                    name : payload.name
                }
                }
            }
    case ActionTypes.CHANGE_STATUS:
            return {
              ...state,
                event:{
                  ...state.event,
                  tasks : state.event.tasks.map((task) => {
                    if(task.id == payload.id){
                        return {
                            ...task,
                            status : payload.status
                        }
                    } else {
                        return {
                            ...task
                        }
                    }
                }),
                selectedTask : {
                    ...state.event.selectedTask,
                    status : payload.status
                }
              }
            }
    case ActionTypes.ASSIGN_MEMBER:
            return {
              ...state,
                event:{
                  ...state.event,
                  tasks : state.event.tasks.map((task) => {
                    if(task.id == payload.id){
                        return {
                            ...task,
                            assignedMembers : [...task.assignedMembers, payload.memberId]
                        }
                    } else {
                        return {
                            ...task
                        }
                    }
                }),
                selectedTask : {
                    ...state.event.selectedTask,
                    assignedMembers : [ ...state.event.tasks.find((task) => {
                        return task.id == payload.id}).assignedMembers, payload.memberId]
                }
                }
            }
    case ActionTypes.SELECT_SUBTASK:
            return{
              ...state,
                event:{
                  ...state.event,
                  tasks : state.event.tasks,
                  selectedTask : state.event.tasks.find((task) => {
                    return task.id == payload.id})
                }
            }
    case ActionTypes.REMOVE_TASK_MEMBER:
            return{
              ...state,
                event:{
                  ...state.event,
                  tasks : state.event.tasks.map((task) => {
                    if(task.id == payload.id){
                        return{
                            ...task,
                            assignedMembers : task.assignedMembers.filter((memberId) => memberId != payload.memberId)
                        }
                    }else{
                        return{ ...task}
                    }
                }),
                selectedTask : {
                    ...state.event.selectedTask,
                    assignedMembers : state.event.selectedTask.assignedMembers.filter((memberId) => memberId != payload.memberId)
                }
                }
            }

    case ActionTypes.SET_ADMIN_CONTENT:
      return {
         ...state,
           adminContent: payload.content
       };

    case ActionTypes.SET_MEMBER_REQUEST:
      payload.olm();
      return {
        ...state,
        membersStatus: "loading"
      };

    case ActionTypes.SET_MEMBER_SUCCESS:
      payload.osm();
      return {
        ...state,
        event: {
          ...state.event,
          eventMembers: [...state.event.eventMembers, {email: payload.email}],
          eventAdmins: state.event.eventAdmins.filter((admin)=>{return admin.email != payload.email})
        },
        membersStatus: "success"
      };

    case ActionTypes.SET_MEMBER_FAILURE:
      payload.oem();
      return {
        ...state,
        membersStatus: "error"
      };

    case ActionTypes.SET_ADMIN_REQUEST:
      payload.olm();
      return {
        ...state,
        membersStatus: "loading"
      };

    case ActionTypes.SET_ADMIN_SUCCESS:
      payload.osm();
      return {
        ...state,
        event: {
          ...state.event,
          eventAdmins: [...state.event.eventAdmins, {email: payload.email}],
          eventMembers: state.event.eventMembers.filter((member)=>{return member.email != payload.email})
        },
        membersStatus: "success"
      };

    case ActionTypes.SET_ADMIN_FAILURE:
      payload.oem();
      return {
        ...state,
        membersStatus: "error"
      };

    case ActionTypes.KICK_MEMBER_REQUEST:
      payload.olm();
      return {
        ...state,
        membersStatus: "loading"
      }

    case ActionTypes.KICK_MEMBER_SUCCESS:
      payload.osm();
      return {
        ...state,
        event: {
          ...state.event,
          eventMembers: state.event.eventMembers.filter((member) => {return member.email !== payload.email}),
          eventAdmins: state.event.eventAdmins.filter((admin) => {return admin.email !== payload.email})
        },
        membersStatus: "success"
      }

    case ActionTypes.KICK_MEMBER_FAILURE:
      payload.oem();
      return {
        ...state,
        membersStatus: "error"
      }

    case ActionTypes.SET_FILTERING:
      return{
        ...state,
        filter: payload
      }

    case ActionTypes.GET_EVENTS_LIST:
      return{
        ...state,
        filteredEvents: state.filteredEvents.concat(payload),
        shouldSendSearchRequest:true,
        loading:false
      }

    case ActionTypes.SEND_FILTER_REQUEST:
      return {
        ...state,
        shouldSendSearchRequest: false,
        loading:true
      }

    case ActionTypes.RESET_FILTERED_EVENTS:
      return {
        ...state,
        filteredEvents: []
      }

    default:
      return state;
    };
}

export default event;
