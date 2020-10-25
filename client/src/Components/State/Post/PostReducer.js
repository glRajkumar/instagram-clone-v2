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

        case "LIKE":
            if (payload.like) {
                const newData = state.posts.map(post => {
                    if (post._id === payload.postId) {
                        return {
                            ...post,
                            isLiked: true,
                            likesCount: post.likesCount + 1
                        }
                    } else {
                        return post
                    }
                })
                return {
                    ...state,
                    posts: newData
                }
            } else {
                const newData = state.posts.map(post => {
                    if (post._id === payload.postId) {
                        return {
                            ...post,
                            isLiked: false,
                            likesCount: post.likesCount - 1
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

        case "SAVE":
            if (payload.save) {
                const newData = state.posts.map(post => {
                    if (post._id === payload.postId) {
                        return {
                            ...post,
                            isSaved: true
                        }
                    } else {
                        return post
                    }
                })
                return {
                    ...state,
                    posts: newData
                }
            } else {
                const newData = state.posts.map(post => {
                    if (post._id === payload.postId) {
                        return {
                            ...post,
                            isSaved: false
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

        case "HEART":
            if (payload.hearted) {
                const newData = state.posts.map(post => {
                    if (post._id === payload.postId) {
                        return {
                            ...post,
                            isHearted: true
                        }
                    } else {
                        return post
                    }
                })
                return {
                    ...state,
                    posts: newData
                }
            } else {
                const newData = state.posts.map(post => {
                    if (post._id === payload.postId) {
                        return {
                            ...post,
                            isHearted: false
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

        case 'COMMENT':
            const newsData = state.posts.map(post => {
                if (post._id === payload) {
                    return {
                        ...post,
                        commentsCount: post.commentsCount + 1
                    }
                } else {
                    return post
                }
            })
            return {
                ...state,
                posts: newsData
            }

        case "DELETE":
            const newData = state.posts.filter(item => {
                return item._id !== payload
            })
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