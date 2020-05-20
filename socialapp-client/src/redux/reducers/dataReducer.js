import {SET_SCREAMS,LIKE_SCREAM,UNLIKE_SCREAM,LOADING_DATA} from '../types';

const initialState={
    screams:[],
    scream:{},
    loading:false
};


export default function(state=initialState,action){
    switch (actions.type) {
        case LOADING_DATA:
            
            return {
                ...state,
                loading:true
            }
            case SET_SCREAMS:
            
                return {
                    ...state,
                    screams:action.payload,
                    loading:false
                }

                case LIKE_SCREAM:
            
                    return {
                        ...state,
                        loading:true
                    }
        default:
            break;
    }
}