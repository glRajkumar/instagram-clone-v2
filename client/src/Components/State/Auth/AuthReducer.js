export default (state, action) => {
    switch (action.type) {
        case "LOADING":
            return {
                ...state,
                loading : true 
            }

        case "LOGIN":
            return {
                ...state,
                _id : action.payload._id,
                name : action.payload.name,
                email : action.payload.email,
                img : action.payload.img,
                auth : action.payload.auth,
                token : action.payload.token, 
                followers : action.payload.followers, 
                following : action.payload.following,                 
                loading : false 
            }

        case "IMG":        
            return {
                ...state,
                img : action.payload.imgName
            }

        case "FOLLOW":        
            return {
                ...state, 
                following : action.payload.following
            }
    
        case "LOGOUT":
            return {
                ...state,
                _id: "",
                name : "",
                email : "",
                img : "",
                auth : false,
                token : "",
                followers : [], 
                following : [],                             
                loading : false 
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