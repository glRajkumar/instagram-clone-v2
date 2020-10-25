const CommentsReducer = (state, { type, payload }) => {
    switch (type) {
        case "LOADING":
            return {
                ...state,
                comLoading: true
            }

        case "GET":
            if (payload.comments.length < 5) {
                return {
                    ...state,
                    skip: state.skip + 5,
                    comLoading: false,
                    comments: [
                        ...state.comments,
                        ...payload.comments
                    ],
                    hasMore: false
                }
            } else {
                return {
                    ...state,
                    skip: state.skip + 5,
                    comLoading: false,
                    comments: [
                        ...state.comments,
                        ...payload.comments
                    ]
                }
            }

        case "ADD":
            return {
                ...state,
                comments: [
                    payload,
                    ...state.comments
                ]
            }

        case 'EDIT':
            const newData = state.comments.map(com => {
                if (com._id === payload.commentId) {
                    return {
                        ...com,
                        text: payload.text
                    }
                } else {
                    return com
                }
            })
            return {
                ...state,
                comments: newData
            }

        case "DELETE":
            const newdData = state.comments.filter(item => item._id !== payload)
            return {
                ...state,
                comments: newdData
            }

        case "ERROR":
            return {
                ...state,
                comLoading: false,
                comError: "Something went wrong..."
            }

        default: return state
    }
}

export default CommentsReducer