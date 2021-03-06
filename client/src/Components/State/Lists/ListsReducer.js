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

        case 'ACTION':
            const newData = state.lists.map(list => {
                if (list._id === payload.id) {
                    return {
                        ...list,
                        ...payload.info
                    }
                } else {
                    return list
                }
            })
            return {
                ...state,
                lists: newData
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
