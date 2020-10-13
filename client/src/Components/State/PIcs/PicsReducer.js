const PicsReducer = (state, { type, payload }) => {
    switch (type) {
        case "LOADING":
            return {
                ...state,
                loading : true 
            }

        case "GET":
            if (payload.pics.length < 6) {
                return{
                    ...state,
                    skip : state.skip + 6,
                    loading : false, 
                    pics : [
                        ...state.pics,
                        ...payload.pics
                    ],
                    hasMore : false
                }        
            }else{
                return{
                    ...state,
                    skip : state.skip + 6,
                    loading : false, 
                    pics : [
                        ...state.pics,
                        ...payload.pics
                    ]
                }    
            }

        case "ERROR":
            return {
                ...state,
                loading : false,
                error : "Something went wrong..." 
            }
                                                    
        default: return state
    }
}

export default PicsReducer