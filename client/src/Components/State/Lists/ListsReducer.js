const ListsReducer = (state, { type, payload }) => {
    switch (type) {
        case "LOADING":
            return {
                ...state,
                listsLoading: true
            }

        case "GET":
            if (payload.lists.length < 10) {
                return {
                    ...state,
                    skip: state.skip + 10,
                    listsLoading: false,
                    lists: [
                        ...state.lists,
                        ...payload.lists
                    ],
                    hasMore: false
                }
            } else {
                return {
                    ...state,
                    skip: state.skip + 10,
                    listsLoading: false,
                    lists: [
                        ...state.lists,
                        ...payload.lists
                    ]
                }
            }

        case 'FOLLOW':
            const newData = state.lists.map(list => {
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
                lists: newData
            }

        case 'UNFOLLOW':
            const newData2 = state.lists.map(list => {
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
                lists: newData2
            }

        case 'REQ':
            const newData3 = state.lists.map(list => {
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
                lists: newData3
            }

        case 'UNREQ':
            const newData4 = state.lists.map(list => {
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
                lists: newData4
            }

        case 'ACCEPT':
            const newData5 = state.lists.map(list => {
                if (list._id === payload) {
                    return {
                        ...list,
                        isRequested: false,
                        isFollowing: true
                    }
                } else {
                    return list
                }
            })
            return {
                ...state,
                lists: newData5
            }

        case 'DECLINE':
            const newData6 = state.lists.filter(item => item._id !== payload)
            return {
                ...state,
                lists: newData6
            }

        case "ERROR":
            return {
                ...state,
                listsLoading: false,
                listsError: "Something went wrong..."
            }

        default: return state
    }
}

export default ListsReducer
