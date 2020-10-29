import React, { useState } from 'react'
import user from '../../Img/user.svg'
import edit from '../../Img/edit.png'
import del from '../../Img/delete.png'
import { useParams } from 'react-router-dom'
import useComments from '../Customs/useComments'
import Loading from '../Common/Loading'
import '../../CSS/comment.css'
import { getTime } from '../Customs/getTime'

function Comments() {
    const { postid } = useParams()
    const [editCom, setEdit] = useState({
        edit: false,
        id: '',
        text: ''
    })
    const [_id, comments, hasMore, comLoading, comError, initComLoad, getComments, makeComment, editComment, deleteComment] = useComments(postid)

    return !initComLoad ? (
        <div className="commets">
            {
                editCom.edit &&
                <div className="cmt-edit">
                    <input
                        type="text"
                        value={editCom.text}
                        className="input-box"
                        onChange={(e) => {
                            e.persist()
                            setEdit(prev => {
                                return {
                                    ...prev,
                                    text: e.target.value
                                }
                            })
                        }}
                    />
                    <button
                        onClick={() => {
                            editComment(editCom.text, editCom.id)
                            setEdit({
                                edit: false,
                                id: '',
                                text: ''
                            })
                        }}>
                        Change
                    </button>
                </div>
            }

            {
                comments.length > 0 &&
                comments.map((comment) => {
                    return (
                        <div className="comment" key={comment._id}>
                            <div className="comment-head">
                                <div>
                                    <img
                                        className="extra"
                                        src={comment.postedBy.img ? `/upload/${comment.postedBy.img}` : user}
                                        alt="user-img"
                                    />
                                    <span>
                                        {comment.postedBy.userName}
                                    </span>
                                </div>

                                <div>
                                    {
                                        comment.postedBy._id === _id &&
                                        <>
                                            <img
                                                onClick={() => {
                                                    setEdit({
                                                        edit: !editCom.edit,
                                                        id: comment._id,
                                                        text: comment.text
                                                    })
                                                }}
                                                src={edit}
                                                alt="edit"
                                                className="icons"
                                            />
                                            <img
                                                onClick={() => {
                                                    deleteComment(postid, comment._id)
                                                }}
                                                src={del}
                                                alt="delete"
                                                className="icons"
                                                style={{ marginLeft: '.5rem' }}
                                            />
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="comment-body">
                                <p> {comment.text} </p>
                                <p className="comment-time">{getTime(comment.updatedAt)}</p>
                            </div>
                        </div>
                    )
                })
            }
            {
                comLoading &&
                <div className="rel-pos"><Loading /></div>
            }

            {
                (hasMore && !comLoading) &&
                <div className="loadbtn">
                    <button onClick={getComments}>load more</button>
                </div>
            }

            {
                comError && <div>error</div>
            }

            <form
                className="cmt-form"
                onSubmit={(e) => {
                    e.preventDefault()
                    makeComment(e.target[0].value, postid)
                    e.target[0].value = ''
                }}>
                <input
                    type="text"
                    className="input-com"
                    placeholder="add a comment..."
                />
            </form>
        </div>
    )
        : <div className="rel-pos"><Loading /></div>
}

export default Comments