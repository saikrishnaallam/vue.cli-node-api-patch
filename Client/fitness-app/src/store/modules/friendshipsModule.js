const state = {
    receivedFriendRequests: [],
    sentFriendRequests: [],
    friends: [],
}

const getters = {
    getReceivedFriendRequests: (state) => state.receivedFriendRequests,
    getSentFriendRequest: (state) => (recipient_id) => state.sentFriendRequests.find(fr => fr.recipient._id === recipient_id),
    getFriends: state => state.friends.map(fr=>fr._id),
    getFriendsObjects: state=>state.friends,
    getIfUserHasSentRequestToUser: state => user_id => state.sentFriendRequests.filter(fr => fr.id == user_id).length > 0 ? true : false,
}

const actions = {
    sendFriendRequest: ({ commit, getters }, recipient_id) => {
        let friend=getters.getAllUsers.find(o => o.id === recipient_id)
        let data=JSON.stringify(friend);
         console.warn(data)
        commit('ADD_SENT_FRIEND_REQUEST', friend)
    },
   
}

const mutations = {
    
    ADD_FRIEND: (state, friend_id) => {
        state.friends.push(friend_id)
    },
    SET_FRIENDS: (state, friends) => {
        state.friends = friends
    },
    ADD_SENT_FRIEND_REQUEST: (state, request) => state.sentFriendRequests.push(request),
    CLEAR_DATA: (state) => {
        state.receivedFriendRequests = []
        state.sentFriendRequests = []
        state.friends = []
       
    }
}

export default {
    state, getters, actions, mutations
}