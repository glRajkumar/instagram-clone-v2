export default (state, action) => {
    switch (action.type) {
        case "LOADING":
            return {
                ...state,
                loading: true
            }

        case "LOGIN":
            return {
                _id: action.payload._id,
                fullName: action.payload.fullName,
                userName: action.payload.userName,
                email: action.payload.email,
                img: action.payload.img,
                followersCount: action.payload.followersCount,
                followingCount: action.payload.followingCount,
                totalPosts: action.payload.totalPosts,
                isPublic: action.payload.isPublic,
                auth: action.payload.auth,
                token: action.payload.token,
                loading: false
            }

        case "IMG":
            return {
                ...state,
                img: action.payload.imgName
            }

        case "PUBLIC":
            return {
                ...state,
                isPublic: !state.isPublic
            }

        case "FOLLOW":
            return {
                ...state,
                followingCount: state.followingCount + action.payload.followingCount
            }

        case "FOLLOWERS":
            return {
                ...state,
                followersCount: state.followersCount + 1
            }

        case "TOTALPOSTS":
            return {
                ...state,
                totalPosts: state.totalPosts + action.payload.totalPosts
            }

        case "LOGOUT":
            return {
                _id: "",
                fullName: "",
                userName: "",
                email: "",
                img: null,
                followersCount: 0,
                followingCount: 0,
                totalPosts: 0,
                token: "",
                isPublic: true,
                auth: false,
                loading: false,
                error: ""
            }

        case "ERROR":
            return {
                ...state,
                loading: false,
                error: "Something went wrong..."
            }

        default: return state
    }
}