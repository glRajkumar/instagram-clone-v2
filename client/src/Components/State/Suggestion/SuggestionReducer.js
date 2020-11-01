const SuggestionReducer = (state, { type, payload }) => {
    switch (type) {
        case "LOADING":
            return {
                ...state,
                sugLoading: true
            }

        case "GET":
            if (payload.suggestions.length < 10) {
                return {
                    ...state,
                    skip: state.skip + 10,
                    sugLoading: false,
                    suggestions: [
                        ...state.suggestions,
                        ...payload.suggestions
                    ],
                    hasMore: false
                }
            } else {
                return {
                    ...state,
                    skip: state.skip + 10,
                    sugLoading: false,
                    suggestions: [
                        ...state.suggestions,
                        ...payload.suggestions
                    ]
                }
            }

        case 'FOLLOW':
            const newData = state.suggestions.map(list => {
                if (list._id === payload) {
                    return {
                        ...list,
                        isFollowing: true
                    }
                } else {
                    return list
                }
            })
            return {
                ...state,
                suggestions: newData
            }

        case 'UNFOLLOW':
            const newData2 = state.suggestions.map(list => {
                if (list._id === payload) {
                    return {
                        ...list,
                        isFollowing: false
                    }
                } else {
                    return list
                }
            })
            return {
                ...state,
                suggestions: newData2
            }

        case 'REQ':
            const newData3 = state.suggestions.map(list => {
                if (list._id === payload) {
                    return {
                        ...list,
                        isRequested: true
                    }
                } else {
                    return list
                }
            })
            return {
                ...state,
                suggestions: newData3
            }

        case 'UNREQ':
            const newData4 = state.suggestions.map(list => {
                if (list._id === payload) {
                    return {
                        ...list,
                        isRequested: false
                    }
                } else {
                    return list
                }
            })
            return {
                ...state,
                suggestions: newData4
            }

        case "ERROR":
            return {
                ...state,
                sugLoading: false,
                sugError: "Something went wrong..."
            }

        default: return state
    }
}

export default SuggestionReducer
