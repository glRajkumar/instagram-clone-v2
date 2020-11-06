const PostReducer = (state, { type, payload }) => {
    switch (type) {
        case "LOADING":
            return {
                ...state,
                postLoading: true
            }

        case "GET":
            if (payload.posts.length < 5) {
                return {
                    ...state,
                    skip: state.skip + 5,
                    postLoading: false,
                    posts: [
                        ...state.posts,
                        ...payload.posts
                    ],
                    hasMore: false
                }
            } else {
                return {
                    ...state,
                    skip: state.skip + 5,
                    postLoading: false,
                    posts: [
                        ...state.posts,
                        ...payload.posts
                    ]
                }
            }

        case "ACTION": {
            const newData = state.posts.map(post => {
                if (post._id === payload.postId) {
                    return {
                        ...post,
                        ...payload.info
                    }
                } else {
                    return post
                }
            })
            return {
                ...state,
                posts: newData
            }
        }

        case "DELETE":
            const newData = state.posts.filter(item => item._id !== payload)
            return {
                ...state,
                posts: newData
            }

        case "ERROR":
            return {
                ...state,
                postLoading: false,
                postError: "Something went wrong..."
            }

        default: return state
    }
}

export default PostReducer