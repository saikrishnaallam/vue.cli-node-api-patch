import axios from '../../axiosConfig'
const state = {
    posts: [],
    postVisibility: [
        "Private",
        "Friends",
        "Public"
    ],
    feedFilterOptions: [
        {
            name: "My posts",
            needsToBeLoggedIn: true
        },
        {
            name: "Friends posts",
            needsToBeLoggedIn: true
        },
        {
            name: "Public posts",
            needsToBeLoggedIn: false
        },
    
    ]
}


const getters = {
    getAllPosts: state => state.posts,
    getPostVisibility: state => state.postVisibility,
    getFeedFilterOptions: state => state.feedFilterOptions,
}

const actions = {
       async addNewExercisePost({commit,getters},postInput){
            console.warn(postInput)
            await axios.post('/exercise/add', postInput).then(data=>{
                    var post=data.data.post
                    post.user_id=getters.getCurrentUser
                    console.log(post)
                    commit('ADD_POST',post)

            }).catch(()=>{})
        },
        async addNewFoodPost({commit,getters},postInput){
            console.warn(postInput)
            await axios.post('/food/add', postInput).then(data=>{
                    var post=data.data.post
                    post.user_id=getters.getCurrentUser
                    console.log(post)
                    commit('ADD_POST',post)

            }).catch(()=>{})
        },

       async fetchMyPosts({commit}){
        axios.get('/posts/my-posts').then(({data})=>{
            commit('SET_POSTS', data)
         
        }).catch(()=>{
        })
       },
       async fetchPublicPosts({commit}){
        axios.get('/posts/public-posts').then(({data})=>{
            commit('SET_POSTS', data)
         
        }).catch(()=>{
        })
       },
       async fetchFriendPosts({commit}){
        axios.get('/posts/friend-posts').then(({data})=>{
            commit('SET_POSTS', data)
         
        }).catch(()=>{
        })
       }

}




const mutations = {
    ADD_POST: (state, post) => state.posts.unshift(post),
    DELETE_POST: (state, post_id) => {
        var index = state.privatePosts.findIndex(post => post._id === post_id)
        state.privatePosts.splice(index, 1)
    },
    SET_POSTS:(state,posts)=>state.posts=posts,
}

export default {
    state, getters, actions, mutations
}