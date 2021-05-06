import router from '../../router/index'
import axios from '../../axiosConfig'


const state = {
    currentUser: null,
    token: null,
}

const getters = {
    getCurrentUser: state => state.currentUser,
    getCurrentUserUsername: state =>  state.currentUser ? state.currentUser.username : null,
    getCurrentUserFullName: state =>  state.currentUser ? `${state.currentUser.firstName} ${state.currentUser.lastName}` : null,
    getCurrentUserId: state => state.currentUser ? state.currentUser._id : null,
    getToken: state => state.token,
    isLoggedIn: state => state.currentUser ? true : false,
    getLikedPosts:state =>state.currentUser.likedPosts,
    getCurrentUserWeight:state=>state.currentUser.weight,
    isAdmin:state=> state.currentUser.role==="ADMIN" ? true : false
}

const actions = {
    //Signs user in, retrieves validation token from server
    removeFriend({commit,getters},friendId){
        commit('REMOVE_FRIEND',friendId)
    },
    addFriend({commit},friendId){
        
        commit('ADD_FRIEND_TOUSER',friendId)
        console.warn(friendId)

    },
    likePost({commit,getters} ,postId){
        if(getters.getLikedPosts.includes(postId)){
            commit("REMOVE_LIKED_POST",postId)
        }else{
        commit('ADD_LIKED_POST',postId)}
        // console.warn(getters.getLikedPosts)
    },

    async signIn({commit,getters}, credentials){
            // this will send credentials to back for checking
            console.log(credentials)
            return await axios.post('/users/login', credentials).then(({data})=>{
                sessionStorage.setItem('authorization', data.token)
                sessionStorage.setItem('user', JSON.stringify(data.user))
                commit('SIGN_IN_USER', data)
                axios.defaults.headers['authorization'] = data.token
                router.push('/')
                return true
            }).catch(()=>{
                sessionStorage.removeItem('authorization')
                sessionStorage.removeItem('user')
                axios.defaults.headers['authorization'] = ''
                return false
            })
        }
    ,
    //Signs out current user
    signOut({commit}){
        sessionStorage.removeItem('authorization')
        sessionStorage.removeItem('user')
        // commit('CLEAR_DATA')
        commit('SIGN_OUT_USER')
        router.push('/SignIn')
    },
    signInFromSessionStorage({commit}){
        var user = sessionStorage.getItem('user')
        var token = sessionStorage.getItem('authorization')
        axios.defaults.headers['authorization'] = token

        if(user !== null && token !== null) commit('SIGN_IN_USER', {user: JSON.parse(user), token: token})
        
    },

}
const mutations = {
    SET_CURRENT_USER: (state, user) => state.currentUser = user,
    SET_TOKEN: (state, token) => state.token = token,
    SIGN_IN_USER: (state, { user, token })=>{
        state.currentUser = user
        state.token = token
    },
    SIGN_OUT_USER: (state)=>{
        state.currentUser = null
        state.token = null
    },
    ADD_LIKED_POST:(state,postId) =>{state.currentUser.likedPosts.push(postId) },
    REMOVE_LIKED_POST:(state,postId) =>{
        let index = state.currentUser.likedPosts.indexOf(postId);
        console.warn(index)
        if (index > -1) {
            state.currentUser.likedPosts.splice(index, 1);
        }
        },
    ADD_FRIEND_TOUSER:(state,friendId)=>{state.currentUser.friends.push(friendId)},
    REMOVE_FRIEND:(state,friendId)=>{
        let index = state.currentUser.friends.indexOf(friendId);
        if(index > -1){
            state.currentUser.friends.splice(friendId)
        }
    }
}

export default {
    state, getters, actions, mutations
}