import axios from '../../axiosConfig'
import router from '../../router/index'


const state = {
    allUsers:[],
    friendIds:[],
    users: [],
    friendProfiles:[]
}

const getters = {
    getUsers: state => state.users,
    getAllUsers: state=>state.allUsers,
    getFriendIds: state=>state.friendIds,
    getFriendProfiles:state=>state.friendProfiles
  
}

const actions = {

   async signUp({commit,getters},userInfo){
        let user={
            username: userInfo.username,
            password: userInfo.password,
            email: userInfo.email,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
          };
          console.warn(user)
          console.warn(JSON.stringify(user))
          return await axios.post('/users/register', user)
          .then(data=>{
              console.warn(data)
          })
          .catch(err=>{
              console.warn(err)
          })

    },
    searchForUser({ commit}, query) {
        axios.get('/users/search/'+query).then(({data})=>{
            commit('SET_SEARCH_RESULTS', data)
         
        }).catch(()=>{
        })
       },
   
    clearSearchResults: ({ commit }) => commit('CLEAR_SEARCH_RESULTS'),

    async fetchFriendIds({commit}){
        axios.get('/users/friends').then(data=>{
            // console.log(data.data.followingUsers)
            commit('SET_FRIEND_IDS',data.data.followingUsers)
        })
    },
    async fetchFriendProfiles({commit}){
        axios.get('/users/friendsProfiles').then(data=>{
            // console.log(data.data.followingUsers)
            commit('SET_FRIEND_PROFILES',data.data)
        })
    },

    removeFrined({commit},id){
        commit('DELETE_FRIEND',id)
    },
    addFriendToList({commit},id){
        commit('ADD_FRIEND_TO_LIST',id)
    }
}

const mutations = {
    SET_SEARCH_RESULTS: (state, users) => {
        state.users = users
    },
    CLEAR_SEARCH_RESULTS: state => state.users = [],
    CLEAR_DATA: (state) => {
        state.users = []
    },
    SET_FRIEND_IDS:(state,ids)=>state.friendIds=ids,
    SET_FRIEND_PROFILES:(state,profiles)=>state.friendProfiles=profiles,
    DELETE_FRIEND: (state, friendId) => {
        var index = state.friendIds.findIndex(id => id === friendId)
        state.friendIds.splice(index, 1)
    },
    ADD_FRIEND_TO_LIST:(state,friendId)=>state.friendIds.push(friendId)
}

export default {
    state, getters, actions, mutations
}