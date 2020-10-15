const PostReducer = (state, { type, payload }) => {
    switch (type) {
        case "LOADING":
            return {
                ...state,
                postLoading : true 
            }

        case "GET":
            if (payload.posts.length < 5) {
                return{
                    ...state,
                    skip : state.skip + 5,
                    postLoading : false, 
                    posts : [
                        ...state.posts,
                        ...payload.posts
                    ],
                    hasMore : false
                }        
            }else{
                return{
                    ...state,
                    skip : state.skip + 5,
                    postLoading : false, 
                    posts : [
                        ...state.posts,
                        ...payload.posts
                    ]
                }    
            }

        case "LIKE":
            if (payload.like) {
                const newData = state.posts.map(post =>{
                    if (post._id === payload.postId) {
                        return{
                            ...post,
                            likes : [
                                ...post.likes,
                                payload._id
                            ]
                        }            
                    }else{
                        return post
                    }
                })
                return{
                    ...state,
                    posts : newData
                }                    
            }else{
                const newData = state.posts.map(post => {
                    if (post._id === payload.postId) {
                        let newLike = post.likes.filter(like => like !== payload._id)
                        return {
                            ...post,
                            likes : newLike
                        }  
                    }else{
                        return post
                    }
                })
                return{
                    ...state,
                    posts : newData
                }    
            }

        case "HEART":
            if (payload.hearted) {
                const newData = state.posts.map(post =>{
                    if (post._id === payload.postId) {
                        return{
                            ...post,
                            hearted : [
                                ...post.hearted,
                                payload._id
                            ]
                        }            
                    }else{
                        return post
                    }
                })
               return{
                    ...state,
                    posts : newData
                }                    
            }else{
                const newData = state.posts.map(post => {
                    if (post._id === payload.postId) {
                    let newLike = post.hearted.filter(hearted => hearted !== payload._id)
                        return {
                            ...post,
                            hearted : newLike
                        }  
                    }else{
                        return post
                    }
                })
                return{
                    ...state,
                    posts : newData
                }    
            }
        
        case "COMMENT":
            return{
                ...state,
                posts : payload
            }                        
        
        case "DELETE":
            const newData = state.posts.filter(item=>{
                return item._id !== payload
            })
            return{
                ...state,
                posts : newData
            }

        case "ERROR":
            return {
                ...state,
                postLoading : false,
                postError : "Something went wrong..." 
            }
                                                    
        default: return state
    }
}

export default PostReducer